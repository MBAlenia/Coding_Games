const { pool: db } = require('../database/db');

/**
 * Calculate and return detailed assessment results for a candidate
 * @param {number} assessmentId - The assessment ID
 * @param {string} candidateEmail - The candidate's email
 * @returns {Promise<Object>} - Detailed assessment results
 */
const getAssessmentResults = async (assessmentId, candidateEmail) => {
  try {
    console.log('=== CALCUL RÉSULTATS ASSESSMENT ===');
    console.log('Assessment ID:', assessmentId);
    console.log('Email candidat:', candidateEmail);
    
    // Get the candidate's user ID
    const [users] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [candidateEmail]
    );

    if (users.length === 0) {
      throw new Error('Candidate not found');
    }

    const userId = users[0].id;
    console.log('User ID candidat:', userId);

    // Get assessment details
    const [assessments] = await db.execute(
      'SELECT title, description, duration FROM assessments WHERE id = ?',
      [assessmentId]
    );

    if (assessments.length === 0) {
      throw new Error('Assessment not found');
    }

    const assessment = assessments[0];

    // Get all questions for this assessment with submissions
    const [questionsWithSubmissions] = await db.execute(`
      SELECT 
        q.id as question_id,
        q.title as question_title,
        q.description as question_description,
        q.max_score,
        aq.order_index,
        s.id as submission_id,
        s.code as candidate_answer,
        s.score as question_score,
        s.status as submission_status,
        s.submitted_at,
        s.test_results
      FROM assessment_questions aq
      JOIN questions q ON aq.question_id = q.id
      LEFT JOIN submissions s ON s.question_id = q.id AND s.user_id = ?
      WHERE aq.assessment_id = ?
      ORDER BY aq.order_index
    `, [userId, assessmentId]);

    console.log('Questions trouvées:', questionsWithSubmissions.length);
    
    // Calculate statistics
    let totalScore = 0;
    let answeredQuestions = 0;
    let totalQuestions = questionsWithSubmissions.length;

    const questionResults = questionsWithSubmissions.map(question => {
      const hasAnswer = question.submission_id !== null;
      const questionScore = question.question_score || 0;
      const maxScore = question.max_score || 100;
      const percentage = hasAnswer ? (questionScore / maxScore) * 100 : 0;

      console.log(`Question ${question.question_id}: Score=${questionScore}/${maxScore}, Pourcentage=${percentage}%`);

      if (hasAnswer) {
        totalScore += percentage;
        answeredQuestions++;
      }

      return {
        questionId: question.question_id,
        title: question.question_title,
        description: question.question_description,
        maxScore: maxScore,
        answered: hasAnswer,
        candidateAnswer: question.candidate_answer || null,
        score: questionScore,
        percentage: Math.round(percentage * 100) / 100,
        submittedAt: question.submitted_at,
        feedback: question.test_results ? JSON.parse(question.test_results).ai_feedback : null
      };
    });

    // Calculate final average score
    const averageScore = answeredQuestions > 0 ? totalScore / answeredQuestions : 0;
    
    console.log('=== CALCUL SCORE FINAL ===');
    console.log('Questions répondues:', answeredQuestions);
    console.log('Score total cumulé:', totalScore);
    console.log('Score moyen final:', averageScore);
    console.log('=== FIN CALCUL ===\n');

    return {
      assessment: {
        id: assessmentId,
        title: assessment.title,
        description: assessment.description,
        duration: assessment.duration
      },
      candidate: {
        email: candidateEmail
      },
      results: {
        totalQuestions,
        answeredQuestions,
        unansweredQuestions: totalQuestions - answeredQuestions,
        averageScore: Math.round(averageScore * 100) / 100,
        questionResults
      }
    };

  } catch (error) {
    console.error('Error calculating assessment results:', error);
    throw error;
  }
};

/**
 * API endpoint to get assessment results
 */
const getAssessmentResultsAPI = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const candidateEmail = req.user.email;

    const results = await getAssessmentResults(assessmentId, candidateEmail);
    
    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Error fetching assessment results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment results',
      error: error.message
    });
  }
};

/**
 * Calculate final score for assessment completion (used by timeout system)
 * @param {number} assessmentId - The assessment ID
 * @param {string} candidateEmail - The candidate's email
 * @returns {Promise<number>} - The calculated average score
 */
const calculateAssessmentScore = async (assessmentId, candidateEmail) => {
  try {
    const results = await getAssessmentResults(assessmentId, candidateEmail);
    return results.results.averageScore;
  } catch (error) {
    console.error('Error calculating assessment score:', error);
    return 0;
  }
};

module.exports = {
  getAssessmentResults,
  getAssessmentResultsAPI,
  calculateAssessmentScore
};
