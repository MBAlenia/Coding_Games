const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Create invitation for assessment (creator or admin only)
router.post('/assessments/:assessmentId/invitations', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  invitationController.sendInvitation
);

// Get invitations for assessment (creator or admin only)
router.get('/assessments/:assessmentId/invitations', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  invitationController.getAssessmentInvitations
);

// Validate invitation token (public route)
router.get('/invitations/validate/:token', 
  invitationController.validateInvitation
);

// Accept invitation (public route)
router.post('/invitations/accept/:token', 
  invitationController.acceptInvitation
);

// Delete invitation (creator or admin only)
router.delete('/invitations/:id', 
  authenticateToken, 
  requireRole(['recruiter', 'admin']), 
  invitationController.deleteInvitation
);

module.exports = router;
