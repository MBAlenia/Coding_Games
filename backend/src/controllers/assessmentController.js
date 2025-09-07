const { pool: db } = require('../database/db');
const redisService = require('../services/redisService');
const CacheService = require('../services/cacheService');

const createAssessment = async (req, res) => {
  try {
    const { title, description, duration, language, difficulty } = req.body;
    const created_by = req.user.id;

    const [result] = await db.execute(
      `INSERT INTO assessments (title, description, duration, language, difficulty, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, duration || 60, language || 'javascript', difficulty || 'medium', 'draft', created_by]
    );

    const [assessments] = await db.execute(
      'SELECT * FROM assessments WHERE id = ?',
      [result.insertId]
    );

    const newAssessment = assessments[0];

    // Invalidate user's assessments cache and warm new assessment cache
    try {
      if (redisService.isConnected) {
        const cacheKey = redisService.keys.assessments(created_by);
        await redisService.del(cacheKey);
        console.log('🗑️ Invalidated assessments cache after creation for user:', created_by);
      }
    } catch (cacheError) {
      console.error('Cache invalidation error after creation:', cacheError);
    }

    res.status(201).json({
      message: 'Assessment created successfully',
      assessment: newAssessment
    });
  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAssessments = async (req, res) => {
  try {
    console.log('🔍 Getting assessments for user:', req.user.id, 'role:', req.user.role);
    
    // Skip cache for now to debug
    let assessments = null;
    
    // If not in cache, fetch from database
    if (req.user.role === 'admin') {
      const [results] = await db.execute(
        `SELECT a.*, u.username as created_by_name 
         FROM assessments a 
         JOIN users u ON a.created_by = u.id 
         ORDER BY a.created_at DESC`
      );
      assessments = results;
    } else if (req.user.role === 'recruiter') {
      const [results] = await db.execute(
        `SELECT a.*, u.username as created_by_name 
         FROM assessments a 
         JOIN users u ON a.created_by = u.id 
         ORDER BY a.created_at DESC`
      );
      assessments = results;
    } else {
      // Candidates can only see assessments they've been invited to
      const [results] = await db.execute(
        `SELECT DISTINCT a.*, u.username as created_by_name 
         FROM assessments a 
         JOIN users u ON a.created_by = u.id 
         JOIN invitations i ON a.id = i.assessment_id 
         WHERE i.candidate_email = ? AND i.status = 'pending' AND i.expires_at > NOW() 
         ORDER BY a.created_at DESC`,
        [req.user.email]
      );
      assessments = results;
    }

    console.log('✅ Found', assessments.length, 'assessments');
    res.json({ assessments });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check cache first (only if Redis is connected)
    let assessment = null;
    if (redisService.isConnected) {
      const cacheKey = redisService.constructor.keys.assessment(id);
      assessment = await redisService.get(cacheKey);
      
      if (assessment) {
        console.log('📦 Assessment loaded from cache:', id);
      }
    }
    
    if (!assessment) {
      // Get assessment details from database
      const [assessments] = await db.execute(
        `SELECT a.*, u.username as created_by_name 
         FROM assessments a 
         JOIN users u ON a.created_by = u.id 
         WHERE a.id = ?`,
        [id]
      );

      if (assessments.length === 0) {
        return res.status(404).json({ message: 'Assessment not found' });
      }

      assessment = assessments[0];
      
      // Cache for 1 hour (only if Redis is connected)
      if (redisService.isConnected) {
        const cacheKey = redisService.constructor.keys.assessment(id);
        await redisService.set(cacheKey, assessment, redisService.constructor.TTL.LONG);
        console.log('💾 Assessment cached:', id);
      }
    }

    // Check permissions
    if (req.user.role === 'candidate') {
      // Check if user is invited to this assessment
      const [invitations] = await db.execute(
        `SELECT * FROM invitations 
         WHERE assessment_id = ? AND candidate_email = ? 
         AND status = 'pending' AND expires_at > NOW()`,
        [id, req.user.email]
      );
      
      if (invitations.length === 0) {
        return res.status(403).json({ message: 'Access denied - no valid invitation' });
      }
    } else if (req.user.role === 'recruiter' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get questions for this assessment - fallback to old method if junction table doesn't exist
    let questions = [];
    try {
      const [junctionQuestions] = await db.execute(`
        SELECT q.*, aq.order_index, aq.points
        FROM questions q
        JOIN assessment_questions aq ON q.id = aq.question_id
        WHERE aq.assessment_id = ? 
        ORDER BY aq.order_index
      `, [id]);
      questions = junctionQuestions;
    } catch (junctionError) {
      console.log('Junction table not found, using fallback method');
      // Fallback to old method
      const [directQuestions] = await db.execute(
        'SELECT * FROM questions WHERE assessment_id = ? ORDER BY id',
        [id]
      );
      questions = directQuestions;
    }

    // Format questions with parsed JSON fields
    const formattedQuestions = questions.map(q => ({
      ...q,
      tags: q.tags ? JSON.parse(q.tags) : []
    }));

    assessment.questions = formattedQuestions;

    res.json(assessment);
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get questions for an assessment
const getAssessmentQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [questions] = await db.execute(`
      SELECT q.*, aq.order_index, aq.points
      FROM questions q
      JOIN assessment_questions aq ON q.id = aq.question_id
      WHERE aq.assessment_id = ? 
      ORDER BY aq.order_index
    `, [id]);
    
    const formattedQuestions = questions.map(q => ({
      ...q,
      tags: q.tags ? JSON.parse(q.tags) : []
    }));
    
    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching assessment questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, language, difficulty, status } = req.body;

    console.log(`🔄 Updating assessment ${id} with data:`, req.body);

    // Check if assessment exists and user has permission
    const [assessments] = await db.execute('SELECT * FROM assessments WHERE id = ?', [id]);
    
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Simple direct update for status only (most common case)
    if (status !== undefined && Object.keys(req.body).length === 1) {
      console.log('🔄 Simple status update to:', status);
      await db.execute('UPDATE assessments SET status = ? WHERE id = ?', [status, id]);
      
      // Simple cache invalidation
      if (redisService.isConnected) {
        try {
          const cacheKey = `assessments:user:${assessment.created_by}`;
          await redisService.del(cacheKey);
          console.log('🗑️ Cache invalidated for user:', assessment.created_by);
        } catch (e) {
          console.log('Cache invalidation failed, continuing...');
        }
      }
      
      return res.json({ message: 'Assessment status updated successfully' });
    }

    // Full update for other fields
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (duration !== undefined) {
      updateFields.push('duration = ?');
      updateValues.push(duration);
    }
    if (language !== undefined) {
      updateFields.push('language = ?');
      updateValues.push(language);
    }
    if (difficulty !== undefined) {
      updateFields.push('difficulty = ?');
      updateValues.push(difficulty);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateValues.push(id);

    const updateQuery = `UPDATE assessments SET ${updateFields.join(', ')} WHERE id = ?`;
    console.log('🔄 Executing query:', updateQuery, 'with values:', updateValues);

    await db.execute(updateQuery, updateValues);
    
    res.json({ message: 'Assessment updated successfully' });
  } catch (error) {
    console.error('Update assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if assessment exists and user has permission
    const [assessments] = await db.execute('SELECT * FROM assessments WHERE id = ?', [id]);
    
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.execute('DELETE FROM assessments WHERE id = ?', [id]);

    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add existing question to assessment
const addExistingQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_id, points = 10 } = req.body;

    // Check if question exists
    const [questions] = await db.execute('SELECT id FROM questions WHERE id = ?', [question_id]);
    if (questions.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if already linked
    const [existing] = await db.execute(
      'SELECT id FROM assessment_questions WHERE assessment_id = ? AND question_id = ?',
      [id, question_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Question already added to this assessment' });
    }

    // Get the next order index
    const [orderResult] = await db.execute(
      'SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM assessment_questions WHERE assessment_id = ?',
      [id]
    );

    // Link question to assessment
    await db.execute(
      'INSERT INTO assessment_questions (assessment_id, question_id, order_index, points) VALUES (?, ?, ?, ?)',
      [id, question_id, orderResult[0].next_order, points]
    );

    // Update assessment duration automatically
    const Assessment = require('../models/Assessment');
    await Assessment.updateDuration(id);

    res.status(201).json({
      message: 'Question added to assessment successfully'
    });
  } catch (error) {
    console.error('Add existing question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add question to assessment (create new)
const addQuestion = async (req, res) => {
  console.log('🔥 addQuestion called - START');
  try {
    const { id } = req.params;
    
    console.log('🔥 Assessment ID:', id);
    console.log('🔥 Request body:', JSON.stringify(req.body, null, 2));
    console.log('🔥 Content-Type:', req.headers['content-type']);
    
    const { title, description, language, difficulty, template_code, time_limit, points } = req.body;

    console.log('🔥 Extracted title:', title);
    console.log('🔥 Extracted description:', description);

    // Validate required fields
    if (!title || !description) {
      console.log('🔥 VALIDATION FAILED - title:', !!title, 'description:', !!description);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: [
          !title ? 'Title is required' : null,
          !description ? 'Description is required' : null
        ].filter(Boolean)
      });
    }

    console.log('🔥 Validation passed, creating question...');

    // Insert the question (independent of assessment)
    const [questionResult] = await db.execute(
      `INSERT INTO questions (title, description, language, difficulty, template_code, time_limit, points) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, language || 'javascript', difficulty || 'intermediate', template_code || '', time_limit || 60, points || 10]
    );

    // Get the next order index for this assessment
    const [orderResult] = await db.execute(
      'SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM assessment_questions WHERE assessment_id = ?',
      [id]
    );

    // Link question to assessment
    await db.execute(
      'INSERT INTO assessment_questions (assessment_id, question_id, order_index, points) VALUES (?, ?, ?, ?)',
      [id, questionResult.insertId, orderResult[0].next_order, points || 10]
    );

    // Update assessment duration automatically
    const Assessment = require('../models/Assessment');
    await Assessment.updateDuration(id);

    res.status(201).json({
      message: 'Question added successfully',
      question_id: questionResult.insertId
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get assessment results
const getAssessmentResults = async (req, res) => {
  try {
    const { id } = req.params;

    const [results] = await db.execute(
      `SELECT ci.candidate_email, ci.candidate_name, ci.status, ci.score, ci.started_at, ci.completed_at
       FROM candidate_invitations ci
       WHERE ci.assessment_id = ?`,
      [id]
    );

    res.json({ results });
  } catch (error) {
    console.error('Get assessment results error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove question from assessment
const removeQuestionFromAssessment = async (req, res) => {
  try {
    const { id, questionId } = req.params;

    // Check if assessment exists and user has permission
    const [assessments] = await db.execute('SELECT * FROM assessments WHERE id = ?', [id]);
    
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove question from assessment (not delete the question itself)
    await db.execute(
      'DELETE FROM assessment_questions WHERE assessment_id = ? AND question_id = ?',
      [id, questionId]
    );

    // Update assessment duration automatically
    const Assessment = require('../models/Assessment');
    await Assessment.updateDuration(id);

    // Invalidate cache
    if (redisService.isConnected) {
      await CacheService.invalidateAssessmentCache(id);
      await CacheService.invalidateQuestionsCache(id);
    }

    res.json({ message: 'Question removed from assessment successfully' });
  } catch (error) {
    console.error('Remove question from assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send invitation
const sendInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { candidate_email, candidate_name } = req.body;

    // Generate invitation token
    const token = require('crypto').randomBytes(32).toString('hex');

    await db.execute(
      `INSERT INTO candidate_invitations (assessment_id, candidate_email, candidate_name, token, status, created_by) 
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [id, candidate_email, candidate_name, token, req.user.id]
    );

    res.status(201).json({
      message: 'Invitation sent successfully',
      token
    });
  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Finalize assessment and trigger AI scoring
const finalizeAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { auto_submit = false } = req.body;
    const candidateId = req.user.id;

    console.log(`🎯 Finalizing assessment ${id} for candidate ${candidateId}`);

    // Get all submissions for this assessment and candidate
    const [submissions] = await db.execute(
      `SELECT s.*, q.title as question_title, q.points as max_points
       FROM submissions s 
       JOIN questions q ON s.question_id = q.id
       JOIN assessment_questions aq ON q.id = aq.question_id
       WHERE aq.assessment_id = ? AND s.user_id = ?
       ORDER BY aq.order_index`,
      [id, candidateId]
    );

    if (submissions.length === 0) {
      return res.status(400).json({ message: 'No submissions found for this assessment' });
    }

    // Update candidate invitation status to completed
    await db.execute(
      `UPDATE candidate_invitations 
       SET status = 'completed', completed_at = NOW()
       WHERE assessment_id = ? AND candidate_id = ?`,
      [id, candidateId]
    );

    // Trigger AI scoring for all submissions
    const aiScoringService = require('../services/aiScoringService');
    
    let totalScore = 0;
    let maxTotalScore = 0;

    for (const submission of submissions) {
      try {
        // Get AI score for this submission
        const aiResult = await aiScoringService.scoreSubmission({
          code: submission.code,
          language: submission.language,
          questionTitle: submission.question_title,
          maxPoints: submission.max_points
        });

        // Update submission with AI score
        await db.execute(
          'UPDATE submissions SET score = ?, ai_feedback = ?, status = ? WHERE id = ?',
          [aiResult.score, aiResult.feedback, 'completed', submission.id]
        );

        totalScore += aiResult.score;
        maxTotalScore += submission.max_points;

      } catch (aiError) {
        console.error(`AI scoring error for submission ${submission.id}:`, aiError);
        // Fallback to basic scoring if AI fails
        await db.execute(
          'UPDATE submissions SET score = ?, status = ? WHERE id = ?',
          [submission.max_points * 0.5, 'completed', submission.id]
        );
        totalScore += submission.max_points * 0.5;
        maxTotalScore += submission.max_points;
      }
    }

    // Update candidate invitation with final score
    await db.execute(
      `UPDATE candidate_invitations 
       SET score = ?, max_score = ?
       WHERE assessment_id = ? AND candidate_id = ?`,
      [totalScore, maxTotalScore, id, candidateId]
    );

    console.log(`✅ Assessment ${id} finalized. Score: ${totalScore}/${maxTotalScore}`);

    res.json({
      message: auto_submit ? 'Assessment auto-submitted and scored successfully' : 'Assessment finalized and scored successfully',
      total_score: totalScore,
      max_score: maxTotalScore,
      submissions_count: submissions.length
    });

  } catch (error) {
    console.error('Finalize assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Recalculate assessment duration
const recalculateDuration = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if assessment exists and user has permission
    const [assessments] = await db.execute('SELECT * FROM assessments WHERE id = ?', [id]);
    
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Use Assessment model to recalculate duration
    const Assessment = require('../models/Assessment');
    const newDuration = await Assessment.updateDuration(id);

    console.log(`🔄 Duration recalculated for assessment ${id}: ${newDuration} minutes`);

    res.json({
      message: 'Duration recalculated successfully',
      duration: newDuration
    });

  } catch (error) {
    console.error('Recalculate duration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAssessment,
  getAssessments,
  getAssessment,
  getAssessmentQuestions,
  updateAssessment,
  deleteAssessment,
  addQuestion,
  addExistingQuestion,
  removeQuestionFromAssessment,
  getAssessmentResults,
  sendInvitation,
  finalizeAssessment,
  recalculateDuration
};
