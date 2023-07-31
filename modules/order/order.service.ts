import { IOrder, Order, OrderItem } from './order.model';
import { Types } from 'mongoose';
import logger from '../../lib/logger';
import { CreateOrderDTO } from './dtos';
import { OrderStatusEnum } from '../../lib/enum';
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

  async getOrderHistory(userId: string): Promise<IOrder[]> {
    try {
      const orders = await Order.find({ userId }).exec();
      return Promise.resolve(orders);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default new OrderService();
