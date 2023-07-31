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
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       mobileNumber:
 *         type: string
 *       password:
 *         type: string
 *       role:
 *         type: string
 *         enum: [Customer]
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
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

export default router;