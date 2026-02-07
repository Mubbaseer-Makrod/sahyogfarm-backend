const { body, param, query, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

/**
 * Validation Result Checker
 * Checks for validation errors and sends error response
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorDetails = {};
    errors.array().forEach(err => {
      errorDetails[err.path || err.param] = err.msg;
    });

    return errorResponse(
      res,
      400,
      'Validation failed',
      errorDetails,
      'VALIDATION_ERROR'
    );
  }

  next();
};

/**
 * Login Validation Rules
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  validate
];

/**
 * Create Product Validation Rules
 */
const createProductValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  
  body('images')
    .exists({ checkNull: true }).withMessage('Images are required')
    .isArray({ min: 1, max: 10 }).withMessage('Product must have between 1 and 10 images'),

  body('images.*')
    .isString().withMessage('Each image must be a base64 string or URL'),
  
  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['available', 'sold']).withMessage('Status must be either available or sold'),
  
  validate
];

/**
 * Update Product Validation Rules
 */
const updateProductValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  
  body('images')
    .optional()
    .isArray({ min: 1, max: 10 }).withMessage('Product must have between 1 and 10 images'),
  
  body('year')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['available', 'sold']).withMessage('Status must be either available or sold'),
  
  validate
];

/**
 * Product ID Validation
 */
const productIdValidation = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID format'),
  
  validate
];

/**
 * Toggle Status Validation
 */
const toggleStatusValidation = [
  param('id')
    .isMongoId().withMessage('Invalid product ID format'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['available', 'sold']).withMessage('Status must be either available or sold'),
  
  validate
];

/**
 * Query Validation for Product List
 */
const productQueryValidation = [
  query('status')
    .optional()
    .isIn(['available', 'sold', 'all']).withMessage('Invalid status filter'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query too long'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  validate
];

module.exports = {
  validate,
  loginValidation,
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  toggleStatusValidation,
  productQueryValidation
};
