import { IOrder, Order, OrderItem } from './order.model';
import { Types } from 'mongoose';
import logger from '../../lib/logger';
import { CreateOrderDTO } from './dtos';
import { OrderStatusEnum, OrderTypeEnum, StaffUserRolesEnum } from '../../lib/enum';
import ProductService from '../product/product.service';
import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';

class OrderService {
  async createOrder(orderData: CreateOrderDTO, userId: string): Promise<IOrder> {
    try {
      const { type, orderItems } = orderData;

      let totalItemQuantity = 0;
      let totalPrice = 0;

      const orderItemsArray = [];

      for (const item of orderItems) {

        const productId = item.productId;
        const quantity = item.quantity;

        const product = await ProductService.getProduct(productId);
        if (!product) {
          return Promise.reject(new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, `Product with ID ${item.productId} not found`));
        }

        const itemTotalPrice = product.price * quantity;
        totalPrice += itemTotalPrice;
        totalItemQuantity += quantity;

        const orderItem = new OrderItem({
          _id: new Types.ObjectId(),
          productId: new Types.ObjectId(productId),
          quantity,
          totalPrice: itemTotalPrice,
        });

        orderItemsArray.push(orderItem);
      }

      const orderId = new Types.ObjectId();

      const newOrder = new Order({
        _id: orderId,
        type,
        status: OrderStatusEnum.Pending,
        orderItems: orderItemsArray,
        totalItemQuantity,
        totalPrice,
        userId,
      });

      const order: IOrder = await newOrder.save();

      return Promise.resolve(order);

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getOrderById(orderId: string, userId: string): Promise<IOrder | null> {
    try {
      const order = await Order.findOne({ _id: orderId, userId }).exec();
      return Promise.resolve(order);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getOrderHistoryAndCount(skip: number, limit: number, userId: string): Promise<{
    count: number,
    orders: IOrder[]
  }> {
    try {
      const query = { userId };

      const [ count, orders ] = await Promise.all([
        Order.countDocuments(query),
        Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ]);

      return Promise.resolve({ count, orders });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getOrdersAndCountByStatus(skip: number, limit: number, status: OrderStatusEnum): Promise<{
    count: number,
    orders: IOrder[]
  }> {
    try {

      const query = { status };

      const [ count, orders ] = await Promise.all([
        Order.countDocuments(query),
        Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ]);

      return Promise.resolve({ count, orders });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getOrdersAndCountByStatusAndType(skip: number, limit: number, status: OrderStatusEnum, type: OrderTypeEnum): Promise<{
    count: number,
    orders: IOrder[]
  }> {
    try {

      const query = { status, type };

      const [ count, orders ] = await Promise.all([
        Order.countDocuments(query),
        Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ]);

      return Promise.resolve({ count, orders });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatusEnum, role: StaffUserRolesEnum): Promise<IOrder> {
    try {
      const order = await Order.findById(orderId).exec();
      if (!order) {
        return Promise.reject(new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, 'Order not found'));
      }

      if (role === StaffUserRolesEnum.Admin) {
        // Admin can update from any status to any status
        order.status = status;
      } else if (role === StaffUserRolesEnum.StoreStaff) {
        if (order.status === OrderStatusEnum.Pending && status === OrderStatusEnum.Cancelled) {
          order.status = status;
        } else if (
          order.status === OrderStatusEnum.ReadyToPickUpFromStore &&
          status === OrderStatusEnum.PickedUpFromStore
        ) {
          order.status = status;
        } else {
          return Promise.reject(new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.FORBIDDEN_ERROR, 'Invalid status update'));
        }
      } else if (role === StaffUserRolesEnum.KitchenStaff) {
        if (order.status === OrderStatusEnum.Pending && status === OrderStatusEnum.Preparing) {
          order.status = status;
        } else if (
          order.type === OrderTypeEnum.PickUpFromStore &&
          order.status === OrderStatusEnum.Preparing &&
          status === OrderStatusEnum.ReadyToPickUpFromStore
        ) {
          order.status = status;
        } else if (
          order.type === OrderTypeEnum.DeliverToHome &&
          order.status === OrderStatusEnum.Preparing &&
          status === OrderStatusEnum.ReadyToDeliverToHome
        ) {
          order.status = status;
        } else {
          return Promise.reject(new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.FORBIDDEN_ERROR, 'Invalid status update'));
        }
      } else if (role === StaffUserRolesEnum.DeliveryStaff) {
        if (
          order.status === OrderStatusEnum.ReadyToDeliverToHome &&
          status === OrderStatusEnum.Delivered
        ) {
          order.status = status;
        } else {
          return Promise.reject(new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.FORBIDDEN_ERROR, 'Invalid status update'));
        }
      } else {
        return Promise.reject(new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.FORBIDDEN_ERROR, 'Invalid role'));
      }

      // Save the order after updating the status
      await order.save();

      return Promise.resolve(order);

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getOrdersAndCount(skip: number, limit: number, date: string, status: OrderStatusEnum) {
    try {
      const query: any = {};

      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        query.createdAt = {
          $gte: startDate,
          $lt: endDate,
        };
      }

      if (status) {
        query.status = status;
      }

      const [ count, orders ] = await Promise.all([
        Order.countDocuments(query),
        Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ]);

      return Promise.resolve({ count, orders });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default new OrderService();
