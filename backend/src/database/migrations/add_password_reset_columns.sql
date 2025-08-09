-- Add password reset columns to users table
-- First check if columns exist, then add them if they don't
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL;

-- Add index for faster token lookups (will fail silently if exists)
CREATE INDEX idx_reset_token ON users(reset_token);
