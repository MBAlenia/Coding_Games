-- Step 1: Add new columns to questions table (safe - only additions)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS technology VARCHAR(50),
ADD COLUMN IF NOT EXISTS difficulty ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
ADD COLUMN IF NOT EXISTS tags JSON,
ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_by INT;
