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

// middleware function for authenticating requests using JWT token
export const authenticator = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // check if authorization header is present in the request
    if (lodash.has(req.headers, 'authorization')) {
      // extracting the token from the authorization header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        Utils.errorResponse(
          res,
          new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, 'Authentication token is required'),
        );
      }

      // decode the token to extract the payload
      // @ts-ignore
      const payload = await Utils.decodeToken(token);

      // check if the token is expired
      if (payload.exp <= moment().unix()) {
        Utils.errorResponse(
          res,
          new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, 'Authentication token is expired'),
        );
      }

      const userId = payload.userId;
      const role = payload.role;

      // check the user role and perform role-based validation
      if (role === UserRolesEnum.Customer) {

        // for customer role, validate user based on email
        const email = payload.email;

        await UserService.findUserByIdAndEmailAndRole(userId, email, role);

        req.user = {
          userId,
          email,
          role,
        };

      } else if (role === StaffUserRolesEnum.Admin || role === StaffUserRolesEnum.StoreStaff || role === StaffUserRolesEnum.KitchenStaff || role === StaffUserRolesEnum.DeliveryStaff) {

        // for staff roles, validate user based on username
        const username = payload.username;

        await StaffUserService.findUserByIdAndUsernameAndRole(userId, username, role);

        req.user = {
          userId,
          username,
          role,
        };

      } else {
        // if the user role is not recognized, return an error response
        Utils.errorResponse(
          res,
          new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, 'Authentication failed'),
        );
      }

      // if everything is valid, call the next middleware or route handler
      next();

    } else {
      // if authorization header is missing, return an error response
      Utils.errorResponse(
        res,
        new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, 'Authentication token is required'),
      );
    }
  } catch (err) {
    // if an error occurs during authentication, return an error response
    Utils.errorResponse(
      res,
      new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHENTICATION_ERROR, (err as Error).message),
    );
  }
};
