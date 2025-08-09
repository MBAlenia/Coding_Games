-- Corrected Sample Data for Coding Platform
-- Creating 5 records for each table with proper foreign key references
-- All in English

-- ============================================
-- SAMPLE USERS (Additional candidates - 5 records)
-- ============================================
INSERT INTO users (username, email, password, role, first_name, last_name, phone, company, skills, notes, status, created_at) VALUES
('sarah.johnson', 'sarah.johnson@email.com', '$2b$10$hash1', 'candidate', 'Sarah', 'Johnson', '+1-555-0101', 'Tech Solutions Inc', 'JavaScript, React, Node.js', 'Strong frontend developer with 3 years experience', 'active', '2024-01-10 08:00:00'),
('mike.chen', 'mike.chen@email.com', '$2b$10$hash2', 'candidate', 'Mike', 'Chen', '+1-555-0102', 'DataCorp Analytics', 'Python, SQL, Machine Learning', 'Data scientist with expertise in ML algorithms', 'active', '2024-01-11 09:15:00'),
('emma.davis', 'emma.davis@email.com', '$2b$10$hash3', 'candidate', 'Emma', 'Davis', '+1-555-0103', 'CloudTech Systems', 'Java, Spring Boot, AWS', 'Senior backend developer, cloud architecture specialist', 'active', '2024-01-12 10:30:00'),
('alex.rodriguez', 'alex.rodriguez@email.com', '$2b$10$hash4', 'candidate', 'Alex', 'Rodriguez', '+1-555-0104', 'Mobile Innovations', 'React Native, Flutter, iOS', 'Mobile app developer with cross-platform expertise', 'active', '2024-01-13 11:45:00'),
('lisa.wang', 'lisa.wang@email.com', '$2b$10$hash5', 'candidate', 'Lisa', 'Wang', '+1-555-0105', 'DevOps Solutions', 'Docker, Kubernetes, CI/CD', 'DevOps engineer specializing in containerization', 'pending', '2024-01-14 13:20:00');

-- Get user IDs for foreign key references
SET @candidate1_id = (SELECT id FROM users WHERE username = 'candidate' LIMIT 1);
SET @candidate2_id = (SELECT id FROM users WHERE username = 'sarah.johnson' LIMIT 1);
SET @candidate3_id = (SELECT id FROM users WHERE username = 'mike.chen' LIMIT 1);
SET @candidate4_id = (SELECT id FROM users WHERE username = 'emma.davis' LIMIT 1);
SET @candidate5_id = (SELECT id FROM users WHERE username = 'alex.rodriguez' LIMIT 1);

-- ============================================
-- SAMPLE ASSESSMENTS (5 records)
-- ============================================
INSERT INTO assessments (title, description, duration, language, difficulty, status, created_by) VALUES
('JavaScript Fundamentals', 'Basic JavaScript programming skills assessment covering variables, functions, and control structures', 45, 'javascript', 'easy', 'active', 1),
('Python Data Structures', 'Advanced Python assessment focusing on data structures, algorithms, and object-oriented programming', 90, 'python', 'hard', 'active', 1),
('Java Spring Boot', 'Enterprise Java development with Spring Boot framework, REST APIs, and database integration', 120, 'java', 'hard', 'active', 2),
('Frontend React Challenge', 'Modern React development with hooks, state management, and component architecture', 60, 'javascript', 'medium', 'draft', 2),
('Database Optimization', 'Advanced SQL optimization techniques, indexing strategies, and query performance tuning', 90, 'sql', 'hard', 'active', 1);

