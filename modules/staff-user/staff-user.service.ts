import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import logger from '../../lib/logger';
import Utils from '../../lib/utils';
import { LoginStaffUserDTO } from './dtos';
import { IStaffUser, StaffUser } from './staff-user.model';
import { CreateStaffUserDTO } from './dtos';
import { Types } from 'mongoose';

class StaffUserService {

  async login(data: LoginStaffUserDTO) {
    try {

      const { username, password } = data;

      // finding the staff user with the provided username
      const user = await StaffUser.findOne({ username });

      if (!user) {
        // if user not found, reject the promise with a custom HTTP error
        logger.error(`Staff user not found with username: ${username}`);
        return Promise.reject(new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.BAD_REQUEST_ERROR, 'Invalid credentials'));
      }

      const userId = user.id;

      // check the password correctness for the username
      const isPasswordCorrect = await Utils.comparePasswords(password, user.password);

      if (!isPasswordCorrect) {
        logger.error(`Incorrect password for userId: ${userId}`);
        return Promise.reject(new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.BAD_REQUEST_ERROR, 'Invalid credentials'));
      }

      // generating an access token for the logged-in staff user with the userId, username, and user role as data for the payload
      const accessToken = await Utils.generateToken({ userId, username, role: user.role });

      logger.info(`Staff user login successful ${JSON.stringify({ accessToken, user })}`);

      return Promise.resolve({ accessToken, userId });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  // function to find a staff user by their userId, username, and role
  async findUserByIdAndUsernameAndRole(userId: string, username: string, role: string): Promise<IStaffUser> {
    try {
      const user = await StaffUser.findOne({ _id: userId, username, role });

      if (!user) {
        logger.error('User not found');
        return Promise.reject(new CustomHttpError(HTTP_CODES.UNPROCESSABLE_ENTITY, ERRORS.UNPROCESSABLE_ENTITY_ERROR, 'Staff user not found'));
      }

      return Promise.resolve(user);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async create(data: CreateStaffUserDTO) {
    try {
      const { username, password, role } = data;

      const userId = new Types.ObjectId();

      // hash the password before storing it in the database
      const hashedPassword = await Utils.hashPassword(password);

      const newStaffUser = new StaffUser({ _id: userId, username, password: hashedPassword, role });

      await newStaffUser.save();

      return Promise.resolve({ userId });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default new StaffUserService();
