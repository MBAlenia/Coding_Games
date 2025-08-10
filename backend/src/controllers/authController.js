const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = await User.create({ username, email, password, role });
    
    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user needs to set password on first login
    if (user.first_login === 1) {
      // Generate a temporary token for password setup
      const crypto = require('crypto');
      const tempToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
      
      // Store the temporary token
      await User.saveInvitationToken(user.id, tempToken, tokenExpiry);
      
      return res.json({
        message: 'First login - password setup required',
        firstLogin: true,
        setupToken: tempToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    }

    // Validate password for regular login
    const isValidPassword = await User.validatePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      firstLogin: false,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile data for user:', user.email, {
      first_login: user.first_login,
      password_set: !!user.password_hash,
      first_login_type: typeof user.first_login
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      },
      first_login: user.first_login === 1 || user.first_login === true,
      password_set: !!user.password_hash
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const refreshToken = async (req, res) => {
  try {
    // User is already authenticated by middleware
    const token = generateToken(req.user.id);
    
    res.json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({ 
        message: 'If an account exists with this email, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await User.saveResetToken(user.id, resetTokenHash, resetTokenExpiry);

    // Generate reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${email}`;

    // Log to console (email functionality to be added later)
    console.log('\n========================================');
    console.log('PASSWORD RESET REQUEST');
    console.log('========================================');
    console.log('Email:', email);
    console.log('Reset URL:', resetUrl);
    console.log('Token expires in 1 hour');
    console.log('========================================\n');

    res.json({ 
      message: 'If an account exists with this email, a password reset link has been sent.',
      // Include URL in development for testing
      ...(process.env.NODE_ENV === 'development' && { resetUrl })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // Validate inputs
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'Email, token, and new password are required' });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the provided token to compare with database
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Verify token and update password
    const success = await User.resetPassword(user.id, tokenHash, newPassword);
    
    if (!success) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const validateInvitationToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    // Check if token exists and is valid
    const user = await User.findByInvitationToken(token);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired invitation token' });
    }
    
    // Check if token is expired
    const now = new Date();
    const expiry = new Date(user.invitation_token_expiry);
    
    if (now > expiry) {
      return res.status(400).json({ message: 'Invitation token has expired' });
    }
    
    // Return user info for the set password form
    res.json({
      valid: true,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      first_login: user.first_login
    });
  } catch (error) {
    console.error('Validate invitation token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const setFirstPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Find user by invitation token
    const user = await User.findByInvitationToken(token);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired invitation token' });
    }
    
    // Check if token is expired
    const now = new Date();
    const expiry = new Date(user.invitation_token_expiry);
    
    if (now > expiry) {
      return res.status(400).json({ message: 'Invitation token has expired' });
    }
    
    // Set the password and clear the invitation token
    const success = await User.setFirstPassword(user.id, password);
    
    if (!success) {
      return res.status(400).json({ message: 'Failed to set password' });
    }
    
    // Generate JWT token for automatic login
    const authToken = generateToken(user.id);
    
    res.json({
      message: 'Password set successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token: authToken
    });
  } catch (error) {
    console.error('Set first password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
  forgotPassword,
  resetPassword,
  validateInvitationToken,
  setFirstPassword
};
