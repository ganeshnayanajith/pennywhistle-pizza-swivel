import { Request, Response, NextFunction } from 'express';
import Utils from '../../lib/utils';
import UserService from './user.service';
import { HTTP_CODES } from '../../lib/constant';
import { RegisterUserDTO } from './dtos';
import UserValidator from './user.validator';

class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: RegisterUserDTO = await UserValidator.registerValidation(req.body);
      const result = await UserService.register(userData);
      Utils.successResponse(res, HTTP_CODES.CREATED, 'Registration successful', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new UserController();
