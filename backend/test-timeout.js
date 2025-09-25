const { checkAndCompleteTimedOutAssessments, checkAllTimedOutAssessments } = require('./src/utils/assessmentTimeout');
const { pool: db } = require('./src/database/db');

async function testTimeoutFunctionality() {
  console.log('Testing Assessment Timeout Functionality');
  console.log('=====================================');

  try {
    // Test 1: Check for a specific candidate
    console.log('\n1. Testing timeout check for specific candidate...');
    const candidateEmail = 'candidate@test.com';
    const completedCount = await checkAndCompleteTimedOutAssessments(candidateEmail);
    console.log(`Result: ${completedCount} assessments auto-completed for ${candidateEmail}`);

    // Test 2: Check all timed out assessments
    console.log('\n2. Testing timeout check for all candidates...');
    const totalCompleted = await checkAllTimedOutAssessments();
    console.log(`Result: ${totalCompleted} assessments auto-completed across all candidates`);

    // Test 3: Show current status of assessments
    console.log('\n3. Current assessment statuses:');
    const [assessments] = await db.execute(`
      SELECT 
        ci.candidate_email,
        a.title as assessment_title,
        ci.status,
        ci.started_at,
        a.duration,
        ci.score,
        CASE 
          WHEN ci.started_at IS NOT NULL AND ci.status = 'started' 
          THEN TIMESTAMPDIFF(MINUTE, ci.started_at, NOW())
          ELSE NULL 
        END as minutes_elapsed
      FROM invitations ci
      JOIN assessments a ON ci.assessment_id = a.id
      WHERE ci.status IN ('started', 'completed')
      ORDER BY ci.candidate_email, ci.started_at DESC
    `);

    console.table(assessments);

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Close database connection
    await db.end();
  }
}

// Run the test
testTimeoutFunctionality();
