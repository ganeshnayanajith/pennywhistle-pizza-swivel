import logger from '../../lib/logger';
import UserService from '../user/user.service';
import { IUser } from '../user/user.model';
import { IOrder } from '../order/order.model';
import OrderService from '../order/order.service';
import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import { OrderStatusEnum } from '../../lib/enum';

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

  async getUserOrdersReport(skip: number, limit: number, userId: string): Promise<{
    count: number,
    orders: IOrder[]
  }> {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        return Promise.reject(new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, 'User not found'));
      }
      const result = await OrderService.getOrderHistoryAndCount(skip, limit, userId);
      return Promise.resolve(result);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getOrdersReport(skip: number, limit: number, date: string, status: OrderStatusEnum): Promise<{
    count: number,
    orders: IOrder[]
  }> {
    try {
      const result = await OrderService.getOrdersAndCount(skip, limit, date, status);
      return Promise.resolve(result);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

}

export default new ReportService();
