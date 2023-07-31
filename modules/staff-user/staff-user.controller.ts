import { Request, Response, NextFunction } from 'express';
import Utils from '../../lib/utils';
import { HTTP_CODES } from '../../lib/constant';
import { LoginStaffUserDTO } from './dtos';
import StaffUserValidator from './staff-user.validator';
import StaffUserService from './staff-user.service';
import { AuthRequest } from '../../lib/security/auth-request';
import { CreateStaffUserDTO } from './dtos';

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

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: CreateStaffUserDTO = await StaffUserValidator.createValidation(req.body);
      const result = await StaffUserService.create(data);
      Utils.successResponse(res, HTTP_CODES.CREATED, 'Staff user creation successful', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new StaffUserController();
