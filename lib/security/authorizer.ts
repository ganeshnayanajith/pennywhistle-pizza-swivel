import { Response, NextFunction } from 'express';
import Utils from '../utils';
import CustomHttpError from '../custom-http-error';
import { HTTP_CODES, ERRORS } from '../constant';
import { AuthRequest } from './auth-request';
import logger from '../logger';

// middleware function for authorization based on user roles
export const authorizer = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // extract the authenticated user information from the request object
      const user = req.user;
      if (!user) {
        // if user information is missing, throw an unauthorized error
        throw new CustomHttpError(HTTP_CODES.UNAUTHORIZED, ERRORS.AUTHORIZATION_ERROR, 'Unauthorized. User not found');
      }

      // check if the user's role is allowed for the current route
      if (!allowedRoles.includes(<string>user?.role)) {
        // if the user's role is not authorized, throw a forbidden error
        throw new CustomHttpError(HTTP_CODES.FORBIDDEN, ERRORS.FORBIDDEN_ERROR, 'Forbidden. User role is not authorized');
      }

      // if the user is authorized, call the next middleware or route handler
      next();

    } catch (err) {
      // if an error occurs during authorization, log the error and return an error response
      logger.error(err);
      Utils.errorResponse(
        res,
        err,
      );
    }
  };
};
