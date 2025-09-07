const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All candidate routes require authentication and admin/recruiter role
router.use(authenticateToken);
router.use(requireRole(['admin', 'recruiter']));

// Dashboard stats
router.get('/dashboard/stats', candidateController.getDashboardStats);

// CRUD operations - Simple routes for recruiters
router.get('/', candidateController.getCandidates);
router.post('/', candidateController.createCandidate);
router.get('/:id', candidateController.getCandidateById);

// Submissions and history
router.get('/:candidateId/submissions', candidateController.getCandidateSubmissions);
// Get candidate history
router.get('/:candidateId/history', candidateController.getCandidateHistory);
router.post('/:candidateId/history', candidateController.addCandidateHistory);

module.exports = router;
