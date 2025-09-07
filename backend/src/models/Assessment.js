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

      // Get questions via junction table
      const [questions] = await pool.execute(
        `SELECT q.*, aq.order_index, aq.points as question_points
         FROM questions q 
         JOIN assessment_questions aq ON q.id = aq.question_id 
         WHERE aq.assessment_id = ? 
         ORDER BY aq.order_index, q.id`,
        [id]
      );

      assessment.questions = questions;
      
      // Calculate total duration from questions' time_limit
      assessment.calculated_duration = questions.reduce((total, question) => {
        return total + (question.time_limit || 0);
      }, 0);

      return assessment;
    } catch (error) {
      throw error;
    }
  }

  static async updateDuration(id) {
    try {
      // Calculate total duration from questions
      const [result] = await pool.execute(
        `SELECT SUM(q.time_limit) as total_duration
         FROM questions q 
         JOIN assessment_questions aq ON q.id = aq.question_id 
         WHERE aq.assessment_id = ?`,
        [id]
      );

      const totalDuration = result[0]?.total_duration || 0;

      // Update assessment duration
      await pool.execute(
        'UPDATE assessments SET duration = ? WHERE id = ?',
        [totalDuration, id]
      );

      return totalDuration;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Assessment;
