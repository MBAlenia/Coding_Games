const express = require('express');
const router = express.Router();
const questionLibraryController = require('../controllers/questionLibraryController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all shared questions with filters
router.get('/', authenticateToken, questionLibraryController.getSharedQuestions);

// Get questions by technology
router.get('/technology/:tech', authenticateToken, questionLibraryController.getQuestionsByTechnology);

// Get questions by difficulty
router.get('/difficulty/:level', authenticateToken, questionLibraryController.getQuestionsByDifficulty);

// Create new shared question (recruiters and admins only)
router.post('/', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  questionLibraryController.createSharedQuestion
);

// Update shared question (creator or admin only)
router.put('/:id', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  questionLibraryController.updateSharedQuestion
);

// Delete shared question (creator or admin only)
router.delete('/:id', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  questionLibraryController.deleteSharedQuestion
);

// Add questions to assessment
router.post('/add-to-assessment', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  questionLibraryController.addQuestionsToAssessment
);

module.exports = router;
