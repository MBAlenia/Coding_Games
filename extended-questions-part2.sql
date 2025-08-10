-- Extended algorithmic questions Part 2 (Assessments 11-20)
-- 3-4 questions per assessment

-- Cloud Computing (ID: 11) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(11, 'Auto-Scaling Manager',
'**Objective**
Auto-scaling logic implementation.

**Commands:**
- METRICS cpu memory requests - Current metrics
- SCALE UP threshold duration - Scale up rule
- SCALE DOWN threshold duration - Scale down rule
- PREDICT timeframe - Predict scaling
- COST - Calculate cost
- EXIT

**Output:**
Scaling decisions with reasoning.', 'javascript', '[]', 'advanced', 1200, 1),

(11, 'S3 Bucket Manager',
'**Objective**
Manage S3 buckets.

**Commands:**
- CREATE bucket region - Create bucket
- UPLOAD bucket key file - Upload file
- LIST bucket prefix - List objects
- DELETE bucket key - Delete object
- LIFECYCLE bucket rules - Set lifecycle
- EXIT

**Example:**
Input:
```
CREATE my-bucket us-east-1
UPLOAD my-bucket data.json /tmp/data.json
LIST my-bucket /
EXIT
```
Output:
```
Bucket created
Uploaded: data.json (2.5KB)
Objects: data.json
```', 'javascript', '[{"input":"CREATE my-bucket us-east-1\\nUPLOAD my-bucket data.json /tmp/data.json\\nLIST my-bucket /\\nEXIT","output":"Bucket created\\nUploaded: data.json (2.5KB)\\nObjects: data.json"}]', 'intermediate', 900, 2),

(11, 'Lambda Function Manager',
'**Objective**
Deploy Lambda functions.

**Commands:**
- DEPLOY name runtime code - Deploy function
- INVOKE name payload - Execute function
- LOGS name - View logs
- METRICS name - Performance metrics
- VERSION name - Create version
- EXIT

**Output:**
Deployment and execution results.', 'javascript', '[]', 'advanced', 1200, 3);

-- Machine Learning (ID: 12) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(12, 'Linear Regression',
'**Objective**
Implement linear regression.

**Input:**
- Training data: (x,y) pairs
- Test data: x values

**Tasks:**
1. Train with gradient descent
2. Calculate MSE
3. Predict test values

**Example:**
Input:
```
5
1 2
2 4
3 5
4 8
5 10
3
6 7 8
```
Output:
```
Model: y = 1.9x + 0.1
MSE: 0.5
Predictions: 11.5, 13.4, 15.3
```', 'python', '[{"input":"5\\n1 2\\n2 4\\n3 5\\n4 8\\n5 10\\n3\\n6 7 8","output":"Model: y = 1.9x + 0.1\\nMSE: 0.5\\nPredictions: 11.5, 13.4, 15.3"}]', 'intermediate', 1200, 1),

(12, 'K-Means Clustering',
'**Objective**
Cluster data points.

**Input:**
- Points and clusters count
- Coordinates
- Max iterations

**Output:**
- Cluster assignments
- Final centroids
- Inertia score

**Example:**
Input:
```
6 2
1 1
1 2
5 5
6 5
6 6
2 1
100
```
Output:
```
Point 1 -> Cluster 1
Point 2 -> Cluster 1
Point 3 -> Cluster 2
Point 4 -> Cluster 2
Point 5 -> Cluster 2
Point 6 -> Cluster 1
```', 'python', '[{"input":"6 2\\n1 1\\n1 2\\n5 5\\n6 5\\n6 6\\n2 1\\n100","output":"Point 1 -> Cluster 1\\nPoint 2 -> Cluster 1\\nPoint 3 -> Cluster 2\\nPoint 4 -> Cluster 2\\nPoint 5 -> Cluster 2\\nPoint 6 -> Cluster 1"}]', 'advanced', 1200, 2),

(12, 'Decision Tree',
'**Objective**
Build decision tree classifier.

**Input:**
- Training data with features
- Test samples

**Tasks:**
1. Build tree using entropy
2. Prune to avoid overfitting
3. Predict test samples
4. Calculate accuracy

**Output:**
Tree structure and predictions.', 'python', '[]', 'advanced', 1500, 3);

-- Cybersecurity (ID: 13) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(13, 'Password Security',
'**Objective**
Validate password strength.

**Scoring:**
- Length 8+: +10 points
- Uppercase: +10 points
- Lowercase: +10 points
- Numbers: +10 points
- Special chars: +20 points
- No patterns: +10 points

**Input:**
List of passwords

**Output:**
Score and recommendations

**Example:**
Input:
```
3
password123
MyP@ssw0rd!
Tr0ub4dor&3
```
Output:
```
password123: 30/100 - Weak
MyP@ssw0rd!: 80/100 - Strong
Tr0ub4dor&3: 90/100 - Very Strong
```', 'python', '[{"input":"3\\npassword123\\nMyP@ssw0rd!\\nTr0ub4dor&3","output":"password123: 30/100 - Weak\\nMyP@ssw0rd!: 80/100 - Strong\\nTr0ub4dor&3: 90/100 - Very Strong"}]', 'intermediate', 600, 1),

(13, 'Encryption Tool',
'**Objective**
Implement encryption/decryption.

**Commands:**
- ENCRYPT method text key - Encrypt text
- DECRYPT method text key - Decrypt text
- HASH algorithm text - Hash text
- VERIFY hash text - Verify hash
- EXIT

**Methods:**
- CAESAR, VIGENERE, AES

**Example:**
Input:
```
ENCRYPT CAESAR hello 3
DECRYPT CAESAR khoor 3
EXIT
```
Output:
```
khoor
hello
```', 'python', '[{"input":"ENCRYPT CAESAR hello 3\\nDECRYPT CAESAR khoor 3\\nEXIT","output":"khoor\\nhello"}]', 'intermediate', 900, 2),

(13, 'Security Scanner',
'**Objective**
Scan for vulnerabilities.

**Commands:**
- SCAN type target - Scan target
- CHECK pattern text - Check for pattern
- VALIDATE input type - Validate input
- REPORT - Generate report
- EXIT

**Scan Types:**
- SQL injection
- XSS attacks
- Path traversal

**Output:**
Vulnerability findings.', 'python', '[]', 'advanced', 1200, 3);

-- Mobile Development (ID: 14) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(14, 'Offline Data Sync',
'**Objective**
Implement offline synchronization.

**Commands:**
- QUEUE operation data - Queue offline operation
- SYNC - Sync with server
- CONFLICT strategy - Set conflict resolution
- STATUS - Sync status
- RETRY failed_id - Retry operation
- EXIT

**Strategies:**
- LAST_WRITE_WINS
- MERGE
- ASK_USER

**Output:**
Sync log with results.', 'javascript', '[]', 'advanced', 900, 1),

(14, 'Push Notification Manager',
'**Objective**
Handle push notifications.

**Commands:**
- REGISTER token - Register device
- SEND user_id message - Send notification
- SCHEDULE time message - Schedule notification
- TOPICS user_id topics - Subscribe to topics
- STATS - Notification statistics
- EXIT

**Output:**
Notification delivery status.', 'javascript', '[]', 'intermediate', 900, 2),

(14, 'Mobile Cache Manager',
'**Objective**
Manage app cache.

**Commands:**
- CACHE key value ttl - Cache data
- GET key - Retrieve from cache
- INVALIDATE pattern - Invalidate matching keys
- SIZE - Cache size
- CLEAR - Clear all cache
- EXIT

**Features:**
- TTL support
- LRU eviction
- Size limits

**Output:**
Cache operations results.', 'javascript', '[]', 'intermediate', 900, 3);

-- System Design (ID: 15) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(15, 'Load Balancer',
'**Objective**
Implement load balancer.

**Input:**
- Server list with weights
- Number of requests

**Features:**
- Weighted distribution
- Health checks
- Failover handling

**Example:**
Input:
```
3
server1 2
server2 1
server3 3
6
```
Output:
```
Request 1 -> server1
Request 2 -> server3
Request 3 -> server1
Request 4 -> server3
Request 5 -> server3
Request 6 -> server2
```', 'javascript', '[{"input":"3\\nserver1 2\\nserver2 1\\nserver3 3\\n6","output":"Request 1 -> server1\\nRequest 2 -> server3\\nRequest 3 -> server1\\nRequest 4 -> server3\\nRequest 5 -> server3\\nRequest 6 -> server2"}]', 'advanced', 900, 1),

(15, 'Rate Limiter',
'**Objective**
Implement rate limiting.

**Commands:**
- LIMIT resource requests window - Set limit
- REQUEST user resource - Make request
- STATUS user resource - Check status
- RESET user resource - Reset counter
- BLACKLIST user duration - Block user
- EXIT

**Output:**
ALLOWED or DENIED with reason.', 'javascript', '[]', 'intermediate', 900, 2),

(15, 'Distributed Cache',
'**Objective**
Design distributed cache.

**Commands:**
- NODE add name capacity - Add cache node
- PUT key value - Store in cache
- GET key - Retrieve value
- REBALANCE - Rebalance data
- REPLICATE factor - Set replication
- EXIT

**Features:**
- Consistent hashing
- Replication
- Auto-rebalancing

**Output:**
Cache operations and node distribution.', 'javascript', '[]', 'expert', 1200, 3);

-- Database Design (ID: 16) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(16, 'Query Optimizer',
'**Objective**
Optimize database queries.

**Given Query:**
```sql
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.date > "2024-01-01"
AND c.country = "USA"
ORDER BY o.total DESC
```

**Tasks:**
1. Identify issues
2. Suggest indexes
3. Rewrite query
4. Explain plan

**Output:**
Optimized query with explanations.', 'sql', '[]', 'advanced', 900, 1),

(16, 'Schema Migration',
'**Objective**
Database migration tool.

**Commands:**
- CREATE migration_name - Create migration
- UP version - Apply migrations
- DOWN version - Rollback to version
- STATUS - Current version
- VALIDATE - Check integrity
- EXIT

**Example:**
Input:
```
CREATE add_users_table
UP 1
STATUS
EXIT
```
Output:
```
Migration created: add_users_table
Applied: add_users_table
Current version: 1
```', 'sql', '[{"input":"CREATE add_users_table\\nUP 1\\nSTATUS\\nEXIT","output":"Migration created: add_users_table\\nApplied: add_users_table\\nCurrent version: 1"}]', 'intermediate', 900, 2),

(16, 'Index Analyzer',
'**Objective**
Analyze and suggest indexes.

**Commands:**
- ANALYZE table - Analyze table
- SUGGEST query - Suggest indexes for query
- CREATE INDEX name ON table(columns) - Create index
- DROP INDEX name - Drop index
- STATS - Index statistics
- EXIT

**Output:**
Index recommendations and performance impact.', 'sql', '[]', 'advanced', 1200, 3);

-- API Development (ID: 17) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(17, 'GraphQL Resolver',
'**Objective**
Create GraphQL API.

**Schema:**
```graphql
type Post {
  id: ID!
  title: String!
  author: User!
  comments: [Comment!]!
}
```

**Implement:**
- Query posts with pagination
- Filter by author
- Sort by date
- N+1 optimization

**Output:**
Resolver implementation.', 'javascript', '[]', 'advanced', 900, 1),

(17, 'API Gateway',
'**Objective**
Build API gateway.

**Commands:**
- ROUTE path service - Add route
- MIDDLEWARE name config - Add middleware
- REQUEST method path body - Make request
- CACHE route duration - Cache responses
- MONITOR - Show metrics
- EXIT

**Middleware:**
- AUTH, RATE_LIMIT, CORS, LOGGING

**Output:**
Request routing and processing.', 'javascript', '[]', 'advanced', 1200, 2),

(17, 'Webhook Manager',
'**Objective**
Manage webhooks.

**Commands:**
- REGISTER url events - Register webhook
- TRIGGER event data - Trigger webhooks
- RETRY webhook_id - Retry failed webhook
- STATUS webhook_id - Check status
- UNREGISTER webhook_id - Remove webhook
- EXIT

**Features:**
- Retry logic
- Signature verification
- Event filtering

**Output:**
Webhook delivery status.', 'javascript', '[]', 'intermediate', 900, 3);

-- Java Enterprise Development (ID: 18) - 4 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(18, 'Order Processing System',
'**Objective**
E-commerce order processing.

**Commands:**
- ORDER customer_id product_id quantity - Create order
- CANCEL order_id - Cancel if not shipped
- SHIP order_id - Mark as shipped
- DELIVER order_id - Mark delivered
- RETURN order_id reason - Process return
- STATUS order_id - Check status
- REPORT - Sales summary
- EXIT

**Business Rules:**
- Check inventory
- Cannot cancel shipped orders
- Returns within 30 days

**Example:**
Input:
```
ORDER 1 101 2
SHIP 1
STATUS 1
REPORT
EXIT
```
Output:
```
Order 1 created
Order 1 shipped
Order 1: SHIPPED
Total Orders: 1, Revenue: $200
```', 'java', '[{"input":"ORDER 1 101 2\\nSHIP 1\\nSTATUS 1\\nREPORT\\nEXIT","output":"Order 1 created\\nOrder 1 shipped\\nOrder 1: SHIPPED\\nTotal Orders: 1, Revenue: $200"}]', 'advanced', 1200, 1),

(18, 'Spring Boot Microservice',
'**Objective**
Build user microservice.

**Endpoints:**
- POST /users - Create user
- GET /users/{id} - Get user
- PUT /users/{id} - Update user
- DELETE /users/{id} - Delete user
- GET /users/search - Search users

**Requirements:**
- JPA repositories
- Service layer
- Exception handling
- Validation
- Unit tests', 'java', '[]', 'advanced', 1500, 2),

(18, 'Event-Driven System',
'**Objective**
Implement event processing.

**Commands:**
- PUBLISH topic event data - Publish event
- SUBSCRIBE topic handler - Subscribe to topic
- PROCESS - Process event queue
- REPLAY from_time to_time - Replay events
- STATUS - Queue status
- EXIT

**Topics:**
- USER_CREATED
- ORDER_PLACED
- PAYMENT_PROCESSED

**Output:**
Event processing log.', 'java', '[]', 'expert', 1500, 3),

(18, 'Caching Strategy',
'**Objective**
Implement caching layer.

**Commands:**
- CACHE_ASIDE key - Cache aside pattern
- WRITE_THROUGH key value - Write through
- WRITE_BEHIND key value - Write behind
- REFRESH key - Refresh cache
- EVICT pattern - Evict matching keys
- STATS - Cache statistics
- EXIT

**Output:**
Cache operations and hit/miss ratio.', 'java', '[]', 'advanced', 1200, 4);

-- Frontend Testing (ID: 19) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(19, 'Test Suite Generator',
'**Objective**
Generate test cases.

**Input:**
Component structure and props

**Generate:**
- Unit tests
- Integration tests
- Snapshot tests
- Coverage report

**Example Component:**
```jsx
function Calculator({ initial = 0 }) {
  const [value, setValue] = useState(initial);
  const add = (n) => setValue(value + n);
  return <div>{value}</div>;
}
```

**Output:**
Complete Jest test suite.', 'javascript', '[]', 'intermediate', 900, 1),

(19, 'E2E Test Automation',
'**Objective**
Cypress E2E tests.

**Scenarios:**
1. User registration
2. Login flow
3. Product purchase
4. Password reset

**Requirements:**
- Page objects
- Custom commands
- API mocking
- Visual regression

**Output:**
Cypress test implementation.', 'javascript', '[]', 'advanced', 1200, 2),

(19, 'Performance Testing',
'**Objective**
Performance test suite.

**Commands:**
- MEASURE component metric - Measure performance
- PROFILE duration - Profile execution
- MEMORY - Check memory leaks
- BUNDLE - Analyze bundle size
- LIGHTHOUSE - Run Lighthouse audit
- EXIT

**Metrics:**
- Render time
- Re-render count
- Memory usage
- Bundle size

**Output:**
Performance report with recommendations.', 'javascript', '[]', 'advanced', 1200, 3);

-- Microservices (ID: 20) - 3 questions
INSERT INTO questions (assessment_id, title, description, language, test_cases, difficulty, time_limit, order_index) VALUES
(20, 'Service Mesh Router',
'**Objective**
Service mesh routing.

**Features:**
- Route by path/headers
- Circuit breaker
- Retry with backoff
- Load balancing
- Request tracing

**Input:**
Request details and service registry

**Output:**
Routing decisions with trace IDs

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
Trace-ID: abc-123
Response-Time: 45ms
```', 'javascript', '[{"input":"GET /api/users\\nService: user-service\\nHealth: healthy slow healthy","output":"Route to: instance-1\\nTrace-ID: abc-123\\nResponse-Time: 45ms"}]', 'expert', 1200, 1),

(20, 'Service Discovery',
'**Objective**
Service discovery system.

**Commands:**
- REGISTER service host port - Register service
- DISCOVER service - Find service instances
- HEALTH service instance status - Update health
- DEREGISTER service instance - Remove instance
- WATCH service - Watch for changes
- EXIT

**Output:**
Service registry status.', 'javascript', '[]', 'advanced', 1200, 2),

(20, 'Saga Orchestrator',
'**Objective**
Distributed transaction saga.

**Commands:**
- START saga_type data - Start saga
- STEP saga_id step_name status - Update step
- COMPENSATE saga_id - Rollback saga
- STATUS saga_id - Check saga status
- RETRY saga_id step - Retry failed step
- EXIT

**Saga Types:**
- ORDER_FULFILLMENT
- USER_REGISTRATION
- PAYMENT_PROCESSING

**Output:**
Saga execution log with compensation.', 'javascript', '[]', 'expert', 1500, 3);