-- ============================================
-- SAMPLE SUBMISSIONS (5 records)
-- ============================================
INSERT INTO submissions (question_id, user_id, code, language, status, score, test_results, execution_time, memory_used, error_message, submitted_at) VALUES
(1, @candidate1_id, 'SELECT * FROM employees WHERE salary > 50000 ORDER BY salary DESC;', 'sql', 'passed', 95.50, '{"passed": 4, "total": 4, "details": [{"test": 1, "passed": true}, {"test": 2, "passed": true}, {"test": 3, "passed": true}, {"test": 4, "passed": true}]}', 120, 1024, NULL, '2024-01-15 10:30:00'),
(2, @candidate2_id, 'SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC;', 'sql', 'passed', 100.00, '{"passed": 3, "total": 3, "details": [{"test": 1, "passed": true}, {"test": 2, "passed": true}, {"test": 3, "passed": true}]}', 95, 512, NULL, '2024-01-16 14:20:00'),
(3, @candidate3_id, 'SELECT e.emp_name, e.department, p.project_name FROM employees e INNER JOIN projects p ON e.emp_id = p.emp_id ORDER BY e.emp_name;', 'sql', 'failed', 60.00, '{"passed": 2, "total": 4, "details": [{"test": 1, "passed": true}, {"test": 2, "passed": false}, {"test": 3, "passed": true}, {"test": 4, "passed": false}]}', 180, 768, 'Syntax error in JOIN clause', '2024-01-17 09:45:00'),
(4, @candidate4_id, 'SELECT department, SUM(amount) as total_sales FROM sales GROUP BY department HAVING SUM(amount) > 100000 ORDER BY total_sales DESC;', 'sql', 'passed', 85.00, '{"passed": 3, "total": 4, "details": [{"test": 1, "passed": true}, {"test": 2, "passed": true}, {"test": 3, "passed": true}, {"test": 4, "passed": false}]}', 150, 640, NULL, '2024-01-18 16:10:00'),
(5, @candidate5_id, 'SELECT e1.name, e1.department, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department = e1.department);', 'sql', 'running', 0.00, NULL, NULL, NULL, NULL, '2024-01-19 11:25:00');

-- Get submission IDs for test_results
SET @submission1_id = (SELECT id FROM submissions WHERE user_id = @candidate1_id AND question_id = 1 LIMIT 1);
SET @submission2_id = (SELECT id FROM submissions WHERE user_id = @candidate2_id AND question_id = 2 LIMIT 1);
SET @submission3_id = (SELECT id FROM submissions WHERE user_id = @candidate3_id AND question_id = 3 LIMIT 1);
SET @submission4_id = (SELECT id FROM submissions WHERE user_id = @candidate4_id AND question_id = 4 LIMIT 1);
SET @submission5_id = (SELECT id FROM submissions WHERE user_id = @candidate5_id AND question_id = 5 LIMIT 1);

-- ============================================
-- SAMPLE TEST_RESULTS (5 records)
-- ============================================
INSERT INTO test_results (submission_id, test_case_index, input, expected_output, actual_output, passed, execution_time, error_message) VALUES
(@submission1_id, 0, 'Table: employees with salary data', '3 employees with salary > 50000', '3 employees with salary > 50000', 1, 45, NULL),
(@submission1_id, 1, 'Table: employees with different salary ranges', '5 employees with salary > 50000', '5 employees with salary > 50000', 1, 38, NULL),
(@submission2_id, 0, 'Table: employees by department', 'IT: 8, Sales: 5, HR: 3', 'IT: 8, Sales: 5, HR: 3', 1, 52, NULL),
(@submission3_id, 0, 'Tables: employees and projects', 'List of employee-project pairs', 'Incomplete result set', 0, 75, 'Missing JOIN condition'),
(@submission4_id, 0, 'Table: sales by department', 'Electronics: 125000, Clothing: 85000', 'Electronics: 125000', 0, 68, 'Incomplete aggregation');

-- Get assessment IDs for candidate_history
SET @assessment1_id = (SELECT id FROM assessments WHERE title = 'SQL Skills Assessment' LIMIT 1);
SET @assessment2_id = (SELECT id FROM assessments WHERE title = 'JavaScript Fundamentals' LIMIT 1);

-- ============================================
-- SAMPLE CANDIDATE_HISTORY (5 records)
-- ============================================
INSERT INTO candidate_history (user_id, assessment_id, action, details, created_at) VALUES
(@candidate1_id, @assessment1_id, 'started', 'Candidate began SQL Skills Assessment', '2024-01-15 10:00:00'),
(@candidate1_id, @assessment1_id, 'question_viewed', 'Viewed question: Employee Salary Query', '2024-01-15 10:05:00'),
(@candidate1_id, @assessment1_id, 'code_submitted', 'Submitted solution for Employee Salary Query', '2024-01-15 10:30:00'),
(@candidate2_id, @assessment1_id, 'started', 'Candidate began SQL Skills Assessment', '2024-01-16 14:00:00'),
(@candidate3_id, @assessment2_id, 'started', 'Candidate began JavaScript Fundamentals', '2024-01-17 09:30:00');

-- Display confirmation
SELECT 'Sample data inserted successfully' as status;
SELECT 
    'assessments' as table_name, COUNT(*) as record_count FROM assessments
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions
UNION ALL  
SELECT 'test_results', COUNT(*) FROM test_results
UNION ALL
SELECT 'candidate_history', COUNT(*) FROM candidate_history
UNION ALL
SELECT 'users', COUNT(*) FROM users;
