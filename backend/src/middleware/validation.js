const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateAssessment = [
  body('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  handleValidationErrors
];

const validateQuestion = [
  body('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  
  body('description')
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  
  body('language')
    .isIn(['javascript', 'python', 'sql'])
    .withMessage('Language must be javascript, python, or sql'),
  
  body('template_code')
    .optional()
    .isString()
    .withMessage('Template code must be a string'),
  
  body('test_cases')
    .isArray({ min: 1 })
    .withMessage('At least one test case is required'),
  
  handleValidationErrors
];

const validateAssessmentUpdate = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be less than 255 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'active', 'archived'])
    .withMessage('Status must be draft, active, or archived'),
  
  handleValidationErrors
];

const validateSubmission = [
  body('code')
    .isLength({ min: 1 })
    .withMessage('Code is required'),
  
  body('language')
    .isIn(['javascript', 'python', 'sql'])
    .withMessage('Language must be javascript, python, or sql'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateAssessment,
  validateAssessmentUpdate,
  validateQuestion,
  validateSubmission,
  handleValidationErrors
};
