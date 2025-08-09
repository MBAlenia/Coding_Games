-- Final Unique Sample Data - Only missing tables
-- All in English with professional email template

-- ============================================
-- SAMPLE SUBMISSIONS (5 records using existing user IDs)
-- ============================================
INSERT INTO submissions (question_id, user_id, code, language, status, score, test_results, execution_time, memory_used, submitted_at) VALUES
(1, 4, 'SELECT * FROM employees WHERE salary > 50000 ORDER BY salary DESC;', 'sql', 'passed', 95.50, '{"passed": 4, "total": 4, "details": [{"test": 1, "passed": true}]}', 120, '1024 KB', '2024-01-15 10:30:00'),
(2, 5, 'SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC;', 'sql', 'passed', 100.00, '{"passed": 3, "total": 3, "details": [{"test": 1, "passed": true}]}', 95, '512 KB', '2024-01-16 14:20:00'),
(3, 6, 'SELECT e.emp_name, e.department, p.project_name FROM employees e INNER JOIN projects p ON e.emp_id = p.emp_id ORDER BY e.emp_name;', 'sql', 'failed', 60.00, '{"passed": 2, "total": 4, "details": [{"test": 1, "passed": false}]}', 180, '768 KB', '2024-01-17 09:45:00'),
(4, 7, 'SELECT department, SUM(amount) as total_sales FROM sales GROUP BY department HAVING SUM(amount) > 100000 ORDER BY total_sales DESC;', 'sql', 'passed', 85.00, '{"passed": 3, "total": 4, "details": [{"test": 1, "passed": true}]}', 150, '640 KB', '2024-01-18 16:10:00'),
(5, 8, 'SELECT e1.name, e1.department, e1.salary FROM employees e1 WHERE e1.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department = e1.department);', 'sql', 'running', 0.00, NULL, NULL, NULL, '2024-01-19 11:25:00');

-- ============================================
-- SAMPLE CANDIDATE_HISTORY (5 records with correct column names)
-- ============================================
INSERT INTO candidate_history (candidate_id, action, details, performed_by, created_at) VALUES
(4, 'started', '{"assessment_id": 1, "assessment_title": "SQL Skills Assessment"}', 4, '2024-01-15 10:00:00'),
(4, 'question_viewed', '{"question_id": 1, "question_title": "Employee Salary Query"}', 4, '2024-01-15 10:05:00'),
(4, 'code_submitted', '{"question_id": 1, "submission_id": 1, "score": 95.5}', 4, '2024-01-15 10:30:00'),
(5, 'started', '{"assessment_id": 1, "assessment_title": "SQL Skills Assessment"}', 5, '2024-01-16 14:00:00'),
(6, 'started', '{"assessment_id": 1, "assessment_title": "SQL Skills Assessment"}', 6, '2024-01-17 09:30:00');

-- ============================================
-- 🔗 EXISTING INVITATION URLS FOR TESTING
-- ============================================
SELECT 
    '🔗 EXISTING INVITATION URLS FOR TESTING:' as info;

SELECT 
    CONCAT('http://localhost:3000/take-assessment/', assessment_id, '?token=', token) as invitation_url,
    candidate_name,
    status,
    'Copy this URL to test the invitation system' as instructions
FROM invitations 
ORDER BY id DESC 
LIMIT 5;

-- ============================================
-- 📧 PROFESSIONAL EMAIL TEMPLATE PREVIEW
-- ============================================
SELECT 
    '📧 PROFESSIONAL EMAIL TEMPLATE PREVIEW:' as info;

SELECT 
    CONCAT(
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        '📧 SUBJECT: 🚀 Technical Assessment Invitation - SQL Skills Assessment\n',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n',
        'Dear ', candidate_name, ',\n\n',
        '👋 Greetings from TechCorp!\n\n',
        'We are pleased to invite you to participate in our technical coding\n',
        'assessment as part of our selection process. This is your opportunity\n',
        'to showcase your programming expertise!\n\n',
        '📋 ASSESSMENT DETAILS:\n',
        '• Assessment: SQL Skills Assessment\n',
        '• Duration: 60 minutes ⏱️\n',
        '• Questions: 14 progressive difficulty levels (Beginner → Expert)\n',
        '• Language: SQL 💾\n',
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
        '👉 Click here: http://localhost:3000/take-assessment/', assessment_id, '?token=', token, '\n\n',
        '📝 STEP-BY-STEP INSTRUCTIONS:\n',
        '1️⃣ Click the assessment link above\n',
        '2️⃣ Read each question carefully\n',
        '3️⃣ Write your SQL code in the Monaco editor\n',
        '4️⃣ Use "Compile" button to test your solution\n',
        '5️⃣ Green border = all tests passed ✅\n',
        '6️⃣ Red border = some tests failed ❌\n',
        '7️⃣ Navigate with Previous/Next buttons\n',
        '8️⃣ Submit when completed\n\n',
        '⚠️ IMPORTANT SECURITY NOTES:\n',
        '🚫 Copy/paste is disabled for security\n',
        '⏰ Complete in one session (no pause/resume)\n',
        '🌐 Ensure stable internet connection\n',
        '📅 This invitation expires in 7 days\n',
        '🆘 Contact support if you encounter issues\n\n',
        '🍀 We wish you the best of luck!\n\n',
        'Best regards,\n',
        '👥 TechCorp Recruitment Team\n',
        '📧 recruitment@techcorp.com\n',
        '🌐 www.techcorp.com\n\n',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        '🔒 This is an automated message. Please do not reply.\n',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    ) as professional_email_template
FROM invitations 
WHERE status = 'pending'
LIMIT 1;

-- ============================================
-- 📊 DATABASE SUMMARY
-- ============================================
SELECT 'Sample data inserted successfully! ✅' as status;

SELECT 
    '📊 DATABASE SUMMARY:' as info;

SELECT 
    'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments
UNION ALL  
SELECT 'questions', COUNT(*) FROM questions
UNION ALL
SELECT 'invitations', COUNT(*) FROM invitations
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'candidate_history', COUNT(*) FROM candidate_history
UNION ALL
SELECT 'test_results', COUNT(*) FROM test_results;

-- ============================================
-- 🎯 READY FOR TESTING
-- ============================================
SELECT 
    '🎯 PLATFORM READY FOR TESTING:' as info;

SELECT 
    CONCAT(
        '✅ Anti-cheat features implemented (copy/paste disabled)\n',
        '✅ CodinGame-style UI with compile button\n',
        '✅ Visual feedback (green/red borders)\n',
        '✅ 14 SQL questions (Beginner to Expert)\n',
        '✅ 60-minute timer for assessments\n',
        '✅ Professional email invitation system\n',
        '✅ Sample data for all tables\n',
        '✅ Navigation between questions\n',
        '✅ Real-time compilation and testing\n\n',
        '🚀 Ready to test the complete assessment workflow!'
    ) as platform_status;
