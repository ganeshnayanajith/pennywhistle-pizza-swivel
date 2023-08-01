import { Response, NextFunction } from 'express';
import ReportService from './report.service';
import { ERRORS, HTTP_CODES } from '../../lib/constant';
import Utils from '../../lib/utils';
import { AuthRequest } from '../../lib/security/auth-request';
import CustomHttpError from '../../lib/custom-http-error';

class ReportController {

  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ReportService.getUsers();
      Utils.successResponse(res, HTTP_CODES.OK, 'Users fetched successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.query.userId) {
        throw new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.BAD_REQUEST_ERROR, 'Query param userId is required');
      }
      const userId = <string>req.query.userId;
      const result = await ReportService.getUserOrders(userId);
      Utils.successResponse(res, HTTP_CODES.OK, 'User orders fetched successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new ReportController();
