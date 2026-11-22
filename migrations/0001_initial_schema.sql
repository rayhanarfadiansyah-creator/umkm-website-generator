
-- ==========================================
-- webUMKM: Initial database schema
-- ==========================================

PRAGMA foreign_keys = ON;

-- 1. Admin account
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admin login sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- 3. Customers
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  package TEXT NOT NULL CHECK (package IN ('basic', 'pro', 'premium')),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_payment', 'paid', 'cancelled', 'refunded')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 5. Payments
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'midtrans',
  provider_transaction_id TEXT UNIQUE,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 6. Customer websites
CREATE TABLE IF NOT EXISTS websites (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE,
  package TEXT NOT NULL CHECK (package IN ('basic', 'pro', 'premium')),
  palette TEXT NOT NULL DEFAULT 'forest',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'preview', 'published', 'paused')),
  content_json TEXT NOT NULL DEFAULT '{}',
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 7. Products and services
CREATE TABLE IF NOT EXISTS website_products (
  id TEXT PRIMARY KEY,
  website_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

-- 8. Private customer management links
-- Store only token hashes, never raw access tokens.
CREATE TABLE IF NOT EXISTS customer_access_tokens (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  website_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE
);

-- Indexes for common dashboard queries
CREATE INDEX IF NOT EXISTS idx_orders_customer
  ON orders(customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_status
  ON orders(status);

CREATE INDEX IF NOT EXISTS idx_payments_order
  ON payments(order_id);

CREATE INDEX IF NOT EXISTS idx_payments_status
  ON payments(status);

CREATE INDEX IF NOT EXISTS idx_websites_customer
  ON websites(customer_id);

CREATE INDEX IF NOT EXISTS idx_websites_status
  ON websites(status);

CREATE INDEX IF NOT EXISTS idx_products_website
  ON website_products(website_id);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin
  ON admin_sessions(admin_id);

CREATE INDEX IF NOT EXISTS idx_customer_tokens_website
  ON customer_access_tokens(website_id);
