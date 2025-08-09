-- Final Sample Data - Using existing users
-- Creating 5 records for remaining tables
-- All in English

-- ============================================
-- SAMPLE INVITATIONS (5 records with professional URLs)
-- ============================================
INSERT INTO invitations (assessment_id, candidate_email, candidate_name, token, status, expires_at, created_by) VALUES
(1, 'sarah.johnson@email.com', 'Sarah Johnson', 'inv_sj_001_abc123def456', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 2),
(1, 'mike.chen@email.com', 'Mike Chen', 'inv_mc_002_ghi789jkl012', 'accepted', DATE_ADD(NOW(), INTERVAL 7 DAY), 2),
(1, 'emma.davis@email.com', 'Emma Davis', 'inv_ed_003_mno345pqr678', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
(1, 'alex.rodriguez@email.com', 'Alex Rodriguez', 'inv_ar_004_stu901vwx234', 'expired', DATE_SUB(NOW(), INTERVAL 1 DAY), 1),
(1, 'lisa.wang@email.com', 'Lisa Wang', 'inv_lw_005_yz567abc890d', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 2);

-- ============================================
-- SAMPLE SUBMISSIONS (5 records using existing user IDs)
-- ============================================
INSERT INTO submissions (question_id, user_id, code, language, status, score, test_results, execution_time, memory_used, submitted_at) VALUES
(1, 4, 'SELECT * FROM employees WHERE salary > 50000 ORDER BY salary DESC;', 'sql', 'passed', 95.50, '{"passed": 4, "total": 4, "details": [{"test": 1, "passed": true}]}', 120, 1024, '2024-01-15 10:30:00'),
(2, 5, 'SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC;', 'sql', 'passed', 100.00, '{"passed": 3, "total": 3, "details": [{"test": 1, "passed": true}]}', 95, 512, '2024-01-16 14:20:00'),
(3, 6, 'SELECT e.emp_name, e.department, p.project_name FROM employees e INNER JOIN projects p ON e.emp_id = p.emp_id ORDER BY e.emp_name;', 'sql', 'failed', 60.00, '{"passed": 2, "total": 4, "details": [{"test": 1, "passed": false}]}', 180, 768, '2024-01-17 09:45:00'),
(4, 7, 'SELECT department, SUM(amount) as total_sales FROM sales GROUP BY department HAVING SUM(amount) > 100000 ORDER BY total_sales DESC;', 'sql', 'passed', 85.00, '{"passed": 3, "total": 4, "details": [{"test": 1, "passed": true}]}', 150, 640, '2024-01-18 16:10:00'),
(5, 8, 'SELECT e1.name, e1.department, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department = e1.department);', 'sql', 'running', 0.00, NULL, NULL, NULL, '2024-01-19 11:25:00');

-- ============================================
-- SAMPLE CANDIDATE_HISTORY (5 records)
-- ============================================
INSERT INTO candidate_history (user_id, assessment_id, action, details, created_at) VALUES
(4, 1, 'started', 'Candidate began SQL Skills Assessment', '2024-01-15 10:00:00'),
(4, 1, 'question_viewed', 'Viewed question: Employee Salary Query', '2024-01-15 10:05:00'),
(4, 1, 'code_submitted', 'Submitted solution for Employee Salary Query', '2024-01-15 10:30:00'),
(5, 1, 'started', 'Candidate began SQL Skills Assessment', '2024-01-16 14:00:00'),
(6, 1, 'started', 'Candidate began SQL Skills Assessment', '2024-01-17 09:30:00');

-- ============================================
-- DISPLAY SAMPLE INVITATION URLS FOR TESTING
-- ============================================
SELECT 
    '🔗 SAMPLE INVITATION URLS FOR TESTING:' as info;

SELECT 
    CONCAT('http://localhost:3000/take-assessment/', assessment_id, '?token=', token) as invitation_url,
    candidate_name,
    status,
    'Copy this URL to test the invitation system' as instructions
FROM invitations 
WHERE token LIKE 'inv_%'
ORDER BY id DESC 
LIMIT 5;

-- ============================================
-- EMAIL TEMPLATE PREVIEW
-- ============================================
SELECT 
    '📧 PROFESSIONAL EMAIL TEMPLATE PREVIEW:' as info;

SELECT 
    CONCAT(
        'Subject: 🚀 Technical Assessment Invitation - SQL Skills Assessment\n',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        'Dear ', candidate_name, ',\n\n',
        'Greetings from TechCorp! 👋\n\n',
        'We are pleased to invite you to participate in our technical coding assessment\n',
        'as part of our selection process. This is your opportunity to showcase your\n',
        'programming expertise!\n\n',
        '📋 ASSESSMENT DETAILS:\n',
        '• Assessment: SQL Skills Assessment\n',
        '• Duration: 60 minutes\n',
        '• Questions: 14 progressive difficulty levels (Beginner → Expert)\n',
        '• Language: SQL\n',
        '• Format: Interactive coding challenges\n\n',
        '🎯 KEY FEATURES:\n',
        '✅ Real-time code compilation with instant feedback\n',
        '🔒 Secure environment with anti-cheat protection\n',
        '⏱️ Live countdown timer (60 minutes)\n',
        '📊 Visual feedback (green/red borders for test results)\n',
        '🔄 Navigate freely between questions\n',
        '💾 Auto-save progress when switching questions\n',
        '🧪 Built-in test cases for immediate validation\n\n',
        '🚀 START YOUR ASSESSMENT:\n',
        'Click here: http://localhost:3000/take-assessment/', assessment_id, '?token=', token, '\n\n',
        '📝 INSTRUCTIONS:\n',
        '1. Click the assessment link above\n',
        '2. Read each question carefully\n',
        '3. Write your SQL code in the editor\n',
        '4. Use "Compile" button to test your solution\n',
        '5. Green border = all tests passed ✅\n',
        '6. Red border = some tests failed ❌\n',
        '7. Navigate with Previous/Next buttons\n',
        '8. Submit when completed\n\n',
        '⚠️ IMPORTANT NOTES:\n',
        '• Copy/paste is disabled for security\n',
        '• Complete in one session (no pause/resume)\n',
        '• Ensure stable internet connection\n',
        '• This invitation expires in 7 days\n',
        '• Contact support if you encounter issues\n\n',
        'We wish you the best of luck! 🍀\n\n',
        'Best regards,\n',
        'TechCorp Recruitment Team\n',
        'recruitment@techcorp.com\n',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    ) as professional_email_template
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
SELECT 'candidate_history', COUNT(*) FROM candidate_history;
