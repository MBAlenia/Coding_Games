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

    // Get questions for this assessment using the junction table
    const [questions] = await db.execute(`
      SELECT q.*, aq.order_index, aq.points
      FROM questions q
      JOIN assessment_questions aq ON q.id = aq.question_id
      WHERE aq.assessment_id = ? 
      ORDER BY aq.order_index
    `, [id]);

    // Format questions with parsed JSON fields
    const formattedQuestions = questions.map(q => ({
      ...q,
      test_cases: q.test_cases ? JSON.parse(q.test_cases) : [],
      tags: q.tags ? JSON.parse(q.tags) : []
    }));

    assessment.questions = formattedQuestions;

    res.json(assessment);
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get questions for an assessment
const getAssessmentQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [questions] = await db.execute(`
      SELECT q.*, aq.order_index, aq.points
      FROM questions q
      JOIN assessment_questions aq ON q.id = aq.question_id
      WHERE aq.assessment_id = ? 
      ORDER BY aq.order_index
    `, [id]);
    
    const formattedQuestions = questions.map(q => ({
      ...q,
      test_cases: q.test_cases ? JSON.parse(q.test_cases) : [],
      tags: q.tags ? JSON.parse(q.tags) : []
    }));
    
    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching assessment questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, language, difficulty } = req.body;

    // Check if assessment exists and user has permission
    const [assessments] = await db.execute('SELECT * FROM assessments WHERE id = ?', [id]);
    
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.execute(
      `UPDATE assessments 
       SET title = ?, description = ?, duration = ?, language = ?, difficulty = ? 
       WHERE id = ?`,
      [title, description, duration, language, difficulty, id]
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

    // Check if assessment exists and user has permission
    const [assessments] = await db.execute('SELECT * FROM assessments WHERE id = ?', [id]);
    
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Check permissions
    if (req.user.role !== 'admin' && assessment.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await db.execute('DELETE FROM assessments WHERE id = ?', [id]);

    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAssessment,
  getAssessments,
  getAssessment,
  getAssessmentQuestions,
  updateAssessment,
  deleteAssessment
};
