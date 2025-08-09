-- Safe migration script that checks for existing columns

-- Add first_login column if it doesn't exist
DROP PROCEDURE IF EXISTS add_first_login_column;
DELIMITER $$
CREATE PROCEDURE add_first_login_column()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'first_login'
    ) THEN
        ALTER TABLE users ADD COLUMN first_login BOOLEAN DEFAULT TRUE;
    END IF;
END$$
DELIMITER ;
CALL add_first_login_column();
DROP PROCEDURE add_first_login_column;

-- Add password_set column if it doesn't exist
DROP PROCEDURE IF EXISTS add_password_set_column;
DELIMITER $$
CREATE PROCEDURE add_password_set_column()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'password_set'
    ) THEN
        ALTER TABLE users ADD COLUMN password_set BOOLEAN DEFAULT FALSE;
    END IF;
END$$
DELIMITER ;
CALL add_password_set_column();
DROP PROCEDURE add_password_set_column;

-- Create invitations table for multiple assessments per candidate
CREATE TABLE IF NOT EXISTS invitations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  assessment_id INT NOT NULL,
  invited_by INT NOT NULL,
  status ENUM('pending', 'accepted', 'completed', 'expired') DEFAULT 'pending',
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  score DECIMAL(5,2) NULL,
  FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by) REFERENCES users(id),
  UNIQUE KEY unique_invitation (candidate_id, assessment_id)
);

-- Create test_sessions table to track active tests
CREATE TABLE IF NOT EXISTS test_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  assessment_id INT NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
  session_token VARCHAR(255) UNIQUE,
  FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  INDEX idx_session_token (session_token),
  INDEX idx_candidate_assessment (candidate_id, assessment_id)
);

-- Update existing candidates to have first_login = true if they don't have a proper password
UPDATE users 
SET first_login = TRUE, password_set = FALSE 
WHERE role = 'candidate' 
AND (password_hash IS NULL OR password_hash LIKE 'NOT_SET_%');

-- Update existing candidates who have set passwords
UPDATE users 
SET first_login = FALSE, password_set = TRUE 
WHERE role = 'candidate' 
AND password_hash IS NOT NULL 
AND password_hash NOT LIKE 'NOT_SET_%';
