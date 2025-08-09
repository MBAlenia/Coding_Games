const { pool: db } = require('../database/db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Get candidate's invitations (assessments assigned to them)
exports.getCandidateInvitations = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const [invitations] = await db.execute(`
      SELECT 
        i.id,
        i.assessment_id,
        i.status,
        i.invited_at,
        i.accepted_at,
        i.completed_at,
        i.expires_at,
        i.score,
        a.title,
        a.description,
        a.duration,
        a.difficulty,
        a.language,
        a.is_active,
        u.first_name as invited_by_name,
        u.last_name as invited_by_lastname
      FROM invitations i
      JOIN assessments a ON i.assessment_id = a.id
      JOIN users u ON i.invited_by = u.id
      WHERE i.candidate_id = ?
      ORDER BY 
        CASE 
          WHEN i.status = 'pending' THEN 1
          WHEN i.status = 'accepted' THEN 2
          WHEN i.status = 'completed' THEN 3
          ELSE 4
        END,
        i.invited_at DESC
    `, [candidateId]);

    res.json({ invitations });
  } catch (error) {
    console.error('Get candidate invitations error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des invitations' });
  }
};

// Get candidate's test submissions
exports.getCandidateSubmissions = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const [submissions] = await db.execute(`
      SELECT 
        s.id,
        s.code,
        s.score,
        s.status,
        s.execution_time,
        s.memory_used,
        s.error_message,
        s.submitted_at,
        s.executed_at,
        q.title as question_title,
        q.language,
        q.difficulty,
        q.points,
        a.title as assessment_title
      FROM submissions s
      JOIN questions q ON s.question_id = q.id
      JOIN assessments a ON q.assessment_id = a.id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC
    `, [candidateId]);

    res.json({ submissions });
  } catch (error) {
    console.error('Get candidate submissions error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des soumissions' });
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
      SET password = ?, first_login = FALSE, password_set = TRUE 
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
      WHERE candidate_id = ? AND assessment_id = ? 
      AND (status = 'pending' OR status = 'accepted')
    `, [candidateId, assessmentId]);

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

    // Update invitation status to completed
    await db.execute(`
      UPDATE invitations 
      SET status = 'completed', completed_at = NOW() 
      WHERE candidate_id = ? AND assessment_id = ?
    `, [candidateId, sessions[0].assessment_id]);

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
        // Check if invitation already exists
        const [existing] = await db.execute(`
          SELECT id FROM invitations 
          WHERE candidate_id = ? AND assessment_id = ?
        `, [candidateId, assessmentId]);

        if (existing.length > 0) {
          errors.push({ 
            candidateId, 
            error: 'Invitation déjà existante' 
          });
          continue;
        }

        // Create invitation
        const [result] = await db.execute(`
          INSERT INTO invitations (
            candidate_id, 
            assessment_id, 
            invited_by, 
            status,
            expires_at
          ) VALUES (?, ?, ?, 'pending', DATE_ADD(NOW(), INTERVAL 30 DAY))
        `, [candidateId, assessmentId, invitedBy]);

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
