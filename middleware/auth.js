const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

/**
 * JWT Authentication Middleware
 * Protects admin routes by verifying JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(
        res,
        401,
        'Authentication required. Please provide a valid token.',
        null,
        'NO_TOKEN'
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return errorResponse(
          res,
          401,
          'Token has expired. Please login again.',
          null,
          'TOKEN_EXPIRED'
        );
      }
      return errorResponse(
        res,
        401,
        'Invalid token. Please login again.',
        null,
        'INVALID_TOKEN'
      );
    }

    // Find user
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return errorResponse(
        res,
        401,
        'User not found. Token is invalid.',
        null,
        'USER_NOT_FOUND'
      );
    }

    if (!user.isActive) {
      return errorResponse(
        res,
        403,
        'Account is deactivated. Please contact support.',
        null,
        'ACCOUNT_DEACTIVATED'
      );
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return errorResponse(
      res,
      500,
      'Authentication failed. Please try again.',
      null,
      'AUTH_ERROR'
    );
  }
};

/**
 * Admin Role Check Middleware
 * Ensures authenticated user has admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(
      res,
      401,
      'Authentication required',
      null,
      'NOT_AUTHENTICATED'
    );
  }

  if (req.user.role !== 'admin') {
    return errorResponse(
      res,
      403,
      'Access denied. Admin privileges required.',
      null,
      'INSUFFICIENT_PERMISSIONS'
    );
  }

  next();
};

/**
 * Generate JWT Token
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Generate Refresh Token (optional)
 * @param {string} userId - User ID
 * @returns {string} - Refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  authenticate,
  requireAdmin,
  generateToken,
  generateRefreshToken
};
