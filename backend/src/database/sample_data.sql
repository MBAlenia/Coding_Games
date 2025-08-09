-- Sample Data for Coding Platform
-- Creating 5 records for each table (except invitations which will be handled separately)
-- All in English

-- ============================================
-- SAMPLE ASSESSMENTS (5 records)
-- ============================================
INSERT INTO assessments (title, description, duration, language, difficulty, status, created_by) VALUES
('JavaScript Fundamentals', 'Basic JavaScript programming skills assessment covering variables, functions, and control structures', 45, 'javascript', 'easy', 'active', 1),
('Python Data Structures', 'Advanced Python assessment focusing on data structures, algorithms, and object-oriented programming', 90, 'python', 'hard', 'active', 1),
('Java Spring Boot', 'Enterprise Java development with Spring Boot framework, REST APIs, and database integration', 120, 'java', 'hard', 'active', 2),
('SQL Database Design', 'Comprehensive SQL assessment covering database design, complex queries, and optimization', 75, 'sql', 'medium', 'active', 1),
('Frontend React Challenge', 'Modern React development with hooks, state management, and component architecture', 60, 'javascript', 'medium', 'draft', 2);

-- ============================================
-- SAMPLE USERS (Additional candidates - 5 records)
-- ============================================
INSERT INTO users (username, email, password, role, first_name, last_name, phone, company, skills, notes, status, created_at) VALUES
('sarah.johnson', 'sarah.johnson@email.com', '$2b$10$hash1', 'candidate', 'Sarah', 'Johnson', '+1-555-0101', 'Tech Solutions Inc', 'JavaScript, React, Node.js', 'Strong frontend developer with 3 years experience', 'active', '2024-01-10 08:00:00'),
('mike.chen', 'mike.chen@email.com', '$2b$10$hash2', 'candidate', 'Mike', 'Chen', '+1-555-0102', 'DataCorp Analytics', 'Python, SQL, Machine Learning', 'Data scientist with expertise in ML algorithms', 'active', '2024-01-11 09:15:00'),
('emma.davis', 'emma.davis@email.com', '$2b$10$hash3', 'candidate', 'Emma', 'Davis', '+1-555-0103', 'CloudTech Systems', 'Java, Spring Boot, AWS', 'Senior backend developer, cloud architecture specialist', 'active', '2024-01-12 10:30:00'),
('alex.rodriguez', 'alex.rodriguez@email.com', '$2b$10$hash4', 'candidate', 'Alex', 'Rodriguez', '+1-555-0104', 'Mobile Innovations', 'React Native, Flutter, iOS', 'Mobile app developer with cross-platform expertise', 'active', '2024-01-13 11:45:00'),
('lisa.wang', 'lisa.wang@email.com', '$2b$10$hash5', 'candidate', 'Lisa', 'Wang', '+1-555-0105', 'DevOps Solutions', 'Docker, Kubernetes, CI/CD', 'DevOps engineer specializing in containerization', 'pending', '2024-01-14 13:20:00');

-- ============================================
-- SAMPLE SUBMISSIONS (5 records)
-- ============================================
INSERT INTO submissions (question_id, user_id, code, language, status, score, test_results, execution_time, memory_used, error_message, submitted_at) VALUES
(1, 3, 'SELECT * FROM employees WHERE salary > 50000 ORDER BY salary DESC;', 'sql', 'passed', 95.50, '{"passed": 4, "total": 4, "details": [{"test": 1, "passed": true}, {"test": 2, "passed": true}, {"test": 3, "passed": true}, {"test": 4, "passed": true}]}', 120, 1024, NULL, '2024-01-15 10:30:00'),
(2, 4, 'SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC;', 'sql', 'passed', 100.00, '{"passed": 3, "total": 3, "details": [{"test": 1, "passed": true}, {"test": 2, "passed": true}, {"test": 3, "passed": true}]}', 95, 512, NULL, '2024-01-16 14:20:00'),
(3, 5, 'SELECT e.emp_name, e.department, p.project_name FROM employees e INNER JOIN projects p ON e.emp_id = p.emp_id ORDER BY e.emp_name;', 'sql', 'failed', 60.00, '{"passed": 2, "total": 4, "details": [{"test": 1, "passed": true}, {"test": 2, "passed": false}, {"test": 3, "passed": true}, {"test": 4, "passed": false}]}', 180, 768, 'Syntax error in JOIN clause', '2024-01-17 09:45:00'),
(4, 6, 'SELECT department, SUM(amount) as total_sales FROM sales GROUP BY department HAVING SUM(amount) > 100000 ORDER BY total_sales DESC;', 'sql', 'passed', 85.00, '{"passed": 3, "total": 4, "details": [{"test": 1, "passed": true}, {"test": 2, "passed": true}, {"test": 3, "passed": true}, {"test": 4, "passed": false}]}', 150, 640, NULL, '2024-01-18 16:10:00'),
(5, 7, 'SELECT e1.name, e1.department, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department = e1.department);', 'sql', 'running', 0.00, NULL, NULL, NULL, NULL, '2024-01-19 11:25:00');

