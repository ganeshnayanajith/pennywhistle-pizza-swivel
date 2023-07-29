import { Request, Response, NextFunction } from 'express';
import Utils from '../../lib/utils';
import UserService from './user.service';
import { HTTP_CODES } from '../../lib/constant';
import { LoginUserDTO, RegisterUserDTO } from './dtos';
import UserValidator from './user.validator';

class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RegisterUserDTO = await UserValidator.registerValidation(req.body);
      const result = await UserService.register(data);
      Utils.successResponse(res, HTTP_CODES.CREATED, 'Registration successful', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginUserDTO = await UserValidator.loginValidation(req.body);
      const result = await UserService.login(data);
      Utils.successResponse(res, HTTP_CODES.OK, 'Login successful', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new UserController();
