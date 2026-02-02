/**
 * Standard Response Utilities
 * Provides consistent response format across all API endpoints
 */

/**
 * Success Response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Error Response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} details - Error details (optional)
 * @param {string} code - Error code (optional)
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', details = null, code = null) => {
  const response = {
    success: false,
    error: getErrorType(statusCode),
    message,
    timestamp: new Date().toISOString()
  };

  if (code) response.code = code;
  if (details) response.details = details;

  return res.status(statusCode).json(response);
};

/**
 * Get error type from status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} - Error type
 */
const getErrorType = (statusCode) => {
  const errorTypes = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    413: 'Payload Too Large',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    503: 'Service Unavailable'
  };

  return errorTypes[statusCode] || 'Error';
};

/**
 * Pagination Response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {array} data - Array of items
 * @param {object} pagination - Pagination metadata
 */
const paginatedResponse = (res, statusCode = 200, message = 'Success', data = [], pagination = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      total: pagination.total || data.length,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      totalPages: pagination.totalPages || 1
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
