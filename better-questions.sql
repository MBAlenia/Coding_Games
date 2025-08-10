-- Clear existing questions and add better, shorter ones in English

-- Delete existing questions for all assessments
DELETE FROM questions WHERE assessment_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);

-- JavaScript Fundamentals (ID: 1)
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(1, 'Array Sum', 'Write a function sum(arr) that returns the sum of all numbers in an array.\n\nExample:\nsum([1, 2, 3, 4]) // returns 10', 'beginner', 300, 1),
(1, 'Find Maximum', 'Write a function findMax(arr) that returns the largest number in an array.\n\nExample:\nfindMax([3, 7, 2, 9, 1]) // returns 9', 'beginner', 300, 2);

-- React Development (ID: 2)
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(2, 'Counter Component', 'Create a React component with a counter that increments when a button is clicked.\n\nRequirements:\n- Display current count\n- Button to increment\n- Button to reset to 0', 'beginner', 300, 1),
(2, 'Todo List', 'Create a React Todo List component.\n\nRequirements:\n- Input field to add items\n- Display list of todos\n- Delete button for each item', 'intermediate', 300, 2);

-- Python Basics (ID: 3)
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(3, 'Palindrome Check', 'Write a function is_palindrome(s) that returns True if a string is a palindrome.\n\nExample:\nis_palindrome("racecar") # returns True\nis_palindrome("hello") # returns False', 'beginner', 300, 1),
(3, 'FizzBuzz', 'Write a function fizzbuzz(n) that prints numbers from 1 to n.\n- Print "Fizz" for multiples of 3\n- Print "Buzz" for multiples of 5\n- Print "FizzBuzz" for multiples of both', 'beginner', 300, 2);

-- Java Programming (ID: 4)
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(4, 'Reverse String', 'Write a method that reverses a string.\n\npublic String reverse(String input)\n\nExample:\nreverse("hello") // returns "olleh"', 'beginner', 300, 1),
(4, 'Prime Number', 'Write a method to check if a number is prime.\n\npublic boolean isPrime(int n)\n\nExample:\nisPrime(7) // returns true\nisPrime(10) // returns false', 'beginner', 300, 2);

-- SQL Database (ID: 5)
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(5, 'Select Users', 'Write a SQL query to select all users with age greater than 18.\n\nTable: users\nColumns: id, name, age, email', 'beginner', 300, 1),
(5, 'Join Tables', 'Write a query to get all orders with customer names.\n\nTables:\n- customers (id, name)\n- orders (id, customer_id, amount)', 'intermediate', 300, 2);

-- Node.js Backend (ID: 6)
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(6, 'Express Route', 'Create an Express GET route /api/hello that returns JSON:\n{"message": "Hello World", "timestamp": current_time}', 'beginner', 300, 1),
(6, 'Middleware', 'Create Express middleware that logs request method and URL for all routes.', 'intermediate', 300, 2);

-- Angular Framework (ID: 7)
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(7, 'Component', 'Create an Angular component that displays a list of items from an array.', 'beginner', 300, 1),
(7, 'Service', 'Create an Angular service that fetches data from an API endpoint.', 'intermediate', 300, 2);

-- Data Structures (ID: 8)
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(8, 'Stack Implementation', 'Implement a Stack with push(), pop(), and peek() methods.', 'intermediate', 300, 1),
(8, 'Binary Search', 'Implement binary search for a sorted array.\n\nReturn index of target or -1 if not found.', 'intermediate', 300, 2);

-- Algorithms (ID: 9)
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(9, 'Two Sum', 'Find two numbers in array that sum to target.\n\nExample:\ntwoSum([2,7,11,15], 9) // returns [0,1]', 'intermediate', 300, 1),
(9, 'Merge Sort', 'Implement merge sort algorithm for an integer array.', 'advanced', 300, 2);

-- Java Enterprise Development (ID: 18) - Short and clear questions
INSERT INTO questions (assessment_id, title, description, difficulty, time_limit, order_index) VALUES
(18, 'REST Controller', 'Create a Spring Boot REST controller for managing users.\n\nRequirements:\n- @RestController annotation\n- GET /api/users endpoint\n- Return list of users as JSON', 'intermediate', 300, 1),
(18, 'JPA Repository', 'Create a JPA repository interface for User entity.\n\nRequirements:\n- Extend JpaRepository\n- Add method findByEmail(String email)\n- Add method findByUsername(String username)', 'intermediate', 300, 2),
(18, 'Service Layer', 'Create a UserService class with business logic.\n\nRequirements:\n- @Service annotation\n- Method to create new user\n- Method to validate email format\n- Handle duplicate username/email', 'advanced', 300, 3);
