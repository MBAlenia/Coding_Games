const bcrypt = require('bcrypt');

const password = 'Test123!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  console.log('Password hash for "Test123!":', hash);
  console.log('\nSQL Update command:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'candidate@test.com';`);
});
