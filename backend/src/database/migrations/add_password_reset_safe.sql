-- Safe migration script for password reset columns
-- This script checks if columns exist before adding them

-- Drop procedure if it exists
DROP PROCEDURE IF EXISTS AddPasswordResetColumns;

-- Create a stored procedure to safely add columns
DELIMITER $$
CREATE PROCEDURE AddPasswordResetColumns()
BEGIN
    -- Check and add reset_token column
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'coding_platform' 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'reset_token'
    ) THEN
        ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL;
    END IF;
    
    -- Check and add reset_token_expiry column
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'coding_platform' 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'reset_token_expiry'
    ) THEN
        ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL;
    END IF;
    
    -- Check and add index
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = 'coding_platform' 
        AND TABLE_NAME = 'users' 
        AND INDEX_NAME = 'idx_reset_token'
    ) THEN
        CREATE INDEX idx_reset_token ON users(reset_token);
    END IF;
END$$
DELIMITER ;

-- Execute the procedure
CALL AddPasswordResetColumns();

-- Clean up
DROP PROCEDURE AddPasswordResetColumns;
