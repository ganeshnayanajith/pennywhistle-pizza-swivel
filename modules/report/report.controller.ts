import { Response, NextFunction } from 'express';
import ReportService from './report.service';
import { HTTP_CODES } from '../../lib/constant';
import Utils from '../../lib/utils';
import { AuthRequest } from '../../lib/security/auth-request';
import QueryValidator from '../../lib/validators/query.validator';

class ReportController {

  async getUsersReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { skip, limit } = await QueryValidator.isValidSkipLimitTwenty(req.query);
      const result = await ReportService.getUsersReport(skip, limit);
      Utils.successResponse(res, HTTP_CODES.OK, 'Users report fetched successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getUserOrdersReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { skip, limit, userId } = await QueryValidator.isValidGetUserOrdersReport(req.query);
      const result = await ReportService.getUserOrdersReport(skip, limit, userId);
      Utils.successResponse(res, HTTP_CODES.OK, 'User orders report fetched successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getOrdersReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { skip, limit, date, status } = await QueryValidator.isValidGetOrdersReport(req.query);
      const result = await ReportService.getOrdersReport(skip, limit, date, status);
      Utils.successResponse(res, HTTP_CODES.OK, 'Orders report fetched successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new ReportController();
