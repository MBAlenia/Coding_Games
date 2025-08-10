const { pool } = require('../database/db');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const { username, email, password, role = 'candidate' } = userData;
    
    try {
      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, password_hash, role]
      );
      
      return { id: result.insertId, username, email, role };
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email, password_hash, role, first_name, last_name, first_login, created_at FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email, role, created_at, first_login, password_hash FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateRole(userId, newRole) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [newRole, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async saveResetToken(userId, tokenHash, expiry) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
        [tokenHash, expiry, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(userId, tokenHash, newPassword) {
    try {
      // First verify the token is valid and not expired
      const [rows] = await pool.execute(
        'SELECT id FROM users WHERE id = ? AND reset_token = ? AND reset_token_expiry > NOW()',
        [userId, tokenHash]
      );

      if (rows.length === 0) {
        return false;
      }

      // Hash the new password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      const [result] = await pool.execute(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [password_hash, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async findByInvitationToken(token) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, username, email, role, first_name, last_name, 
                invitation_token, invitation_token_expiry, first_login
         FROM users 
         WHERE invitation_token = ?`,
        [token]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async setFirstPassword(userId, password) {
    try {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Update password, clear invitation token, and set first_login to 0
      const [result] = await pool.execute(
        `UPDATE users 
         SET password_hash = ?, 
             invitation_token = NULL, 
             invitation_token_expiry = NULL,
             first_login = 0
         WHERE id = ?`,
        [password_hash, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async saveInvitationToken(userId, token, expiry) {
    try {
      const [result] = await pool.execute(
        `UPDATE users 
         SET invitation_token = ?, 
             invitation_token_expiry = ?
         WHERE id = ?`,
        [token, expiry, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
