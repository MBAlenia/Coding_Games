-- Complete algorithmic questions with clear problem statements for all assessments
-- CodinGame style with input/output examples

-- Clear all existing questions
DELETE FROM questions;

-- JavaScript Fundamentals (ID: 1)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(1, 'Array Operations Manager', 
'**Objective**
Create a program that manages an array of numbers through commands.

**Commands:**
- `ADD value` - Add value to array
- `REMOVE value` - Remove first occurrence
- `SUM` - Print sum of all elements
- `MAX` - Print maximum value
- `SORT` - Sort ascending
- `PRINT` - Print all elements
- `EXIT` - End program

**Example:**
Input:
```
ADD 5
ADD 3
ADD 8
PRINT
SUM
EXIT
```
Output:
```
5 3 8
16
```', 'javascript', '[{"input":"ADD 5\\nADD 3\\nADD 8\\nPRINT\\nSUM\\nEXIT","output":"5 3 8\\n16"}]', 'beginner', 600, 1);

-- React Development (ID: 2)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(2, 'Task List Manager',
'**Objective**
Build a React component that manages tasks.

**Requirements:**
- Add tasks with unique IDs
- Mark tasks as complete/incomplete
- Delete tasks
- Filter by status (all/active/completed)
- Count statistics

**Component should handle:**
```jsx
// Add task: addTask("Buy milk")
// Toggle: toggleTask(1)
// Delete: deleteTask(1)
// Filter: setFilter("active")
```', 'javascript', '[]', 'intermediate', 900, 1);

-- Python Basics (ID: 3)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(3, 'Student Grade Manager',
'**Objective**
Manage student grades with commands.

**Commands:**
- `ADD name grade` - Add student (grade 0-100)
- `UPDATE name grade` - Update grade
- `DELETE name` - Remove student
- `AVERAGE` - Print class average
- `TOP n` - Print top n students
- `PASS` - Count passing (>=60)
- `EXIT`

**Example:**
Input:
```
ADD Alice 85
ADD Bob 92
ADD Charlie 58
AVERAGE
PASS
TOP 2
EXIT
```
Output:
```
78.33
2
Bob 92
Alice 85
```', 'python', '[{"input":"ADD Alice 85\\nADD Bob 92\\nADD Charlie 58\\nAVERAGE\\nPASS\\nTOP 2\\nEXIT","output":"78.33\\n2\\nBob 92\\nAlice 85"}]', 'beginner', 600, 1);

-- Java Programming (ID: 4)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(4, 'Bank Account System',
'**Objective**
Manage bank accounts with transactions.

**Commands:**
- `CREATE id name balance` - Create account
- `DEPOSIT id amount` - Add money
- `WITHDRAW id amount` - Remove money
- `TRANSFER from to amount` - Transfer funds
- `BALANCE id` - Show balance
- `EXIT`

**Rules:**
- Cannot withdraw more than balance
- Print "INSUFFICIENT FUNDS" if failed

**Example:**
Input:
```
CREATE 1 John 1000
CREATE 2 Jane 500
TRANSFER 1 2 300
BALANCE 1
BALANCE 2
EXIT
```
Output:
```
700
800
```', 'java', '[{"input":"CREATE 1 John 1000\\nCREATE 2 Jane 500\\nTRANSFER 1 2 300\\nBALANCE 1\\nBALANCE 2\\nEXIT","output":"700\\n800"}]', 'intermediate', 600, 1);

-- SQL Database (ID: 5)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(5, 'Sales Analysis Query',
'**Objective**
Write SQL queries for sales data.

**Tables:**
```sql
sales (id, product_id, quantity, date, amount)
products (id, name, category, price)
```

**Tasks:**
1. Total sales by category
2. Top 5 products by revenue
3. Monthly sales trend
4. Products with no sales
5. Average order value

**Output Format:**
Query results as formatted tables.', 'sql', '[]', 'intermediate', 600, 1);

-- Node.js Backend (ID: 6)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(6, 'API Rate Limiter',
'**Objective**
Implement rate limiting middleware.

**Requirements:**
- Limit: 100 requests per minute per IP
- Return 429 when limit exceeded
- Reset counter after time window
- Include headers:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

**Implementation:**
```javascript
function rateLimiter(limit, window) {
  // Your code here
}
```', 'javascript', '[]', 'intermediate', 900, 1);

-- Angular Framework (ID: 7)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(7, 'Search with Debounce',
'**Objective**
Create search component with debouncing.

**Requirements:**
- Search input field
- Debounce API calls (300ms)
- Show loading state
- Display results
- Handle errors
- Clear button

**Component Features:**
- Use RxJS operators
- Cancel pending requests
- Highlight search terms', 'javascript', '[]', 'intermediate', 900, 1);

-- Data Structures (ID: 8)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(8, 'Queue with Priority',
'**Objective**
Implement priority queue.

**Operations:**
- `ENQUEUE value priority` - Add with priority
- `DEQUEUE` - Remove highest priority
- `PEEK` - View highest priority
- `SIZE` - Current size
- `CLEAR` - Empty queue

**Example:**
Input:
```
ENQUEUE task1 3
ENQUEUE task2 1
ENQUEUE task3 2
DEQUEUE
PEEK
EXIT
```
Output:
```
task2
task1
```', 'javascript', '[{"input":"ENQUEUE task1 3\\nENQUEUE task2 1\\nENQUEUE task3 2\\nDEQUEUE\\nPEEK\\nEXIT","output":"task2\\ntask1"}]', 'intermediate', 600, 1);

-- Algorithms (ID: 9)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(9, 'Coin Change Problem',
'**Objective**
Find minimum coins for amount.

**Input:**
- Line 1: Target amount
- Line 2: Number of coin types
- Line 3: Coin values

**Output:**
- Minimum coins needed
- Combination used

**Example:**
Input:
```
11
3
1 5 6
```
Output:
```
2
5 6
```', 'javascript', '[{"input":"11\\n3\\n1 5 6","output":"2\\n5 6"}]', 'intermediate', 600, 1);

-- DevOps Basics (ID: 10)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(10, 'Container Health Check',
'**Objective**
Write script to monitor Docker containers.

**Requirements:**
- Check container status
- Monitor CPU/Memory usage
- Restart if unhealthy
- Send alerts if down > 5 min
- Log all actions

**Output Format:**
```
[timestamp] Container: nginx Status: healthy CPU: 15% MEM: 120MB
[timestamp] Container: api Status: unhealthy - Restarting
```', 'javascript', '[]', 'intermediate', 900, 1);

-- Cloud Computing (ID: 11)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(11, 'Auto-Scaling Logic',
'**Objective**
Implement auto-scaling algorithm.

**Input:**
- Current instances
- CPU metrics (array)
- Scale up threshold (%)
- Scale down threshold (%)

**Rules:**
- Scale up if avg CPU > threshold for 5 min
- Scale down if avg CPU < threshold for 10 min
- Min instances: 2, Max: 10

**Output:**
Scaling decisions with timestamps.', 'javascript', '[]', 'advanced', 900, 1);

-- Machine Learning (ID: 12)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(12, 'K-Means Clustering',
'**Objective**
Implement K-means clustering.

**Input:**
- Line 1: N points, K clusters
- Next N lines: x y coordinates

**Output:**
- Cluster assignments
- Centroids coordinates

**Example:**
Input:
```
6 2
1 1
1 2
5 5
6 5
6 6
1 1
```
Output:
```
Point 1: Cluster 1
Point 2: Cluster 1
Point 3: Cluster 2
Point 4: Cluster 2
Point 5: Cluster 2
Point 6: Cluster 1
Centroid 1: (1.0, 1.3)
Centroid 2: (5.7, 5.3)
```', 'python', '[{"input":"6 2\\n1 1\\n1 2\\n5 5\\n6 5\\n6 6\\n1 1","output":"Point 1: Cluster 1\\nPoint 2: Cluster 1\\nPoint 3: Cluster 2\\nPoint 4: Cluster 2\\nPoint 5: Cluster 2\\nPoint 6: Cluster 1\\nCentroid 1: (1.0, 1.3)\\nCentroid 2: (5.7, 5.3)"}]', 'advanced', 1200, 1);

-- Cybersecurity (ID: 13)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(13, 'Password Validator',
'**Objective**
Validate and score passwords.

**Rules:**
- Min 8 characters: +1 point
- Uppercase letter: +1 point
- Lowercase letter: +1 point
- Number: +1 point
- Special char: +1 point
- Length > 12: +1 point
- No common patterns: +2 points

**Input:**
Passwords, one per line.

**Output:**
Password strength (Weak/Medium/Strong/Very Strong)

**Example:**
Input:
```
password123
MyP@ssw0rd!
abc
SuperSecure$Pass123
```
Output:
```
Weak (3/8)
Strong (6/8)
Weak (1/8)
Very Strong (8/8)
```', 'python', '[{"input":"password123\\nMyP@ssw0rd!\\nabc\\nSuperSecure$Pass123","output":"Weak (3/8)\\nStrong (6/8)\\nWeak (1/8)\\nVery Strong (8/8)"}]', 'intermediate', 600, 1);

-- Mobile Development (ID: 14)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(14, 'Offline Data Sync',
'**Objective**
Implement offline data synchronization.

**Requirements:**
- Queue operations while offline
- Sync when connection restored
- Handle conflicts (last-write-wins)
- Retry failed operations
- Show sync status

**Operations:**
- CREATE, UPDATE, DELETE
- Track timestamps
- Merge conflicts

**Output:**
Sync log with operations and results.', 'javascript', '[]', 'advanced', 900, 1);

-- System Design (ID: 15)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(15, 'Load Balancer Algorithm',
'**Objective**
Implement round-robin load balancer.

**Input:**
- Server list with weights
- Number of requests

**Features:**
- Weighted distribution
- Health checks
- Failover handling
- Session persistence

**Example:**
Input:
```
3
server1 weight=2
server2 weight=1
server3 weight=3
10
```
Output:
```
Request 1 -> server1
Request 2 -> server3
Request 3 -> server1
Request 4 -> server3
Request 5 -> server3
Request 6 -> server2
...
```', 'javascript', '[{"input":"3\\nserver1 2\\nserver2 1\\nserver3 3\\n6","output":"Request 1 -> server1\\nRequest 2 -> server3\\nRequest 3 -> server1\\nRequest 4 -> server3\\nRequest 5 -> server3\\nRequest 6 -> server2"}]', 'advanced', 900, 1);

-- Database Design (ID: 16)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(16, 'Query Optimizer',
'**Objective**
Optimize slow queries.

**Given Query:**
```sql
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.date > "2024-01-01"
AND c.country = "USA"
ORDER BY o.total DESC
```

**Tasks:**
1. Identify performance issues
2. Suggest indexes
3. Rewrite query if needed
4. Explain execution plan

**Output:**
Optimized query with explanations.', 'sql', '[]', 'advanced', 900, 1);

-- API Development (ID: 17)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(17, 'GraphQL Resolver',
'**Objective**
Create GraphQL resolver for blog.

**Schema:**
```graphql
type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}
```

**Implement:**
- Query posts with pagination
- Filter by author
- Sort by date/popularity
- N+1 query optimization

**Output:**
Resolver implementation with DataLoader.', 'javascript', '[]', 'advanced', 900, 1);

-- Java Enterprise Development (ID: 18)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(18, 'Order Processing System',
'**Objective**
Process e-commerce orders with validation.

**Commands:**
- `ORDER customer_id product_id quantity` - Create order
- `CANCEL order_id` - Cancel if not shipped
- `SHIP order_id` - Mark as shipped
- `DELIVER order_id` - Mark delivered
- `RETURN order_id reason` - Process return
- `STATUS order_id` - Check status
- `REPORT` - Sales summary

**Business Rules:**
- Check inventory before order
- Cannot cancel shipped orders
- Returns allowed within 30 days
- Apply discounts for bulk orders

**Example:**
Input:
```
ORDER 1 101 2
ORDER 1 102 1
SHIP 1
STATUS 1
REPORT
EXIT
```
Output:
```
Order 1 created
Order 2 created
Order 1 shipped
Order 1: SHIPPED
Total Orders: 2, Revenue: $150
```', 'java', '[{"input":"ORDER 1 101 2\\nORDER 1 102 1\\nSHIP 1\\nSTATUS 1\\nREPORT\\nEXIT","output":"Order 1 created\\nOrder 2 created\\nOrder 1 shipped\\nOrder 1: SHIPPED\\nTotal Orders: 2, Revenue: $150"}]', 'advanced', 1200, 1);

-- Frontend Testing (ID: 19)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(19, 'Test Suite Generator',
'**Objective**
Generate test cases for components.

**Input:**
Component structure and props.

**Generate:**
- Unit tests for methods
- Integration tests
- Snapshot tests
- Coverage report

**Example Component:**
```jsx
function Calculator({ initial = 0 }) {
  const [value, setValue] = useState(initial);
  const add = (n) => setValue(value + n);
  const reset = () => setValue(0);
  return <div>...</div>;
}
```

**Output:**
Complete test suite with Jest/React Testing Library.', 'javascript', '[]', 'intermediate', 900, 1);

-- Microservices (ID: 20)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(20, 'Service Mesh Router',
'**Objective**
Implement service mesh routing logic.

**Features:**
- Route by path/headers
- Circuit breaker pattern
- Retry with backoff
- Load balancing
- Request tracing

**Input:**
Request details and service registry.

**Output:**
Routing decisions with trace IDs.

**Example:**
Input:
```
GET /api/users
Service: user-service (3 instances)
Health: instance-1 (healthy), instance-2 (slow), instance-3 (healthy)
```
Output:
```
Route to: instance-1
Trace-ID: abc-123-def
Response-Time: 45ms
```', 'javascript', '[]', 'expert', 1200, 1);
