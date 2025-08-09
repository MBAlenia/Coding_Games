const { pool: db } = require('../database/db');

const userController = {
  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const [users] = await db.execute(`
        SELECT id, email, first_name, last_name, role, created_at, updated_at 
        FROM users 
        ORDER BY created_at DESC
      `);
      
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Allow admin to view any user, others can only view themselves
      if (userRole !== 'admin' && parseInt(id) !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const [users] = await db.execute(`
        SELECT id, email, first_name, last_name, role, created_at, updated_at 
        FROM users 
        WHERE id = ?
      `, [id]);

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(users[0]);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, role } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Allow admin to update any user, others can only update themselves
      if (userRole !== 'admin' && parseInt(id) !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Only admin can change roles
      const updateFields = [];
      const updateValues = [];

      if (first_name) {
        updateFields.push('first_name = ?');
        updateValues.push(first_name);
      }
      if (last_name) {
        updateFields.push('last_name = ?');
        updateValues.push(last_name);
      }
      if (email) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
      if (role && userRole === 'admin') {
        updateFields.push('role = ?');
        updateValues.push(role);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      updateFields.push('updated_at = NOW()');
      updateValues.push(id);

      await db.execute(`
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = ?
      `, updateValues);

      // Fetch updated user
      const [users] = await db.execute(`
        SELECT id, email, first_name, last_name, role, created_at, updated_at 
        FROM users 
        WHERE id = ?
      `, [id]);

      res.json(users[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  },

  // Delete user (admin only)
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Prevent self-deletion
      if (parseInt(id) === userId) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Create recruiter (admin only)
  createRecruiter: async (req, res) => {
    try {
      const { email, first_name, last_name, username } = req.body;

      // Validate required fields
      if (!email || !first_name || !last_name) {
        return res.status(400).json({ 
          message: 'Email, first name, and last name are required' 
        });
      }

      // Check if user already exists
      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ 
          message: 'User with this email already exists' 
        });
      }

      // Generate a temporary token for first login
      const crypto = require('crypto');
      const invitationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Insert new recruiter without password, with first_login = 1
      const [result] = await db.execute(`
        INSERT INTO users (
          email, 
          first_name, 
          last_name, 
          username, 
          role,
          status, 
          first_login,
          invitation_token,
          invitation_token_expiry,
          created_at
        ) VALUES (?, ?, ?, ?, 'recruiter', 'active', 1, ?, ?, NOW())
      `, [
        email, 
        first_name, 
        last_name, 
        username || email,
        invitationToken,
        tokenExpiry
      ]);

      // Get email service
      const { sendInvitationEmail } = require('../services/emailService');
      
      // Prepare invitation URL
      const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/invitation/${invitationToken}`;
      
      // Send welcome email
      const emailData = {
        to: email,
        candidateName: `${first_name} ${last_name}`,
        assessmentTitle: 'Welcome to the Platform',
        assessmentDescription: 'You have been invited as a recruiter. Please set your password to get started.',
        duration: null,
        invitationUrl: invitationUrl,
        expiresAt: tokenExpiry
      };

      await sendInvitationEmail(emailData);

      res.status(201).json({
        message: 'Recruiter created successfully',
        user: {
          id: result.insertId,
          email,
          first_name,
          last_name,
          role: 'recruiter'
        },
        invitationUrl
      });
    } catch (error) {
      console.error('Error creating recruiter:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ message: 'Email or username already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
};

module.exports = userController;
