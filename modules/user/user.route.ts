import { Router } from 'express';
import UserController from './user.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for users management
 * definitions:
 *   RegisterUserDTO:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       mobileNumber:
 *         type: string
 *       password:
 *         type: string
 *   LoginUserDTO:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register user
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/RegisterUserDTO'
 *     responses:
 *       201:
 *         description: Registration Successful
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
router.post('/register', UserController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/LoginUserDTO'
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
router.post('/login', UserController.login);

export default router;