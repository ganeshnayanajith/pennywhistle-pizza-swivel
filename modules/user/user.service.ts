import User from './user.model';
import RegisterUserDTO from './dtos/register-user.dto';
import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import logger from '../../lib/logger';

class UserService {
  async register(userData: RegisterUserDTO) {
    try {
      const { name, email, mobileNumber, password } = userData;

      const existingUser = await User.findOne().or([ { email }, { mobileNumber } ]);
      if (existingUser) {
        throw new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.VALIDATION_ERROR, 'User already exists with the same email or mobile number.');
      }

      const newUser = new User({
        name,
        email,
        mobileNumber,
        password,
      });

      await newUser.save();

      return Promise.resolve({ message: 'User registered successfully!' });

    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default new UserService();
