const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all questions (question library)
router.get('/', authenticateToken, questionController.getAllQuestions);

// Get all questions for an assessment
router.get('/assessment/:assessmentId', authenticateToken, questionController.getQuestions);

// Create new question (independent)
router.post('/', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  questionController.createQuestion
);

// Get specific question (with user's submissions if candidate)
router.get('/:id', authenticateToken, questionController.getQuestion);

// Update question (creator or admin only)
router.put('/:id', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  questionController.updateQuestion
);

// Delete question (creator or admin only)
router.delete('/:id', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  questionController.deleteQuestion
);

module.exports = router;
