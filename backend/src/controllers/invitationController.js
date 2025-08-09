const { pool: db } = require('../database/db');
const crypto = require('crypto');
const emailService = require('../services/emailService');

const invitationController = {
  // Send invitation to a candidate for an assessment
  sendInvitation: async (req, res) => {
    try {
      const { assessmentId } = req.params;
      const { candidate_email, candidate_name, expires_at } = req.body;
      const created_by = req.user.id;

      // Check if assessment exists and user has permission
      const [assessments] = await db.execute(
        'SELECT * FROM assessments WHERE id = ?',
        [assessmentId]
      );

      if (assessments.length === 0) {
        return res.status(404).json({ message: 'Assessment not found' });
      }

      const assessment = assessments[0];

      // Check permissions (only admin or assessment creator can send invitations)
      if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Check if candidate exists
      const [candidates] = await db.execute(
        'SELECT id FROM users WHERE email = ? AND role = ?',
        [candidate_email, 'candidate']
      );

      let candidateId;
      if (candidates.length === 0) {
        // Create new candidate if doesn't exist
        const [result] = await db.execute(
          'INSERT INTO users (email, first_name, last_name, username, password_hash, role, first_login, password_set) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            candidate_email,
            candidate_name?.split(' ')[0] || 'Candidate',
            candidate_name?.split(' ')[1] || '',
            candidate_email,
            'NOT_SET_' + Date.now(),
            'candidate',
            true,
            false
          ]
        );
        candidateId = result.insertId;
      } else {
        candidateId = candidates[0].id;
      }

      // Check if invitation already exists
      const [existingInvitations] = await db.execute(
        'SELECT * FROM invitations WHERE candidate_id = ? AND assessment_id = ?',
        [candidateId, assessmentId]
      );

      if (existingInvitations.length > 0) {
        return res.status(400).json({ message: 'Invitation already sent to this candidate' });
      }

      // Generate invitation token
      const token = crypto.randomBytes(32).toString('hex');

      // Create invitation
      const [result] = await db.execute(
        `INSERT INTO invitations 
         (candidate_id, assessment_id, invited_by, status, expires_at, token) 
         VALUES (?, ?, ?, 'pending', ?, ?)`,
        [candidateId, assessmentId, created_by, expires_at || null, token]
      );

      // Send email
      try {
        await emailService.sendInvitationEmail(
          candidate_email,
          candidate_name || 'Candidate',
          assessment.title,
          token
        );
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }

      res.status(201).json({
        message: 'Invitation sent successfully',
        invitationId: result.insertId
      });
    } catch (error) {
      console.error('Send invitation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get invitations for an assessment
  getAssessmentInvitations: async (req, res) => {
    try {
      const { assessmentId } = req.params;

      // Check if assessment exists and user has permission
      const [assessments] = await db.execute(
        'SELECT * FROM assessments WHERE id = ?',
        [assessmentId]
      );

      if (assessments.length === 0) {
        return res.status(404).json({ message: 'Assessment not found' });
      }

      const assessment = assessments[0];

      // Check permissions
      if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Get invitations
      const [invitations] = await db.execute(
        `SELECT i.*, u.email, u.first_name, u.last_name
         FROM invitations i
         JOIN users u ON i.candidate_id = u.id
         WHERE i.assessment_id = ?
         ORDER BY i.invited_at DESC`,
        [assessmentId]
      );

      res.json(invitations);
    } catch (error) {
      console.error('Get invitations error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update invitation status
  updateInvitationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Check if invitation exists and user has permission
      const [invitations] = await db.execute(
        `SELECT i.*, a.created_by as assessment_created_by
         FROM invitations i
         JOIN assessments a ON i.assessment_id = a.id
         WHERE i.id = ?`,
        [id]
      );

      if (invitations.length === 0) {
        return res.status(404).json({ message: 'Invitation not found' });
      }

      const invitation = invitations[0];

      // Check permissions
      if (req.user.role !== 'admin' && invitation.assessment_created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Update invitation status
      await db.execute(
        'UPDATE invitations SET status = ? WHERE id = ?',
        [status, id]
      );

      res.json({ message: 'Invitation status updated successfully' });
    } catch (error) {
      console.error('Update invitation status error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Validate invitation token
  validateInvitation: async (req, res) => {
    try {
      const { token } = req.params;

      const [invitations] = await db.execute(
        `SELECT i.*, a.title as assessment_title, a.duration, a.description
         FROM invitations i
         JOIN assessments a ON i.assessment_id = a.id
         WHERE i.token = ? AND i.status = 'pending'`,
        [token]
      );

      if (invitations.length === 0) {
        return res.status(404).json({ message: 'Invalid or expired invitation' });
      }

      const invitation = invitations[0];

      // Check if invitation has expired
      if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
        await db.execute(
          'UPDATE invitations SET status = ? WHERE id = ?',
          ['expired', invitation.id]
        );
        return res.status(400).json({ message: 'Invitation has expired' });
      }

      res.json({
        valid: true,
        assessment: {
          id: invitation.assessment_id,
          title: invitation.assessment_title,
          duration: invitation.duration,
          description: invitation.description
        }
      });
    } catch (error) {
      console.error('Validate invitation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Accept invitation (start assessment)
  acceptInvitation: async (req, res) => {
    try {
      const { token } = req.body;

      const [invitations] = await db.execute(
        'SELECT * FROM invitations WHERE token = ? AND status = ?',
        [token, 'pending']
      );

      if (invitations.length === 0) {
        return res.status(404).json({ message: 'Invalid or expired invitation' });
      }

      const invitation = invitations[0];

      // Check if invitation has expired
      if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
        await db.execute(
          'UPDATE invitations SET status = ? WHERE id = ?',
          ['expired', invitation.id]
        );
        return res.status(400).json({ message: 'Invitation has expired' });
      }

      // Update invitation status
      await db.execute(
        'UPDATE invitations SET status = ?, accepted_at = NOW() WHERE id = ?',
        ['accepted', invitation.id]
      );

      res.json({ message: 'Invitation accepted', assessmentId: invitation.assessment_id });
    } catch (error) {
      console.error('Accept invitation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Delete invitation
  deleteInvitation: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if invitation exists and user has permission
      const [invitations] = await db.execute(
        `SELECT i.*, a.created_by as assessment_created_by
         FROM invitations i
         JOIN assessments a ON i.assessment_id = a.id
         WHERE i.id = ?`,
        [id]
      );

      if (invitations.length === 0) {
        return res.status(404).json({ message: 'Invitation not found' });
      }

      const invitation = invitations[0];

      // Check permissions
      if (req.user.role !== 'admin' && invitation.assessment_created_by !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Delete invitation
      await db.execute('DELETE FROM invitations WHERE id = ?', [id]);

      res.json({ message: 'Invitation deleted successfully' });
    } catch (error) {
      console.error('Delete invitation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = invitationController;
