-- Unique Sample Data for All Tables
-- 5 records each with unique identifiers
-- All in English

-- ============================================
-- SAMPLE USERS (5 additional candidates with unique names)
-- ============================================
INSERT INTO users (username, email, password_hash, role, first_name, last_name) VALUES
('john.smith', 'john.smith@techcorp.com', '$2b$10$samplehash1', 'candidate', 'John', 'Smith'),
('maria.garcia', 'maria.garcia@devstudio.com', '$2b$10$samplehash2', 'candidate', 'Maria', 'Garcia'),
('david.wilson', 'david.wilson@innovate.io', '$2b$10$samplehash3', 'candidate', 'David', 'Wilson'),
('sophie.brown', 'sophie.brown@codelab.net', '$2b$10$samplehash4', 'candidate', 'Sophie', 'Brown'),
('james.taylor', 'james.taylor@webdev.org', '$2b$10$samplehash5', 'candidate', 'James', 'Taylor');

-- ============================================
-- SAMPLE ASSESSMENTS (5 additional)
-- ============================================
INSERT INTO assessments (title, description, duration, language, difficulty, status, created_by) VALUES
('JavaScript Fundamentals Test', 'Basic JavaScript programming skills assessment covering ES6+ features', 45, 'javascript', 'easy', 'active', 1),
('Python Algorithm Challenge', 'Advanced Python data structures and algorithm implementation', 90, 'python', 'hard', 'active', 1),
('Java Enterprise Development', 'Spring Boot framework and REST API development', 120, 'java', 'hard', 'active', 2),
('React Frontend Assessment', 'Modern React hooks and component architecture', 60, 'javascript', 'medium', 'active', 2),
('Advanced SQL Queries', 'Complex SQL queries and database optimization', 75, 'sql', 'medium', 'draft', 1);

-- ============================================
-- SAMPLE INVITATIONS (5 records with professional URLs)
-- ============================================
INSERT INTO invitations (assessment_id, candidate_email, candidate_name, token, status, expires_at, created_by) VALUES
(1, 'john.smith@techcorp.com', 'John Smith', 'inv_js_001_abc123def456', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 2),
(2, 'maria.garcia@devstudio.com', 'Maria Garcia', 'inv_mg_002_ghi789jkl012', 'accepted', DATE_ADD(NOW(), INTERVAL 7 DAY), 2),
(3, 'david.wilson@innovate.io', 'David Wilson', 'inv_dw_003_mno345pqr678', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
(4, 'sophie.brown@codelab.net', 'Sophie Brown', 'inv_sb_004_stu901vwx234', 'expired', DATE_SUB(NOW(), INTERVAL 1 DAY), 1),
(5, 'james.taylor@webdev.org', 'James Taylor', 'inv_jt_005_yz567abc890d', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 2);

-- ============================================
-- SAMPLE SUBMISSIONS (5 records)
-- ============================================
INSERT INTO submissions (question_id, user_id, code, language, status, score, test_results, execution_time, memory_used, submitted_at) VALUES
(1, 3, 'SELECT * FROM employees WHERE salary > 50000 ORDER BY salary DESC;', 'sql', 'passed', 95.50, '{"passed": 4, "total": 4}', 120, 1024, '2024-01-15 10:30:00'),
(2, 4, 'SELECT department, COUNT(*) as count FROM employees GROUP BY department;', 'sql', 'passed', 100.00, '{"passed": 3, "total": 3}', 95, 512, '2024-01-16 14:20:00'),
(3, 5, 'SELECT e.name, p.project_name FROM employees e JOIN projects p ON e.id = p.emp_id;', 'sql', 'failed', 60.00, '{"passed": 2, "total": 4}', 180, 768, '2024-01-17 09:45:00'),
(4, 6, 'SELECT department, SUM(amount) FROM sales GROUP BY department HAVING SUM(amount) > 100000;', 'sql', 'passed', 85.00, '{"passed": 3, "total": 4}', 150, 640, '2024-01-18 16:10:00'),
(5, 7, 'SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);', 'sql', 'running', 0.00, NULL, NULL, NULL, '2024-01-19 11:25:00');

-- ============================================
-- SAMPLE TEST_RESULTS (5 records)
-- ============================================
INSERT INTO test_results (submission_id, test_case_index, input, expected_output, actual_output, passed, execution_time) VALUES
(1, 0, 'employees table with salary data', 'High salary employees list', 'High salary employees list', 1, 45),
(1, 1, 'employees with various salaries', 'Filtered and sorted results', 'Filtered and sorted results', 1, 38),
(2, 0, 'employees by department', 'Department counts: IT=8, Sales=5, HR=3', 'Department counts: IT=8, Sales=5, HR=3', 1, 52),
(3, 0, 'employees and projects tables', 'Employee-project relationships', 'Incomplete JOIN result', 0, 75),
(4, 0, 'sales data by department', 'High-performing departments', 'Partial aggregation result', 0, 68);

-- ============================================
-- SAMPLE CANDIDATE_HISTORY (5 records)
-- ============================================
INSERT INTO candidate_history (user_id, assessment_id, action, details, created_at) VALUES
(3, 1, 'started', 'Candidate began SQL Skills Assessment', '2024-01-15 10:00:00'),
(3, 1, 'question_viewed', 'Viewed question: Employee Salary Query', '2024-01-15 10:05:00'),
(3, 1, 'code_submitted', 'Submitted solution for Employee Salary Query', '2024-01-15 10:30:00'),
(4, 1, 'started', 'Candidate began SQL Skills Assessment', '2024-01-16 14:00:00'),
(5, 2, 'started', 'Candidate began JavaScript Fundamentals Test', '2024-01-17 09:30:00');

-- ============================================
-- DISPLAY SAMPLE INVITATION URLS FOR TESTING
-- ============================================
SELECT 
    '🔗 SAMPLE INVITATION URLS FOR TESTING:' as info;

SELECT 
    CONCAT('http://localhost:3000/take-assessment/', assessment_id, '?token=', token) as invitation_url,
    candidate_name,
    status,
    'Copy this URL to test the invitation system' as note
FROM invitations 
WHERE token LIKE 'inv_%'
ORDER BY id DESC 
LIMIT 5;

-- ============================================
-- EMAIL TEMPLATE PREVIEW
-- ============================================
SELECT 
    '📧 EMAIL TEMPLATE PREVIEW:' as info;

SELECT 
    CONCAT(
        'Subject: 🚀 Coding Assessment Invitation - SQL Skills Assessment\n',
        'To: ', candidate_email, '\n',
        'Dear ', candidate_name, ',\n\n',
        'You have been invited to take our technical coding assessment.\n',
        'Assessment: SQL Skills Assessment\n',
        'Duration: 60 minutes\n',
        'Click here to start: http://localhost:3000/take-assessment/', assessment_id, '?token=', token, '\n\n',
        'Features:\n',
        '✅ Real-time code compilation\n',
        '🔒 Anti-cheat protection (copy/paste disabled)\n',
        '⏱️ 60-minute timer\n',
        '📊 Instant feedback with visual indicators\n',
        '🔄 Navigate between questions\n\n',
        'Good luck!\n',
        'TechCorp Recruitment Team'
    ) as email_preview
FROM invitations 
WHERE status = 'pending' AND token LIKE 'inv_%'
LIMIT 1;

-- Display confirmation
SELECT 'Sample data inserted successfully! ✅' as status;
SELECT 
    'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments
UNION ALL  
SELECT 'invitations', COUNT(*) FROM invitations
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'test_results', COUNT(*) FROM test_results
UNION ALL
SELECT 'candidate_history', COUNT(*) FROM candidate_history;
