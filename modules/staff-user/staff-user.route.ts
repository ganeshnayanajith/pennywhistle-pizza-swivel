import { Router } from 'express';
import StaffUserController from './staff-user.controller';

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

export default router;