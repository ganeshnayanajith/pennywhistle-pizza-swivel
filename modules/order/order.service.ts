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

        // retrieving the product details from the ProductService based on productId
        const product = await ProductService.getProduct(productId);
        if (!product) {
          return Promise.reject(new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, `Product with ID ${item.productId} not found`));
        }

        // calculating total price and quantity for each unique order item (a product with any quantity)
        const itemTotalPrice = product.price * quantity;
        totalPrice += itemTotalPrice;
        totalItemQuantity += quantity;

        // creating an OrderItem instance and adding it to the orderItemsArray
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
      // finding the order in the database with the provided orderId and userId
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

      // using Promise.all to fetch order count and orders in parallel with the provided userId
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

      // using Promise.all to fetch order count and orders in parallel with the provided status
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

      // using Promise.all to fetch order count and orders in parallel with the provided order status and type
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
      // finding the order in the database by orderId
      const order = await Order.findById(orderId).exec();
      if (!order) {
        // if order not found, reject the promise with a custom HTTP error
        return Promise.reject(new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, 'Order not found'));
      }

      // checking the role of the user making the status update
      if (role === StaffUserRolesEnum.Admin) {

        // Admin can update from any status to any status
        order.status = status;

      } else if (role === StaffUserRolesEnum.StoreStaff) {

        // StoreStaff can update the status from Pending to Cancelled or from ReadyToPickUpFromStore to PickedUpFromStore
        if (order.status === OrderStatusEnum.Pending && status === OrderStatusEnum.Cancelled) {
          order.status = status;
        } else if (
          order.status === OrderStatusEnum.ReadyToPickUpFromStore &&
          status === OrderStatusEnum.PickedUpFromStore
        ) {
          order.status = status;
        } else {
          // if the status update is not valid, reject the promise with a custom HTTP error
          return Promise.reject(new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.FORBIDDEN_ERROR, 'Invalid status update'));
        }

      } else if (role === StaffUserRolesEnum.KitchenStaff) {

        // KitchenStaff can update the status from Pending to Preparing or from Preparing to ReadyToPickUpFromStore/ReadyToDeliverToHome according to the order type
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

        // DeliveryStaff can update the status from ReadyToDeliverToHome to Delivered
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

      // if date is provided, filter orders based on the given date
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
        // if status is provided, filter orders based on the given status
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
