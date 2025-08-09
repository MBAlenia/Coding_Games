const { pool: db } = require('../database/db');

const createAssessment = async (req, res) => {
  try {
    const { title, description, duration, language, difficulty } = req.body;
    const created_by = req.user.id;

    const [result] = await db.execute(
      `INSERT INTO assessments (title, description, duration, language, difficulty, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, duration || 60, language || 'javascript', difficulty || 'medium', created_by]
    );

    const [assessments] = await db.execute(
      'SELECT * FROM assessments WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Assessment created successfully',
      assessment: assessments[0]
    });
  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAssessments = async (req, res) => {
  try {
    let assessments = [];
    
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
         WHERE a.created_by = ? 
         ORDER BY a.created_at DESC`,
        [req.user.id]
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

    res.json({ assessments });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get assessment details
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

    const assessment = assessments[0];

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

    // Get questions for this assessment
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE assessment_id = ? ORDER BY created_at ASC',
      [id]
    );

    assessment.questions = questions;

    res.json(assessment);
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Check if assessment exists
    const [assessments] = await db.execute(
      'SELECT * FROM assessments WHERE id = ?',
      [id]
    );

    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Add id at the end for WHERE clause
    values.push(id);

    // Execute update
    await db.execute(
      `UPDATE assessments SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Assessment updated successfully' });
  } catch (error) {
    console.error('Update assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if assessment exists
    const [assessments] = await db.execute(
      'SELECT * FROM assessments WHERE id = ?',
      [id]
    );

    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete assessment (cascading will handle related records)
    await db.execute('DELETE FROM assessments WHERE id = ?', [id]);

    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, language, template_code, test_cases } = req.body;

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const question = await Question.create({
      assessment_id: id,
      title,
      description,
      language,
      template_code,
      test_cases
    });

    res.status(201).json({
      message: 'Question added successfully',
      question
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAssessmentResults = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if assessment exists and user has permission
    const [assessments] = await db.execute(
      'SELECT * FROM assessments WHERE id = ?',
      [id]
    );
    
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    const assessment = assessments[0];
    
    // Check permissions
    if (req.user.role === 'candidate') {
      return res.status(403).json({ message: 'Access denied' });
    } else if (req.user.role === 'recruiter' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get all submissions for this assessment with user details
    const [results] = await db.execute(
      `SELECT 
         s.id, s.user_id, s.question_id, s.code, s.language, s.status, 
         s.score, s.test_results, s.execution_time, s.memory_used, s.submitted_at,
         u.username, u.email, u.first_name, u.last_name,
         q.title as question_title, q.max_score as question_max_score
       FROM submissions s
       JOIN users u ON s.user_id = u.id
       JOIN questions q ON s.question_id = q.id
       WHERE q.assessment_id = ?
       ORDER BY s.submitted_at DESC`,
      [id]
    );
    
    res.json({ results });
  } catch (error) {
    console.error('Get assessment results error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const sendInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { candidate_email, candidate_name, expires_at } = req.body;

    // Check if assessment exists
    const [assessments] = await db.execute(
      'SELECT * FROM assessments WHERE id = ?',
      [id]
    );

    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate invitation token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    
    // Format date for MySQL (remove 'Z' and replace 'T' with space)
    const formatDateForMySQL = (date) => {
      const d = new Date(date);
      return d.toISOString().slice(0, 19).replace('T', ' ');
    };
    
    const expiresAtDate = expires_at ? formatDateForMySQL(expires_at) : formatDateForMySQL(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    
    // Store invitation in database
    await db.execute(
      `INSERT INTO invitations (assessment_id, candidate_email, token, expires_at, status, created_by) 
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [id, candidate_email, token, expiresAtDate, req.user.id]
    );
    
    // Update user's invitation token if they exist
    await db.execute(
      `UPDATE users 
       SET invitation_token = ?, 
           invitation_token_expiry = ?,
           first_login = 1
       WHERE email = ?`,
      [token, expiresAtDate, candidate_email]
    );

    // Get email service
    const { sendInvitationEmail } = require('../services/emailService');
    
    // Prepare invitation URL - use the new invitation route for first-time users
    const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/invitation/${token}?assessment=${id}`;
    
    // Send email (or log in development)
    const emailData = {
      to: candidate_email,
      candidateName: candidate_name,
      assessmentTitle: assessment.title,
      assessmentDescription: assessment.description,
      duration: assessment.duration,
      invitationUrl: invitationUrl,
      expiresAt: expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    await sendInvitationEmail(emailData);

    res.status(201).json({ 
      message: 'Invitation sent successfully',
      invitation_url: invitationUrl 
    });
  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAssessment,
  getAssessments,
  getAssessment,
  updateAssessment,
  deleteAssessment,
  addQuestion,
  getAssessmentResults,
  sendInvitation
};
