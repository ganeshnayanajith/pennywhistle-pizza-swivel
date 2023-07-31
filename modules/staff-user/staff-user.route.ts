import { Router } from 'express';
import StaffUserController from './staff-user.controller';
import { authenticator } from '../../lib/security/authenticator';
import { authorizer } from '../../lib/security/authorizer';
import { StaffUserRolesEnum } from '../../lib/enum';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Staff users
 *   description: API endpoints for staff users management
 * definitions:
 *   LoginStaffUserDTO:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *   CreateStaffUserDTO:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       role:
 *         type: string
 *         enum: [Admin, StoreStaff, KitchenStaff, DeliveryStaff]
 */

/**
 * @swagger
 * /staff-user/login:
 *   post:
 *     summary: Login staff user
 *     tags: [Staff users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/LoginStaffUserDTO'
 *     responses:
 *       200:
 *         description: Login Successful
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
 *                     userId:
 *                       type: string
 *                     accessToken:
 *                       type: string
 *                 error:
 *                   type: null
 */
router.post('/login', StaffUserController.login);

/**
 * @swagger
 * /staff-user/create:
 *   post:
 *     summary: Create staff user
 *     tags: [Staff users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateStaffUserDTO'
 *     responses:
 *       200:
 *         description: Staff user creation successful
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
 *                     userId:
 *                       type: string
 *                 error:
 *                   type: null
 */
router.post('/create', authenticator, authorizer([ StaffUserRolesEnum.Admin ]), StaffUserController.create);

export default router;