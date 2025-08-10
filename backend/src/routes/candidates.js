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
router.get('/:id', candidateController.getCandidateById);
router.post('/', candidateController.createCandidate);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

// Submissions and history
router.get('/:id/submissions', candidateController.getCandidateSubmissions);
router.get('/:id/history', candidateController.getCandidateHistory);
router.post('/:candidateId/history', candidateController.addCandidateHistory);

module.exports = router;
