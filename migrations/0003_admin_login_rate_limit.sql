CREATE TABLE IF NOT EXISTS admin_login_attempts (
  attempt_key TEXT PRIMARY KEY,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  window_started_at TEXT NOT NULL,
  last_attempt_at TEXT NOT NULL,
  blocked_until TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_blocked_until
  ON admin_login_attempts(blocked_until);

CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_last_attempt
  ON admin_login_attempts(last_attempt_at);