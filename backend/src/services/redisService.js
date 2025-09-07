const redis = require('redis');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
        socket: {
          family: 4, // Force IPv4
        },
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            console.error('Redis connection refused');
            return new Error('Redis connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        console.log('✅ Redis ready to use');
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.isConnected = false;
      console.log('Redis disconnected');
    }
  }

  // Cache with TTL (Time To Live)
  async set(key, value, ttlSeconds = 3600) {
    if (!this.isConnected) return false;
    
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, ttlSeconds, serializedValue);
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  // Get cached data
  async get(key) {
    if (!this.isConnected) return null;
    
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  // Delete cache
  async del(key) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  // Delete multiple keys with pattern
  async delPattern(pattern) {
    if (!this.isConnected) return false;
    
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Redis DEL pattern error:', error);
      return false;
    }
  }

  // Check if key exists
  async exists(key) {
    if (!this.isConnected) return false;
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  // Set TTL for existing key
  async expire(key, ttlSeconds) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.expire(key, ttlSeconds);
      return true;
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      return false;
    }
  }

  // Cache keys generators
  static keys = {
    assessment: (id) => `assessment:${id}`,
    assessments: (userId) => `assessments:user:${userId}`,
    question: (id) => `question:${id}`,
    questions: (assessmentId) => `questions:assessment:${assessmentId}`,
    aiResult: (submissionId) => `ai:result:${submissionId}`,
    userSession: (userId) => `session:${userId}`,
    assessmentResults: (assessmentId, userId) => `results:${assessmentId}:${userId}`
  };

  // TTL constants (in seconds)
  static TTL = {
    SHORT: 300,      // 5 minutes
    MEDIUM: 1800,    // 30 minutes  
    LONG: 3600,      // 1 hour
    VERY_LONG: 86400 // 24 hours
  };
}

// Create singleton instance
const redisService = new RedisService();

module.exports = redisService;
