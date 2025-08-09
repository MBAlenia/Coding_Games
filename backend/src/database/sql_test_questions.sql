-- SQL Test Questions for Coding Platform
-- 8 Questions: Beginner (2), Intermediate (2), Advanced (2), Expert (2)
-- All in English with CodinGame-style format

-- First, let's create an assessment for SQL tests
INSERT INTO assessments (title, description, duration, created_by, status) 
VALUES ('SQL Skills Assessment', 'Comprehensive SQL assessment covering all skill levels from beginner to expert', 60, 1, 'active');

SET @assessment_id = LAST_INSERT_ID();

-- ============================================
-- BEGINNER LEVEL 1: Simple SELECT
-- ============================================
INSERT INTO questions (
    assessment_id,
    title,
    description,
    language,
    difficulty,
    points,
    time_limit,
    template_code,
    test_cases
) VALUES (
    @assessment_id,
    'Employee Salary Query',
    '<h3>Employee Salary Query</h3>
    <p>You have a table called <code>employees</code> with the following structure:</p>
    <pre>
    employees:
    - id (INTEGER)
    - name (VARCHAR)
    - department (VARCHAR)
    - salary (DECIMAL)
    </pre>
    <p><strong>Task:</strong> Write a SQL query to select all employees who earn more than $50,000.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Return all columns</li>
        <li>Filter employees with salary > 50000</li>
        <li>Order results by salary in descending order</li>
    </ul>',
    'sql',
    'beginner',
    10,
    30,
    '-- Write your SQL query here\nSELECT *\nFROM employees\nWHERE \n-- Add your condition here',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'Table: employees\n| id | name | department | salary |\n|1|John|IT|60000|\n|2|Jane|HR|45000|\n|3|Bob|IT|75000|',
            'expected_output', '| id | name | department | salary |\n|3|Bob|IT|75000|\n|1|John|IT|60000|',
            'is_hidden', false
        ),
        JSON_OBJECT(
            'input', 'Table: employees\n| id | name | department | salary |\n|4|Alice|Sales|52000|\n|5|Charlie|IT|48000|',
            'expected_output', '| id | name | department | salary |\n|4|Alice|Sales|52000|',
            'is_hidden', true
        )
    )
);

