import { NextFunction, Response } from 'express';
import OrderService from './order.service';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import Utils from '../../lib/utils';
import { CreateOrderDTO, UpdateOrderStatusDTO } from './dtos';
import { AuthRequest } from '../../lib/security/auth-request';
import CustomHttpError from '../../lib/custom-http-error';
import OrderValidator from './order.validator';
import { OrderStatusEnum, OrderTypeEnum, StaffUserRolesEnum } from '../../lib/enum';
import QueryValidator from '../../lib/validators/query.validator';

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

  async getOrderHistoryAndCount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const userId = req.user.userId;
      const { skip, limit } = await QueryValidator.isValidSkipLimitTwenty(req.query);
      const result = await OrderService.getOrderHistoryAndCount(skip, limit, userId);
      Utils.successResponse(res, HTTP_CODES.OK, 'Order history fetched successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getPendingOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      if (req.user.role !== StaffUserRolesEnum.StoreStaff && req.user.role !== StaffUserRolesEnum.KitchenStaff && req.user.role !== StaffUserRolesEnum.Admin) {
        throw new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.FORBIDDEN_ERROR, 'Forbidden. User role is not authorized');
      }
      const orders = await OrderService.getOrdersByStatus(OrderStatusEnum.Pending);
      Utils.successResponse(res, HTTP_CODES.OK, 'Pending orders fetched successfully', orders);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getReadyToDeliverOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      if (req.user.role !== StaffUserRolesEnum.DeliveryStaff && req.user.role !== StaffUserRolesEnum.Admin) {
        throw new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.FORBIDDEN_ERROR, 'Forbidden. User role is not authorized');
      }
      const orders = await OrderService.getOrdersByStatusAndType(OrderStatusEnum.ReadyToDeliverToHome, OrderTypeEnum.DeliverToHome);
      Utils.successResponse(res, HTTP_CODES.OK, 'Ready to deliver orders fetched successfully', orders);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const role: StaffUserRolesEnum = req.user.role;
      const orderId = req.params.id;
      const { status }: UpdateOrderStatusDTO = await OrderValidator.updateStatusValidation(req.body);
      const orders = await OrderService.updateOrderStatus(orderId, status, role);
      Utils.successResponse(res, HTTP_CODES.OK, 'Orders status updated successfully', orders);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new OrderController();