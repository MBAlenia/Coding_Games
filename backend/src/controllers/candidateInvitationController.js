const { pool: db } = require('../database/db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Get candidate's invitations (assessments assigned to them)
exports.getCandidateInvitations = async (req, res) => {
  try {
    const candidateEmail = req.user.email;

    const [invitations] = await db.execute(`
      SELECT 
        i.id,
        i.assessment_id,
        i.status,
        i.created_at as invited_at,
        i.accepted_at,
        i.expires_at,
        a.title,
        a.description,
        a.duration,
        a.difficulty,
        a.language,
        u.first_name as invited_by_name,
        u.last_name as invited_by_lastname
      FROM invitations i
      JOIN assessments a ON i.assessment_id = a.id
      JOIN users u ON i.created_by = u.id
      WHERE i.candidate_email = ?
      ORDER BY 
        CASE 
          WHEN i.status = 'pending' THEN 1
          WHEN i.status = 'accepted' THEN 2
          WHEN i.status = 'completed' THEN 3
          ELSE 4
        END,
        i.created_at DESC
    `, [candidateEmail]);

    res.json({ invitations });
  } catch (error) {
    console.error('Get candidate invitations error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des invitations' });
  }
};

// Get candidate submissions
exports.getCandidateSubmissions = async (req, res) => {
  try {
    const candidateId = req.user.id;
    
    const [submissions] = await db.execute(`
      SELECT s.*, q.title as question_title, a.title as assessment_title, a.language
      FROM submissions s
      JOIN questions q ON s.question_id = q.id
      JOIN assessments a ON q.assessment_id = a.id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC
    `, [candidateId]);

    res.json({
      success: true,
      submissions: submissions
    });
  } catch (error) {
    console.error('Get candidate submissions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get assessment details for candidate (simplified - no complex checks)
exports.getCandidateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get assessment details with questions - simplified access
    const [assessments] = await db.execute(
      `SELECT a.*, CONCAT(u.first_name, ' ', u.last_name) as created_by_name 
       FROM assessments a 
       JOIN users u ON a.created_by = u.id 
       WHERE a.id = ?`,
      [id]
    );

    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Get questions for this assessment
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE assessment_id = ? ORDER BY created_at ASC',
      [id]
    );

    assessment.questions = questions;

    res.json(assessment);
  } catch (error) {
    console.error('Get candidate assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Start test session - mark invitation as accepted
exports.startTestSession = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const candidateEmail = req.user.email;
    
    // Check if invitation exists and is pending
    const [invitations] = await db.execute(
      'SELECT * FROM invitations WHERE assessment_id = ? AND candidate_email = ?',
      [assessmentId, candidateEmail]
    );

    if (invitations.length === 0) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    const invitation = invitations[0];
    
    if (invitation.status === 'accepted') {
      return res.status(400).json({ message: 'Test already started' });
    }

    if (invitation.status === 'expired') {
      return res.status(400).json({ message: 'Invitation has expired' });
    }

    // Mark invitation as accepted
    await db.execute(
      'UPDATE invitations SET status = ?, accepted_at = NOW() WHERE id = ?',
      ['accepted', invitation.id]
    );

    res.json({ message: 'Test session started successfully' });
  } catch (error) {
    console.error('Start test session error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Set password on first login
exports.setPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const candidateId = req.user.id;

    if (!password || password.length < 8) {
      return res.status(400).json({ 
        message: 'Le mot de passe doit contenir au moins 8 caractères' 
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and flags
    await db.execute(`
      UPDATE users 
      SET password_hash = ?, first_login = 0 
      WHERE id = ?
    `, [hashedPassword, candidateId]);

    res.json({ 
      message: 'Mot de passe défini avec succès',
      success: true 
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ message: 'Erreur lors de la définition du mot de passe' });
  }
};

// Start a test session
exports.startTestSession = async (req, res) => {
  try {
    const { assessmentId } = req.body;
    const candidateId = req.user.id;
    const candidateEmail = req.user.email;

    // Check if there's already an active session for this assessment
    const [existingSessions] = await db.execute(`
      SELECT id, status 
      FROM test_sessions 
      WHERE candidate_id = ? AND assessment_id = ? AND status = 'in_progress'
    `, [candidateId, assessmentId]);

    if (existingSessions.length > 0) {
      return res.status(400).json({ 
        message: 'Une session de test est déjà en cours pour cette évaluation' 
      });
    }

    // Check if invitation exists and is valid
    const [invitations] = await db.execute(`
      SELECT id, status 
      FROM invitations 
      WHERE candidate_email = ? AND assessment_id = ? 
      AND (status = 'pending' OR status = 'accepted')
    `, [candidateEmail, assessmentId]);

    if (invitations.length === 0) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à passer cette évaluation' 
      });
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Create new test session
    const [result] = await db.execute(`
      INSERT INTO test_sessions (candidate_id, assessment_id, session_token, status)
      VALUES (?, ?, ?, 'in_progress')
    `, [candidateId, assessmentId, sessionToken]);

    // Update invitation status to accepted if it was pending
    if (invitations[0].status === 'pending') {
      await db.execute(`
        UPDATE invitations 
        SET status = 'accepted', accepted_at = NOW() 
        WHERE id = ?
      `, [invitations[0].id]);
    }

    res.json({
      success: true,
      sessionId: result.insertId,
      sessionToken,
      message: 'Session de test démarrée avec succès'
    });
  } catch (error) {
    console.error('Start test session error:', error);
    res.status(500).json({ message: 'Erreur lors du démarrage de la session' });
  }
};

// End a test session
exports.endTestSession = async (req, res) => {
  try {
    const { sessionId, sessionToken } = req.body;
    const candidateId = req.user.id;

    // Verify session belongs to candidate and token matches
    const [sessions] = await db.execute(`
      SELECT id, assessment_id 
      FROM test_sessions 
      WHERE id = ? AND candidate_id = ? AND session_token = ? AND status = 'in_progress'
    `, [sessionId, candidateId, sessionToken]);

    if (sessions.length === 0) {
      return res.status(404).json({ 
        message: 'Session de test introuvable ou déjà terminée' 
      });
    }

    // Update session status
    await db.execute(`
      UPDATE test_sessions 
      SET status = 'completed', ended_at = NOW() 
      WHERE id = ?
    `, [sessionId]);

    // Calculate final assessment score and update invitation
    const assessmentId = sessions[0].assessment_id;
    console.log('=== FINALISATION ASSESSMENT ===');
    console.log('Assessment ID:', assessmentId);
    console.log('Email candidat:', req.user.email);
    
    // Calculate final score from all submissions
    const [scoreResult] = await db.execute(`
      SELECT 
        AVG((s.score / q.max_score) * 100) as average_percentage
      FROM submissions s
      JOIN questions q ON s.question_id = q.id
      JOIN assessment_questions aq ON aq.question_id = q.id
      WHERE s.user_id = ? AND aq.assessment_id = ? AND s.status = 'completed'
    `, [candidateId, assessmentId]);
    
    const finalScore = scoreResult[0].average_percentage || 0;
    console.log('Score final calculé:', finalScore);
    
    // Update invitation status to completed with final score
    await db.execute(`
      UPDATE invitations 
      SET status = 'completed', accepted_at = NOW(), score = ?
      WHERE candidate_email = ? AND assessment_id = ?
    `, [Math.round(finalScore * 100) / 100, req.user.email, assessmentId]);
    
    console.log('Invitation mise à jour avec score:', Math.round(finalScore * 100) / 100);
    console.log('=== FIN FINALISATION ===\n');

    res.json({
      success: true,
      message: 'Session de test terminée avec succès'
    });
  } catch (error) {
    console.error('End test session error:', error);
    res.status(500).json({ message: 'Erreur lors de la fin de la session' });
  }
};

// Check active test sessions
exports.getActiveTestSessions = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const [sessions] = await db.execute(`
      SELECT 
        ts.id,
        ts.assessment_id,
        ts.started_at,
        ts.session_token,
        a.title as assessment_title
      FROM test_sessions ts
      JOIN assessments a ON ts.assessment_id = a.id
      WHERE ts.candidate_id = ? AND ts.status = 'in_progress'
    `, [candidateId]);

    res.json({ 
      activeSessions: sessions,
      hasActiveSessions: sessions.length > 0 
    });
  } catch (error) {
    console.error('Get active sessions error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des sessions actives' });
  }
};

