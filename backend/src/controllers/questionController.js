const { pool: db } = require('../database/db');

const questionController = {
  // Get all questions for an assessment
  getQuestions: async (req, res) => {
    try {
      const { assessmentId } = req.params;
      
      const [questions] = await db.execute(`
        SELECT id, title, description, language, difficulty, points, time_limit, created_at
        FROM questions 
        WHERE assessment_id = ? 
        ORDER BY created_at ASC
      `, [assessmentId]);
      
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des questions' });
    }
  },

  // Create new question
  createQuestion: async (req, res) => {
    try {
      const { assessmentId } = req.params;
      const {
        title, description, initial_code, language, difficulty,
        points, time_limit, test_cases
      } = req.body;

      // Validate required fields
      if (!title || !description || !language) {
        return res.status(400).json({ message: 'Titre, description et langage sont requis' });
      }

      // Insert question
      const [result] = await db.execute(`
        INSERT INTO questions (
          assessment_id, title, description, initial_code, language,
          difficulty, points, time_limit, test_cases, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        assessmentId, title, description, initial_code || '', language,
        difficulty || 'medium', points || 100, time_limit || 30,
        JSON.stringify(test_cases || [])
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

      // Parse test_cases if it's a JSON string
      if (question.test_cases && typeof question.test_cases === 'string') {
        try {
          question.test_cases = JSON.parse(question.test_cases);
        } catch (e) {
          question.test_cases = [];
        }
      }

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
      const { title, description, language, initial_code, test_cases, points, time_limit, difficulty } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Check if user can update this question
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

      // Update question
      const [result] = await db.execute(`
        UPDATE questions 
        SET title = ?, description = ?, language = ?, initial_code = ?, 
            test_cases = ?, points = ?, time_limit = ?, difficulty = ?
        WHERE id = ?
      `, [title, description, language, initial_code || '', JSON.stringify(test_cases || []), points || 100, time_limit || 30, difficulty || 'medium', id]);

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
