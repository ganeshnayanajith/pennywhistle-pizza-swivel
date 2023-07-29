import { IUser, User } from './user.model';
import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import logger from '../../lib/logger';
import Utils from '../../lib/utils';
import { LoginUserDTO, RegisterUserDTO } from './dtos';
import { Types } from 'mongoose';

class UserService {
  async register(userData: RegisterUserDTO) {
    try {
      const { name, email, mobileNumber, password } = userData;

      const existingUser = await User.findOne().or([ { email }, { mobileNumber } ]);
      if (existingUser) {
        return Promise.reject(new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.VALIDATION_ERROR, 'User already exists with the same email or mobile number.'));
      }

      const userId = new Types.ObjectId();

      const newUser = new User({
        _id: userId,
        name,
        email,
        mobileNumber,
        password,
      });

      await newUser.save();

      return Promise.resolve({ userId });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async login(data: LoginUserDTO) {
    try {

      const { email, password } = data;

      const user = await User.findOne({ email, password });

      if (!user) {
        logger.error(`User not found`);
        return Promise.reject(new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.BAD_REQUEST_ERROR, 'Invalid credentials'));
      }

      const userId = user.id;

      const accessToken = await Utils.generateToken({ userId, name: user.name, email });

      logger.info(`User login successful ${JSON.stringify({ accessToken, user })}`);

      return Promise.resolve({ accessToken, userId });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async findUserByIdAndEmail(userId: string, email: string): Promise<IUser> {
    try {
      const user = await User.findOne({ _id: userId, email });

      if (!user) {
        logger.error('User not found');
        return Promise.reject(new CustomHttpError(HTTP_CODES.UNPROCESSABLE_ENTITY, ERRORS.UNPROCESSABLE_ENTITY_ERROR, 'User not found'));
      }

      return Promise.resolve(user);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default new UserService();
