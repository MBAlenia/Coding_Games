# Assessment Timeout System

## Overview
This system automatically completes assessments when candidates exceed the time limit, ensuring fair evaluation and preventing indefinite "started" states.

## How It Works

### Database Structure
- **candidate_invitations** table tracks assessment status with columns:
  - `status`: 'pending', 'started', 'completed', 'expired'
  - `started_at`: Timestamp when assessment begins
  - `completed_at`: Timestamp when assessment ends
  - `score`: Final calculated score

- **assessments** table contains:
  - `duration`: Time limit in minutes

### Timeout Detection
The system checks if: `current_time > started_at + duration_minutes`

### Automatic Triggers

#### 1. Login Listener (Primary)
- Runs every time a candidate authenticates
- Located in: `src/middleware/auth.js`
- Checks only the logged-in candidate's assessments
- Non-blocking (won't prevent login if check fails)

#### 2. Scheduled Job (Backup)
- Runs every 5 minutes via cron job
- Located in: `src/jobs/assessmentTimeoutJob.js`
- Checks all candidates' timed-out assessments
- Ensures completion even if candidate doesn't log in

### Score Calculation
When an assessment times out, the system:
1. Finds all submitted answers for the assessment
2. Calculates score based on existing submissions
3. Uses the best score for each question
4. Converts to percentage based on total possible points
5. Updates the invitation with final score and "completed" status

## Files Created/Modified

### New Files
- `src/utils/assessmentTimeout.js` - Core timeout logic
- `src/jobs/assessmentTimeoutJob.js` - Scheduled job
- `test-timeout.js` - Test script

### Modified Files
- `src/middleware/auth.js` - Added login listener
- `src/server.js` - Initialize scheduled job
- `package.json` - Added node-cron dependency

## Usage

### Testing
Run the test script to verify functionality:
```bash
cd backend
node test-timeout.js
```

### Manual Check
You can manually trigger timeout checks:
```javascript
const { checkAllTimedOutAssessments } = require('./src/utils/assessmentTimeout');
await checkAllTimedOutAssessments();
```

### Installation
Install the new dependency:
```bash
cd backend
npm install
```

## Configuration

### Scheduled Job Frequency
Default: Every 5 minutes
To change: Modify the cron pattern in `assessmentTimeoutJob.js`
```javascript
// Current: '*/5 * * * *' (every 5 minutes)
// Hourly: '0 * * * *'
// Every 30 seconds: '*/30 * * * * *'
```

### Disable Scheduled Job
Comment out this line in `server.js`:
```javascript
// initializeTimeoutJob();
```

## Logging
The system logs:
- Number of assessments auto-completed
- Candidate email and assessment details
- Any errors during processing

## Error Handling
- Login authentication continues even if timeout check fails
- Scheduled job continues running if individual checks fail
- Database errors are logged but don't crash the system

## Security Considerations
- Only processes assessments with "started" status
- Validates assessment duration from database
- Uses existing submission scores (no score manipulation)
- Maintains audit trail with timestamps
