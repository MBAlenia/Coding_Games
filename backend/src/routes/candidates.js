const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All candidate routes require authentication and admin/recruiter role
router.use(authenticateToken);
router.use(requireRole(['admin', 'recruiter']));

// Dashboard stats
router.get('/dashboard/stats', candidateController.getDashboardStats);

// CRUD operations
router.get('/candidates', candidateController.getCandidates);
router.get('/candidates/:id', candidateController.getCandidateById);
router.post('/candidates', candidateController.createCandidate);
router.put('/candidates/:id', candidateController.updateCandidate);
router.delete('/candidates/:id', candidateController.deleteCandidate);

// Submissions and history
router.get('/candidates/:id/submissions', candidateController.getCandidateSubmissions);
router.get('/candidates/:candidateId/history', candidateController.getCandidateHistory);
router.post('/candidates/:candidateId/history', candidateController.addCandidateHistory);

module.exports = router;
