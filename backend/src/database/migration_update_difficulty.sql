-- Migration to update the difficulty ENUM and map existing data.

-- Step 1: Add the new ENUM values to the existing list to avoid data loss.
ALTER TABLE questions MODIFY COLUMN difficulty ENUM('easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'easy';

-- Step 2: Update existing records to use the new difficulty values.
-- We use points to differentiate between advanced and expert as they were both 'hard'.
UPDATE questions SET difficulty = 'beginner' WHERE difficulty = 'easy';
UPDATE questions SET difficulty = 'intermediate' WHERE difficulty = 'medium';
UPDATE questions SET difficulty = 'advanced' WHERE difficulty = 'hard' AND points = 30;
UPDATE questions SET difficulty = 'expert' WHERE difficulty = 'hard' AND points = 40;

-- Step 3: Remove the old ENUM values, leaving only the new ones.
ALTER TABLE questions MODIFY COLUMN difficulty ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner';
