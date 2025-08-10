-- Extended algorithmic questions Part 1 (Assessments 1-10)
-- 3-4 questions per assessment

-- Clear existing questions
DELETE FROM questions;

-- JavaScript Fundamentals (ID: 1) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(1, 'Array Operations Manager', 
'**Objective**
Manage an array of numbers through commands.

**Commands:**
- ADD value - Add to array
- REMOVE value - Remove first occurrence
- SUM - Print sum
- MAX - Print maximum
- MIN - Print minimum
- SORT - Sort ascending
- PRINT - Print all elements
- EXIT

**Example:**
Input:
```
ADD 5
ADD 3
ADD 8
PRINT
SUM
MAX
EXIT
```
Output:
```
5 3 8
16
8
```', 'javascript', '[{"input":"ADD 5\\nADD 3\\nADD 8\\nPRINT\\nSUM\\nMAX\\nEXIT","output":"5 3 8\\n16\\n8"}]', 'beginner', 600, 1),

(1, 'String Manipulation',
'**Objective**
Process strings with operations.

**Commands:**
- CONCAT str1 str2 - Join strings
- SUBSTRING str start end - Extract part
- REPLACE str old new - Replace all
- PALINDROME str - Check palindrome (YES/NO)
- COUNT str char - Count character
- EXIT

**Example:**
Input:
```
CONCAT hello world
PALINDROME racecar
COUNT mississippi s
EXIT
```
Output:
```
helloworld
YES
4
```', 'javascript', '[{"input":"CONCAT hello world\\nPALINDROME racecar\\nCOUNT mississippi s\\nEXIT","output":"helloworld\\nYES\\n4"}]', 'beginner', 600, 2),

(1, 'Object Data Store',
'**Objective**
Key-value store with nested objects.

**Commands:**
- SET key value - Store value
- GET key - Retrieve value
- SET key.subkey value - Nested value
- DELETE key - Remove key
- EXISTS key - Check exists (YES/NO)
- KEYS - List all keys
- EXIT

**Example:**
Input:
```
SET user.name John
SET user.age 25
GET user.name
EXISTS user.email
KEYS
EXIT
```
Output:
```
John
NO
user.name user.age
```', 'javascript', '[{"input":"SET user.name John\\nSET user.age 25\\nGET user.name\\nEXISTS user.email\\nKEYS\\nEXIT","output":"John\\nNO\\nuser.name user.age"}]', 'intermediate', 600, 3);

-- React Development (ID: 2) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(2, 'Shopping Cart Component',
'**Objective**
Build React shopping cart.

**Requirements:**
- Add/remove items
- Update quantities
- Calculate total
- Apply discounts
- Persist in localStorage

**Methods:**
addItem(item)
removeItem(id)
updateQuantity(id, qty)
getTotal()
applyDiscount(percent)', 'javascript', '[]', 'intermediate', 900, 1),

(2, 'Form Wizard Component',
'**Objective**
Multi-step form with validation.

**Steps:**
1. Personal Info
2. Address
3. Payment
4. Review

**Features:**
- Progress indicator
- Next/Previous navigation
- Validation per step
- Save draft
- Submit all data', 'javascript', '[]', 'intermediate', 900, 2),

(2, 'Real-time Search',
'**Objective**
Autocomplete search component.

**Features:**
- Debounced API calls (300ms)
- Highlight matches
- Keyboard navigation
- Recent searches
- Loading states
- Clear button', 'javascript', '[]', 'advanced', 900, 3);

-- Python Basics (ID: 3) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(3, 'Student Grade Manager',
'**Objective**
Manage student grades.

**Commands:**
- ADD name grade - Add student (0-100)
- UPDATE name grade - Update grade
- DELETE name - Remove student
- AVERAGE - Class average
- TOP n - Top n students
- GRADE name - Letter grade (A/B/C/D/F)
- EXIT

**Grading:**
90-100: A, 80-89: B, 70-79: C, 60-69: D, <60: F

**Example:**
Input:
```
ADD Alice 92
ADD Bob 78
AVERAGE
TOP 1
EXIT
```
Output:
```
85.00
Alice 92
```', 'python', '[{"input":"ADD Alice 92\\nADD Bob 78\\nAVERAGE\\nTOP 1\\nEXIT","output":"85.00\\nAlice 92"}]', 'beginner', 600, 1),

(3, 'Matrix Operations',
'**Objective**
2D matrix operations.

**Commands:**
- CREATE name rows cols - Create matrix
- SET name row col value - Set element
- ADD m1 m2 - Add matrices
- TRANSPOSE name - Transpose
- PRINT name - Display
- EXIT

**Example:**
Input:
```
CREATE A 2 2
SET A 0 0 1
SET A 0 1 2
SET A 1 0 3
SET A 1 1 4
TRANSPOSE A
EXIT
```
Output:
```
1 3
2 4
```', 'python', '[{"input":"CREATE A 2 2\\nSET A 0 0 1\\nSET A 0 1 2\\nSET A 1 0 3\\nSET A 1 1 4\\nTRANSPOSE A\\nEXIT","output":"1 3\\n2 4"}]', 'intermediate', 900, 2),

(3, 'Text Analysis',
'**Objective**
Analyze text documents.

**Commands:**
- LOAD text - Load text
- WORDS - Count words
- UNIQUE - Unique words
- FREQUENCY word - Word frequency
- COMMON n - Top n words
- SENTENCES - Count sentences
- EXIT

**Example:**
Input:
```
LOAD The quick brown fox jumps over the lazy dog
WORDS
UNIQUE
EXIT
```
Output:
```
9
9
```', 'python', '[{"input":"LOAD The quick brown fox jumps over the lazy dog\\nWORDS\\nUNIQUE\\nEXIT","output":"9\\n9"}]', 'intermediate', 900, 3);

-- Java Programming (ID: 4) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(4, 'Bank Account System',
'**Objective**
Manage bank accounts.

**Commands:**
- CREATE id name balance - Create account
- DEPOSIT id amount - Add money
- WITHDRAW id amount - Remove money
- TRANSFER from to amount - Transfer
- BALANCE id - Show balance
- EXIT

**Rules:**
- No overdraft allowed
- Log all transactions

**Example:**
Input:
```
CREATE 1 John 1000
DEPOSIT 1 500
BALANCE 1
EXIT
```
Output:
```
Account created: 1
Deposited 500
Balance: 1500
```', 'java', '[{"input":"CREATE 1 John 1000\\nDEPOSIT 1 500\\nBALANCE 1\\nEXIT","output":"Account created: 1\\nDeposited 500\\nBalance: 1500"}]', 'intermediate', 900, 1),

(4, 'Library Management',
'**Objective**
Library book lending system.

**Commands:**
- ADDBOOK isbn title author - Add book
- ADDMEMBER id name - Add member
- BORROW member_id isbn - Borrow book
- RETURN member_id isbn - Return book
- AVAILABLE - List available books
- EXIT

**Rules:**
- Max 3 books per member
- 14 day loan period

**Example:**
Input:
```
ADDBOOK 123 Java_Programming Smith
ADDMEMBER 1 Alice
BORROW 1 123
AVAILABLE
EXIT
```
Output:
```
Book added
Member added
Book borrowed
No books available
```', 'java', '[{"input":"ADDBOOK 123 Java_Programming Smith\\nADDMEMBER 1 Alice\\nBORROW 1 123\\nAVAILABLE\\nEXIT","output":"Book added\\nMember added\\nBook borrowed\\nNo books available"}]', 'intermediate', 900, 2),

(4, 'Thread Pool Manager',
'**Objective**
Thread pool for tasks.

**Commands:**
- POOL size - Create pool
- SUBMIT task_id priority - Submit task
- STATUS - Pool status
- COMPLETE task_id - Mark complete
- CANCEL task_id - Cancel task
- EXIT

**Output:**
Pool status and task execution.', 'java', '[]', 'advanced', 1200, 3);

-- SQL Database (ID: 5) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(5, 'E-Commerce Analytics',
'**Objective**
Sales analysis queries.

**Tables:**
orders (id, customer_id, date, total)
order_items (order_id, product_id, quantity, price)
products (id, name, category)
customers (id, name, country)

**Queries:**
1. Monthly revenue
2. Top 10 customers
3. Product profit margins
4. Category performance

**Output:**
Query results with aggregations.', 'sql', '[]', 'intermediate', 900, 1),

(5, 'Social Network Analysis',
'**Objective**
Analyze social data.

**Tables:**
users (id, username, created_at)
friendships (user_id, friend_id)
posts (id, user_id, content, created_at)
likes (post_id, user_id)

**Queries:**
1. Most mutual friends
2. Viral posts (>1000 likes)
3. Engagement by hour
4. Inactive users (30 days)

**Output:**
Analytics results.', 'sql', '[]', 'advanced', 900, 2),

(5, 'Query Optimization',
'**Objective**
Optimize slow query.

**Given:**
```sql
SELECT c.name, COUNT(o.id), SUM(o.total)
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.date > DATE_SUB(NOW(), INTERVAL 1 YEAR)
GROUP BY c.id
HAVING COUNT(o.id) > 5
ORDER BY SUM(o.total) DESC
```

**Tasks:**
1. Identify bottlenecks
2. Add indexes
3. Rewrite for performance', 'sql', '[]', 'advanced', 900, 3);

-- Node.js Backend (ID: 6) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(6, 'REST API with Auth',
'**Objective**
Build authenticated API.

**Endpoints:**
POST /auth/register
POST /auth/login
GET /users/profile
PUT /users/profile
DELETE /users/account

**Requirements:**
- JWT authentication
- Password hashing
- Rate limiting
- Input validation', 'javascript', '[]', 'intermediate', 1200, 1),

(6, 'WebSocket Chat',
'**Objective**
Real-time chat server.

**Features:**
- Multiple rooms
- Private messages
- Typing indicators
- User presence
- Message history

**Events:**
join_room, leave_room, message, typing, private', 'javascript', '[]', 'advanced', 1200, 2),

(6, 'Queue Worker System',
'**Objective**
Job queue with workers.

**Commands:**
- QUEUE job_type data priority - Add job
- WORKER count - Spawn workers
- PROCESS - Process next job
- RETRY job_id - Retry failed
- STATUS - Queue stats
- EXIT

**Job Types:**
EMAIL, IMAGE, REPORT', 'javascript', '[]', 'advanced', 1200, 3);

-- Angular Framework (ID: 7) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(7, 'Data Table Component',
'**Objective**
Advanced data table.

**Features:**
- Sorting (multi-column)
- Filtering (per column)
- Pagination
- Row selection
- Column resize
- Export CSV/PDF
- Virtual scrolling', 'javascript', '[]', 'intermediate', 1200, 1),

(7, 'Form Builder',
'**Objective**
Dynamic form from JSON.

**Schema:**
```json
{
  "fields": [
    {
      "type": "text",
      "name": "fieldName",
      "validators": ["required", "email"]
    }
  ]
}
```

**Features:**
- Conditional fields
- Custom validators
- Error messages', 'javascript', '[]', 'advanced', 1200, 2),

(7, 'State Management',
'**Objective**
NgRx store implementation.

**Store:**
- Auth state
- Product state
- Cart state
- UI state

**Requirements:**
- Actions, reducers, effects
- Selectors
- Entity adapters', 'javascript', '[]', 'advanced', 1200, 3);

-- Data Structures (ID: 8) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(8, 'LRU Cache',
'**Objective**
Least Recently Used cache.

**Operations:**
- PUT key value - Add/update
- GET key - Retrieve
- SIZE - Current size
- CLEAR - Empty cache
- EXIT

**Constraints:**
O(1) operations, capacity limit

**Example (capacity=3):**
Input:
```
PUT a 1
PUT b 2
PUT c 3
PUT d 4
GET b
GET a
EXIT
```
Output:
```
2
-1
```', 'javascript', '[{"input":"PUT a 1\\nPUT b 2\\nPUT c 3\\nPUT d 4\\nGET b\\nGET a\\nEXIT","output":"2\\n-1"}]', 'advanced', 900, 1),

(8, 'Graph Operations',
'**Objective**
Graph with algorithms.

**Commands:**
- VERTEX v - Add vertex
- EDGE v1 v2 weight - Add edge
- SHORTEST v1 v2 - Shortest path
- DFS start - Depth-first
- BFS start - Breadth-first
- EXIT

**Example:**
Input:
```
VERTEX A
VERTEX B
EDGE A B 5
SHORTEST A B
EXIT
```
Output:
```
Path: A -> B
Distance: 5
```', 'javascript', '[{"input":"VERTEX A\\nVERTEX B\\nEDGE A B 5\\nSHORTEST A B\\nEXIT","output":"Path: A -> B\\nDistance: 5"}]', 'advanced', 1200, 2),

(8, 'Trie Autocomplete',
'**Objective**
Trie for autocomplete.

**Commands:**
- INSERT word - Add word
- SEARCH prefix - Find words with prefix
- DELETE word - Remove word
- COUNT prefix - Count matches
- EXIT

**Example:**
Input:
```
INSERT apple
INSERT application
SEARCH app
COUNT app
EXIT
```
Output:
```
apple application
2
```', 'javascript', '[{"input":"INSERT apple\\nINSERT application\\nSEARCH app\\nCOUNT app\\nEXIT","output":"apple application\\n2"}]', 'intermediate', 900, 3);

-- Algorithms (ID: 9) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(9, 'Meeting Scheduler',
'**Objective**
Find available meeting slots.

**Input:**
- Person A schedule
- Person B schedule
- Meeting duration
- Working hours

**Output:**
All possible meeting slots.

**Example:**
Input:
```
2
9 10
12 13
2
10 11
14 15
30
9 18
```
Output:
```
[11,11.5] [13,13.5] [15,15.5]
```', 'javascript', '[{"input":"2\\n9 10\\n12 13\\n2\\n10 11\\n14 15\\n30\\n9 18","output":"[11,11.5] [13,13.5] [15,15.5]"}]', 'intermediate', 900, 1),

(9, 'Island Counter',
'**Objective**
Count islands in grid.

**Input:**
- Grid (1=land, 0=water)

**Output:**
- Number of islands
- Largest island size

**Example:**
Input:
```
4 5
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1
```
Output:
```
Islands: 3
Largest: 4 cells
```', 'javascript', '[{"input":"4 5\\n1 1 0 0 0\\n1 1 0 0 0\\n0 0 1 0 0\\n0 0 0 1 1","output":"Islands: 3\\nLargest: 4 cells"}]', 'intermediate', 900, 2),

(9, 'Task Scheduler',
'**Objective**
Schedule tasks with cooldown.

**Input:**
- Tasks array
- Cooldown period

**Output:**
- Optimal schedule
- Total time

**Example:**
Input:
```
6
A A A B B B
2
```
Output:
```
Schedule: A B _ A B _ A B
Time: 8
```', 'javascript', '[{"input":"6\\nA A A B B B\\n2","output":"Schedule: A B _ A B _ A B\\nTime: 8"}]', 'advanced', 1200, 3);

-- DevOps Basics (ID: 10) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(10, 'Docker Health Monitor',
'**Objective**
Monitor container health.

**Commands:**
- MONITOR container - Start monitoring
- THRESHOLD cpu memory - Set limits
- CHECK - Current status
- RESTART container - Restart if unhealthy
- REPORT - Generate report
- EXIT

**Output:**
Health status and metrics.', 'javascript', '[]', 'intermediate', 900, 1),

(10, 'CI/CD Pipeline',
'**Objective**
Build deployment pipeline.

**Stages:**
1. Checkout code
2. Install dependencies
3. Run tests
4. Build application
5. Deploy to staging
6. Run E2E tests
7. Deploy to production

**Requirements:**
- Parallel execution
- Rollback on failure', 'javascript', '[]', 'intermediate', 1200, 2),

(10, 'Log Aggregator',
'**Objective**
Aggregate service logs.

**Commands:**
- SOURCE service file - Add log source
- FILTER level pattern - Filter logs
- SEARCH term - Search logs
- STATS timeframe - Statistics
- EXPORT format - Export logs
- EXIT

**Output:**
Log analysis results.', 'javascript', '[]', 'advanced', 1200, 3);
