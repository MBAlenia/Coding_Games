const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All user routes require authentication
router.use(authenticateToken);

// Get all users (admin only)
router.get('/', requireRole('admin'), userController.getAllUsers);

// Create recruiter (admin only)
router.post('/recruiters', requireRole('admin'), userController.createRecruiter);

// Get user by ID (admin or self)
router.get('/:id', userController.getUserById);

// Update user (admin or self)
router.put('/:id', userController.updateUser);

// Delete user (admin only)
router.delete('/:id', requireRole('admin'), userController.deleteUser);

module.exports = router;
