-- Additional SQL Test Questions (6 new questions)
-- 2 per difficulty level: Beginner, Intermediate, Advanced
-- All in English with expected results

-- Get the assessment ID for SQL Skills Assessment
SET @assessment_id = (SELECT id FROM assessments WHERE title = 'SQL Skills Assessment' LIMIT 1);

-- ============================================
-- BEGINNER LEVEL 3: Basic WHERE with LIKE
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
    'Customer Name Search',
    '<h3>Customer Name Search</h3>
    <p>You have a table called <code>customers</code> with the following structure:</p>
    <pre>
    customers:
    - customer_id (INTEGER)
    - first_name (VARCHAR)
    - last_name (VARCHAR)
    - email (VARCHAR)
    - city (VARCHAR)
    </pre>
    <p><strong>Task:</strong> Find all customers whose first name starts with "J".</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Use LIKE operator for pattern matching</li>
        <li>Return customer_id, first_name, last_name, and email</li>
        <li>Order results by last_name alphabetically</li>
    </ul>',
    'sql',
    'beginner',
    10,
    30,
    '-- Find customers with first name starting with "J"\nSELECT customer_id, first_name, last_name, email\nFROM customers\nWHERE first_name LIKE \n-- Add your pattern here\nORDER BY last_name;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'Table: customers\n| customer_id | first_name | last_name | email | city |\n|1|John|Smith|john@email.com|New York|\n|2|Jane|Doe|jane@email.com|Boston|\n|3|Mike|Johnson|mike@email.com|Chicago|\n|4|Jennifer|Brown|jen@email.com|Seattle|',
            'expected_output', '| customer_id | first_name | last_name | email |\n|2|Jane|Doe|jane@email.com|\n|4|Jennifer|Brown|jen@email.com|\n|1|John|Smith|john@email.com|',
            'is_hidden', false
        ),
        JSON_OBJECT(
            'input', 'Table: customers\n| customer_id | first_name | last_name | email | city |\n|5|James|Wilson|james@email.com|Miami|\n|6|Sarah|Davis|sarah@email.com|Denver|',
            'expected_output', '| customer_id | first_name | last_name | email |\n|5|James|Wilson|james@email.com|',
            'is_hidden', true
        )
    )
);

