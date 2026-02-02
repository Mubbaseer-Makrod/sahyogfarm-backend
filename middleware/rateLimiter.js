const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/response');

/**
 * Rate Limiter Handler
 */
const rateLimitHandler = (req, res) => {
  return errorResponse(
    res,
    429,
    'Too many requests. Please try again later.',
    {
      retryAfter: req.rateLimit.resetTime
    },
    'RATE_LIMIT_EXCEEDED'
  );
};

/**
 * General API Rate Limiter
 * 100 requests per 15 minutes
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler
});

/**
 * Login Rate Limiter
 * 5 requests per 15 minutes
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5'),
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: rateLimitHandler
});

/**
 * Image Upload & Admin Operations Rate Limiter
 * 200 requests per 15 minutes (industry standard for authenticated admin operations)
 */
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX || '200'),
  message: 'Too many upload requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler
});

module.exports = {
  apiLimiter,
  loginLimiter,
  uploadLimiter
};
