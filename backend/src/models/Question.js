const { pool } = require('../database/db');

class Question {
  static async create(questionData) {
    const { assessment_id, title, description, language, template_code } = questionData;
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO questions (assessment_id, title, description, language, template_code) VALUES (?, ?, ?, ?, ?)',
        [assessment_id, title, description, language, template_code]
      );
      
      return { id: result.insertId, ...questionData };
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM questions WHERE id = ?',
        [id]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByAssessmentId(assessmentId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM questions WHERE assessment_id = ? ORDER BY id',
        [assessmentId]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, questionData) {
    const { title, description, language, template_code } = questionData;
    
    try {
      const [result] = await pool.execute(
        'UPDATE questions SET title = ?, description = ?, language = ?, template_code = ? WHERE id = ?',
        [title, description, language, template_code, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM questions WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getWithSubmissions(questionId, userId) {
    try {
      const question = await this.findById(questionId);
      if (!question) return null;

      // Get user's submissions for this question
      const [submissions] = await pool.execute(
        'SELECT * FROM submissions WHERE question_id = ? AND user_id = ? ORDER BY submitted_at DESC',
        [questionId, userId]
      );

      question.submissions = submissions.map(sub => ({
        ...sub,
        results: sub.results ? JSON.parse(sub.results) : null
      }));

      return question;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Question;
