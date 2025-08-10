-- Questions pour Java Enterprise Development (ID: 18)
INSERT INTO questions (assessment_id, title, description, template_code, expected_output, test_cases, difficulty, points, language) VALUES
(18, 'Spring Boot REST API', 'Create a REST controller with GET and POST endpoints for managing users', 
'@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n    \n    // TODO: Implement GET /api/users endpoint\n    \n    // TODO: Implement POST /api/users endpoint\n    \n}', 
'{"users": [{"id": 1, "name": "John"}]}', 
'[{"input": "GET /api/users", "expected": "List of users"}, {"input": "POST /api/users", "expected": "User created"}]', 
'medium', 50, 'java'),

(18, 'JPA Repository', 'Implement a JPA repository interface for User entity with custom query methods', 
'@Repository\npublic interface UserRepository extends JpaRepository<User, Long> {\n    \n    // TODO: Find users by email\n    \n    // TODO: Find users by status\n    \n}', 
'List<User> findByEmail(String email);', 
'[{"input": "findByEmail", "expected": "User with matching email"}, {"input": "findByStatus", "expected": "Users with status"}]', 
'medium', 50, 'java');

-- Questions pour Java Spring Boot (ID: 8, 13)
INSERT INTO questions (assessment_id, title, description, template_code, expected_output, test_cases, difficulty, points, language) VALUES
(8, 'Spring Boot Configuration', 'Configure a Spring Boot application with database connection', 
'@Configuration\npublic class DatabaseConfig {\n    \n    // TODO: Configure DataSource bean\n    \n}', 
'DataSource configured', 
'[{"input": "DataSource", "expected": "Database connection"}]', 
'easy', 30, 'java'),

(13, 'Spring Boot Service', 'Create a service class with business logic for user management', 
'@Service\npublic class UserService {\n    \n    // TODO: Implement user creation logic\n    \n    // TODO: Implement user validation\n    \n}', 
'User service with validation', 
'[{"input": "createUser", "expected": "User created successfully"}]', 
'medium', 40, 'java');

-- Questions pour JavaScript Fundamentals (ID: 6, 11, 16)
INSERT INTO questions (assessment_id, title, description, template_code, expected_output, test_cases, difficulty, points, language) VALUES
(6, 'Array Manipulation', 'Implement functions to filter and transform arrays', 
'function processArray(arr) {\n    // TODO: Filter even numbers and multiply by 2\n    return [];\n}', 
'[4, 8, 12]', 
'[{"input": "[1,2,3,4,5,6]", "expected": "[4,8,12]"}]', 
'easy', 25, 'javascript'),

(11, 'Object Operations', 'Work with JavaScript objects and destructuring', 
'function extractUserInfo(user) {\n    // TODO: Extract name and email from user object\n    return {};\n}', 
'{"name": "John", "email": "john@test.com"}', 
'[{"input": "user object", "expected": "extracted info"}]', 
'easy', 25, 'javascript'),

(16, 'Async Programming', 'Implement async/await functions for API calls', 
'async function fetchUserData(userId) {\n    // TODO: Fetch user data from API\n    return null;\n}', 
'User data object', 
'[{"input": "userId", "expected": "user data"}]', 
'medium', 35, 'javascript');

-- Questions pour Python (ID: 7, 12, 17)
INSERT INTO questions (assessment_id, title, description, template_code, expected_output, test_cases, difficulty, points, language) VALUES
(7, 'List Comprehensions', 'Use Python list comprehensions to process data', 
'def process_numbers(numbers):\n    # TODO: Return squares of even numbers\n    return []', 
'[4, 16, 36]', 
'[{"input": "[1,2,3,4,5,6]", "expected": "[4,16,36]"}]', 
'easy', 30, 'python'),

(12, 'Dictionary Operations', 'Work with Python dictionaries and data manipulation', 
'def group_by_category(items):\n    # TODO: Group items by category\n    return {}', 
'{"tech": ["laptop"], "books": ["python"]}', 
'[{"input": "list of items", "expected": "grouped dict"}]', 
'medium', 35, 'python'),

(17, 'Algorithm Implementation', 'Implement sorting and searching algorithms', 
'def binary_search(arr, target):\n    # TODO: Implement binary search\n    return -1', 
'Index of target element', 
'[{"input": "[1,2,3,4,5], 3", "expected": "2"}]', 
'hard', 45, 'python');

-- Questions pour SQL (ID: 1, 2, 9, 15, 20)
INSERT INTO questions (assessment_id, title, description, template_code, expected_output, test_cases, difficulty, points, language) VALUES
(1, 'Basic SELECT', 'Write SQL queries to retrieve data from tables', 
'-- TODO: Select all users from users table\nSELECT * FROM users;', 
'All user records', 
'[{"input": "users table", "expected": "all records"}]', 
'easy', 20, 'sql'),

(2, 'JOIN Operations', 'Write SQL queries with JOIN operations', 
'-- TODO: Join users and orders tables\nSELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id;', 
'User names with order totals', 
'[{"input": "users and orders", "expected": "joined data"}]', 
'medium', 35, 'sql'),

(9, 'Database Design', 'Create tables with proper relationships', 
'-- TODO: Create users table with constraints\nCREATE TABLE users (\n    id INT PRIMARY KEY,\n    email VARCHAR(255) UNIQUE\n);', 
'Table created successfully', 
'[{"input": "table definition", "expected": "table created"}]', 
'medium', 40, 'sql'),

(15, 'Query Optimization', 'Optimize SQL queries for better performance', 
'-- TODO: Optimize this query with proper indexing\nSELECT * FROM users WHERE email = ?;', 
'Optimized query', 
'[{"input": "slow query", "expected": "optimized version"}]', 
'hard', 50, 'sql'),

(20, 'Advanced Queries', 'Write complex SQL queries with subqueries and aggregations', 
'-- TODO: Find users with more than 5 orders\nSELECT u.name FROM users u WHERE (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) > 5;', 
'Users with multiple orders', 
'[{"input": "users and orders", "expected": "filtered results"}]', 
'hard', 45, 'sql');

-- Questions pour React Frontend (ID: 10, 14, 19)
INSERT INTO questions (assessment_id, title, description, template_code, expected_output, test_cases, difficulty, points, language) VALUES
(10, 'React Component', 'Create a functional React component with state', 
'import React, { useState } from "react";\n\nfunction UserProfile() {\n    // TODO: Implement user profile component\n    return <div>User Profile</div>;\n}', 
'Functional user profile component', 
'[{"input": "component props", "expected": "rendered component"}]', 
'medium', 35, 'javascript'),

(14, 'React Hooks', 'Use React hooks for state management and effects', 
'import React, { useState, useEffect } from "react";\n\nfunction DataFetcher() {\n    // TODO: Fetch and display data using hooks\n    return <div>Loading...</div>;\n}', 
'Component with data fetching', 
'[{"input": "API data", "expected": "displayed data"}]', 
'medium', 40, 'javascript'),

(19, 'React State Management', 'Implement complex state management in React', 
'import React, { useReducer } from "react";\n\nfunction TodoApp() {\n    // TODO: Implement todo app with useReducer\n    return <div>Todo App</div>;\n}', 
'Todo application with state management', 
'[{"input": "todo actions", "expected": "updated state"}]', 
'hard', 45, 'javascript');
