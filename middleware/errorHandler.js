const { errorResponse } = require('../utils/response');

/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized error responses
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return errorResponse(
      res,
      400,
      'Validation failed',
      errors,
      'VALIDATION_ERROR'
    );
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(
      res,
      409,
      `${field} already exists`,
      { field },
      'DUPLICATE_ERROR'
    );
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return errorResponse(
      res,
      400,
      'Invalid ID format',
      { field: err.path },
      'INVALID_ID'
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(
      res,
      401,
      'Invalid token',
      null,
      'INVALID_TOKEN'
    );
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(
      res,
      401,
      'Token expired',
      null,
      'TOKEN_EXPIRED'
    );
  }

  // Custom application errors
  if (err.statusCode) {
    return errorResponse(
      res,
      err.statusCode,
      err.message,
      err.details || null,
      err.code || null
    );
  }

  // Default server error
  return errorResponse(
    res,
    500,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null,
    'SERVER_ERROR'
  );
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  return errorResponse(
    res,
    404,
    `Route ${req.method} ${req.path} not found`,
    null,
    'NOT_FOUND'
  );
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
