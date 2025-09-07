const cron = require('node-cron');
const { checkAllTimedOutAssessments } = require('../utils/assessmentTimeout');

/**
 * Scheduled job to check for timed out assessments every 5 minutes
 * This ensures assessments are auto-completed even if candidates don't log in
 */
const startAssessmentTimeoutJob = () => {
  // Run every 5 minutes
  const job = cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('Running scheduled assessment timeout check...');
      const completedCount = await checkAllTimedOutAssessments();
      
      if (completedCount > 0) {
        console.log(`✅ Scheduled job: Auto-completed ${completedCount} timed out assessments`);
      } else {
        console.log('✅ Scheduled job: No timed out assessments found');
      }
    } catch (error) {
      console.error('❌ Error in scheduled assessment timeout job:', error);
    }
  }, {
    scheduled: false // Don't start automatically
  });

  return job;
};

/**
 * Start the timeout job (call this from server.js)
 */
const initializeTimeoutJob = () => {
  const job = startAssessmentTimeoutJob();
  job.start();
  console.log('🕒 Assessment timeout scheduled job initialized (runs every 5 minutes)');
  return job;
};

module.exports = {
  startAssessmentTimeoutJob,
  initializeTimeoutJob
};
