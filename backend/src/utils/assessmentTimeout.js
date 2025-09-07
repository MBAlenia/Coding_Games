const { pool: db } = require('../database/db');
const { calculateAssessmentScore } = require('../controllers/assessmentScoringController');

/**
 * Check and auto-complete timed out assessments for a candidate
 * @param {string} candidateEmail - The candidate's email
 * @returns {Promise<number>} - Number of assessments that were auto-completed
 */
const checkAndCompleteTimedOutAssessments = async (candidateEmail) => {
  try {
    // Find all started assessments for this candidate that might be timed out
    const [timedOutAssessments] = await db.execute(`
      SELECT 
        ci.id,
        ci.assessment_id,
        ci.started_at,
        a.duration,
        ci.candidate_email,
        ci.score
      FROM candidate_invitations ci
      JOIN assessments a ON ci.assessment_id = a.id
      WHERE ci.candidate_email = ? 
        AND ci.status = 'started'
        AND ci.started_at IS NOT NULL
        AND TIMESTAMPDIFF(MINUTE, ci.started_at, NOW()) >= a.duration
    `, [candidateEmail]);

    if (timedOutAssessments.length === 0) {
      return 0;
    }

    console.log(`Found ${timedOutAssessments.length} timed out assessments for ${candidateEmail}`);

    // Auto-complete each timed out assessment
    for (const assessment of timedOutAssessments) {
      await autoCompleteAssessment(assessment);
    }

    return timedOutAssessments.length;
  } catch (error) {
    console.error('Error checking timed out assessments:', error);
    return 0;
  }
};

/**
 * Auto-complete a single timed out assessment
 * @param {Object} assessment - Assessment data from the query
 */
const autoCompleteAssessment = async (assessment) => {
  try {
    // Calculate the final score based on existing submissions
    const finalScore = await calculateAssessmentScore(assessment.assessment_id, assessment.candidate_email);
    
    // Update the invitation status to completed
    await db.execute(`
      UPDATE candidate_invitations 
      SET 
        status = 'completed',
        completed_at = NOW(),
        score = ?
      WHERE id = ?
    `, [finalScore, assessment.id]);

    console.log(`Auto-completed assessment ${assessment.assessment_id} for ${assessment.candidate_email} with score: ${finalScore}`);
  } catch (error) {
    console.error(`Error auto-completing assessment ${assessment.assessment_id}:`, error);
  }
};

/**
 * Calculate final score based on existing submissions (average of answered questions)
 * @param {number} assessmentId - The assessment ID
 * @param {string} candidateEmail - The candidate's email
 * @returns {Promise<number>} - The calculated final score (average percentage)
 */
const calculateFinalScore = async (assessmentId, candidateEmail) => {
  try {
    // Get the candidate's user ID
    const [users] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [candidateEmail]
    );

    if (users.length === 0) {
      return 0; // No user found, return 0 score
    }

    const userId = users[0].id;

    // Get all questions for this assessment with their submissions
    const [questionsWithSubmissions] = await db.execute(`
      SELECT 
        aq.question_id,
        q.max_score,
        s.score as submission_score
      FROM assessment_questions aq
      JOIN questions q ON aq.question_id = q.id
      LEFT JOIN submissions s ON s.question_id = q.id AND s.user_id = ?
      WHERE aq.assessment_id = ?
      ORDER BY aq.order_index
    `, [userId, assessmentId]);

    if (questionsWithSubmissions.length === 0) {
      return 0; // No questions found
    }

    // Calculate average score from answered questions only
    let totalScore = 0;
    let answeredQuestions = 0;

    for (const question of questionsWithSubmissions) {
      if (question.submission_score !== null) {
        // Calculate percentage for this question
        const questionMaxScore = question.max_score || 100;
        const questionPercentage = (question.submission_score / questionMaxScore) * 100;
        totalScore += questionPercentage;
        answeredQuestions++;
      }
    }

    // Return average percentage of answered questions
    const finalScore = answeredQuestions > 0 ? totalScore / answeredQuestions : 0;
    
    return Math.round(finalScore * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Error calculating final score:', error);
    return 0;
  }
};

/**
 * Check all timed out assessments across all candidates (for scheduled jobs)
 * @returns {Promise<number>} - Number of assessments that were auto-completed
 */
const checkAllTimedOutAssessments = async () => {
  try {
    // Find all started assessments that are timed out
    const [timedOutAssessments] = await db.execute(`
      SELECT 
        ci.id,
        ci.assessment_id,
        ci.started_at,
        a.duration,
        ci.candidate_email,
        ci.score
      FROM candidate_invitations ci
      JOIN assessments a ON ci.assessment_id = a.id
      WHERE ci.status = 'started'
        AND ci.started_at IS NOT NULL
        AND TIMESTAMPDIFF(MINUTE, ci.started_at, NOW()) >= a.duration
    `);

    if (timedOutAssessments.length === 0) {
      return 0;
    }

    console.log(`Found ${timedOutAssessments.length} timed out assessments across all candidates`);

    // Auto-complete each timed out assessment
    for (const assessment of timedOutAssessments) {
      await autoCompleteAssessment(assessment);
    }

    return timedOutAssessments.length;
  } catch (error) {
    console.error('Error checking all timed out assessments:', error);
    return 0;
  }
};

module.exports = {
  checkAndCompleteTimedOutAssessments,
  checkAllTimedOutAssessments
};