// Create invitations for candidates (used by recruiters)
exports.createInvitations = async (req, res) => {
  try {
    const { candidateIds, assessmentId } = req.body;
    const invitedBy = req.user.id;

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ 
        message: 'Veuillez sélectionner au moins un candidat' 
      });
    }

    // Check if assessment exists and is active
    const [assessments] = await db.execute(`
      SELECT id, title, is_active 
      FROM assessments 
      WHERE id = ? AND is_active = TRUE
    `, [assessmentId]);

    if (assessments.length === 0) {
      return res.status(404).json({ 
        message: 'Évaluation introuvable ou inactive' 
      });
    }

    const results = [];
    const errors = [];

    for (const candidateId of candidateIds) {
      try {
        // Get candidate email and name
        const [candidates] = await db.execute(`
          SELECT email, CONCAT(first_name, ' ', last_name) as name 
          FROM users 
          WHERE id = ?
        `, [candidateId]);

        if (candidates.length === 0) {
          errors.push({ 
            candidateId, 
            error: 'Candidat introuvable' 
          });
          continue;
        }

        const candidateEmail = candidates[0].email;
        const candidateName = candidates[0].name;

        // Check if invitation already exists
        const [existing] = await db.execute(`
          SELECT id FROM invitations 
          WHERE candidate_email = ? AND assessment_id = ?
        `, [candidateEmail, assessmentId]);

        if (existing.length > 0) {
          errors.push({ 
            candidateId, 
            error: 'Invitation déjà existante' 
          });
          continue;
        }

        // Generate unique token for invitation
        const token = crypto.randomBytes(32).toString('hex');

        // Create invitation
        const [result] = await db.execute(`
          INSERT INTO invitations (
            assessment_id,
            candidate_email,
            candidate_name,
            token,
            status,
            expires_at,
            created_by
          ) VALUES (?, ?, ?, ?, 'pending', DATE_ADD(NOW(), INTERVAL 30 DAY), ?)
        `, [assessmentId, candidateEmail, candidateName, token, invitedBy]);

        results.push({
          candidateId,
          invitationId: result.insertId,
          success: true
        });
      } catch (error) {
        console.error(`Error creating invitation for candidate ${candidateId}:`, error);
        errors.push({ 
          candidateId, 
          error: 'Erreur lors de la création' 
        });
      }
    }

    res.json({
      message: `${results.length} invitation(s) créée(s) avec succès`,
      results,
      errors,
      success: errors.length === 0
    });
  } catch (error) {
    console.error('Create invitations error:', error);
    res.status(500).json({ message: 'Erreur lors de la création des invitations' });
  }
};
