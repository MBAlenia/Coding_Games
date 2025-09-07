-- Migration: Add question metadata and enable question sharing across assessments
-- Date: 2024-08-16
-- SAFE MIGRATION - NO DATA DELETION

-- Step 1: Add new columns to questions table (safe - only additions)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS technology VARCHAR(50),
ADD COLUMN IF NOT EXISTS difficulty ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
ADD COLUMN IF NOT EXISTS tags JSON,
ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_by INT;

-- Add foreign key constraint safely
SET @constraint_exists = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE 
                         WHERE TABLE_SCHEMA = DATABASE() 
                         AND TABLE_NAME = 'questions' 
                         AND CONSTRAINT_NAME = 'fk_questions_created_by');

SET @sql = IF(@constraint_exists = 0, 
              'ALTER TABLE questions ADD CONSTRAINT fk_questions_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL',
              'SELECT "Constraint already exists" as message');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Create assessment_questions junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS assessment_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    question_id INT NOT NULL,
    order_index INT DEFAULT 0,
    points INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_assessment_question (assessment_id, question_id),
    CONSTRAINT fk_aq_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    CONSTRAINT fk_aq_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_assessment_id (assessment_id),
    INDEX idx_question_id (question_id)
);

-- Step 3: SAFELY migrate existing data from questions to assessment_questions
-- Only insert if data doesn't already exist
INSERT IGNORE INTO assessment_questions (assessment_id, question_id, order_index, points)
SELECT 
    assessment_id, 
    id as question_id,
    ROW_NUMBER() OVER (PARTITION BY assessment_id ORDER BY id) as order_index,
    10 as points
FROM questions 
WHERE assessment_id IS NOT NULL;

-- Step 4: SAFELY update existing questions with default metadata (only if NULL)
UPDATE questions 
SET 
    technology = CASE 
        WHEN language = 'javascript' THEN 'JavaScript'
        WHEN language = 'python' THEN 'Python'
        WHEN language = 'sql' THEN 'SQL'
        ELSE 'General'
    END,
    difficulty = 'intermediate',
    tags = JSON_ARRAY('existing'),
    is_shared = FALSE,
    created_by = 1
WHERE technology IS NULL;

-- Step 5: Keep assessment_id as is for backward compatibility
-- DO NOT MODIFY assessment_id column to preserve existing relationships

-- Step 6: Create a questions library table for better organization
CREATE TABLE IF NOT EXISTS question_library (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    technology VARCHAR(50),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_library_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Step 7: Add library_id to questions for categorization
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS library_id INT,
ADD CONSTRAINT fk_questions_library FOREIGN KEY (library_id) REFERENCES question_library(id) ON DELETE SET NULL;

-- Step 8: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_technology ON questions(technology);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_is_shared ON questions(is_shared);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);

-- Step 9: Add some sample shared questions for testing
INSERT INTO questions (title, description, language, technology, difficulty, tags, template_code, test_cases, is_shared, created_by)
VALUES 
-- JavaScript Questions
('Reverse a String', 'Write a function that reverses a string', 'javascript', 'JavaScript', 'beginner', 
 JSON_ARRAY('strings', 'algorithms', 'fundamentals'),
 'function reverseString(str) {\n  // Your code here\n  return str;\n}',
 '[{"input": "hello", "expected": "olleh"}, {"input": "world", "expected": "dlrow"}]',
 TRUE, 1),

('Find Maximum in Array', 'Find the maximum value in an array of numbers', 'javascript', 'JavaScript', 'beginner',
 JSON_ARRAY('arrays', 'algorithms', 'fundamentals'),
 'function findMax(arr) {\n  // Your code here\n  return 0;\n}',
 '[{"input": [1,5,3,9,2], "expected": 9}, {"input": [-1,-5,-3], "expected": -1}]',
 TRUE, 1),

('Check Palindrome', 'Check if a string is a palindrome', 'javascript', 'JavaScript', 'intermediate',
 JSON_ARRAY('strings', 'algorithms'),
 'function isPalindrome(str) {\n  // Your code here\n  return false;\n}',
 '[{"input": "racecar", "expected": true}, {"input": "hello", "expected": false}]',
 TRUE, 1),

-- Python Questions
('Calculate Factorial', 'Calculate the factorial of a number', 'python', 'Python', 'beginner',
 JSON_ARRAY('math', 'recursion', 'fundamentals'),
 'def factorial(n):\n    # Your code here\n    return 1',
 '[{"input": 5, "expected": 120}, {"input": 0, "expected": 1}]',
 TRUE, 1),

('Fibonacci Sequence', 'Generate the nth Fibonacci number', 'python', 'Python', 'intermediate',
 JSON_ARRAY('algorithms', 'recursion', 'dynamic-programming'),
 'def fibonacci(n):\n    # Your code here\n    return 0',
 '[{"input": 6, "expected": 8}, {"input": 10, "expected": 55}]',
 TRUE, 1),

-- SQL Questions
('Select All Users', 'Write a query to select all users from the users table', 'sql', 'SQL', 'beginner',
 JSON_ARRAY('database', 'select', 'fundamentals'),
 '-- Write your SQL query here\nSELECT * FROM users LIMIT 1;',
 '[{"expected": "SELECT * FROM users;"}]',
 TRUE, 1),

('Join Tables', 'Join users and orders tables to get user orders', 'sql', 'SQL', 'intermediate',
 JSON_ARRAY('database', 'joins'),
 '-- Write your SQL query here\n',
 '[{"expected": "SELECT u.*, o.* FROM users u JOIN orders o ON u.id = o.user_id;"}]',
 TRUE, 1);

-- Step 10: Create a view for easier question browsing
CREATE OR REPLACE VIEW question_catalog AS
SELECT 
    q.id,
    q.title,
    q.description,
    q.language,
    q.technology,
    q.difficulty,
    q.tags,
    q.is_shared,
    q.created_at,
    u.email as created_by_email,
    COUNT(DISTINCT aq.assessment_id) as used_in_assessments
FROM questions q
LEFT JOIN users u ON q.created_by = u.id
LEFT JOIN assessment_questions aq ON q.id = aq.question_id
WHERE q.is_shared = TRUE
GROUP BY q.id;

COMMIT;
