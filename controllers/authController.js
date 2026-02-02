const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return errorResponse(
      res,
      401,
      'Invalid credentials',
      { email: 'Email or password is incorrect' },
      'INVALID_CREDENTIALS'
    );
  }

  // Check if account is active
  if (!user.isActive) {
    return errorResponse(
      res,
      403,
      'Account is deactivated',
      null,
      'ACCOUNT_DEACTIVATED'
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return errorResponse(
      res,
      401,
      'Invalid credentials',
      { password: 'Email or password is incorrect' },
      'INVALID_CREDENTIALS'
    );
  }

  // Update last login
  await user.updateLastLogin();

  // Generate token
  const token = generateToken(user._id);

  // Return user data and token
  return successResponse(
    res,
    200,
    'Login successful',
    {
      user: user.toSafeObject(),
      token
    }
  );
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // User is already attached by auth middleware
  return successResponse(
    res,
    200,
    'User retrieved successfully',
    {
      user: req.user.toSafeObject()
    }
  );
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // In JWT, logout is handled client-side by removing token
  // This endpoint can be used for logging purposes or token blacklisting
  return successResponse(
    res,
    200,
    'Logged out successfully',
    {}
  );
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
const refreshToken = asyncHandler(async (req, res) => {
  // Generate new token
  const newToken = generateToken(req.user._id);

  return successResponse(
    res,
    200,
    'Token refreshed successfully',
    {
      token: newToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  );
});

/**
 * @route   POST /api/auth/register (Admin Only - For Creating New Admins)
 * @desc    Register new admin user
 * @access  Private/Admin
 */
const register = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(
      res,
      409,
      'User already exists',
      { email: 'This email is already registered' },
      'USER_EXISTS'
    );
  }

  // Create new user
  const user = await User.create({
    email,
    name,
    password,
    role: 'admin'
  });

  // Generate token
  const token = generateToken(user._id);

  return successResponse(
    res,
    201,
    'User registered successfully',
    {
      user: user.toSafeObject(),
      token
    }
  );
});

module.exports = {
  login,
  getMe,
  logout,
  refreshToken,
  register
};
