-- Algorithmic questions with clear problem statements, input/output format, and examples
-- Similar to CodinGame style questions

-- Clear all existing questions
DELETE FROM questions;

-- JavaScript Fundamentals (ID: 1)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(1, 'Array Operations Manager', 
'**Objective**
Create a program that manages an array of numbers through a series of commands.

**Commands:**
- `ADD value` - Add value to the array
- `REMOVE value` - Remove first occurrence of value
- `SUM` - Print the sum of all elements
- `MAX` - Print the maximum value
- `MIN` - Print the minimum value
- `SORT` - Sort array in ascending order
- `PRINT` - Print all elements space-separated
- `EXIT` - End program

**Input**
Series of commands, one per line.
Last command is always EXIT.

**Output**
Execute commands and print results when requested.

**Example**
Input:
```
ADD 5
ADD 3
ADD 8
PRINT
SUM
MAX
SORT
PRINT
EXIT
```

Output:
```
5 3 8
16
8
3 5 8
```', 'javascript', '[{"input":"ADD 5\\nADD 3\\nADD 8\\nPRINT\\nSUM\\nMAX\\nSORT\\nPRINT\\nEXIT","output":"5 3 8\\n16\\n8\\n3 5 8"}]', 'beginner', 600, 1),

(1, 'String Transformer',
'**Objective**
Process strings based on transformation commands.

**Commands:**
- `UPPER text` - Convert to uppercase
- `LOWER text` - Convert to lowercase
- `REVERSE text` - Reverse the string
- `LENGTH text` - Print string length
- `REPLACE text old new` - Replace all occurrences
- `EXIT` - End program

**Input**
Commands, one per line.

**Output**
Result of each transformation.

**Example**
Input:
```
UPPER hello
LOWER WORLD
REVERSE javascript
LENGTH programming
EXIT
```

Output:
```
HELLO
world
tpircsavaj
11
```', 'javascript', '[{"input":"UPPER hello\\nLOWER WORLD\\nREVERSE javascript\\nLENGTH programming\\nEXIT","output":"HELLO\\nworld\\ntpircsavaj\\n11"}]', 'beginner', 600, 2);

-- React Development (ID: 2)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(2, 'Component State Manager',
'**Objective**
Create a React component that manages a list of tasks with state operations.

**Requirements:**
1. Maintain a tasks array in state
2. Implement these methods:
   - `addTask(title)` - Add new task with unique ID
   - `toggleTask(id)` - Toggle task completion status
   - `deleteTask(id)` - Remove task from list
   - `getStats()` - Return {total, completed, pending}

**Component Structure:**
```jsx
function TaskManager() {
  // Your implementation
  
  return (
    <div>
      {/* Display tasks */}
      {/* Show stats */}
    </div>
  );
}
```

**Expected Behavior:**
- Each task has: id, title, completed (boolean)
- Display count of total/completed/pending tasks
- Show visual indication of completed tasks', 'javascript', '[]', 'intermediate', 900, 1),

(2, 'Form Validation Component',
'**Objective**
Build a registration form with real-time validation.

**Requirements:**
1. Fields: username, email, password, confirmPassword
2. Validations:
   - Username: 3-20 characters, alphanumeric only
   - Email: Valid email format
   - Password: Min 8 chars, 1 uppercase, 1 number
   - Confirm: Must match password
3. Show error messages below each field
4. Disable submit until all valid
5. Display success message on valid submission

**Component Output:**
Form should prevent submission if any validation fails and show appropriate error messages.', 'javascript', '[]', 'intermediate', 900, 2);

-- Python Basics (ID: 3)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(3, 'Dictionary Operations',
'**Objective**
Manage a dictionary of products with various operations.

**Commands:**
- `ADD id name price` - Add product (price is float)
- `UPDATE id name price` - Update existing product
- `DELETE id` - Remove product
- `GET id` - Print product details
- `LIST` - List all products sorted by id
- `TOTAL` - Print sum of all prices
- `EXIT` - End program

**Input**
Commands, one per line.

**Output**
Execute commands and print requested information.

**Example**
Input:
```
ADD 1 Laptop 999.99
ADD 2 Mouse 25.50
LIST
TOTAL
DELETE 2
TOTAL
EXIT
```

Output:
```
1 Laptop 999.99
2 Mouse 25.50
1025.49
999.99
```', 'python', '[{"input":"ADD 1 Laptop 999.99\\nADD 2 Mouse 25.50\\nLIST\\nTOTAL\\nDELETE 2\\nTOTAL\\nEXIT","output":"1 Laptop 999.99\\n2 Mouse 25.50\\n1025.49\\n999.99"}]', 'beginner', 600, 1),

(3, 'Data Analysis',
'**Objective**
Analyze a list of numbers and compute statistics.

**Input**
- First line: integer N (number of values)
- Next N lines: one number per line

**Output**
Print the following statistics (2 decimal places):
1. Mean
2. Median
3. Mode (smallest if multiple)
4. Standard deviation
5. Min
6. Max

**Example**
Input:
```
5
10
20
20
30
40
```

Output:
```
Mean: 24.00
Median: 20.00
Mode: 20
StdDev: 11.40
Min: 10
Max: 40
```', 'python', '[{"input":"5\\n10\\n20\\n20\\n30\\n40","output":"Mean: 24.00\\nMedian: 20.00\\nMode: 20\\nStdDev: 11.40\\nMin: 10\\nMax: 40"}]', 'intermediate', 600, 2);

-- Java Programming (ID: 4)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(4, 'User Management System',
'**Objective**
Manage users with commands for CRUD operations.

**Commands:**
- `ADD id name email` - Add new user if id doesn\'t exist
- `UPDATE id name email` - Update existing user
- `DELETE id` - Remove user
- `LIST` - Display all users sorted by id
- `FIND name` - Find users by name (partial match)
- `EXIT` - End program

**Input**
Commands, one per line.

**Output**
Execute commands and display results.

**Example**
Input:
```
ADD 1 Alice alice@mail.com
ADD 2 Bob bob@mail.com
LIST
UPDATE 1 Alicia alicia@mail.com
LIST
DELETE 2
LIST
EXIT
```

Output:
```
1 Alice alice@mail.com
2 Bob bob@mail.com
1 Alicia alicia@mail.com
2 Bob bob@mail.com
1 Alicia alicia@mail.com
```', 'java', '[{"input":"ADD 1 Alice alice@mail.com\\nADD 2 Bob bob@mail.com\\nLIST\\nUPDATE 1 Alicia alicia@mail.com\\nLIST\\nDELETE 2\\nLIST\\nEXIT","output":"1 Alice alice@mail.com\\n2 Bob bob@mail.com\\n1 Alicia alicia@mail.com\\n2 Bob bob@mail.com\\n1 Alicia alicia@mail.com"}]', 'intermediate', 600, 1),

(4, 'Banking Transaction Processor',
'**Objective**
Process banking transactions for multiple accounts.

**Commands:**
- `CREATE id name balance` - Create account
- `DEPOSIT id amount` - Add money
- `WITHDRAW id amount` - Remove money (check sufficient funds)
- `TRANSFER from_id to_id amount` - Transfer between accounts
- `BALANCE id` - Show account balance
- `HISTORY id` - Show transaction history
- `EXIT` - End program

**Rules:**
- Cannot withdraw more than balance
- All amounts are positive
- Print "INSUFFICIENT FUNDS" for failed withdrawals

**Example**
Input:
```
CREATE 1 John 1000
CREATE 2 Jane 500
DEPOSIT 1 200
WITHDRAW 2 100
TRANSFER 1 2 300
BALANCE 1
BALANCE 2
EXIT
```

Output:
```
900
900
```', 'java', '[{"input":"CREATE 1 John 1000\\nCREATE 2 Jane 500\\nDEPOSIT 1 200\\nWITHDRAW 2 100\\nTRANSFER 1 2 300\\nBALANCE 1\\nBALANCE 2\\nEXIT","output":"900\\n900"}]', 'intermediate', 900, 2);

-- SQL Database (ID: 5)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(5, 'Employee Query Builder',
'**Objective**
Write SQL queries for employee management.

**Database Schema:**
```sql
employees (id, name, department, salary, hire_date)
departments (id, name, budget)
projects (id, name, department_id, status)
```

**Tasks:**
1. Find all employees with salary > 50000
2. List employees grouped by department with average salary
3. Find departments with total salary exceeding budget
4. Get employees working on active projects
5. Find top 3 highest paid employees per department

**Expected Output Format:**
Each query result as a table with appropriate columns.', 'sql', '[]', 'intermediate', 600, 1),

(5, 'Order Analytics',
'**Objective**
Analyze e-commerce order data.

**Tables:**
```sql
orders (id, customer_id, order_date, total)
customers (id, name, email, country)
order_items (id, order_id, product_id, quantity, price)
products (id, name, category, stock)
```

**Queries to Write:**
1. Monthly revenue for last 12 months
2. Top 10 customers by total spending
3. Products that need restocking (stock < 10)
4. Average order value by country
5. Most popular product categories

**Output:**
Results formatted as tables with clear column headers.', 'sql', '[]', 'advanced', 900, 2);

-- Node.js Backend (ID: 6)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(6, 'REST API Server',
'**Objective**
Create Express.js API for task management.

**Endpoints:**
- `GET /tasks` - List all tasks
- `GET /tasks/:id` - Get specific task
- `POST /tasks` - Create task {title, description}
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/status/:status` - Filter by status

**Task Model:**
```javascript
{
  id: number,
  title: string,
  description: string,
  status: "pending" | "in_progress" | "completed",
  created_at: Date,
  updated_at: Date
}
```

**Requirements:**
- Use in-memory storage
- Validate input data
- Return appropriate HTTP status codes
- Handle errors gracefully', 'javascript', '[]', 'intermediate', 900, 1),

(6, 'WebSocket Chat Server',
'**Objective**
Build real-time chat server with Socket.io.

**Features:**
1. User connection/disconnection handling
2. Broadcast messages to all users
3. Private messages between users
4. Typing indicators
5. Online users list
6. Message history (last 50 messages)

**Events:**
- `connection` - New user joins
- `message` - Broadcast message
- `private_message` - Send to specific user
- `typing` - Show typing indicator
- `disconnect` - User leaves

**Expected Behavior:**
Server should handle multiple concurrent connections and maintain chat state.', 'javascript', '[]', 'advanced', 1200, 2);

-- Angular Framework (ID: 7)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(7, 'Product Catalog Component',
'**Objective**
Create Angular component for product catalog with filtering.

**Requirements:**
1. Display products in grid layout
2. Implement filters:
   - Category dropdown
   - Price range slider
   - Search by name
3. Sort options: price, name, rating
4. Pagination (10 items per page)
5. Add to cart functionality

**Product Interface:**
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
}
```

**Component should:**
- Use Angular services for data
- Implement reactive forms for filters
- Use RxJS for search debouncing', 'javascript', '[]', 'intermediate', 900, 1),

(7, 'Dashboard with Charts',
'**Objective**
Build analytics dashboard with data visualization.

**Components:**
1. Sales chart (line graph)
2. Category distribution (pie chart)
3. Monthly comparison (bar chart)
4. Key metrics cards
5. Date range selector

**Features:**
- Real-time data updates
- Export to PDF/CSV
- Responsive layout
- Loading states
- Error handling

**Use:**
- Angular Material for UI
- Chart.js for visualizations
- Observables for data streams', 'javascript', '[]', 'advanced', 1200, 2);

-- Data Structures (ID: 8)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(8, 'LRU Cache Implementation',
'**Objective**
Implement Least Recently Used (LRU) cache.

**Operations:**
- `PUT key value` - Add/update key-value pair
- `GET key` - Retrieve value (return -1 if not found)
- `SIZE` - Return current cache size
- `CLEAR` - Empty the cache

**Constraints:**
- Cache capacity: specified at creation
- When full, remove least recently used item
- GET and PUT should be O(1) operations

**Example** (capacity=3):
Input:
```
PUT 1 100
PUT 2 200
PUT 3 300
GET 1
PUT 4 400
GET 2
GET 3
GET 4
```

Output:
```
100
-1
300
400
```', 'javascript', '[{"input":"PUT 1 100\\nPUT 2 200\\nPUT 3 300\\nGET 1\\nPUT 4 400\\nGET 2\\nGET 3\\nGET 4","output":"100\\n-1\\n300\\n400"}]', 'advanced', 900, 1),

(8, 'Binary Search Tree Operations',
'**Objective**
Implement BST with various operations.

**Commands:**
- `INSERT value` - Add node
- `DELETE value` - Remove node
- `SEARCH value` - Check if exists (print YES/NO)
- `MIN` - Find minimum value
- `MAX` - Find maximum value
- `INORDER` - Print inorder traversal
- `HEIGHT` - Print tree height

**Example:**
Input:
```
INSERT 50
INSERT 30
INSERT 70
INSERT 20
INSERT 40
INORDER
HEIGHT
MIN
MAX
```

Output:
```
20 30 40 50 70
2
20
70
```', 'javascript', '[{"input":"INSERT 50\\nINSERT 30\\nINSERT 70\\nINSERT 20\\nINSERT 40\\nINORDER\\nHEIGHT\\nMIN\\nMAX","output":"20 30 40 50 70\\n2\\n20\\n70"}]', 'intermediate', 900, 2);

-- Algorithms (ID: 9)
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(9, 'Path Finding in Grid',
'**Objective**
Find shortest path in a grid from start to end.

**Input:**
- First line: N M (grid dimensions)
- Next N lines: Grid where:
  - `S` = Start position
  - `E` = End position
  - `.` = Open path
  - `#` = Wall

**Output:**
- Minimum number of steps
- Print -1 if no path exists

**Example:**
Input:
```
5 5
S....
.###.
.....
.###.
....E
```

Output:
```
8
```', 'javascript', '[{"input":"5 5\\nS....\\n.###.\\n.....\\n.###.\\n....E","output":"8"}]', 'intermediate', 900, 1),

(9, 'Stock Trading Algorithm',
'**Objective**
Maximize profit from stock trading.

**Rules:**
- Can buy and sell multiple times
- Must sell before buying again
- Can hold at most one stock at a time

**Input:**
- First line: N (number of days)
- Second line: N space-separated prices

**Output:**
- Maximum profit possible
- Transactions made (BUY day SELL day)

**Example:**
Input:
```
6
7 1 5 3 6 4
```

Output:
```
Max Profit: 7
BUY 2 SELL 3
BUY 4 SELL 5
```', 'javascript', '[{"input":"6\\n7 1 5 3 6 4","output":"Max Profit: 7\\nBUY 2 SELL 3\\nBUY 4 SELL 5"}]', 'advanced', 900, 2);

-- Continue with remaining assessments...
-- DevOps, Cloud Computing, ML, Security, Mobile, System Design, etc.
-- Each with 2 algorithmic problems following the same pattern
