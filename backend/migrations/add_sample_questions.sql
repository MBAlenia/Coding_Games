-- Add sample questions to the library
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

('Two Sum Problem', 'Find two numbers in an array that add up to a target', 'javascript', 'JavaScript', 'intermediate',
 JSON_ARRAY('arrays', 'algorithms', 'hash-table'),
 'function twoSum(nums, target) {\n  // Your code here\n  return [];\n}',
 '[{"input": [[2,7,11,15], 9], "expected": [0,1]}, {"input": [[3,2,4], 6], "expected": [1,2]}]',
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

('Binary Search', 'Implement binary search algorithm', 'python', 'Python', 'intermediate',
 JSON_ARRAY('algorithms', 'search', 'arrays'),
 'def binary_search(arr, target):\n    # Your code here\n    return -1',
 '[{"input": [[1,2,3,4,5], 3], "expected": 2}, {"input": [[1,3,5,7,9], 6], "expected": -1}]',
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
 TRUE, 1),

('Group By and Count', 'Count the number of orders per user', 'sql', 'SQL', 'intermediate',
 JSON_ARRAY('database', 'group-by', 'aggregation'),
 '-- Write your SQL query here\n',
 '[{"expected": "SELECT user_id, COUNT(*) as order_count FROM orders GROUP BY user_id;"}]',
 TRUE, 1),

-- Advanced Questions
('Implement Quick Sort', 'Implement the quicksort algorithm', 'python', 'Python', 'advanced',
 JSON_ARRAY('algorithms', 'sorting', 'recursion'),
 'def quicksort(arr):\n    # Your code here\n    return arr',
 '[{"input": [3,6,8,10,1,2,1], "expected": [1,1,2,3,6,8,10]}]',
 TRUE, 1),

('Valid Parentheses', 'Check if parentheses are valid and balanced', 'javascript', 'JavaScript', 'intermediate',
 JSON_ARRAY('strings', 'stack', 'algorithms'),
 'function isValid(s) {\n  // Your code here\n  return false;\n}',
 '[{"input": "()", "expected": true}, {"input": "()[]{}", "expected": true}, {"input": "(]", "expected": false}]',
 TRUE, 1);
