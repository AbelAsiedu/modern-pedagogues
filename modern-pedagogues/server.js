require('dotenv').config();
const path = require('path');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const Stripe = require('stripe');

const { initDb, getDb } = require('./db');
const { sendEmail } = require('./email');
const { upload, localUploadDir } = require('./storage');
const { listContent, getContentDetail } = require('./marketplace');

const app = express();
const stripe = process.env.STRIPE_SECRET ? Stripe(process.env.STRIPE_SECRET) : null;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    }
  })
);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
const jsonParser = express.json();
app.use((req, res, next) => {
  if (req.path.startsWith('/webhooks/stripe')) {
    return next();
  }
  return jsonParser(req, res, next);
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

const csrfProtection = csrf();

const ensureHttps = (req, res, next) => {
  if (process.env.FORCE_HTTPS === 'true' && req.protocol !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }
  return next();
};

app.use(ensureHttps);

const configureSession = (db) => {
  if (db.isPostgres) {
    const PgStore = require('connect-pg-simple')(session);
    return session({
      store: new PgStore({ conString: process.env.DATABASE_URL }),
      secret: process.env.SESSION_SECRET || 'dev_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.COOKIE_DOMAIN || undefined
      }
    });
  }
  const SQLiteStore = require('connect-sqlite3')(session);
  return session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: path.join(__dirname, 'data') }),
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN || undefined
    }
  });
};

const attachLocals = (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user?.role === 'admin';
  res.locals.isCreator = req.session.user?.role === 'creator';
  return next();
};

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('public/error', {
      title: 'Validation error',
      message: errors.array().map((err) => err.msg).join(', ')
    });
  }
  return next();
};

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  return next();
};

const requireAdmin = (req, res, next) => {
  if (req.session.user?.role !== 'admin') {
    return res.status(403).render('public/error', {
      title: 'Unauthorized',
      message: 'Admin access required.'
    });
  }
  return next();
};

const requireCreator = (req, res, next) => {
  if (!req.session.user || !['creator', 'admin'].includes(req.session.user.role)) {
    return res.status(403).render('public/error', {
      title: 'Unauthorized',
      message: 'Creator access required.'
    });
  }
  return next();
};