-- ============================================
-- BEGINNER LEVEL 2: COUNT and GROUP BY
-- ============================================
INSERT INTO questions (
    assessment_id,
    title,
    description,
    language,
    difficulty,
    points,
    time_limit,
    template_code,
    test_cases
) VALUES (
    @assessment_id,
    'Department Employee Count',
    '<h3>Department Employee Count</h3>
    <p>Given the <code>employees</code> table:</p>
    <pre>
    employees:
    - id (INTEGER)
    - name (VARCHAR)
    - department (VARCHAR)
    - hire_date (DATE)
    </pre>
    <p><strong>Task:</strong> Count the number of employees in each department.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Group employees by department</li>
        <li>Count employees per department</li>
        <li>Name the count column as "employee_count"</li>
        <li>Order by employee_count descending</li>
    </ul>',
    'sql',
    'beginner',
    10,
    30,
    '-- Count employees by department\nSELECT department, \n       -- Add COUNT here\nFROM employees\n-- Add GROUP BY and ORDER BY',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'Table: employees\n|id|name|department|hire_date|\n|1|John|IT|2020-01-15|\n|2|Jane|IT|2020-03-20|\n|3|Bob|HR|2019-05-10|\n|4|Alice|IT|2021-02-01|',
            'expected_output', '|department|employee_count|\n|IT|3|\n|HR|1|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- INTERMEDIATE LEVEL 1: JOIN Operations
-- ============================================
INSERT INTO questions (
    assessment_id,
    title,
    description,
    language,
    difficulty,
    points,
    time_limit,
    template_code,
    test_cases
) VALUES (
    @assessment_id,
    'Employee Project Assignment',
    '<h3>Employee Project Assignment</h3>
    <p>You have two tables:</p>
    <pre>
    employees:
    - emp_id (INTEGER)
    - emp_name (VARCHAR)
    - department (VARCHAR)
    
    projects:
    - project_id (INTEGER)
    - project_name (VARCHAR)
    - emp_id (INTEGER)
    - start_date (DATE)
    </pre>
    <p><strong>Task:</strong> List all employees with their assigned projects.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Use INNER JOIN to connect employees and projects</li>
        <li>Show employee name, department, and project name</li>
        <li>Order by employee name</li>
    </ul>',
    'sql',
    'intermediate',
    20,
    45,
    '-- Join employees with their projects\nSELECT \n    -- Select required columns\nFROM employees e\n-- Add JOIN clause here\nORDER BY emp_name;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'employees:\n|emp_id|emp_name|department|\n|1|Alice|IT|\n|2|Bob|Sales|\n\nprojects:\n|project_id|project_name|emp_id|\n|101|Website|1|\n|102|Mobile App|1|\n|103|CRM|2|',
            'expected_output', '|emp_name|department|project_name|\n|Alice|IT|Website|\n|Alice|IT|Mobile App|\n|Bob|Sales|CRM|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- INTERMEDIATE LEVEL 2: Aggregation with HAVING
-- ============================================
INSERT INTO questions (
    assessment_id,
    title,
    description,
    language,
    difficulty,
    points,
    time_limit,
    template_code,
    test_cases
) VALUES (
    @assessment_id,
    'High Sales Departments',
    '<h3>High Sales Departments</h3>
    <p>Given a <code>sales</code> table:</p>
    <pre>
    sales:
    - sale_id (INTEGER)
    - department (VARCHAR)
    - amount (DECIMAL)
    - sale_date (DATE)
    </pre>
    <p><strong>Task:</strong> Find departments with total sales exceeding $100,000.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Group by department</li>
        <li>Calculate total sales per department</li>
        <li>Filter departments with total > 100000 using HAVING</li>
        <li>Show department and total_sales</li>
    </ul>',
    'sql',
    'intermediate',
    20,
    45,
    '-- Find high-performing departments\nSELECT department,\n       SUM(amount) as total_sales\nFROM sales\nGROUP BY department\n-- Add HAVING clause\nORDER BY total_sales DESC;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'sales:\n|sale_id|department|amount|sale_date|\n|1|Electronics|50000|2024-01-15|\n|2|Electronics|75000|2024-01-20|\n|3|Clothing|30000|2024-01-18|\n|4|Clothing|45000|2024-01-22|',
            'expected_output', '|department|total_sales|\n|Electronics|125000|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- ADVANCED LEVEL 1: Subqueries
-- ============================================
INSERT INTO questions (
    assessment_id,
    title,
    description,
    language,
    difficulty,
    points,
    time_limit,
    template_code,
    test_cases
) VALUES (
    @assessment_id,
    'Above Average Salaries',
    '<h3>Above Average Salaries</h3>
    <p>Using the <code>employees</code> table:</p>
    <pre>
    employees:
    - emp_id (INTEGER)
    - name (VARCHAR)
    - department (VARCHAR)
    - salary (DECIMAL)
    </pre>
    <p><strong>Task:</strong> Find all employees who earn more than the average salary in their department.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Use a correlated subquery</li>
        <li>Compare each employee''s salary to their department average</li>
        <li>Return name, department, salary, and dept_avg_salary</li>
    </ul>',
    'sql',
    'advanced',
    30,
    60,
    '-- Find employees earning above department average\nSELECT \n    e1.name,\n    e1.department,\n    e1.salary,\n    -- Add subquery for department average\nFROM employees e1\nWHERE e1.salary > (\n    -- Correlated subquery here\n)\nORDER BY department, salary DESC;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'employees:\n|emp_id|name|department|salary|\n|1|John|IT|70000|\n|2|Jane|IT|85000|\n|3|Bob|IT|60000|\n|4|Alice|HR|65000|\n|5|Charlie|HR|55000|',
            'expected_output', '|name|department|salary|dept_avg_salary|\n|Alice|HR|65000|60000|\n|Jane|IT|85000|71667|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- ADVANCED LEVEL 2: Window Functions
-- ============================================
INSERT INTO questions (
    assessment_id,
    title,
    description,
    language,
    difficulty,
    points,
    time_limit,
    template_code,
    test_cases
) VALUES (
    @assessment_id,
    'Sales Ranking by Region',
    '<h3>Sales Ranking by Region</h3>
    <p>Given a <code>sales_reps</code> table:</p>
    <pre>
    sales_reps:
    - rep_id (INTEGER)
    - rep_name (VARCHAR)
    - region (VARCHAR)
    - total_sales (DECIMAL)
    </pre>
    <p><strong>Task:</strong> Rank sales representatives within each region based on their total sales.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Use ROW_NUMBER() window function</li>
        <li>Partition by region</li>
        <li>Order by total_sales descending within each partition</li>
        <li>Show rep_name, region, total_sales, and rank</li>
    </ul>',
    'sql',
    'advanced',
    30,
    60,
    '-- Rank sales reps by region\nSELECT \n    rep_name,\n    region,\n    total_sales,\n    -- Add ROW_NUMBER window function\nFROM sales_reps\nORDER BY region, rank;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'sales_reps:\n|rep_id|rep_name|region|total_sales|\n|1|Alice|North|150000|\n|2|Bob|North|120000|\n|3|Charlie|South|180000|\n|4|David|South|160000|',
            'expected_output', '|rep_name|region|total_sales|rank|\n|Alice|North|150000|1|\n|Bob|North|120000|2|\n|Charlie|South|180000|1|\n|David|South|160000|2|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- EXPERT LEVEL 1: Recursive CTE
-- ============================================
INSERT INTO questions (
    assessment_id,
    title,
    description,
    language,
    difficulty,
    points,
    time_limit,
    template_code,
    test_cases
) VALUES (
    @assessment_id,
    'Organization Hierarchy',
    '<h3>Organization Hierarchy</h3>
    <p>Given an <code>employees</code> table with hierarchical data:</p>
    <pre>
    employees:
    - emp_id (INTEGER)
    - emp_name (VARCHAR)
    - manager_id (INTEGER) - NULL for CEO
    - level (INTEGER) - organizational level
    </pre>
    <p><strong>Task:</strong> Build the complete organizational hierarchy starting from the CEO.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Use a recursive CTE (Common Table Expression)</li>
        <li>Start with the CEO (manager_id IS NULL)</li>
        <li>Recursively find all subordinates</li>
        <li>Calculate the hierarchy level for each employee</li>
        <li>Show emp_name, manager_name, and hierarchy_level</li>
    </ul>',
    'sql',
    'expert',
    40,
    90,
    '-- Build organizational hierarchy\nWITH RECURSIVE org_hierarchy AS (\n    -- Anchor: Start with CEO\n    SELECT \n        emp_id,\n        emp_name,\n        manager_id,\n        1 as hierarchy_level\n    FROM employees\n    WHERE manager_id IS NULL\n    \n    UNION ALL\n    \n    -- Recursive part\n    -- Add recursive query here\n)\nSELECT \n    -- Final selection\nFROM org_hierarchy\nORDER BY hierarchy_level, emp_name;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'employees:\n|emp_id|emp_name|manager_id|\n|1|CEO|NULL|\n|2|VP Sales|1|\n|3|VP Tech|1|\n|4|Manager A|2|\n|5|Manager B|3|',
            'expected_output', '|emp_name|hierarchy_level|\n|CEO|1|\n|VP Sales|2|\n|VP Tech|2|\n|Manager A|3|\n|Manager B|3|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- EXPERT LEVEL 2: Complex Analytics Query
-- ============================================
INSERT INTO questions (
    assessment_id,
    title,
    description,
    language,
    difficulty,
    points,
    time_limit,
    template_code,
    test_cases
) VALUES (
    @assessment_id,
    'Customer Lifetime Value Analysis',
    '<h3>Customer Lifetime Value Analysis</h3>
    <p>You have multiple tables for a comprehensive customer analysis:</p>
    <pre>
    customers: (customer_id, customer_name, registration_date, segment)
    orders: (order_id, customer_id, order_date, total_amount)
    products: (product_id, product_name, category)
    order_items: (order_id, product_id, quantity, unit_price)
    </pre>
    <p><strong>Task:</strong> Calculate customer lifetime value with the following metrics:</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Total revenue per customer</li>
        <li>Number of orders</li>
        <li>Average order value</li>
        <li>Days since first purchase</li>
        <li>Customer segment classification based on value (High > $10000, Medium $5000-10000, Low < $5000)</li>
        <li>Rank customers within each segment</li>
    </ul>',
    'sql',
    'expert',
    40,
    90,
    '-- Complex customer lifetime value analysis\nWITH customer_metrics AS (\n    SELECT \n        c.customer_id,\n        c.customer_name,\n        c.segment,\n        -- Calculate metrics here\n    FROM customers c\n    LEFT JOIN orders o ON c.customer_id = o.customer_id\n    GROUP BY c.customer_id, c.customer_name, c.segment\n),\ncustomer_segments AS (\n    SELECT \n        *,\n        CASE \n            WHEN total_revenue > 10000 THEN ''High Value''\n            WHEN total_revenue BETWEEN 5000 AND 10000 THEN ''Medium Value''\n            ELSE ''Low Value''\n        END as value_segment\n    FROM customer_metrics\n)\nSELECT \n    -- Final selection with ranking\nFROM customer_segments\nORDER BY value_segment, segment_rank;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'Complex multi-table dataset',
            'expected_output', 'Customer lifetime value metrics with segmentation and ranking',
            'is_hidden', false
        )
    )
);

-- Add indexes for better performance
CREATE INDEX idx_questions_assessment ON questions(assessment_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);

-- Output confirmation
SELECT 
    q.title,
    q.difficulty,
    q.points,
    q.time_limit,
    q.language
FROM questions q
WHERE q.assessment_id = @assessment_id
ORDER BY 
    FIELD(q.difficulty, 'beginner', 'intermediate', 'advanced', 'expert'),
    q.title;
