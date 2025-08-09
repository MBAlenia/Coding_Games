const { pool } = require('../database/db');

class Submission {
  static async create(submissionData) {
    const { user_id, question_id, code, language } = submissionData;
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO submissions (user_id, question_id, code, language, status) VALUES (?, ?, ?, ?, ?)',
        [user_id, question_id, code, language, 'pending']
      );
      
      return { id: result.insertId, ...submissionData, status: 'pending' };
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT s.*, q.title as question_title, u.username 
         FROM submissions s 
         JOIN questions q ON s.question_id = q.id 
         JOIN users u ON s.user_id = u.id 
         WHERE s.id = ?`,
        [id]
      );
      
      if (rows[0] && rows[0].results) {
        rows[0].results = JSON.parse(rows[0].results);
      }
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByUser(user_id) {
    try {
      const [rows] = await pool.execute(
        `SELECT s.*, q.title as question_title, a.title as assessment_title 
         FROM submissions s 
         JOIN questions q ON s.question_id = q.id 
         JOIN assessments a ON q.assessment_id = a.id 
         WHERE s.user_id = ? 
         ORDER BY s.submitted_at DESC`,
        [user_id]
      );
      
      return rows.map(row => ({
        ...row,
        results: row.results ? JSON.parse(row.results) : null
      }));
    } catch (error) {
      throw error;
    }
  }

  static async findByQuestion(question_id) {
    try {
      const [rows] = await pool.execute(
        `SELECT s.*, u.username 
         FROM submissions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.question_id = ? 
         ORDER BY s.submitted_at DESC`,
        [question_id]
      );
      
      return rows.map(row => ({
        ...row,
        results: row.results ? JSON.parse(row.results) : null
      }));
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status, results = null, score = null) {
    try {
      const [result] = await pool.execute(
        'UPDATE submissions SET status = ?, results = ?, score = ? WHERE id = ?',
        [status, results ? JSON.stringify(results) : null, score, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getLatestByUserAndQuestion(user_id, question_id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM submissions WHERE user_id = ? AND question_id = ? ORDER BY submitted_at DESC LIMIT 1',
        [user_id, question_id]
      );
      
      if (rows[0] && rows[0].results) {
        rows[0].results = JSON.parse(rows[0].results);
      }
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async getAssessmentResults(assessment_id) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
           u.username,
           u.email,
           q.title as question_title,
           s.status,
           s.score,
           s.submitted_at,
           s.results
         FROM submissions s
         JOIN questions q ON s.question_id = q.id
         JOIN users u ON s.user_id = u.id
         WHERE q.assessment_id = ?
         ORDER BY u.username, q.id, s.submitted_at DESC`,
        [assessment_id]
      );
      
      return rows.map(row => ({
        ...row,
        results: row.results ? JSON.parse(row.results) : null
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Submission;
