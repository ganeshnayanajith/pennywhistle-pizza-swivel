import { Response, NextFunction } from 'express';
import lodash from 'lodash';
import moment from 'moment';
import Utils from '../utils';
import CustomHttpError from '../custom-http-error';
import { HTTP_CODES, ERRORS } from '../constant';
import UserService from '../../modules/user/user.service';
import { AuthRequest } from './auth-request';
import { StaffUserRolesEnum, UserRolesEnum } from '../enum';
import StaffUserService from '../../modules/staff-user/staff-user.service';

export const authenticator = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (lodash.has(req.headers, 'authorization')) {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        Utils.errorResponse(
          res,
          new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, 'Authentication token is required'),
        );
      }

      // @ts-ignore
      const payload = await Utils.decodeToken(token);

      if (payload.exp <= moment().unix()) {
        Utils.errorResponse(
          res,
          new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, 'Authentication token is expired'),
        );
      }

      const userId = payload.userId;
      const role = payload.role;

      if (role === UserRolesEnum.Customer) {

        const email = payload.email;

        await UserService.findUserByIdAndEmailAndRole(userId, email, role);

        req.user = {
          userId,
          email,
          role,
        };

      } else if (role === StaffUserRolesEnum.Admin || role === StaffUserRolesEnum.StoreStaff || role === StaffUserRolesEnum.KitchenStaff || role === StaffUserRolesEnum.DeliveryStaff) {

        const username = payload.username;

        await StaffUserService.findUserByIdAndUsernameAndRole(userId, username, role);

        req.user = {
          userId,
          username,
          role,
        };

      } else {
        Utils.errorResponse(
          res,
          new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, 'Authentication failed'),
        );
      }

      next();
    } else {
      Utils.errorResponse(
        res,
        new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, 'Authentication token is required'),
      );
    }
  } catch (err) {
    Utils.errorResponse(
      res,
      new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, (err as Error).message),
    );
  }
};
