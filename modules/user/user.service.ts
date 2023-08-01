import { IUser, User } from './user.model';
import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import { UserRolesEnum } from '../../lib/enum';
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
        role: UserRolesEnum.Customer,
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

      const accessToken = await Utils.generateToken({ userId, email, role: user.role });

      logger.info(`User login successful ${JSON.stringify({ accessToken, user })}`);

      return Promise.resolve({ accessToken, userId });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async findUserByIdAndEmailAndRole(userId: string, email: string, role: string): Promise<IUser> {
    try {
      const user = await User.findOne({ _id: userId, email, role });

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

  async getUsersAndCount(skip: number, limit: number): Promise<{ count: number, users: IUser[] }> {
    try {
      const [ count, users ] = await Promise.all([
        User.countDocuments({}),
        User.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ]);
      return Promise.resolve({ count, users });
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).exec();
      return Promise.resolve(user);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default new UserService();
