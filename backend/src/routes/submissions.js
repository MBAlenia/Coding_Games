const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Submit code for a question
router.post('/questions/:questionId', 
  authenticateToken, 
  submissionController.submitCode
);

// Get specific submission status
router.get('/:submissionId', authenticateToken, submissionController.getSubmissionStatus);

// Get user's submissions
router.get('/users/me', authenticateToken, submissionController.getUserSubmissions);

// Test code execution (for development/testing)
router.post('/test', 
  authenticateToken, 
  submissionController.runTestCode
);

module.exports = router;
