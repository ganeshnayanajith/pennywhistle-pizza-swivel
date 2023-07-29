import { Response, NextFunction } from 'express';
import Utils from '../utils';
import CustomHttpError from '../custom-http-error';
import { HTTP_CODES, ERRORS } from '../constant';
import { AuthRequest } from './auth-request';
import logger from '../logger';

export const authorizer = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

      const user = req.user;
      if (!user) {
        throw new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.AUTHORIZATION_ERROR, 'Unauthorized. User not found');
      }

      if (!allowedRoles.includes(<string>user?.role)) {
        throw new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.AUTHORIZATION_ERROR, 'Forbidden. User role is not authorized');
      }

      next();

    } catch (err) {
      logger.error(err);
      Utils.errorResponse(
        res,
        err,
      );
    }
  };
};