-- ============================================
-- SAMPLE TEST_RESULTS (5 records)
-- ============================================
INSERT INTO test_results (submission_id, test_case_index, input, expected_output, actual_output, passed, execution_time, error_message) VALUES
(1, 0, 'Table: employees with salary data', '3 employees with salary > 50000', '3 employees with salary > 50000', 1, 45, NULL),
(1, 1, 'Table: employees with different salary ranges', '5 employees with salary > 50000', '5 employees with salary > 50000', 1, 38, NULL),
(2, 0, 'Table: employees by department', 'IT: 8, Sales: 5, HR: 3', 'IT: 8, Sales: 5, HR: 3', 1, 52, NULL),
(3, 0, 'Tables: employees and projects', 'List of employee-project pairs', 'Incomplete result set', 0, 75, 'Missing JOIN condition'),
(4, 0, 'Table: sales by department', 'Electronics: 125000, Clothing: 85000', 'Electronics: 125000', 0, 68, 'Incomplete aggregation');

-- ============================================
-- SAMPLE CANDIDATE_HISTORY (5 records)
-- ============================================
INSERT INTO candidate_history (user_id, assessment_id, action, details, created_at) VALUES
(3, 1, 'started', 'Candidate began SQL Skills Assessment', '2024-01-15 10:00:00'),
(3, 1, 'question_viewed', 'Viewed question: Employee Salary Query', '2024-01-15 10:05:00'),
(3, 1, 'code_submitted', 'Submitted solution for Employee Salary Query', '2024-01-15 10:30:00'),
(4, 1, 'started', 'Candidate began SQL Skills Assessment', '2024-01-16 14:00:00'),
(5, 2, 'started', 'Candidate began JavaScript Fundamentals', '2024-01-17 09:30:00');

-- ============================================
-- SAMPLE USERS (Additional candidates - 5 records)
-- ============================================
INSERT INTO users (username, email, password, role, first_name, last_name, phone, company, skills, notes, status, created_at) VALUES
('sarah.johnson', 'sarah.johnson@email.com', '$2b$10$hash1', 'candidate', 'Sarah', 'Johnson', '+1-555-0101', 'Tech Solutions Inc', 'JavaScript, React, Node.js', 'Strong frontend developer with 3 years experience', 'active', '2024-01-10 08:00:00'),
('mike.chen', 'mike.chen@email.com', '$2b$10$hash2', 'candidate', 'Mike', 'Chen', '+1-555-0102', 'DataCorp Analytics', 'Python, SQL, Machine Learning', 'Data scientist with expertise in ML algorithms', 'active', '2024-01-11 09:15:00'),
('emma.davis', 'emma.davis@email.com', '$2b$10$hash3', 'candidate', 'Emma', 'Davis', '+1-555-0103', 'CloudTech Systems', 'Java, Spring Boot, AWS', 'Senior backend developer, cloud architecture specialist', 'active', '2024-01-12 10:30:00'),
('alex.rodriguez', 'alex.rodriguez@email.com', '$2b$10$hash4', 'candidate', 'Alex', 'Rodriguez', '+1-555-0104', 'Mobile Innovations', 'React Native, Flutter, iOS', 'Mobile app developer with cross-platform expertise', 'active', '2024-01-13 11:45:00'),
('lisa.wang', 'lisa.wang@email.com', '$2b$10$hash5', 'candidate', 'Lisa', 'Wang', '+1-555-0105', 'DevOps Solutions', 'Docker, Kubernetes, CI/CD', 'DevOps engineer specializing in containerization', 'pending', '2024-01-14 13:20:00');

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
