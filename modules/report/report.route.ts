import { Router } from 'express';
import ReportController from './report.controller';
import { authenticator } from '../../lib/security/authenticator';
import { authorizer } from '../../lib/security/authorizer';
import { StaffUserRolesEnum } from '../../lib/enum';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: API endpoints for report views
 */

/**
 * @swagger
 * /report/users:
 *   get:
 *     summary: Get users list as a report by admin
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                     $ref: '#/definitions/User'
 *                 error:
 *                   type: null
 */
router.get('/users', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), ReportController.getUsers);

/**
 * @swagger
 * /report/user/orders:
 *   get:
 *     summary: Get orders for a user as a report by admin
 *     tags: [Reports]
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
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID of the user to get user orders
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User orders report fetched successfully
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
router.get('/user/orders', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), ReportController.getUserOrdersReport);

/**
 * @swagger
 * /report/orders:
 *   get:
 *     summary: Get orders as a report by admin
 *     tags: [Reports]
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
 *       - in: query
 *         name: date
 *         required: false
 *         description: Date to query orders
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         required: false
 *         description: Status to query orders
 *         schema:
 *           type: string
 *           enum: [Pending, Cancelled, Preparing, ReadyToPickUpFromStore, ReadyToDeliverToHome, Delivered, PickedUpFromStore, Completed]
 *     responses:
 *       200:
 *         description: Orders report fetched successfully
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
 *                   properties:
 *                     count:
 *                       type: number
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         $ref: '#/definitions/Order'
 *                 error:
 *                   type: null
 */
router.get('/orders', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), ReportController.getOrdersReport);

export default router;