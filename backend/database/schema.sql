-- Hosting commitments table
CREATE TABLE IF NOT EXISTS hosting_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    host_name TEXT NOT NULL,
    host_address TEXT NOT NULL,
    hosting_date DATE NOT NULL UNIQUE,
    start_time TIME NOT NULL,
    additional_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index on hosting_date for efficient queries
CREATE INDEX IF NOT EXISTS idx_hosting_date ON hosting_slots(hosting_date);
