const express = require('express');
const router = express.Router();
const { pool: db } = require('../database/db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all questions for the question library
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { technology, difficulty, search } = req.query;
    
    let query = `
      SELECT id, title, description, language, created_at
      FROM questions 
      WHERE 1=1
    `;
    const params = [];

    // Remove technology and difficulty filters for now since columns may not exist
    // if (technology) {
    //   query += ' AND technology = ?';
    //   params.push(technology);
    // }

    // if (difficulty) {
    //   query += ' AND difficulty = ?';
    //   params.push(difficulty);
    // }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [questions] = await db.execute(query, params);
    
    // Return questions without tag parsing for now
    const formattedQuestions = questions.map(q => ({
      ...q,
      technology: 'JavaScript', // Default value
      difficulty: 'intermediate', // Default value
      tags: [] // Default empty array
    }));
    
    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching question library:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Add questions to assessment
router.post('/add-to-assessment', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  async (req, res) => {
    try {
      const { assessmentId, questionIds } = req.body;

      if (!assessmentId || !questionIds || !Array.isArray(questionIds)) {
        return res.status(400).json({ message: 'Assessment ID and question IDs are required' });
      }

      // Check if assessment exists
      const [assessments] = await db.execute('SELECT id FROM assessments WHERE id = ?', [assessmentId]);
      if (assessments.length === 0) {
        return res.status(404).json({ message: 'Assessment not found' });
      }

      // Get current max order for this assessment
      const [orderResult] = await db.execute(
        'SELECT COALESCE(MAX(order_index), 0) as max_order FROM assessment_questions WHERE assessment_id = ?',
        [assessmentId]
      );
      let nextOrder = orderResult[0].max_order + 1;

      // Add each question to the assessment
      for (const questionId of questionIds) {
        // Check if question exists
        const [questions] = await db.execute('SELECT id FROM questions WHERE id = ?', [questionId]);
        if (questions.length === 0) {
          continue; // Skip non-existent questions
        }

        // Check if already linked
        const [existing] = await db.execute(
          'SELECT id FROM assessment_questions WHERE assessment_id = ? AND question_id = ?',
          [assessmentId, questionId]
        );
        
        if (existing.length === 0) {
          // Add the link
          await db.execute(
            'INSERT INTO assessment_questions (assessment_id, question_id, order_index, points) VALUES (?, ?, ?, ?)',
            [assessmentId, questionId, nextOrder, 10]
          );
          nextOrder++;
        }
      }

      res.status(201).json({
        message: `Questions added to assessment successfully`
      });
    } catch (error) {
      console.error('Error adding questions to assessment:', error);
      res.status(500).json({ message: 'Error adding questions to assessment' });
    }
  }
);

module.exports = router;
