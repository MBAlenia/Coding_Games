const { pool: db } = require('../database/db');

// Get all candidates (non-admin users)
exports.getCandidates = async (req, res) => {
  try {
    const [candidates] = await db.execute(`
      SELECT 
        id, email, first_name, last_name, phone, company, 
        position, experience_years, skills, resume_url, 
        linkedin_url, github_url, notes, status, 
        created_at, last_login
      FROM users 
      WHERE role = 'candidate' OR role IS NULL
      ORDER BY created_at DESC
    `);
    
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des candidats' });
  }
};

// Get single candidate with detailed info
exports.getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [candidates] = await db.execute(`
      SELECT 
        id, email, first_name, last_name, phone, company, 
        position, experience_years, skills, resume_url, 
        linkedin_url, github_url, notes, status, 
        created_at, last_login
      FROM users 
      WHERE id = ? AND (role = 'candidate' OR role IS NULL)
    `, [id]);
    
    if (candidates.length === 0) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }
    
    res.json(candidates[0]);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du candidat' });
  }
};

// Create new candidate
exports.createCandidate = async (req, res) => {
  try {
    const {
      email, 
      first_name, 
      last_name,
      username // Optional username, defaults to email
    } = req.body;
    
    // Validate required fields - only 4 fields needed
    if (!email || !first_name || !last_name) {
      return res.status(400).json({ 
        message: 'Email, first name and last name are required' 
      });
    }
    
    // Check if email already exists
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'This email is already in use' });
    }
    
    // Insert new candidate without password - they'll set it on first login
    const [result] = await db.execute(`
      INSERT INTO users (
        email, 
        first_name, 
        last_name, 
        password_hash,
        username, 
        role,
        status, 
        first_login,
        created_at
      ) VALUES (?, ?, ?, NULL, ?, 'candidate', 'active', 1, NOW())
    `, [
      email, 
      first_name, 
      last_name, 
      username || email // Use email as username if not provided
    ]);
    
    res.status(201).json({
      id: result.insertId,
      message: 'Candidate created successfully'
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ message: 'Error creating candidate' });
  }
};

// Update candidate
exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Build dynamic update query
    const fields = [];
    const values = [];
    
    const allowedFields = [
      'email', 'first_name', 'last_name', 'phone', 'company',
      'position', 'experience_years', 'skills', 'resume_url',
      'linkedin_url', 'github_url', 'notes', 'status'
    ];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }
    
    if (fields.length === 0) {
      return res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
    }
    
    values.push(id);
    
    const [result] = await db.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ? AND (role = 'candidate' OR role IS NULL)`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }
    
    res.json({ message: 'Candidat mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du candidat' });
  }
};

// Delete candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.execute(
      'DELETE FROM users WHERE id = ? AND (role = \'candidate\' OR role IS NULL)',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }
    
    res.json({ message: 'Candidat supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du candidat' });
  }
};

// Get candidate submissions with details
exports.getCandidateSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    
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
    `, [id]);
    
    // Get test results for each submission
    for (let submission of submissions) {
      const [testResults] = await db.execute(`
        SELECT 
          test_case_index,
          input,
          expected_output,
          actual_output,
          passed,
          execution_time,
          error_message
        FROM test_results
        WHERE submission_id = ?
        ORDER BY test_case_index
      `, [submission.id]);
      
      submission.test_results = testResults;
    }
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching candidate submissions:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des soumissions' });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total candidates
    const [totalCandidatesResult] = await db.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = \'candidate\' OR role IS NULL'
    );
    
    // Active candidates
    const [activeCandidatesResult] = await db.execute(
      'SELECT COUNT(*) as count FROM users WHERE (role = \'candidate\' OR role IS NULL) AND status = \'active\''
    );
    
    // Total assessments
    const [totalAssessmentsResult] = await db.execute(
      'SELECT COUNT(*) as count FROM assessments'
    );
    
    // Completed submissions (passed or failed)
    const [completedSubmissionsResult] = await db.execute(`
      SELECT COUNT(*) as count 
      FROM submissions 
      WHERE status IN ('passed', 'failed', 'completed')
    `);
    
    res.json({
      totalCandidates: totalCandidatesResult[0].count,
      activeCandidates: activeCandidatesResult[0].count,
      totalAssessments: totalAssessmentsResult[0].count,
      completedSubmissions: completedSubmissionsResult[0].count
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

// Add candidate history entry
exports.addCandidateHistory = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { action, details } = req.body;
    const performedBy = req.user.id; // From auth middleware
    
    await db.execute(`
      INSERT INTO candidate_history (candidate_id, action, details, performed_by, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `, [candidateId, action, JSON.stringify(details), performedBy]);
    
    res.status(201).json({ message: 'Historique ajouté avec succès' });
  } catch (error) {
    console.error('Error adding candidate history:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'historique' });
  }
};

// Get candidate history
exports.getCandidateHistory = async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const [history] = await db.execute(`
      SELECT 
        h.id,
        h.action,
        h.details,
        h.created_at,
        u.first_name as performed_by_first_name,
        u.last_name as performed_by_last_name
      FROM candidate_history h
      JOIN users u ON h.performed_by = u.id
      WHERE h.candidate_id = ?
      ORDER BY h.created_at DESC
    `, [candidateId]);
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching candidate history:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
};
