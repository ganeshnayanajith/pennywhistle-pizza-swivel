import { Router } from 'express';
import OrderController from './order.controller';
import { authenticator } from '../../lib/security/authenticator';
import { authorizer } from '../../lib/security/authorizer';
import { StaffUserRolesEnum, UserRolesEnum } from '../../lib/enum';

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
 *         enum: [Pending, Cancelled, Preparing, ReadyToPickUpFromStore, ReadyToDeliverToHome, Delivered, PickedUpFromStore, Completed]
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
 *   UpdateOrderStatusDTO:
 *     type: object
 *     properties:
 *       status:
 *         type: string
 *         enum: [Pending, Cancelled, Preparing, ReadyToPickUpFromStore, ReadyToDeliverToHome, Delivered, PickedUpFromStore, Completed]
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
 * /order/user/history:
 *   get:
 *     summary: Get order history for a customer
 *     tags: [Orders]
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
router.get('/user/history', authenticator, authorizer([ UserRolesEnum.Customer ]), OrderController.getOrderHistoryAndCount);

/**
 * @swagger
 * /order/staff-user/pending:
 *   get:
 *     summary: Get pending orders for store staff, kitchen staff, and admin users
 *     tags: [Orders]
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
 *         description: Pending orders retrieved successfully
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
router.get('/staff-user/pending', authenticator, authorizer([ StaffUserRolesEnum.StoreStaff, StaffUserRolesEnum.KitchenStaff, StaffUserRolesEnum.Admin ]), OrderController.getPendingOrders);

/**
 * @swagger
 * /order/staff-user/ready-to-deliver:
 *   get:
 *     summary: Get ready to deliver orders for delivery staff and admin users
 *     tags: [Orders]
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
 *         description: Ready to deliver orders retrieved successfully
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
router.get('/staff-user/ready-to-deliver', authenticator, authorizer([ StaffUserRolesEnum.DeliveryStaff, StaffUserRolesEnum.Admin ]), OrderController.getReadyToDeliverOrders);

/**
 * @swagger
 * /order/{id}:
 *   put:
 *     summary: Update order status by staff users
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UpdateOrderStatusDTO'
 *     responses:
 *       200:
 *         description: Order status updated successfully
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
router.put('/:id', authenticator, authorizer([ StaffUserRolesEnum.StoreStaff, StaffUserRolesEnum.KitchenStaff, StaffUserRolesEnum.DeliveryStaff, StaffUserRolesEnum.Admin ]), OrderController.updateOrderStatus);

export default router;
