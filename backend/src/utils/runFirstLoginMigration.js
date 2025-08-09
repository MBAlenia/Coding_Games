const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function runMigration() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'mysql',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'rootpassword',
      database: process.env.DB_NAME || 'coding_platform',
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Check if columns already exist
    const [existingColumns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'coding_platform' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('first_login', 'invitation_token', 'invitation_token_expiry')
    `);
    
    const existingColumnNames = existingColumns.map(c => c.COLUMN_NAME);
    
    // Add columns only if they don't exist
    if (!existingColumnNames.includes('first_login')) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN first_login TINYINT(1) DEFAULT 1 
        COMMENT 'Indicates if user needs to set password on first login'
      `);
      console.log('✅ Added column: first_login');
    }
    
    if (!existingColumnNames.includes('invitation_token')) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN invitation_token VARCHAR(255) DEFAULT NULL 
        COMMENT 'Token for first-time login'
      `);
      console.log('✅ Added column: invitation_token');
    }
    
    if (!existingColumnNames.includes('invitation_token_expiry')) {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN invitation_token_expiry DATETIME DEFAULT NULL 
        COMMENT 'Expiry time for invitation token'
      `);
      console.log('✅ Added column: invitation_token_expiry');
    }
    
    // Update existing users (using password_hash instead of password)
    await connection.query(`
      UPDATE users SET first_login = 0 WHERE password_hash IS NOT NULL
    `);
    
    // Add index if it doesn't exist
    const [existingIndexes] = await connection.query(`
      SHOW INDEX FROM users WHERE Key_name = 'idx_invitation_token'
    `);
    
    if (existingIndexes.length === 0) {
      await connection.query(`
        ALTER TABLE users ADD INDEX idx_invitation_token (invitation_token)
      `);
      console.log('✅ Added index: idx_invitation_token');
    }
    
    console.log('✅ Migration completed successfully');

    // Verify the columns were added
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'coding_platform' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('first_login', 'invitation_token', 'invitation_token_expiry')
    `);

    console.log('✅ Added columns:', columns.map(c => c.COLUMN_NAME).join(', '));

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

runMigration();
