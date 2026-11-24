-- Anonymous visitor identity for free website quota
CREATE TABLE IF NOT EXISTS anonymous_visitors (
  visitor_hash TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- One row represents one consumed free website slot
CREATE TABLE IF NOT EXISTS anonymous_free_usage (
  website_id TEXT PRIMARY KEY,
  visitor_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (visitor_hash)
    REFERENCES anonymous_visitors(visitor_hash)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_anonymous_free_usage_visitor
  ON anonymous_free_usage(visitor_hash);

CREATE INDEX IF NOT EXISTS idx_anonymous_visitors_last_seen
  ON anonymous_visitors(last_seen_at);
