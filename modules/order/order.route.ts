import { Router } from 'express';
import OrderController from './order.controller';
import { authenticator } from '../../lib/security/authenticator';
import { authorizer } from '../../lib/security/authorizer';
import { UserRolesEnum } from '../../lib/enum';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API endpoints for orders management
 * definitions:
 *   CreateOrderItemDTO:
 *     type: object
 *     properties:
 *       productId:
 *         type: string
 *       quantity:
 *         type: number
 *   CreateOrderDTO:
 *     type: object
 *     properties:
 *       type:
 *         type: string
 *         enum: [PickUpFromStore, DeliverToHome]
 *       orderItems:
 *         type: array
 *         items:
 *           type: object
 *           $ref: '#/definitions/CreateOrderItemDTO'
 *   OrderItem:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       productId:
 *         type: string
 *       quantity:
 *         type: number
 *       totalPrice:
 *         type: number
 *   Order:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       type:
 *         type: string
 *         enum: [PickUpFromStore, DeliverToHome]
 *       status:
 *         type: string
 *         enum: [Pending, Cancelled, Preparing, ReadyToPickUpFromStore, ReadyToDeliverToHome, Delivered]
 *       orderItems:
 *         type: array
 *         items:
 *           type: object
 *           $ref: '#/definitions/OrderItem'
 *       totalItemQuantity:
 *         type: number
 *       totalPrice:
 *         type: number
 *       userId:
 *         type: string
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateOrderDTO'
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                   $ref: '#/definitions/Order'
 *                 error:
 *                   type: null
 */
router.post('/', authenticator, authorizer([ UserRolesEnum.Customer ]), OrderController.createOrder);

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Get an order by id
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
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
 *                   $ref: '#/definitions/Order'
 *                 error:
 *                   type: null
 */
router.get('/:id', authenticator, authorizer([ UserRolesEnum.Customer ]), OrderController.getOrderById);

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     $ref: '#/definitions/Order'
 *                 error:
 *                   type: null
 */
router.get('/', authenticator, OrderController.getOrderHistory);

export default router;
