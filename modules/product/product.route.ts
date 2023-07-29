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
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   $ref: '#/definitions/CreateProductDTO'
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
 *                 data:
 *                   type: object
 *                   $ref: '#/definitions/CreateProductDTO'
 */
router.get('/:id', ProductController.getProduct);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   $ref: '#/definitions/UpdateProductDTO'
 */
router.put('/:id', ProductController.updateProduct);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   $ref: '#/definitions/UpdateProductDTO'
 */
router.delete('/:id', ProductController.deleteProduct);

export default router;
