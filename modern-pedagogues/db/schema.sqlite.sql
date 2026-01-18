PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  reset_token TEXT,
  reset_expires INTEGER,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS teachers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  bio TEXT,
  subject TEXT,
  rate_cents INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  image_path TEXT,
  file_path TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER DEFAULT 1,
  price_cents INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS content_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  title TEXT,
  body TEXT,
  updated_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS marketplace_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT,
  status TEXT DEFAULT 'draft',
  file_path TEXT,
  thumbnail_path TEXT,
  rating REAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS marketplace_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id INTEGER,
  variant TEXT NOT NULL,
  price_cents INTEGER DEFAULT 0,
  license TEXT,
  FOREIGN KEY (content_id) REFERENCES marketplace_content(id)
);

CREATE TABLE IF NOT EXISTS marketplace_packs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content_ids TEXT,
  price_cents INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS marketplace_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_id INTEGER,
  seller_id INTEGER,
  content_id INTEGER,
  pack_id INTEGER,
  amount_cents INTEGER,
  status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (content_id) REFERENCES marketplace_content(id),
  FOREIGN KEY (pack_id) REFERENCES marketplace_packs(id)
);

CREATE TABLE IF NOT EXISTS marketplace_favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  content_id INTEGER,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  UNIQUE(user_id, content_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (content_id) REFERENCES marketplace_content(id)
);

CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  content_id INTEGER,
  rating INTEGER,
  comment TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (content_id) REFERENCES marketplace_content(id)
);

CREATE TABLE IF NOT EXISTS creator_earnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER,
  month TEXT,
  amount_cents INTEGER,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY (creator_id) REFERENCES users(id)
);
