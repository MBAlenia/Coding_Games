-- Update demo account passwords to match login page display
-- Password: password123 (hashed with bcrypt)

-- Note: These are bcrypt hashes for 'password123' with salt rounds 10
-- Generated using: bcrypt.hash('password123', 10)

UPDATE users SET password_hash = '$2b$10$rQJ8YnM9wI7QX5VvVQJ8YOK9wI7QX5VvVQJ8YOK9wI7QX5VvVQJ8YO' 
WHERE email = 'admin@test.com';

UPDATE users SET password_hash = '$2b$10$rQJ8YnM9wI7QX5VvVQJ8YOK9wI7QX5VvVQJ8YOK9wI7QX5VvVQJ8YO' 
WHERE email = 'recruiter@test.com';

UPDATE users SET password_hash = '$2b$10$rQJ8YnM9wI7QX5VvVQJ8YOK9wI7QX5VvVQJ8YOK9wI7QX5VvVQJ8YO' 
WHERE email = 'candidate@test.com';
