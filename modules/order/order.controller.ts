import { NextFunction, Response } from 'express';
import OrderService from './order.service';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import Utils from '../../lib/utils';
import { CreateOrderDTO } from './dtos';
import { AuthRequest } from '../../lib/security/auth-request';
import CustomHttpError from '../../lib/custom-http-error';
import OrderValidator from './order.validator';
import { OrderStatusEnum, StaffUserRolesEnum } from '../../lib/enum';

class OrderController {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderData: CreateOrderDTO = await OrderValidator.createValidation(req.body);
      // @ts-ignore
      const userId = req.user.userId;
      const createdOrder = await OrderService.createOrder(orderData, userId);
      Utils.successResponse(res, HTTP_CODES.CREATED, 'Order created successfully', createdOrder);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      // @ts-ignore
      const userId = req.user.userId;
      const order = await OrderService.getOrderById(orderId, userId);
      if (!order) {
        throw new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, 'Order not found');
      }
      Utils.successResponse(res, HTTP_CODES.OK, 'Order data fetched successfully', order);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getOrderHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const userId = req.user.userId;
      const orders = await OrderService.getOrderHistory(userId);
      Utils.successResponse(res, HTTP_CODES.OK, 'Order history fetched successfully', orders);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getPendingOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      if (req.user.role !== StaffUserRolesEnum.StoreStaff && req.user.role !== StaffUserRolesEnum.KitchenStaff) {
        throw new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.FORBIDDEN_ERROR, 'Forbidden. User role is not authorized');
      }
      const orders = await OrderService.getOrdersByStatus(OrderStatusEnum.Pending);
      Utils.successResponse(res, HTTP_CODES.OK, 'Pending orders fetched successfully', orders);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new OrderController();