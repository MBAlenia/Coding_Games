const { pool: db } = require('../database/db');
const fs = require('fs').promises;
const path = require('path');

async function runMigration() {
  try {
    console.log('🔄 Running invitations table migration...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../../migrations/create_invitations_table.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    
    // Execute the migration
    await db.execute(sql);
    
    console.log('✅ Invitations table created successfully!');
    
    // Check if table was created
    const [tables] = await db.execute("SHOW TABLES LIKE 'invitations'");
    if (tables.length > 0) {
      console.log('✅ Table verified: invitations exists');
      
      // Show table structure
      const [columns] = await db.execute("DESCRIBE invitations");
      console.log('\n📋 Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
