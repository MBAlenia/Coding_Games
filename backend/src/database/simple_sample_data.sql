-- Simple Sample Data for All Tables
-- 5 records each (except invitations handled separately)
-- All in English

-- ============================================
-- SAMPLE USERS (5 additional candidates)
-- ============================================
INSERT INTO users (username, email, password_hash, role, first_name, last_name) VALUES
('sarah.johnson', 'sarah.johnson@email.com', '$2b$10$samplehash1', 'candidate', 'Sarah', 'Johnson'),
('mike.chen', 'mike.chen@email.com', '$2b$10$samplehash2', 'candidate', 'Mike', 'Chen'),
('emma.davis', 'emma.davis@email.com', '$2b$10$samplehash3', 'candidate', 'Emma', 'Davis'),
('alex.rodriguez', 'alex.rodriguez@email.com', '$2b$10$samplehash4', 'candidate', 'Alex', 'Rodriguez'),
('lisa.wang', 'lisa.wang@email.com', '$2b$10$samplehash5', 'candidate', 'Lisa', 'Wang');

-- ============================================
-- SAMPLE ASSESSMENTS (5 additional)
-- ============================================
INSERT INTO assessments (title, description, duration, language, difficulty, status, created_by) VALUES
('JavaScript Fundamentals', 'Basic JavaScript programming skills assessment', 45, 'javascript', 'easy', 'active', 1),
('Python Data Structures', 'Advanced Python data structures and algorithms', 90, 'python', 'hard', 'active', 1),
('Java Spring Boot', 'Enterprise Java development with Spring Boot', 120, 'java', 'hard', 'active', 2),
('Frontend React', 'Modern React development and state management', 60, 'javascript', 'medium', 'active', 2),
('Database Design', 'SQL database design and optimization', 75, 'sql', 'medium', 'draft', 1);

-- ============================================
-- SAMPLE INVITATIONS (5 records with URLs)
-- ============================================
INSERT INTO invitations (assessment_id, candidate_email, candidate_name, token, status, expires_at, created_by) VALUES
(1, 'sarah.johnson@email.com', 'Sarah Johnson', 'abc123token1', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 2),
(2, 'mike.chen@email.com', 'Mike Chen', 'def456token2', 'accepted', DATE_ADD(NOW(), INTERVAL 7 DAY), 2),
(3, 'emma.davis@email.com', 'Emma Davis', 'ghi789token3', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
(4, 'alex.rodriguez@email.com', 'Alex Rodriguez', 'jkl012token4', 'expired', DATE_SUB(NOW(), INTERVAL 1 DAY), 1),
(5, 'lisa.wang@email.com', 'Lisa Wang', 'mno345token5', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 2);

-- Display sample invitation URLs for testing
SELECT 
    'Sample Invitation URLs:' as info,
    CONCAT('http://localhost:3000/take-assessment/', assessment_id, '?token=', token) as invitation_url,
    candidate_name,
    status
FROM invitations 
ORDER BY id DESC 
LIMIT 5;

-- Display confirmation
SELECT 'Sample data inserted successfully' as status;
SELECT 
    'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments
UNION ALL  
SELECT 'invitations', COUNT(*) FROM invitations;