-- ============================================
-- BEGINNER LEVEL 4: SUM and AVG Functions
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
    'Order Statistics',
    '<h3>Order Statistics</h3>
    <p>Given an <code>orders</code> table:</p>
    <pre>
    orders:
    - order_id (INTEGER)
    - customer_id (INTEGER)
    - order_date (DATE)
    - total_amount (DECIMAL)
    - status (VARCHAR)
    </pre>
    <p><strong>Task:</strong> Calculate basic statistics for completed orders.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Filter orders with status = "completed"</li>
        <li>Calculate total revenue (SUM of total_amount)</li>
        <li>Calculate average order value (AVG of total_amount)</li>
        <li>Count total number of completed orders</li>
        <li>Name columns: total_revenue, avg_order_value, order_count</li>
    </ul>',
    'sql',
    'beginner',
    10,
    30,
    '-- Calculate statistics for completed orders\nSELECT \n    SUM(total_amount) as total_revenue,\n    AVG(total_amount) as avg_order_value,\n    COUNT(*) as order_count\nFROM orders\nWHERE status = \n-- Add your condition here',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'Table: orders\n|order_id|customer_id|order_date|total_amount|status|\n|1|101|2024-01-15|250.00|completed|\n|2|102|2024-01-16|150.00|completed|\n|3|103|2024-01-17|300.00|pending|\n|4|104|2024-01-18|200.00|completed|',
            'expected_output', '|total_revenue|avg_order_value|order_count|\n|600.00|200.00|3|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- INTERMEDIATE LEVEL 3: LEFT JOIN with NULL handling
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
    'Customer Order History',
    '<h3>Customer Order History</h3>
    <p>You have two tables:</p>
    <pre>
    customers:
    - customer_id (INTEGER)
    - customer_name (VARCHAR)
    - email (VARCHAR)
    
    orders:
    - order_id (INTEGER)
    - customer_id (INTEGER)
    - order_date (DATE)
    - total_amount (DECIMAL)
    </pre>
    <p><strong>Task:</strong> List all customers and their total order amounts, including customers who have never placed an order.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Use LEFT JOIN to include all customers</li>
        <li>Show customer_name, email, and total_spent</li>
        <li>For customers with no orders, show 0.00 as total_spent</li>
        <li>Order by total_spent descending, then by customer_name</li>
    </ul>',
    'sql',
    'intermediate',
    20,
    45,
    '-- List all customers with their total spending\nSELECT \n    c.customer_name,\n    c.email,\n    COALESCE(SUM(o.total_amount), 0.00) as total_spent\nFROM customers c\n-- Add LEFT JOIN here\nGROUP BY c.customer_id, c.customer_name, c.email\nORDER BY total_spent DESC, customer_name;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'customers:\n|customer_id|customer_name|email|\n|1|Alice Johnson|alice@email.com|\n|2|Bob Smith|bob@email.com|\n|3|Carol Davis|carol@email.com|\n\norders:\n|order_id|customer_id|order_date|total_amount|\n|101|1|2024-01-15|250.00|\n|102|1|2024-01-20|150.00|\n|103|2|2024-01-18|300.00|',
            'expected_output', '|customer_name|email|total_spent|\n|Alice Johnson|alice@email.com|400.00|\n|Bob Smith|bob@email.com|300.00|\n|Carol Davis|carol@email.com|0.00|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- INTERMEDIATE LEVEL 4: Date Functions and Filtering
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
    'Monthly Sales Report',
    '<h3>Monthly Sales Report</h3>
    <p>Given a <code>sales</code> table:</p>
    <pre>
    sales:
    - sale_id (INTEGER)
    - product_name (VARCHAR)
    - sale_date (DATE)
    - quantity (INTEGER)
    - unit_price (DECIMAL)
    </pre>
    <p><strong>Task:</strong> Generate a monthly sales report for 2024.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Filter sales for year 2024 only</li>
        <li>Group by month (use MONTH() function)</li>
        <li>Calculate total revenue per month (quantity * unit_price)</li>
        <li>Show month_number and total_revenue</li>
        <li>Order by month_number</li>
    </ul>',
    'sql',
    'intermediate',
    20,
    45,
    '-- Generate monthly sales report for 2024\nSELECT \n    MONTH(sale_date) as month_number,\n    SUM(quantity * unit_price) as total_revenue\nFROM sales\nWHERE YEAR(sale_date) = 2024\nGROUP BY MONTH(sale_date)\nORDER BY month_number;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'Table: sales\n|sale_id|product_name|sale_date|quantity|unit_price|\n|1|Widget A|2024-01-15|10|25.00|\n|2|Widget B|2024-01-20|5|50.00|\n|3|Widget A|2024-02-10|8|25.00|\n|4|Widget C|2024-02-15|12|30.00|',
            'expected_output', '|month_number|total_revenue|\n|1|500.00|\n|2|560.00|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- ADVANCED LEVEL 3: CASE Statements and Complex Aggregation
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
    'Employee Performance Analysis',
    '<h3>Employee Performance Analysis</h3>
    <p>Using an <code>employee_sales</code> table:</p>
    <pre>
    employee_sales:
    - emp_id (INTEGER)
    - emp_name (VARCHAR)
    - department (VARCHAR)
    - sales_amount (DECIMAL)
    - quarter (INTEGER)
    - year (INTEGER)
    </pre>
    <p><strong>Task:</strong> Categorize employees based on their total annual sales performance.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Calculate total sales per employee for 2024</li>
        <li>Categorize performance: "Excellent" (>100000), "Good" (50000-100000), "Average" (<50000)</li>
        <li>Use CASE statement for categorization</li>
        <li>Show emp_name, department, total_sales, performance_category</li>
        <li>Order by total_sales descending</li>
    </ul>',
    'sql',
    'advanced',
    30,
    60,
    '-- Analyze employee performance with categorization\nSELECT \n    emp_name,\n    department,\n    SUM(sales_amount) as total_sales,\n    CASE \n        WHEN SUM(sales_amount) > 100000 THEN ''Excellent''\n        WHEN SUM(sales_amount) BETWEEN 50000 AND 100000 THEN ''Good''\n        ELSE ''Average''\n    END as performance_category\nFROM employee_sales\nWHERE year = 2024\nGROUP BY emp_id, emp_name, department\nORDER BY total_sales DESC;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'Table: employee_sales\n|emp_id|emp_name|department|sales_amount|quarter|year|\n|1|John Doe|Sales|30000|1|2024|\n|1|John Doe|Sales|35000|2|2024|\n|2|Jane Smith|Sales|45000|1|2024|\n|2|Jane Smith|Sales|60000|2|2024|\n|3|Mike Johnson|Marketing|25000|1|2024|',
            'expected_output', '|emp_name|department|total_sales|performance_category|\n|Jane Smith|Sales|105000|Excellent|\n|John Doe|Sales|65000|Good|\n|Mike Johnson|Marketing|25000|Average|',
            'is_hidden', false
        )
    )
);

-- ============================================
-- ADVANCED LEVEL 4: Multiple JOINs and Subqueries
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
    'Product Category Analysis',
    '<h3>Product Category Analysis</h3>
    <p>You have three tables:</p>
    <pre>
    products: (product_id, product_name, category_id, unit_price)
    categories: (category_id, category_name)
    order_items: (order_item_id, product_id, quantity, order_date)
    </pre>
    <p><strong>Task:</strong> Find categories that have products with above-average sales volume.</p>
    <p><strong>Requirements:</strong></p>
    <ul>
        <li>Calculate total quantity sold per category</li>
        <li>Compare with overall average quantity per category</li>
        <li>Show only categories performing above average</li>
        <li>Include category_name, total_quantity, avg_category_quantity</li>
        <li>Order by total_quantity descending</li>
    </ul>',
    'sql',
    'advanced',
    30,
    60,
    '-- Find high-performing product categories\nWITH category_sales AS (\n    SELECT \n        c.category_name,\n        SUM(oi.quantity) as total_quantity\n    FROM categories c\n    JOIN products p ON c.category_id = p.category_id\n    JOIN order_items oi ON p.product_id = oi.product_id\n    GROUP BY c.category_id, c.category_name\n),\navg_performance AS (\n    SELECT AVG(total_quantity) as avg_category_quantity\n    FROM category_sales\n)\nSELECT \n    cs.category_name,\n    cs.total_quantity,\n    ap.avg_category_quantity\nFROM category_sales cs\nCROSS JOIN avg_performance ap\nWHERE cs.total_quantity > ap.avg_category_quantity\nORDER BY cs.total_quantity DESC;',
    JSON_ARRAY(
        JSON_OBJECT(
            'input', 'Complex multi-table dataset with products, categories, and order items',
            'expected_output', 'Categories with above-average sales performance',
            'is_hidden', false
        )
    )
);

-- Output confirmation
SELECT 
    'Additional questions added successfully' as status,
    COUNT(*) as total_sql_questions
FROM questions 
WHERE assessment_id = @assessment_id AND language = 'sql';
