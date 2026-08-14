CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  vin TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS idx_vin ON documents(vin);
