-- Step 3: SAFELY update existing questions with default metadata (only if NULL)
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
