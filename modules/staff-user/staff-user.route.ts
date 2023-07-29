import { Router } from 'express';
import StaffUserController from './staff-user.controller';

const router = Router();

router.post('/login', StaffUserController.login);

export default router;