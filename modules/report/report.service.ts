import logger from '../../lib/logger';
import UserService from '../user/user.service';
import { IUser } from '../user/user.model';
import { IOrder } from '../order/order.model';
import OrderService from '../order/order.service';
import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';

class ReportService {

  async getUsers(): Promise<IUser[]> {
    try {
      const users = await UserService.getUsers();
      return Promise.resolve(users);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        return Promise.reject(new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, 'User not found'));
      }
      const orders = await OrderService.getOrderHistory(userId);
      return Promise.resolve(orders);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

}

export default new ReportService();
