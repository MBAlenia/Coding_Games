-- Add first_login column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN first_login TINYINT(1) DEFAULT 1 COMMENT 'Indicates if user needs to set password on first login';

-- Update existing users to have first_login = 0 (they already have passwords)
UPDATE users SET first_login = 0 WHERE password IS NOT NULL;

-- Add invitation_token column to store the current invitation token
ALTER TABLE users 
ADD COLUMN invitation_token VARCHAR(255) DEFAULT NULL COMMENT 'Token for first-time login';

-- Add invitation_token_expiry column
ALTER TABLE users 
ADD COLUMN invitation_token_expiry DATETIME DEFAULT NULL COMMENT 'Expiry time for invitation token';

-- Add index for faster token lookups
ALTER TABLE users ADD INDEX idx_invitation_token (invitation_token);
