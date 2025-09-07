const aiScoringService = require('./src/services/aiScoringService');
const { pool: db } = require('./src/database/db');
const { calculateAssessmentScore } = require('./src/controllers/assessmentScoringController');

async function testAIScoring() {
  console.log('Testing AI Scoring System');
  console.log('========================');

  try {
    // Test 1: Test AI scoring service directly
    console.log('\n1. Testing AI scoring service...');
    const testQuestion = "Écrivez une fonction JavaScript qui calcule la somme de deux nombres.";
    const testAnswer = "function sum(a, b) { return a + b; }";
    const maxScore = 100;

    const result = await aiScoringService.scoreAnswer(testQuestion, testAnswer, maxScore);
    console.log('AI Scoring Result:', result);

    // Test 2: Test batch scoring
    console.log('\n2. Testing batch scoring...');
    const batchSubmissions = [
      {
        question: "Écrivez une fonction qui inverse une chaîne de caractères.",
        answer: "function reverse(str) { return str.split('').reverse().join(''); }",
        maxScore: 100
      },
      {
        question: "Écrivez une requête SQL pour sélectionner tous les utilisateurs.",
        answer: "SELECT * FROM users;",
        maxScore: 50
      }
    ];

    const batchResults = await aiScoringService.scoreBatch(batchSubmissions);
    console.log('Batch Scoring Results:', batchResults);

    // Test 3: Test assessment score calculation
    console.log('\n3. Testing assessment score calculation...');
    
    // Check if we have test data
    const [testInvitations] = await db.execute(`
      SELECT ci.*, a.title as assessment_title
      FROM candidate_invitations ci
      JOIN assessments a ON ci.assessment_id = a.id
      WHERE ci.status IN ('started', 'completed')
      LIMIT 1
    `);

    if (testInvitations.length > 0) {
      const invitation = testInvitations[0];
      const assessmentScore = await calculateAssessmentScore(
        invitation.assessment_id, 
        invitation.candidate_email
      );
      console.log(`Assessment "${invitation.assessment_title}" score for ${invitation.candidate_email}: ${assessmentScore}%`);
    } else {
      console.log('No test invitations found for assessment score calculation');
    }

    // Test 4: Show current submission scores
    console.log('\n4. Current submission scores:');
    const [submissions] = await db.execute(`
      SELECT 
        s.id,
        u.email as candidate_email,
        q.title as question_title,
        s.score,
        q.max_score,
        s.status,
        s.submitted_at
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      JOIN questions q ON s.question_id = q.id
      ORDER BY s.submitted_at DESC
      LIMIT 10
    `);

    console.table(submissions);

    console.log('\n✅ AI Scoring test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Close database connection
    await db.end();
  }
}

// Run the test
testAIScoring();
