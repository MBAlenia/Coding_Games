const { pool: db } = require('../database/db');

const questionLibraryController = {
  // Get all shared questions with optional filters
  getSharedQuestions: async (req, res) => {
    try {
      const { technology, difficulty, tags, search } = req.query;
      
      let query = `
        SELECT 
          q.id, q.title, q.description, q.language, q.technology, 
          q.difficulty, q.tags, q.template_code,
          q.created_at,
          COUNT(DISTINCT aq.assessment_id) as used_count
        FROM questions q
        LEFT JOIN assessment_questions aq ON q.id = aq.question_id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (technology) {
        query += ' AND q.technology = ?';
        params.push(technology);
      }
      
      if (difficulty) {
        query += ' AND q.difficulty = ?';
        params.push(difficulty);
      }
      
      if (tags) {
        query += ' AND JSON_CONTAINS(q.tags, ?)';
        params.push(JSON.stringify([tags]));
      }
      
      if (search) {
        query += ' AND (q.title LIKE ? OR q.description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }
      
      query += ' GROUP BY q.id ORDER BY q.created_at DESC';
      
      const [questions] = await db.execute(query, params);
      
      // Parse JSON fields and format response
      const formattedQuestions = questions.map(q => ({
        ...q,
        tags: q.tags ? JSON.parse(q.tags) : [],
        created_by_email: 'system@example.com'
      }));
      
      res.json(formattedQuestions);
    } catch (error) {
      console.error('Error fetching shared questions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get questions by technology
  getQuestionsByTechnology: async (req, res) => {
    try {
      const { tech } = req.params;
      
      const [questions] = await db.execute(`
        SELECT 
          q.id, q.title, q.description, q.language, q.technology, 
          q.difficulty, q.tags, q.template_code,
          q.created_at, q.assessment_id
        FROM questions q
        WHERE q.technology = ?
        ORDER BY q.difficulty, q.created_at DESC
      `, [tech]);
      
      const formattedQuestions = questions.map(q => ({
        ...q,
        tags: q.tags ? JSON.parse(q.tags) : [],
        created_by_email: 'system@example.com'
      }));
      
      res.json(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions by technology:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get questions by difficulty
  getQuestionsByDifficulty: async (req, res) => {
    try {
      const { level } = req.params;
      
      const [questions] = await db.execute(`
        SELECT 
          q.id, q.title, q.description, q.language, q.technology, 
          q.difficulty, q.tags, q.template_code,
          q.created_at, q.assessment_id
        FROM questions q
        WHERE q.difficulty = ?
        ORDER BY q.technology, q.created_at DESC
      `, [level]);
      
      const formattedQuestions = questions.map(q => ({
        ...q,
        tags: q.tags ? JSON.parse(q.tags) : [],
        created_by_email: 'system@example.com'
      }));
      
      res.json(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions by difficulty:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Create new shared question
  createSharedQuestion: async (req, res) => {
    try {
      const { title, description, language, technology, difficulty, tags, template_code } = req.body;
      
      const [result] = await db.execute(`
        INSERT INTO questions 
        (title, description, language, technology, difficulty, tags, template_code)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        title, 
        description, 
        language, 
        technology, 
        difficulty, 
        JSON.stringify(tags || []), 
        template_code
      ]);
      
      const [newQuestion] = await db.execute(`
        SELECT * FROM questions WHERE id = ?
      `, [result.insertId]);
      
      const formattedQuestion = {
        ...newQuestion[0],
        tags: newQuestion[0].tags ? JSON.parse(newQuestion[0].tags) : [],
        created_by_email: 'system@example.com'
      };
      
      res.status(201).json({
        message: 'Question created successfully',
        question: formattedQuestion
      });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update shared question
  updateSharedQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, language, technology, difficulty, tags, template_code } = req.body;
      
      // Check if question exists and user has permission
      const [questions] = await db.execute('SELECT * FROM questions WHERE id = ?', [id]);
      
      if (questions.length === 0) {
        return res.status(404).json({ message: 'Question not found' });
      }
      
      const question = questions[0];
      
      // Check permissions (admin or creator)
      if (req.user.role !== 'admin' && question.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      await db.execute(`
        UPDATE questions 
        SET title = ?, description = ?, language = ?, technology = ?, 
            difficulty = ?, tags = ?, template_code = ?
        WHERE id = ?
      `, [
        title, 
        description, 
        language, 
        technology, 
        difficulty, 
        JSON.stringify(tags || []), 
        template_code, 
        id
      ]);
      
      res.json({ message: 'Question updated successfully' });
    } catch (error) {
      console.error('Error updating shared question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Delete shared question
  deleteSharedQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if question exists and user has permission
      const [questions] = await db.execute('SELECT * FROM questions WHERE id = ?', [id]);
      
      if (questions.length === 0) {
        return res.status(404).json({ message: 'Question not found' });
      }
      
      const question = questions[0];
      
      // Check permissions (admin or creator)
      if (req.user.role !== 'admin' && question.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Check if question is used in any assessments
      const [assessmentQuestions] = await db.execute(
        'SELECT COUNT(*) as count FROM assessment_questions WHERE question_id = ?', 
        [id]
      );
      
      if (assessmentQuestions[0].count > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete question that is used in assessments' 
        });
      }
      
      await db.execute('DELETE FROM questions WHERE id = ?', [id]);
      
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Error deleting shared question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Add questions to assessment
  addQuestionsToAssessment: async (req, res) => {
    try {
      const { assessmentId, questionIds } = req.body;
      
      if (!assessmentId || !questionIds || !Array.isArray(questionIds)) {
        return res.status(400).json({ message: 'Assessment ID and question IDs array are required' });
      }
      
      // Check if assessment exists and user has permission
      const [assessments] = await db.execute('SELECT * FROM assessments WHERE id = ?', [assessmentId]);
      
      if (assessments.length === 0) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
      
      const assessment = assessments[0];
      
      // Check permissions
      if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Get current max order_index for this assessment
      const [maxOrder] = await db.execute(`
        SELECT COALESCE(MAX(order_index), 0) as max_order 
        FROM assessment_questions 
        WHERE assessment_id = ?
      `, [assessmentId]);
      
      let startOrder = maxOrder[0].max_order + 1;
      
      // Add questions to assessment
      const insertPromises = questionIds.map((questionId, index) => {
        return db.execute(`
          INSERT IGNORE INTO assessment_questions (assessment_id, question_id, order_index, points)
          VALUES (?, ?, ?, 10)
        `, [assessmentId, questionId, startOrder + index]);
      });
      
      await Promise.all(insertPromises);
      
      res.json({ 
        message: 'Questions added to assessment successfully',
        addedCount: questionIds.length
      });
    } catch (error) {
      console.error('Error adding questions to assessment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = questionLibraryController;
