const Product = require('../models/Product');
const { processImages } = require('../utils/imageHandler');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/products
 * @desc    Get all available products (public)
 * @access  Public
 */
const getPublicProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12
  } = req.query;

  // Build query for available products only
  const query = {
    status: 'available',
    deletedAt: null
  };

  // Pagination with bounds checking
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 per page for public
  const skip = (pageNum - 1) * limitNum;

  // Execute queries in parallel for performance
  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limitNum)
      .select('-deletedAt')
      .lean(), // Better performance with lean()
    Product.countDocuments(query)
  ]);

  return paginatedResponse(
    res,
    200,
    'Products retrieved successfully',
    products,
    {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  );
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID (public)
 * @access  Public
 */
const getPublicProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    status: 'available',
    deletedAt: null
  });

  if (!product) {
    return errorResponse(
      res,
      404,
      'Product not found',
      null,
      'PRODUCT_NOT_FOUND'
    );
  }

  return successResponse(
    res,
    200,
    'Product retrieved successfully',
    { product }
  );
});

/**
 * @route   GET /api/admin/products
 * @desc    Get all products with filters (admin)
 * @access  Private/Admin
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const {
    status = 'all',
    search = '',
    page = 1,
    limit = 10  // Default 10 products per page for admin
  } = req.query;

  // Build query
  const query = { deletedAt: null };

  // Status filter
  if (status !== 'all') {
    query.status = status;
  }

  // Enhanced search filter - search in title, brand, model, location
  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    query.$or = [
      { title: searchRegex },
      { brand: searchRegex },
      { model: searchRegex },
      { location: searchRegex },
      { description: searchRegex }
    ];
  }

  // Pagination with bounds checking
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 per page
  const skip = (pageNum - 1) * limitNum;

  // Execute queries in parallel for performance
  const [products, total, stats] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limitNum)
      .lean(), // Use lean() for better performance (returns plain JS objects)
    Product.countDocuments(query),
    Product.getStats()
  ]);

  return paginatedResponse(
    res,
    200,
    'Products retrieved successfully',
    products,
    {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      stats
    }
  );
});

/**
 * @route   GET /api/admin/products/:id
 * @desc    Get single product by ID (admin)
 * @access  Private/Admin
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    deletedAt: null
  });

  if (!product) {
    return errorResponse(
      res,
      404,
      'Product not found',
      null,
      'PRODUCT_NOT_FOUND'
    );
  }

  return successResponse(
    res,
    200,
    'Product retrieved successfully',
    { product }
  );
});

/**
 * @route   POST /api/admin/products
 * @desc    Create new product
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, images, year, price, status } = req.body;

  // Process images (upload base64 to cloud)
  const processedImages = await processImages(images);

  // Create product
  const product = await Product.create({
    title,
    description,
    images: processedImages,
    year,
    price,
    status: status || 'available'
  });

  return successResponse(
    res,
    201,
    'Product created successfully',
    { product }
  );
});

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update product
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { title, description, images, year, price, status } = req.body;

  // Find product
  const product = await Product.findOne({
    _id: req.params.id,
    deletedAt: null
  });

  if (!product) {
    return errorResponse(
      res,
      404,
      'Product not found',
      null,
      'PRODUCT_NOT_FOUND'
    );
  }

  // Process images if provided
  let processedImages = product.images;
  if (images && images.length > 0) {
    processedImages = await processImages(images);
  }

  // Update fields
  if (title !== undefined) product.title = title;
  if (description !== undefined) product.description = description;
  if (images !== undefined) product.images = processedImages;
  if (year !== undefined) product.year = year;
  if (price !== undefined) product.price = price;
  if (status !== undefined) product.status = status;

  await product.save();

  return successResponse(
    res,
    200,
    'Product updated successfully',
    { product }
  );
});

/**
 * @route   PATCH /api/admin/products/:id/status
 * @desc    Toggle product status
 * @access  Private/Admin
 */
const toggleProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const product = await Product.findOne({
    _id: req.params.id,
    deletedAt: null
  });

  if (!product) {
    return errorResponse(
      res,
      404,
      'Product not found',
      null,
      'PRODUCT_NOT_FOUND'
    );
  }

  product.status = status;
  await product.save();

  return successResponse(
    res,
    200,
    'Product status updated successfully',
    { product }
  );
});

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete product (soft delete)
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    deletedAt: null
  });

  if (!product) {
    return errorResponse(
      res,
      404,
      'Product not found',
      null,
      'PRODUCT_NOT_FOUND'
    );
  }

  // Soft delete
  await product.softDelete();

  return successResponse(
    res,
    200,
    'Product deleted successfully',
    { deletedId: product._id }
  );
});

/**
 * @route   GET /api/admin/products/stats
 * @desc    Get product statistics
 * @access  Private/Admin
 */
const getProductStats = asyncHandler(async (req, res) => {
  const stats = await Product.getStats();

  return successResponse(
    res,
    200,
    'Statistics retrieved successfully',
    { stats }
  );
});

module.exports = {
  getPublicProducts,
  getPublicProductById,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getProductStats
};
