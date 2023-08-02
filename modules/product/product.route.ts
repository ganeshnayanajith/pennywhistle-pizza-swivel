import { Router } from 'express';
import ProductController from './product.controller';
import { authenticator } from '../../lib/security/authenticator';
import { authorizer } from '../../lib/security/authorizer';
import { StaffUserRolesEnum } from '../../lib/enum';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for products management
 * definitions:
 *   CreateProductDTO:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       sku:
 *         type: string
 *       size:
 *         type: string
 *         enum: [Small, Regular, Large]
 *       price:
 *         type: number
 *   UpdateProductDTO:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       sku:
 *         type: string
 *       size:
 *         type: string
 *         enum: [Small, Regular, Large]
 *       price:
 *         type: number
 *   Product:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       name:
 *         type: string
 *       sku:
 *         type: string
 *       size:
 *         type: string
 *         enum: ['Small', 'Regular', 'Large']
 *       price:
 *         type: number
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateProductDTO'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   $ref: '#/definitions/Product'
 *                 error:
 *                  type: null
 */
router.post('/', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), ProductController.createProduct);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   $ref: '#/definitions/Product'
 *                 error:
 *                  type: null
 */
router.get('/:id', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), ProductController.getProduct);

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         required: false
 *         description: No of records to skip
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         required: false
 *         description: No of records to limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Products data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         $ref: '#/definitions/Product'
 *                 error:
 *                  type: null
 */
router.get('/', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), ProductController.getProductsAndCount);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UpdateProductDTO'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   $ref: '#/definitions/Product'
 *                 error:
 *                  type: null
 */
router.put('/:id', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), ProductController.updateProduct);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   $ref: '#/definitions/Product'
 *                 error:
 *                  type: null
 */
router.delete('/:id', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), ProductController.deleteProduct);

export default router;
