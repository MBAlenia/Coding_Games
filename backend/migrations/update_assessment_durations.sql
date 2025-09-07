-- Update all existing assessments to have calculated durations
-- This migration calculates the total duration for each assessment based on its questions' time_limit

UPDATE assessments a
SET duration = (
    SELECT COALESCE(SUM(q.time_limit), 0)
    FROM questions q 
    JOIN assessment_questions aq ON q.id = aq.question_id 
    WHERE aq.assessment_id = a.id
)
WHERE a.id IN (
    SELECT DISTINCT assessment_id 
    FROM assessment_questions
);

-- Set duration to 0 for assessments with no questions
UPDATE assessments 
SET duration = 0 
WHERE id NOT IN (
    SELECT DISTINCT assessment_id 
    FROM assessment_questions
);

-- Show results
SELECT 'Assessment durations updated:' as info;
SELECT id, title, duration, 
       (SELECT COUNT(*) FROM assessment_questions WHERE assessment_id = assessments.id) as question_count
FROM assessments 
ORDER BY id;
