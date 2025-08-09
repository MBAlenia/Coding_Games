-- Create database
CREATE DATABASE IF NOT EXISTS coding_platform;
USE coding_platform;

-- Candidates table
CREATE TABLE candidates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    technology VARCHAR(50) NOT NULL,
    level ENUM('beginner', 'intermediate', 'expert') NOT NULL,
    session_token VARCHAR(255) UNIQUE,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    status ENUM('registered', 'in_progress', 'completed', 'expired') DEFAULT 'registered',
    score INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_technology (technology),
    INDEX idx_level (level),
    INDEX idx_status (status),
    INDEX idx_session_token (session_token)
);

-- Challenges table
CREATE TABLE challenges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technology VARCHAR(50) NOT NULL,
    level ENUM('beginner', 'intermediate', 'expert') NOT NULL,
    starter_code TEXT,
    expected_output TEXT,
    test_cases JSON,
    time_limit INT DEFAULT 3600,
    difficulty_score INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_tech_level (technology, level)
);

-- Submissions table
CREATE TABLE submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_id INT NOT NULL,
    challenge_id INT NOT NULL,
    code TEXT NOT NULL,
    output TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    execution_time FLOAT,
    memory_used INT,
    test_results JSON,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    
    INDEX idx_candidate (candidate_id),
    INDEX idx_challenge (challenge_id),
    INDEX idx_submitted_at (submitted_at)
);

-- Recruiters table (optional - for authentication)
CREATE TABLE recruiters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(255),
    role ENUM('admin', 'recruiter') DEFAULT 'recruiter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Assessment sessions table (for tracking active sessions)
CREATE TABLE assessment_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    expected_end_time TIMESTAMP NOT NULL,
    actual_end_time TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status ENUM('active', 'completed', 'expired', 'abandoned') DEFAULT 'active',
    
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_status (status)
);
