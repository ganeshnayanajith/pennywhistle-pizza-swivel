import { Response, NextFunction } from 'express';
import ReportService from './report.service';
import { HTTP_CODES } from '../../lib/constant';
import Utils from '../../lib/utils';
import { AuthRequest } from '../../lib/security/auth-request';

class ReportController {

  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ReportService.getUsers();
      Utils.successResponse(res, HTTP_CODES.OK, 'Users fetched successful', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new ReportController();
