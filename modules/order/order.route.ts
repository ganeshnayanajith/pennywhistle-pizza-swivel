import { Router } from 'express';
import OrderController from './order.controller';
import { authenticator } from '../../lib/security/authenticator';
import { authorizer } from '../../lib/security/authorizer';
import { UserRolesEnum } from '../../lib/enum';

const router = Router();

router.post('/', authenticator, authorizer([ UserRolesEnum.Customer ]), OrderController.createOrder);
router.get('/:id', authenticator, authorizer([ UserRolesEnum.Customer ]), OrderController.getOrderById);
router.get('/', authenticator, OrderController.getOrderHistory);

export default router;
