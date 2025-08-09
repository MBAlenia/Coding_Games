const express = require('express');
const router = express.Router();
const candidateInvitationController = require('../controllers/candidateInvitationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Candidate routes (requires candidate authentication)
router.get('/my-invitations', authenticateToken, candidateInvitationController.getCandidateInvitations);
router.get('/my-submissions', authenticateToken, candidateInvitationController.getCandidateSubmissions);
router.post('/set-password', authenticateToken, candidateInvitationController.setPassword);
router.post('/start-test', authenticateToken, candidateInvitationController.startTestSession);
router.post('/end-test', authenticateToken, candidateInvitationController.endTestSession);
router.get('/active-sessions', authenticateToken, candidateInvitationController.getActiveTestSessions);

// Recruiter routes (requires recruiter/admin authentication)
router.post('/create', authenticateToken, requireRole(['recruiter', 'admin']), candidateInvitationController.createInvitations);

module.exports = router;
