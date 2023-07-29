import { Request, Response, NextFunction } from 'express';
import Utils from '../../lib/utils';
import { HTTP_CODES } from '../../lib/constant';
import { LoginStaffUserDTO } from './dtos';
import StaffUserValidator from './staff-user.validator';
import StaffUserService from './staff-user.service';

class StaffUserController {

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginStaffUserDTO = await StaffUserValidator.loginValidation(req.body);
      const result = await StaffUserService.login(data);
      Utils.successResponse(res, HTTP_CODES.OK, 'Login successful', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new StaffUserController();