const registerRoutes = (db) => {
  app.use(configureSession(db));
  app.use(attachLocals);

  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/uploads', express.static(localUploadDir));

  app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(200).json({ received: true });
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Stripe webhook error', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await db.run('UPDATE marketplace_transactions SET status = $1 WHERE stripe_payment_id = $2', [
        'completed',
        session.payment_intent
      ]);
    }

    return res.json({ received: true });
  });

  app.use((req, res, next) => {
    if (req.path.startsWith('/webhooks/stripe')) {
      return next();
    }
    return csrfProtection(req, res, next);
  });

  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  app.get('/', (req, res) => res.render('public/home', { title: 'The Modern Pedagogues' }));
  app.get('/about', (req, res) => res.render('public/about', { title: 'About' }));
  app.get('/contact', (req, res) => res.render('public/contact', { title: 'Contact' }));
  app.post(
    '/contact',
    contactLimiter,
    [
      body('name').trim().notEmpty().withMessage('Name required.'),
      body('email').isEmail().withMessage('Valid email required.'),
      body('message').trim().isLength({ min: 10 }).withMessage('Message too short.')
    ],
    handleValidation,
    async (req, res) => {
      const { name, email, subject, message } = req.body;
      await db.run(
        'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
        [name, email, subject || 'Contact Form', message]
      );
      await sendEmail({
        to: process.env.SMTP_FROM || 'hello@modernpedagogues.com',
        subject: `New message from ${name}`,
        html: `<p>${message}</p><p>Reply: ${email}</p>`
      });
      res.render('public/contact', { title: 'Contact', success: true });
    }
  );

  app.get('/curriculum', (req, res) => res.render('public/curriculum', { title: 'Curriculum' }));
  app.get('/tutors', (req, res) => res.render('public/tutors', { title: 'Tutors' }));
  app.get('/resources', (req, res) => res.render('public/resources', { title: 'Resources' }));
  app.get('/apply', (req, res) => res.render('public/apply', { title: 'Tutor Application' }));
  app.post(
    '/apply',
    contactLimiter,
    [body('message').trim().isLength({ min: 10 }).withMessage('Please share more details.')],
    handleValidation,
    async (req, res) => {
      await db.run('INSERT INTO applications (user_id, message) VALUES ($1, $2)', [
        req.session.user?.id || null,
        req.body.message
      ]);
      res.render('public/apply', { title: 'Tutor Application', success: true });
    }
  );
  app.get('/privacy', (req, res) => res.render('public/privacy', { title: 'Privacy Policy' }));
  app.get('/terms', (req, res) => res.render('public/terms', { title: 'Terms of Service' }));

  app.get('/signup', (req, res) => res.render('account/signup', { title: 'Sign Up' }));
  app.post(
    '/signup',
    authLimiter,
    [
      body('name').trim().notEmpty().withMessage('Name required.'),
      body('email').isEmail().withMessage('Valid email required.'),
      body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars.')
    ],
    handleValidation,
    async (req, res) => {
      const { name, email, password, role } = req.body;
      const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.length) {
        return res.status(400).render('public/error', { title: 'Signup error', message: 'Email already in use.' });
      }
      const hash = await bcrypt.hash(password, 10);
      await db.run('INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)', [
        name,
        email,
        hash,
        role === 'creator' ? 'creator' : 'user'
      ]);
      res.redirect('/login');
    }
  );

  app.get('/login', (req, res) => res.render('account/login', { title: 'Login' }));
  app.post(
    '/login',
    authLimiter,
    [body('email').isEmail().withMessage('Valid email required.'), body('password').notEmpty()],
    handleValidation,
    async (req, res) => {
      const { email, password } = req.body;
      const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = users[0];
      if (!user) {
        return res.status(400).render('public/error', { title: 'Login error', message: 'Invalid credentials.' });
      }
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(400).render('public/error', { title: 'Login error', message: 'Invalid credentials.' });
      }
      req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };
      res.redirect('/dashboard');
    }
  );

  app.post('/logout', requireAuth, (req, res) => {
    req.session.destroy(() => res.redirect('/'));
  });

  app.get('/password/forgot', (req, res) => res.render('account/forgot', { title: 'Reset Password' }));
  app.post(
    '/password/forgot',
    authLimiter,
    [body('email').isEmail().withMessage('Valid email required.')],
    handleValidation,
    async (req, res) => {
      const { email } = req.body;
      const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = users[0];
      if (!user) {
        return res.render('account/forgot', { title: 'Reset Password', sent: true });
      }
      const token = require('crypto').randomBytes(24).toString('hex');
      const expires = Date.now() + 3600 * 1000;
      await db.run('UPDATE users SET reset_token = $1, reset_expires = $2 WHERE id = $3', [
        token,
        db.isPostgres ? new Date(expires) : expires,
        user.id
      ]);
      const resetUrl = `${req.protocol}://${req.headers.host}/password/reset/${token}`;
      await sendEmail({
        to: email,
        subject: 'Reset your password',
        html: `<p>Reset your password: <a href="${resetUrl}">Reset</a></p>`
      });
      res.render('account/forgot', { title: 'Reset Password', sent: true });
    }
  );

  app.get('/password/reset/:token', async (req, res) => {
    const users = await db.query('SELECT * FROM users WHERE reset_token = $1', [req.params.token]);
    const user = users[0];
    if (!user) {
      return res.status(400).render('public/error', { title: 'Reset error', message: 'Token invalid.' });
    }
    if (db.isPostgres ? new Date(user.reset_expires).getTime() < Date.now() : user.reset_expires < Date.now()) {
      return res.status(400).render('public/error', { title: 'Reset error', message: 'Token expired.' });
    }
    return res.render('account/reset', { title: 'Reset Password', token: req.params.token });
  });

  app.post(
    '/password/reset/:token',
    [body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars.')],
    handleValidation,
    async (req, res) => {
      const users = await db.query('SELECT * FROM users WHERE reset_token = $1', [req.params.token]);
      const user = users[0];
      if (!user) {
        return res.status(400).render('public/error', { title: 'Reset error', message: 'Token invalid.' });
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      await db.run('UPDATE users SET password_hash = $1, reset_token = NULL, reset_expires = NULL WHERE id = $2', [
        hash,
        user.id
      ]);
      res.redirect('/login');
    }
  );

  app.get('/dashboard', requireAuth, async (req, res) => {
    const orders = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [
      req.session.user.id
    ]);
    res.render('account/dashboard', { title: 'Dashboard', orders });
  });

  app.get('/account', requireAuth, (req, res) => res.render('account/account', { title: 'Account' }));

  app.get('/store', async (req, res) => {
    const products = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.render('public/store', { title: 'Store', products });
  });

  app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('public/cart', { title: 'Cart', cart });
  });

  app.post('/cart/add', [body('productId').notEmpty()], handleValidation, async (req, res) => {
    const productId = Number(req.body.productId);
    const products = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    const product = products[0];
    if (!product) {
      return res.status(404).render('public/error', { title: 'Not found', message: 'Product not found.' });
    }
    req.session.cart = req.session.cart || [];
    req.session.cart.push({ id: product.id, title: product.title, price_cents: product.price_cents });
    res.redirect('/cart');
  });

  app.post('/checkout', requireAuth, async (req, res) => {
    const cart = req.session.cart || [];
    if (!cart.length) {
      return res.redirect('/cart');
    }
    const total = cart.reduce((sum, item) => sum + item.price_cents, 0);
    const orderInsertSql = db.isPostgres
      ? 'INSERT INTO orders (user_id, total_cents, status) VALUES ($1, $2, $3) RETURNING id'
      : 'INSERT INTO orders (user_id, total_cents, status) VALUES ($1, $2, $3)';
    const orderResult = await db.run(orderInsertSql, [req.session.user.id, total, 'completed']);
    const orderId = db.isPostgres ? orderResult.rows[0]?.id : orderResult.lastID;
    await Promise.all(
      cart.map((item) =>
        db.run('INSERT INTO order_items (order_id, product_id, quantity, price_cents) VALUES ($1, $2, $3, $4)', [
          orderId,
          item.id,
          1,
          item.price_cents
        ])
      )
    );
    req.session.cart = [];
    res.render('public/checkout', { title: 'Checkout', success: true });
  });

  app.get('/marketplace', async (req, res) => {
    const { items, page } = await listContent(db, req.query);
    res.render('marketplace/index', { title: 'Marketplace', items, page, query: req.query });
  });

  app.get('/marketplace/upload', requireCreator, (req, res) =>
    res.render('marketplace/upload', { title: 'Upload Content' })
  );

  app.post(
    '/marketplace/upload',
    requireCreator,
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    [
      body('title').notEmpty().withMessage('Title required.'),
      body('category').notEmpty().withMessage('Category required.')
    ],
    handleValidation,
    async (req, res) => {
      const filePath = req.files?.file?.[0]?.filename || null;
      const thumbnailPath = req.files?.thumbnail?.[0]?.filename || null;
      const { title, description, category, tags, version_price, version_license, version_variant } = req.body;
      const contentInsertSql = db.isPostgres
        ? 'INSERT INTO marketplace_content (creator_id, title, description, category, tags, status, file_path, thumbnail_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id'
        : 'INSERT INTO marketplace_content (creator_id, title, description, category, tags, status, file_path, thumbnail_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      const contentResult = await db.run(contentInsertSql, [
        req.session.user.id,
        title,
        description,
        category,
        tags,
        'draft',
        filePath,
        thumbnailPath
      ]);
      const contentId = db.isPostgres ? contentResult.rows[0]?.id : contentResult.lastID;
      await db.run(
        'INSERT INTO marketplace_versions (content_id, variant, price_cents, license) VALUES ($1, $2, $3, $4)',
        [contentId, version_variant || 'standard', Number(version_price || 0) * 100, version_license || 'personal']
      );
      res.redirect('/creator/dashboard');
    }
  );

  app.get('/creator/dashboard', requireCreator, async (req, res) => {
    const items = await db.query('SELECT * FROM marketplace_content WHERE creator_id = $1 ORDER BY created_at DESC', [
      req.session.user.id
    ]);
    res.render('marketplace/creator-dashboard', { title: 'Creator Dashboard', items });
  });

  app.post('/marketplace/:id/publish', requireCreator, async (req, res) => {
    await db.run('UPDATE marketplace_content SET status = $1 WHERE id = $2 AND creator_id = $3', [
      'published',
      req.params.id,
      req.session.user.id
    ]);
    res.redirect('/creator/dashboard');
  });

  app.get('/marketplace/:id', async (req, res) => {
    const detail = await getContentDetail(db, req.params.id);
    if (!detail) {
      return res.status(404).render('public/error', { title: 'Not found', message: 'Content not found.' });
    }
    const favorite = req.session.user
      ? await db.query('SELECT id FROM marketplace_favorites WHERE user_id = $1 AND content_id = $2', [
          req.session.user.id,
          req.params.id
        ])
      : [];
    res.render('marketplace/detail', {
      title: detail.content.title,
      detail,
      isFavorite: favorite.length > 0
    });
  });

  app.post('/marketplace/:id/favorite', requireAuth, async (req, res) => {
    const sql = db.isPostgres
      ? 'INSERT INTO marketplace_favorites (user_id, content_id) VALUES ($1, $2) ON CONFLICT DO NOTHING'
      : 'INSERT OR IGNORE INTO marketplace_favorites (user_id, content_id) VALUES ($1, $2)';
    await db.run(sql, [req.session.user.id, req.params.id]);
    res.redirect(`/marketplace/${req.params.id}`);
  });

  app.post(
    '/marketplace/:id/review',
    requireAuth,
    [body('rating').isInt({ min: 1, max: 5 }), body('comment').trim().notEmpty()],
    handleValidation,
    async (req, res) => {
      await db.run(
        'INSERT INTO marketplace_reviews (user_id, content_id, rating, comment) VALUES ($1, $2, $3, $4)',
        [req.session.user.id, req.params.id, Number(req.body.rating), req.body.comment]
      );
      res.redirect(`/marketplace/${req.params.id}`);
    }
  );

  app.post('/marketplace/:id/purchase', requireAuth, async (req, res) => {
    const versionId = Number(req.body.versionId);
    const versions = await db.query('SELECT * FROM marketplace_versions WHERE id = $1', [versionId]);
    const version = versions[0];
    if (!version) {
      return res.status(404).render('public/error', { title: 'Not found', message: 'Version not found.' });
    }
    const contentRows = await db.query('SELECT * FROM marketplace_content WHERE id = $1', [version.content_id]);
    const content = contentRows[0];
    const amount = version.price_cents;
    const transactionInsertSql = db.isPostgres
      ? 'INSERT INTO marketplace_transactions (buyer_id, seller_id, content_id, amount_cents, status) VALUES ($1, $2, $3, $4, $5) RETURNING id'
      : 'INSERT INTO marketplace_transactions (buyer_id, seller_id, content_id, amount_cents, status) VALUES ($1, $2, $3, $4, $5)';
    const transactionResult = await db.run(transactionInsertSql, [
      req.session.user.id,
      content.creator_id,
      content.id,
      amount,
      'pending'
    ]);
    const transactionId = db.isPostgres ? transactionResult.rows[0]?.id : transactionResult.lastID;

    if (!stripe) {
      await db.run('UPDATE marketplace_transactions SET status = $1 WHERE id = $2', ['completed', transactionId]);
      return res.redirect(`/marketplace/${content.id}`);
    }

    const sessionStripe = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: content.title },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      success_url: `${req.protocol}://${req.headers.host}/marketplace/${content.id}?success=true`,
      cancel_url: `${req.protocol}://${req.headers.host}/marketplace/${content.id}?cancel=true`
    });

    await db.run('UPDATE marketplace_transactions SET stripe_payment_id = $1 WHERE id = $2', [
      sessionStripe.payment_intent,
      transactionId
    ]);

    res.redirect(sessionStripe.url);
  });

  app.post('/marketplace/:id/download', requireAuth, async (req, res) => {
    const contentRows = await db.query('SELECT * FROM marketplace_content WHERE id = $1', [req.params.id]);
    const content = contentRows[0];
    if (!content) {
      return res.status(404).render('public/error', { title: 'Not found', message: 'Content not found.' });
    }
    const versions = await db.query('SELECT * FROM marketplace_versions WHERE content_id = $1', [req.params.id]);
    const freeVersion = versions.find((item) => item.price_cents === 0);
    const paidTransaction = await db.query(
      'SELECT * FROM marketplace_transactions WHERE buyer_id = $1 AND content_id = $2 AND status = $3',
      [req.session.user.id, req.params.id, 'completed']
    );
    if (!freeVersion && paidTransaction.length === 0) {
      return res.status(403).render('public/error', { title: 'Payment required', message: 'Purchase required.' });
    }
    await db.run('UPDATE marketplace_content SET download_count = download_count + 1 WHERE id = $1', [req.params.id]);
    res.render('marketplace/download', { title: 'Download Ready', content });
  });

  app.get('/admin', (req, res) => res.render('admin/login', { title: 'Admin Login' }));
  app.post(
    '/admin',
    authLimiter,
    [body('email').isEmail(), body('password').notEmpty()],
    handleValidation,
    async (req, res) => {
      const users = await db.query('SELECT * FROM users WHERE email = $1 AND role = $2', [req.body.email, 'admin']);
      const user = users[0];
      if (!user) {
        return res.status(400).render('public/error', { title: 'Login error', message: 'Invalid admin credentials.' });
      }
      const match = await bcrypt.compare(req.body.password, user.password_hash);
      if (!match) {
        return res.status(400).render('public/error', { title: 'Login error', message: 'Invalid admin credentials.' });
      }
      req.session.user = { id: user.id, email: user.email, name: user.name, role: 'admin' };
      res.redirect('/admin/dashboard');
    }
  );

  app.get('/admin/dashboard', requireAdmin, async (req, res) => {
    const userCount = await db.query('SELECT COUNT(*) AS count FROM users');
    const orderCount = await db.query('SELECT COUNT(*) AS count FROM orders');
    const contentCount = await db.query('SELECT COUNT(*) AS count FROM marketplace_content');
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      metrics: {
        users: userCount[0]?.count || 0,
        orders: orderCount[0]?.count || 0,
        content: contentCount[0]?.count || 0
      }
    });
  });

  app.get('/admin/pages', requireAdmin, async (req, res) => {
    const pages = await db.query('SELECT * FROM content_pages ORDER BY updated_at DESC');
    res.render('admin/pages', { title: 'Content Pages', pages });
  });

  app.post('/admin/pages', requireAdmin, async (req, res) => {
    const existing = await db.query('SELECT id FROM content_pages WHERE slug = $1', [req.body.slug]);
    if (existing.length) {
      await db.run('UPDATE content_pages SET title = $1, body = $2, updated_at = $3 WHERE slug = $4', [
        req.body.title,
        req.body.body,
        db.isPostgres ? new Date() : Date.now(),
        req.body.slug
      ]);
    } else {
      await db.run('INSERT INTO content_pages (slug, title, body) VALUES ($1, $2, $3)', [
        req.body.slug,
        req.body.title,
        req.body.body
      ]);
    }
    res.redirect('/admin/pages');
  });

  app.get('/admin/products', requireAdmin, async (req, res) => {
    const products = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.render('admin/products', { title: 'Manage Products', products });
  });

  app.post('/admin/products', requireAdmin, upload.single('image'), async (req, res) => {
    await db.run('INSERT INTO products (title, description, price_cents, image_path) VALUES ($1, $2, $3, $4)', [
      req.body.title,
      req.body.description,
      Number(req.body.price || 0) * 100,
      req.file?.filename || null
    ]);
    res.redirect('/admin/products');
  });

  app.get('/admin/orders', requireAdmin, async (req, res) => {
    const orders = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.render('admin/orders', { title: 'Orders', orders });
  });

  app.get('/admin/users', requireAdmin, async (req, res) => {
    const users = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.render('admin/users', { title: 'Users', users });
  });

  app.post('/admin/users/reset', requireAdmin, async (req, res) => {
    const hash = await bcrypt.hash('password', 10);
    await db.run('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.body.userId]);
    res.redirect('/admin/users');
  });

  app.post('/admin/users/delete', requireAdmin, async (req, res) => {
    await db.run('DELETE FROM users WHERE id = $1', [req.body.userId]);
    res.redirect('/admin/users');
  });

  app.get('/admin/messages', requireAdmin, async (req, res) => {
    const messages = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.render('admin/messages', { title: 'Messages', messages });
  });

  app.get('/admin/applications', requireAdmin, async (req, res) => {
    const applications = await db.query('SELECT * FROM applications ORDER BY created_at DESC');
    res.render('admin/applications', { title: 'Tutor Applications', applications });
  });

  app.get('/admin/media', requireAdmin, async (req, res) => {
    const files = fs.existsSync(localUploadDir) ? fs.readdirSync(localUploadDir) : [];
    res.render('admin/media', { title: 'Media Manager', files });
  });

  app.get('/admin/transactions', requireAdmin, async (req, res) => {
    const transactions = await db.query('SELECT * FROM marketplace_transactions ORDER BY created_at DESC');
    res.render('admin/transactions', { title: 'Marketplace Transactions', transactions });
  });

  app.get('/admin/marketplace', requireAdmin, async (req, res) => {
    const items = await db.query('SELECT * FROM marketplace_content ORDER BY created_at DESC');
    res.render('admin/marketplace', { title: 'Marketplace Moderation', items });
  });

  app.post('/admin/marketplace/:id/moderate', requireAdmin, async (req, res) => {
    await db.run('UPDATE marketplace_content SET status = $1 WHERE id = $2', [req.body.status, req.params.id]);
    res.redirect('/admin/marketplace');
  });

  const frontendOut = path.join(__dirname, 'frontend', 'out');
  app.use('/app', express.static(frontendOut));

  app.use((req, res) => res.status(404).render('public/error', { title: 'Not Found', message: 'Page not found.' }));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('public/error', { title: 'Server error', message: 'Something went wrong.' });
  });
};

const start = async () => {
  await initDb();
  const db = getDb();
  registerRoutes(db);
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on ${port}`));
};

if (require.main === module) {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { app, start, registerRoutes };
