const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getProductStats
} = require('../controllers/productController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  toggleStatusValidation,
  productQueryValidation
} = require('../middleware/validation');
const { uploadLimiter } = require('../middleware/rateLimiter');

// Apply authentication to all admin routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * @swagger
 * /api/admin/products/stats:
 *   get:
 *     tags: [Admin Products]
 *     summary: Get product statistics
 *     description: Retrieve statistics for all products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 15
 *                         available:
 *                           type: integer
 *                           example: 10
 *                         sold:
 *                           type: integer
 *                           example: 5
 *                         recent:
 *                           type: integer
 *                           example: 3
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', getProductStats);

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     tags: [Admin Products]
 *     summary: Get all products with filters
 *     description: Retrieve all products with optional filters and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, sold, all]
 *         description: Filter by status (default all)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Items per page (default 20)
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', productQueryValidation, getAllProducts);

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     tags: [Admin Products]
 *     summary: Create new product
 *     description: Create a new product with base64 image upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: Image size too large
 */
router.post('/', uploadLimiter, createProductValidation, createProduct);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   get:
 *     tags: [Admin Products]
 *     summary: Get single product
 *     description: Retrieve single product by ID (admin view)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', productIdValidation, getProductById);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     tags: [Admin Products]
 *     summary: Update product
 *     description: Update existing product (partial update supported)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', uploadLimiter, productIdValidation, updateProductValidation, updateProduct);

/**
 * @swagger
 * /api/admin/products/{id}/status:
 *   patch:
 *     tags: [Admin Products]
 *     summary: Toggle product status
 *     description: Change product status between 'available' and 'sold'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, sold]
 *                 example: sold
 *     responses:
 *       200:
 *         description: Product status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/status', toggleStatusValidation, toggleProductStatus);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     tags: [Admin Products]
 *     summary: Delete product
 *     description: Soft delete product (sets deletedAt timestamp)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedId:
 *                       type: string
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', productIdValidation, deleteProduct);

module.exports = router;
