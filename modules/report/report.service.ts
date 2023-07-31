import logger from '../../lib/logger';
import UserService from '../user/user.service';
import { IUser } from '../user/user.model';

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

}

export default new ReportService();
