import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import logger from '../../lib/logger';
import Utils from '../../lib/utils';
import { LoginStaffUserDTO } from './dtos';
import { StaffUser } from './staff-user.model';

class StaffUserService {

  async login(data: LoginStaffUserDTO) {
    try {

      const { username, password } = data;

      const user = await StaffUser.findOne({ username, password });

      if (!user) {
        logger.error(`Staff user not found`);
        return Promise.reject(new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.BAD_REQUEST_ERROR, 'Invalid credentials'));
      }

      const userId = user.id;

      const accessToken = await Utils.generateToken({ userId, username, role: user.role });

      logger.info(`Staff user login successful ${JSON.stringify({ accessToken, user })}`);

      return Promise.resolve({ accessToken, userId });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default new StaffUserService();
