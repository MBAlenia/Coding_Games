const { pool: db } = require('../database/db');
const redisService = require('../services/redisService');

const questionController = {
  // Get all questions (question library)
  getAllQuestions: async (req, res) => {
    try {
      const [questions] = await db.execute(`
        SELECT id, title, description, language, difficulty, created_at
        FROM questions 
        ORDER BY created_at DESC
      `);
      
      res.json(questions);
    } catch (error) {
      console.error('Error fetching all questions:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des questions' });
    }
  },

  // Get all questions for an assessment
  getQuestions: async (req, res) => {
    try {
      const { assessmentId } = req.params;
      
      // Check cache first (only if Redis is connected)
      let cachedQuestions = null;
      if (redisService.isConnected) {
        const cacheKey = redisService.constructor.keys.questions(assessmentId);
        cachedQuestions = await redisService.get(cacheKey);
        
        if (cachedQuestions) {
          console.log('📦 Questions loaded from cache for assessment:', assessmentId);
          return res.json(cachedQuestions);
        }
      }
      
      const [questions] = await db.execute(`
        SELECT id, title, description, language, difficulty, points, time_limit, created_at
        FROM questions 
        WHERE assessment_id = ? 
        ORDER BY created_at ASC
      `, [assessmentId]);
      
      // Cache the results for 1 hour (only if Redis is connected)
      if (redisService.isConnected) {
        const cacheKey = redisService.constructor.keys.questions(assessmentId);
        await redisService.set(cacheKey, questions, redisService.constructor.TTL.LONG);
        console.log('💾 Questions cached for assessment:', assessmentId);
      }
      
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des questions' });
    }
  },

  // Create new question (independent)
  createQuestion: async (req, res) => {
    try {
      const { title, description, template_code, language, difficulty, time_limit, points } = req.body;

      console.log('Creating question with data:', { title, description, template_code, language, difficulty, time_limit, points });

      // Validate required fields
      if (!title || !description) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: ['Title and description are required'] 
        });
      }

      // Insert question (independent of assessment)
      const [result] = await db.execute(`
        INSERT INTO questions (title, description, template_code, language, difficulty, time_limit, points, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        title, 
        description, 
        template_code || '', 
        language || 'javascript', 
        difficulty || 'intermediate',
        time_limit || 60,
        points || 10
      ]);

      res.status(201).json({
        id: result.insertId,
        message: 'Question créée avec succès'
      });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la question' });
    }
  },

  // Get question by ID (with user submissions if candidate)
  getQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Base query for question
      let questionQuery = `
        SELECT q.*, a.title as assessment_title, a.total_time as assessment_duration
        FROM questions q
        JOIN assessments a ON q.assessment_id = a.id
        WHERE q.id = ?
      `;

      const [questions] = await db.execute(questionQuery, [id]);

      if (questions.length === 0) {
        return res.status(404).json({ message: 'Question non trouvée' });
      }

      const question = questions[0];


      // If candidate, also get their submissions for this question
      if (userRole === 'candidate') {
        const [submissions] = await db.execute(`
          SELECT * FROM submissions 
          WHERE question_id = ? AND user_id = ? 
          ORDER BY created_at DESC
        `, [id, userId]);
        
        question.user_submissions = submissions;
      }

      res.json(question);
    } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update question (creator or admin only)
  updateQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, language, template_code, difficulty } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      console.log('Updating question with data:', { title, description, language, template_code, difficulty });

      // Validate required fields
      if (!title || !description) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: ['Title and description are required'] 
        });
      }

      // Update question
      const [result] = await db.execute(`
        UPDATE questions 
        SET title = ?, description = ?, language = ?, template_code = ?, difficulty = ?, updated_at = NOW()
        WHERE id = ?
      `, [title, description, language || 'javascript', template_code || '', difficulty || 'intermediate', id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Question non trouvée' });
      }

      res.json({ message: 'Question mise à jour avec succès' });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
  },

  // Delete question (creator or admin only)
  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Check if user can delete this question
      if (userRole !== 'admin') {
        const [questions] = await db.execute(`
          SELECT q.*, a.created_by 
          FROM questions q 
          JOIN assessments a ON q.assessment_id = a.id 
          WHERE q.id = ?
        `, [id]);

        if (questions.length === 0) {
          return res.status(404).json({ message: 'Question non trouvée' });
        }

        if (questions[0].created_by !== userId) {
          return res.status(403).json({ message: 'Accès refusé' });
        }
      }

      const [result] = await db.execute('DELETE FROM questions WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Question non trouvée' });
      }

      res.json({ message: 'Question supprimée avec succès' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  }
};

module.exports = questionController;
