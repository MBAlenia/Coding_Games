const jwt = require('jsonwebtoken');
const { pool: db } = require('../database/db');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from MySQL database
    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = ?',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user role is in allowed roles
    const userRole = req.user.role || 'candidate';
    console.log('Authorization check - User role:', userRole, 'Required roles:', roles);
    
    if (!roles.includes(userRole)) {
      console.log('Access denied - User role not in allowed roles');
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

// Alias for backward compatibility
const requireRole = authorizeRole;

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateToken,
  requireRole,
  authorizeRole,
  generateToken
};
