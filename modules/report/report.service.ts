import logger from '../../lib/logger';
import UserService from '../user/user.service';
import { IUser } from '../user/user.model';
import { IOrder } from '../order/order.model';
import OrderService from '../order/order.service';
import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import { OrderStatusEnum } from '../../lib/enum';

// ReportService class to handle report-related operations
class ReportService {

  // function to get a paginated list of users for report purposes
  async getUsersReport(skip: number, limit: number): Promise<{ count: number, users: IUser[] }> {
    try {
      // fetching paginated users and count using the UserService
      const result = await UserService.getUsersAndCount(skip, limit);
      return Promise.resolve(result);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  // function to get a paginated list of orders for a specific user for report purposes
  async getUserOrdersReport(skip: number, limit: number, userId: string): Promise<{
    count: number,
    orders: IOrder[]
  }> {
    try {
      // checking if the user with the provided userId exists. if not reject the promise with a custom HTTP error
      const user = await UserService.getUserById(userId);
      if (!user) {
        return Promise.reject(new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, 'User not found'));
      }

      // fetching paginated user orders and count using the OrderService
      const result = await OrderService.getOrderHistoryAndCount(skip, limit, userId);
      return Promise.resolve(result);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  // function to get a paginated list of orders for report purposes
  async getOrdersReport(skip: number, limit: number, date: string, status: OrderStatusEnum): Promise<{
    count: number,
    orders: IOrder[]
  }> {
    try {
      // fetching paginated orders and count using the OrderService with the provided date and status
      const result = await OrderService.getOrdersAndCount(skip, limit, date, status);
      return Promise.resolve(result);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

}

export default new ReportService();
