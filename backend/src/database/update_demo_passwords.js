const bcrypt = require('bcrypt');
const { pool } = require('./db');

async function updateDemoPasswords() {
  try {
    console.log('Updating demo account passwords...');
    
    // Hash the password 'password123'
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password123', saltRounds);
    
    console.log('Generated password hash for "password123"');
    
    // Update all demo accounts with the same password
    const emails = ['admin@test.com', 'recruiter@test.com', 'candidate@test.com'];
    
    for (const email of emails) {
      const [result] = await pool.execute(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [passwordHash, email]
      );
      
      if (result.affectedRows > 0) {
        console.log(`✓ Updated password for ${email}`);
      } else {
        console.log(`⚠ No user found with email ${email}`);
      }
    }
    
    console.log('\nDemo account passwords updated successfully!');
    console.log('All demo accounts now use password: password123');
    
  } catch (error) {
    console.error('Error updating demo passwords:', error);
  } finally {
    await pool.end();
  }
}

// Run the update
updateDemoPasswords();
