const redisService = require('./redisService');

/**
 * High-level cache service with business logic
 */
class CacheService {
  
  // Cache invalidation helpers
  static async invalidateUserAssessments(userId) {
    const key = redisService.keys.assessments(userId);
    await redisService.del(key);
    console.log('🗑️ Invalidated assessments cache for user:', userId);
  }

  static async invalidateAssessment(assessmentId) {
    const key = redisService.keys.assessment(assessmentId);
    await redisService.del(key);
    console.log('🗑️ Invalidated assessment cache:', assessmentId);
  }

  static async invalidateAssessmentQuestions(assessmentId) {
    const key = redisService.keys.questions(assessmentId);
    await redisService.del(key);
    console.log('🗑️ Invalidated questions cache for assessment:', assessmentId);
  }

  // Cache warming - preload frequently accessed data
  static async warmAssessmentCache(assessmentId, assessmentData) {
    const key = redisService.keys.assessment(assessmentId);
    await redisService.set(key, assessmentData, redisService.TTL.LONG);
    console.log('🔥 Warmed assessment cache:', assessmentId);
  }

  // Bulk cache operations
  static async invalidateAllUserData(userId) {
    await Promise.all([
      this.invalidateUserAssessments(userId),
      redisService.del(redisService.keys.userSession(userId))
    ]);
    console.log('🗑️ Invalidated all cache for user:', userId);
  }

  // Cache statistics
  static async getCacheStats() {
    if (!redisService.isConnected) {
      return { connected: false };
    }

    try {
      const info = await redisService.client.info('memory');
      const keyCount = await redisService.client.dbSize();
      
      return {
        connected: true,
        keyCount,
        memoryInfo: info
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { connected: false, error: error.message };
    }
  }
}

module.exports = CacheService;
