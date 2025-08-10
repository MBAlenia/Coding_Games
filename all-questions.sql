-- Simple, clear questions in English for all assessments
-- All questions include required fields: language and test_cases

-- Clear all existing questions
DELETE FROM questions;

-- JavaScript Fundamentals (ID: 1)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(1, 'Sum Array', 'Write a function sum(arr) that returns the sum of all numbers in an array.\n\nExample: sum([1,2,3,4]) returns 10', 'javascript', '[]', 'beginner', 300, 1),
(1, 'Find Max', 'Write a function findMax(arr) that returns the largest number.\n\nExample: findMax([3,7,2,9,1]) returns 9', 'javascript', '[]', 'beginner', 300, 2);

-- React Development (ID: 2)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(2, 'Counter Component', 'Create a React counter component with increment and reset buttons.', 'javascript', '[]', 'beginner', 300, 1),
(2, 'Todo List', 'Create a Todo List component with add and delete functionality.', 'javascript', '[]', 'intermediate', 300, 2);

-- Python Basics (ID: 3)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(3, 'Palindrome', 'Write is_palindrome(s) that returns True if string is palindrome.\n\nExample: is_palindrome("racecar") returns True', 'python', '[]', 'beginner', 300, 1),
(3, 'FizzBuzz', 'Print numbers 1 to n. Print Fizz for multiples of 3, Buzz for 5, FizzBuzz for both.', 'python', '[]', 'beginner', 300, 2);

-- Java Programming (ID: 4)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(4, 'Reverse String', 'Write reverse(String s) method.\n\nExample: reverse("hello") returns "olleh"', 'java', '[]', 'beginner', 300, 1),
(4, 'Prime Check', 'Write isPrime(int n) that returns true if n is prime.', 'java', '[]', 'beginner', 300, 2);

-- SQL Database (ID: 5)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(5, 'Select Query', 'Select all users with age > 18 from users table.', 'sql', '[]', 'beginner', 300, 1),
(5, 'Join Query', 'Join orders and customers tables to show customer names with orders.', 'sql', '[]', 'intermediate', 300, 2);

-- Node.js Backend (ID: 6)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(6, 'Express Route', 'Create GET /api/hello route that returns JSON message.', 'javascript', '[]', 'beginner', 300, 1),
(6, 'Middleware', 'Create logging middleware for Express.', 'javascript', '[]', 'intermediate', 300, 2);

-- Angular Framework (ID: 7)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(7, 'Component', 'Create Angular component to display list of items.', 'javascript', '[]', 'beginner', 300, 1),
(7, 'Service', 'Create Angular service to fetch data from API.', 'javascript', '[]', 'intermediate', 300, 2);

-- Data Structures (ID: 8)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(8, 'Stack', 'Implement Stack with push, pop, peek methods.', 'javascript', '[]', 'intermediate', 300, 1),
(8, 'Binary Search', 'Implement binary search for sorted array.', 'javascript', '[]', 'intermediate', 300, 2);

-- Algorithms (ID: 9)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(9, 'Two Sum', 'Find two numbers that sum to target.\n\nExample: twoSum([2,7,11,15], 9) returns [0,1]', 'javascript', '[]', 'intermediate', 300, 1),
(9, 'Merge Sort', 'Implement merge sort algorithm.', 'javascript', '[]', 'advanced', 300, 2);

-- DevOps Basics (ID: 10)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(10, 'Dockerfile', 'Write Dockerfile for Node.js app on port 3000.', 'javascript', '[]', 'intermediate', 300, 1),
(10, 'CI Pipeline', 'Create GitHub Actions workflow for tests.', 'javascript', '[]', 'intermediate', 300, 2);

-- Cloud Computing (ID: 11)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(11, 'S3 Bucket', 'Create AWS S3 bucket with public read access.', 'javascript', '[]', 'intermediate', 300, 1),
(11, 'Lambda Function', 'Create AWS Lambda function to process uploads.', 'javascript', '[]', 'advanced', 300, 2);

-- Machine Learning (ID: 12)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(12, 'Linear Regression', 'Implement simple linear regression in Python.', 'python', '[]', 'intermediate', 300, 1),
(12, 'Data Preprocessing', 'Clean and normalize dataset for ML model.', 'python', '[]', 'intermediate', 300, 2);

-- Cybersecurity (ID: 13)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(13, 'Password Hash', 'Implement secure password hashing with salt.', 'python', '[]', 'intermediate', 300, 1),
(13, 'Input Validation', 'Validate and sanitize user input to prevent SQL injection.', 'python', '[]', 'intermediate', 300, 2);

-- Mobile Development (ID: 14)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(14, 'React Native Screen', 'Create React Native login screen.', 'javascript', '[]', 'intermediate', 300, 1),
(14, 'API Integration', 'Integrate REST API in mobile app.', 'javascript', '[]', 'intermediate', 300, 2);

-- System Design (ID: 15)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(15, 'URL Shortener', 'Design URL shortener system architecture.', 'javascript', '[]', 'advanced', 300, 1),
(15, 'Chat System', 'Design scalable chat application.', 'javascript', '[]', 'advanced', 300, 2);

-- Database Design (ID: 16)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(16, 'Schema Design', 'Design database schema for e-commerce platform.', 'sql', '[]', 'intermediate', 300, 1),
(16, 'Query Optimization', 'Optimize slow SQL query with proper indexing.', 'sql', '[]', 'advanced', 300, 2);

-- API Development (ID: 17)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(17, 'REST API', 'Create RESTful API for user management.', 'javascript', '[]', 'intermediate', 300, 1),
(17, 'GraphQL', 'Implement GraphQL resolver for products.', 'javascript', '[]', 'advanced', 300, 2);

-- Java Enterprise Development (ID: 18)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(18, 'Spring Boot REST', 'Create REST controller for users.', 'java', '[]', 'intermediate', 300, 1),
(18, 'JPA Repository', 'Create JPA repository with custom queries.', 'java', '[]', 'intermediate', 300, 2),
(18, 'Service Layer', 'Implement UserService with validation.', 'java', '[]', 'advanced', 300, 3);

-- Frontend Testing (ID: 19)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(19, 'Unit Test', 'Write Jest unit test for React component.', 'javascript', '[]', 'intermediate', 300, 1),
(19, 'E2E Test', 'Write Cypress E2E test for login flow.', 'javascript', '[]', 'advanced', 300, 2);

-- Microservices (ID: 20)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(20, 'Service Communication', 'Implement REST communication between microservices.', 'javascript', '[]', 'advanced', 300, 1),
(20, 'Service Discovery', 'Configure service discovery with Consul.', 'javascript', '[]', 'expert', 300, 2);
