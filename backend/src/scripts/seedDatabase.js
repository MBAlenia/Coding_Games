const { pool } = require('../database/db');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Question = require('../models/Question');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@codingplatform.com',
      password: 'Admin123!',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Create recruiter user
    const recruiter = await User.create({
      username: 'recruiter1',
      email: 'recruiter@company.com',
      password: 'Recruiter123!',
      role: 'recruiter'
    });
    console.log('✅ Recruiter user created');

    // Create candidate user
    const candidate = await User.create({
      username: 'candidate1',
      email: 'candidate@email.com',
      password: 'Candidate123!',
      role: 'candidate'
    });
    console.log('✅ Candidate user created');

    // Create sample assessment
    const assessment = await Assessment.create({
      title: 'JavaScript Developer Assessment',
      description: 'A comprehensive assessment to evaluate JavaScript programming skills',
      created_by: recruiter.id
    });
    console.log('✅ Sample assessment created');

    // Create sample questions
    const question1 = await Question.create({
      assessment_id: assessment.id,
      title: 'Array Sum',
      description: 'Write a function that takes an array of numbers and returns their sum.',
      language: 'javascript',
      template_code: `function sum(numbers) {
  // Your code here
  
}`,
      test_cases: [
        { input: [1, 2, 3, 4, 5], expected: 15 },
        { input: [10, -5, 3], expected: 8 },
        { input: [], expected: 0 },
        { input: [100], expected: 100 }
      ]
    });

    const question2 = await Question.create({
      assessment_id: assessment.id,
      title: 'Palindrome Check',
      description: 'Write a function that checks if a given string is a palindrome (reads the same forwards and backwards).',
      language: 'javascript',
      template_code: `function isPalindrome(str) {
  // Your code here
  
}`,
      test_cases: [
        { input: 'racecar', expected: true },
        { input: 'hello', expected: false },
        { input: 'A man a plan a canal Panama', expected: true },
        { input: '', expected: true }
      ]
    });

    const question3 = await Question.create({
      assessment_id: assessment.id,
      title: 'Fibonacci Sequence',
      description: 'Write a function that returns the nth number in the Fibonacci sequence.',
      language: 'javascript',
      template_code: `function fibonacci(n) {
  // Your code here
  
}`,
      test_cases: [
        { input: 0, expected: 0 },
        { input: 1, expected: 1 },
        { input: 5, expected: 5 },
        { input: 10, expected: 55 }
      ]
    });

    console.log('✅ Sample questions created');

    // Create Python assessment
    const pythonAssessment = await Assessment.create({
      title: 'Python Developer Assessment',
      description: 'Test your Python programming skills',
      created_by: recruiter.id
    });

    const pythonQuestion = await Question.create({
      assessment_id: pythonAssessment.id,
      title: 'List Comprehension',
      description: 'Write a function that returns a list of squares of even numbers from 1 to n.',
      language: 'python',
      template_code: `def even_squares(n):
    # Your code here
    pass`,
      test_cases: [
        { input: 10, expected: [4, 16, 36, 64, 100] },
        { input: 5, expected: [4, 16] },
        { input: 1, expected: [] },
        { input: 6, expected: [4, 16, 36] }
      ]
    });

    console.log('✅ Python assessment and question created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@codingplatform.com / Admin123!');
    console.log('Recruiter: recruiter@company.com / Recruiter123!');
    console.log('Candidate: candidate@email.com / Candidate123!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️  Some data already exists. Skipping...');
    } else {
      throw error;
    }
  } finally {
    await pool.end();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = seedDatabase;
