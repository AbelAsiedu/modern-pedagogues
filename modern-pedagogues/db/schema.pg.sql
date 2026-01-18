CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  reset_token TEXT,
  reset_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  bio TEXT,
  subject TEXT,
  rate_cents INTEGER
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  image_path TEXT,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  price_cents INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_pages (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  body TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_content (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT,
  status TEXT DEFAULT 'draft',
  file_path TEXT,
  thumbnail_path TEXT,
  rating NUMERIC DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_versions (
  id SERIAL PRIMARY KEY,
  content_id INTEGER REFERENCES marketplace_content(id),
  variant TEXT NOT NULL,
  price_cents INTEGER DEFAULT 0,
  license TEXT
);

CREATE TABLE IF NOT EXISTS marketplace_packs (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content_ids TEXT,
  price_cents INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS marketplace_transactions (
  id SERIAL PRIMARY KEY,
  buyer_id INTEGER REFERENCES users(id),
  seller_id INTEGER REFERENCES users(id),
  content_id INTEGER REFERENCES marketplace_content(id),
  pack_id INTEGER REFERENCES marketplace_packs(id),
  amount_cents INTEGER,
  status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content_id INTEGER REFERENCES marketplace_content(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, content_id)
);

CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content_id INTEGER REFERENCES marketplace_content(id),
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS creator_earnings (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id),
  month TEXT,
  amount_cents INTEGER,
  status TEXT DEFAULT 'pending'
);
