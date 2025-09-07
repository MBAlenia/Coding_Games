-- Add some sample questions with metadata
INSERT INTO questions (title, description, language, technology, difficulty, tags, template_code, test_cases) VALUES
('Reverse String', 'Write a function to reverse a string', 'javascript', 'JavaScript', 'beginner', 
 JSON_ARRAY('strings', 'algorithms'), 
 'function reverseString(str) {\n  // Your code here\n  return "";\n}',
 JSON_ARRAY('{"input": "hello", "expected": "olleh"}', '{"input": "world", "expected": "dlrow"}')),

('Find Maximum', 'Find the maximum number in an array', 'javascript', 'JavaScript', 'beginner',
 JSON_ARRAY('arrays', 'loops'),
 'function findMax(arr) {\n  // Your code here\n  return 0;\n}',
 JSON_ARRAY('{"input": [1,5,3,9,2], "expected": 9}', '{"input": [-1,-5,-3], "expected": -1}')),

('Fibonacci', 'Calculate nth Fibonacci number', 'python', 'Python', 'intermediate',
 JSON_ARRAY('recursion', 'math'),
 'def fibonacci(n):\n    # Your code here\n    return 0',
 JSON_ARRAY('{"input": 5, "expected": 5}', '{"input": 8, "expected": 21}')),

('SQL Join', 'Join users and orders tables', 'sql', 'SQL', 'intermediate',
 JSON_ARRAY('database', 'joins'),
 '-- Write your SQL query here\nSELECT * FROM users LIMIT 1;',
 JSON_ARRAY('{"expected": "SELECT u.*, o.* FROM users u JOIN orders o ON u.id = o.user_id"}')),

('Binary Search', 'Implement binary search algorithm', 'python', 'Python', 'advanced',
 JSON_ARRAY('algorithms', 'search'),
 'def binary_search(arr, target):\n    # Your code here\n    return -1',
 JSON_ARRAY('{"input": [[1,2,3,4,5], 3], "expected": 2}'));

-- Now populate assessment_questions with existing data
INSERT IGNORE INTO assessment_questions (assessment_id, question_id, order_index, points)
SELECT 
    assessment_id, 
    id as question_id,
    ROW_NUMBER() OVER (PARTITION BY assessment_id ORDER BY id) as order_index,
    10 as points
FROM questions 
WHERE assessment_id IS NOT NULL;

-- Show results
SELECT 'Questions created:' as info, COUNT(*) as count FROM questions;
SELECT 'Assessment links:' as info, COUNT(*) as count FROM assessment_questions;
SELECT 'Sample assessment questions:' as info;
SELECT aq.assessment_id, q.title, q.technology, q.difficulty 
FROM assessment_questions aq 
JOIN questions q ON aq.question_id = q.id 
LIMIT 5;
