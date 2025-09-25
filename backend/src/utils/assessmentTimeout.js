const { pool: db } = require('../database/db');
const { calculateAssessmentScore } = require('../controllers/assessmentScoringController');

/**
 * Check and auto-complete timed out assessments for a candidate
 * @param {string} candidateEmail - The candidate's email
 * @returns {Promise<number>} - Number of assessments that were auto-completed
 */
exports.checkAndCompleteTimedOutAssessments = async (candidateEmail) => {
  try {
    // Find all started assessments for this candidate that might be timed out
    const [timedOutAssessments] = await db.execute(`
      SELECT 
        i.id,
        i.assessment_id,
        i.created_at as started_at,
        a.duration,
        i.candidate_email,
        NULL as score
      FROM invitations i
      JOIN assessments a ON i.assessment_id = a.id
      WHERE i.candidate_email = ? 
        AND i.status = 'pending'
        AND i.created_at IS NOT NULL
        AND TIMESTAMPDIFF(MINUTE, i.created_at, NOW()) >= a.duration
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
    // For now, we'll just update the status to 'completed' since we don't have scoring implemented
    await db.execute(`
      UPDATE invitations 
      SET 
        status = 'completed',
        expires_at = NOW()
      WHERE id = ?
    `, [assessment.id]);

    console.log(`Auto-completed assessment ${assessment.assessment_id} for ${assessment.candidate_email}`);
  } catch (error) {
    console.error(`Error auto-completing assessment ${assessment.assessment_id}:`, error);
  }
};

/**
 * Check all timed out assessments across all candidates (for scheduled jobs)
 * @returns {Promise<number>} - Number of assessments that were auto-completed
 */
exports.checkAllTimedOutAssessments = async () => {
  try {
    // Find all started assessments that are timed out
    const [timedOutAssessments] = await db.execute(`
      SELECT 
        i.id,
        i.assessment_id,
        i.created_at as started_at,
        a.duration,
        i.candidate_email,
        NULL as score
      FROM invitations i
      JOIN assessments a ON i.assessment_id = a.id
      WHERE i.status = 'pending'
        AND i.created_at IS NOT NULL
        AND TIMESTAMPDIFF(MINUTE, i.created_at, NOW()) >= a.duration
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
