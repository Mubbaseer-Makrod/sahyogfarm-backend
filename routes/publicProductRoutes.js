const express = require('express');
const router = express.Router();
const {
  getPublicProducts,
  getPublicProductById
} = require('../controllers/productController');

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Public Products]
 *     summary: Get all available products
 *     description: Retrieve all products with status 'available' (no authentication required)
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     count:
 *                       type: integer
 *                       example: 10
 */
router.get('/', getPublicProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Public Products]
 *     summary: Get single product
 *     description: Retrieve single product by ID (only if status is 'available')
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getPublicProductById);

module.exports = router;
