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
 *         name: userId
 *         required: true
 *         description: ID of the user to get user orders
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User orders fetched successfully
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
router.get('/user/orders', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), ReportController.getUserOrders);

export default router;