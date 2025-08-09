-- Basic Sample Data - Safe insertion without foreign key conflicts
-- All in English

-- ============================================
-- SAMPLE USERS (5 additional candidates)
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
        '✅ Real-time code compilation with visual feedback\n',
        '🔒 Anti-cheat protection (copy/paste disabled)\n',
        '⏱️ 60-minute timer with countdown\n',
        '📊 Instant test results with green/red borders\n',
        '🔄 Navigate between questions freely\n',
        '💾 Auto-save progress when switching questions\n\n',
        'Instructions:\n',
        '1. Click the link above to start your assessment\n',
        '2. You have 60 minutes to complete all questions\n',
        '3. Use the "Compile" button to test your code\n',
        '4. Navigate with Previous/Next buttons\n',
        '5. Submit when finished\n\n',
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
SELECT 'invitations', COUNT(*) FROM invitations;
