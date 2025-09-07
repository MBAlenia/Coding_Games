const { pool: db } = require('../database/db');
const aiScoringService = require('../services/aiScoringService');

// Simplified submission controller without queue for now
// TODO: Re-implement queue system when needed

const submitCode = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { code, language } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!code || !language) {
      return res.status(400).json({ 
        message: 'Code and language are required' 
      });
    }

    // Get question details
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE id = ?',
      [questionId]
    );

    if (questions.length === 0) {
      return res.status(404).json({ 
        message: 'Question not found' 
      });
    }

    const question = questions[0];

    // Validate language matches question requirements
    if (language.toLowerCase() !== question.language.toLowerCase()) {
      return res.status(400).json({ 
        message: `Language mismatch. Expected: ${question.language}, Got: ${language}` 
      });
    }

    // Test cases no longer needed with AI scoring
    // Skip test case parsing since AI evaluates directly

    // Create submission record with pending status
    const [result] = await db.execute(
      `INSERT INTO submissions (user_id, question_id, code, language, status, submitted_at) 
       VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [userId, questionId, code, language]
    );

    const submissionId = result.insertId;

    // Évaluer la réponse avec l'IA
    try {
      const questionText = `${question.title}\n\n${question.description}`;
      const aiResult = await aiScoringService.scoreAnswer(
        questionText, 
        code, 
        question.max_score
      );

      // Mettre à jour la soumission avec le score de l'IA
      await db.execute(
        `UPDATE submissions 
         SET status = 'passed', score = ?, test_results = ?, executed_at = NOW()
         WHERE id = ?`,
        [aiResult.score, JSON.stringify({ ai_feedback: aiResult.feedback }), submissionId]
      );

      res.status(201).json({
        message: 'Code submitted and evaluated successfully',
        submissionId,
        status: 'passed',
        score: aiResult.score,
        maxScore: question.max_score,
        feedback: aiResult.feedback
      });

    } catch (aiError) {
      console.error('AI scoring error:', aiError);
      
      // Fallback: marquer comme completed avec score 0
      await db.execute(
        `UPDATE submissions 
         SET status = 'error', score = 0, error_message = ?, executed_at = NOW()
         WHERE id = ?`,
        ['AI scoring failed', submissionId]
      );

      res.status(201).json({
        message: 'Code submitted but scoring failed',
        submissionId,
        status: 'error',
        score: 0,
        maxScore: question.max_score,
        feedback: 'Erreur lors de l\'évaluation automatique'
      });
    }

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ 
      message: 'Failed to submit code',
      error: error.message 
    });
  }
};

const getSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user.id;

    const [submissions] = await db.execute(
      `SELECT s.*, q.title as question_title, q.difficulty 
       FROM submissions s
       JOIN questions q ON s.question_id = q.id
       WHERE s.id = ? AND s.user_id = ?`,
      [submissionId, userId]
    );

    if (submissions.length === 0) {
      return res.status(404).json({ 
        message: 'Submission not found' 
      });
    }

    const submission = submissions[0];
    
    // Parse results if available
    if (submission.results) {
      try {
        submission.results = JSON.parse(submission.results);
      } catch (error) {
        console.error('Failed to parse results:', error);
      }
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ 
      message: 'Failed to fetch submission status' 
    });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { questionId, status, limit = 10, offset = 0 } = req.query;

    let query = `
      SELECT s.*, q.title as question_title, q.difficulty, a.title as assessment_title
      FROM submissions s
      JOIN questions q ON s.question_id = q.id
      LEFT JOIN assessments a ON q.assessment_id = a.id
      WHERE s.user_id = ?
    `;
    
    const params = [userId];

    if (questionId) {
      query += ' AND s.question_id = ?';
      params.push(questionId);
    }

    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }

    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [submissions] = await db.execute(query, params);

    // Parse results for each submission
    submissions.forEach(submission => {
      if (submission.results) {
        try {
          submission.results = JSON.parse(submission.results);
        } catch (error) {
          console.error('Failed to parse results:', error);
        }
      }
    });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ 
      message: 'Failed to fetch submissions' 
    });
  }
};

const runTestCode = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    // Validate input
    if (!code || !language || !testCases) {
      return res.status(400).json({ 
        message: 'Code, language, and test cases are required' 
      });
    }

    // Validate test cases format
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ 
        message: 'Test cases must be a non-empty array' 
      });
    }

    // For now, return mock results
    // TODO: Implement actual code execution when docker executor is ready
    const mockResults = testCases.map((testCase, index) => ({
      testCase: index + 1,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: "Mock output", // Placeholder
      passed: Math.random() > 0.5, // Random pass/fail for demo
      executionTime: Math.floor(Math.random() * 100) + 10
    }));

    res.json({
      success: true,
      results: mockResults,
      passedTests: mockResults.filter(r => r.passed).length,
      totalTests: mockResults.length
    });

  } catch (error) {
    console.error('Test execution error:', error);
    res.status(500).json({ 
      message: 'Failed to execute test code',
      error: error.message 
    });
  }
};

module.exports = {
  submitCode,
  getSubmissionStatus,
  getUserSubmissions,
  runTestCode
};
