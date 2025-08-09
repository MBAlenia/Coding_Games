const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateAssessment, validateAssessmentUpdate, validateQuestion } = require('../middleware/validation');

// Get all assessments (role-based filtering)
router.get('/', authenticateToken, assessmentController.getAssessments);

// Create new assessment (recruiters and admins only)
router.post('/', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  validateAssessment, 
  assessmentController.createAssessment
);

// Get specific assessment with questions
router.get('/:id', authenticateToken, assessmentController.getAssessment);

// Update assessment (creator or admin only)
router.put('/:id', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  validateAssessmentUpdate, 
  assessmentController.updateAssessment
);

// Delete assessment (creator or admin only)
router.delete('/:id', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  assessmentController.deleteAssessment
);

// Add question to assessment (creator or admin only)
router.post('/:id/questions', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  validateQuestion, 
  assessmentController.addQuestion
);

// Get assessment results (creator or admin only)
router.get('/:id/results', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  assessmentController.getAssessmentResults
);

// Send invitation for assessment (creator or admin only)
router.post('/:id/invitations',
  authenticateToken,
  requireRole(['recruiter', 'admin']),
  assessmentController.sendInvitation
);

module.exports = router;
