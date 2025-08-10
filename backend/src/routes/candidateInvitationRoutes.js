const express = require('express');
const router = express.Router();
const candidateInvitationController = require('../controllers/candidateInvitationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Candidate routes (requires authentication only - candidates can access their own data)
router.get('/my-invitations', authenticateToken, candidateInvitationController.getCandidateInvitations);
// Get candidate's submissions
router.get('/my-submissions', authenticateToken, candidateInvitationController.getCandidateSubmissions);

// Get assessment details for candidate (via invitation)
router.get('/assessment/:id', authenticateToken, candidateInvitationController.getCandidateAssessment);

// Start test session for specific assessment
router.post('/start-test/:assessmentId', authenticateToken, candidateInvitationController.startTestSession);

// Set password on first login
router.post('/set-password', authenticateToken, candidateInvitationController.setPassword);
router.post('/start-test', authenticateToken, candidateInvitationController.startTestSession);
router.post('/end-test', authenticateToken, candidateInvitationController.endTestSession);
router.get('/active-sessions', authenticateToken, candidateInvitationController.getActiveTestSessions);

// Recruiter routes (requires recruiter/admin authentication)
router.post('/create', authenticateToken, requireRole(['recruiter', 'admin']), candidateInvitationController.createInvitations);

module.exports = router;
