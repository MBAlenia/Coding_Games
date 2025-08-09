const { pool } = require('../database/db');

class Assessment {
  static async create(assessmentData) {
    const { title, description, created_by } = assessmentData;
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO assessments (title, description, created_by) VALUES (?, ?, ?)',
        [title, description, created_by]
      );
      
      return { id: result.insertId, title, description, created_by };
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT a.*, u.username as creator_name 
         FROM assessments a 
         JOIN users u ON a.created_by = u.id 
         WHERE a.id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await pool.execute(
        `SELECT a.*, u.username as creator_name 
         FROM assessments a 
         JOIN users u ON a.created_by = u.id 
         ORDER BY a.created_at DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByCreator(created_by) {
    try {
      const [rows] = await pool.execute(
        `SELECT a.*, u.username as creator_name 
         FROM assessments a 
         JOIN users u ON a.created_by = u.id 
         WHERE a.created_by = ? 
         ORDER BY a.created_at DESC`,
        [created_by]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, assessmentData) {
    const { title, description } = assessmentData;
    
    try {
      const [result] = await pool.execute(
        'UPDATE assessments SET title = ?, description = ? WHERE id = ?',
        [title, description, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM assessments WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getWithQuestions(id) {
    try {
      // Get assessment
      const assessment = await this.findById(id);
      if (!assessment) return null;

      // Get questions
      const [questions] = await pool.execute(
        'SELECT * FROM questions WHERE assessment_id = ? ORDER BY id',
        [id]
      );

      assessment.questions = questions;
      return assessment;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Assessment;
