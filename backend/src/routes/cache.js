const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const CacheService = require('../services/cacheService');

// Get cache statistics (admin only)
router.get('/stats', 
  authenticateToken, 
  requireRole(['admin']), 
  async (req, res) => {
    try {
      const stats = await CacheService.getCacheStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting cache stats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Clear specific cache (admin only)
router.delete('/assessment/:id', 
  authenticateToken, 
  requireRole(['admin']), 
  async (req, res) => {
    try {
      const { id } = req.params;
      await CacheService.invalidateAssessment(id);
      await CacheService.invalidateAssessmentQuestions(id);
      res.json({ message: 'Assessment cache cleared successfully' });
    } catch (error) {
      console.error('Error clearing assessment cache:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Clear user cache (admin only)
router.delete('/user/:id', 
  authenticateToken, 
  requireRole(['admin']), 
  async (req, res) => {
    try {
      const { id } = req.params;
      await CacheService.invalidateAllUserData(id);
      res.json({ message: 'User cache cleared successfully' });
    } catch (error) {
      console.error('Error clearing user cache:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
