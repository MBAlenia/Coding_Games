-- Simple, short questions in English for all assessments

-- Delete existing questions for assessment 18 only (to test)
DELETE FROM questions WHERE assessment_id = 18;

-- Java Enterprise Development (ID: 18) - Simple and clear
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(18, 'REST Controller', 'Create a Spring Boot REST controller for users.\n\nRequirements:\n- @RestController annotation\n- GET /api/users endpoint\n- Return JSON response', 'java', '[]', 'intermediate', 300, 1),
(18, 'JPA Repository', 'Create a JPA repository for User entity.\n\nRequirements:\n- Extend JpaRepository<User, Long>\n- Add findByEmail method', 'java', '[]', 'intermediate', 300, 2),
(18, 'User Service', 'Create a UserService class.\n\nRequirements:\n- @Service annotation\n- createUser method\n- validateEmail method', 'java', '[]', 'advanced', 300, 3);
