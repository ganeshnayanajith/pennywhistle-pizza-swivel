import { Response } from 'express';
import { ERRORS, MESSAGES, HTTP_CODES } from './constant';
import logger from './logger';
import jwt from 'jsonwebtoken';
import secretConfigs from '../secret-configs';

class Utils {
  static async generateToken(data: any): Promise<string> {
    try {
      const opts: jwt.SignOptions = {
        expiresIn: '1d',
      };
      const token: string = jwt.sign(data, secretConfigs.JWT_SECRET, opts);
      return token;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  static async decodeToken(token: string): Promise<any> {
    try {
      const payload: any = await jwt.verify(token, secretConfigs.JWT_SECRET);
      return payload;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  static successResponse(res: Response, status: number, message: string, data: any): Response {
    return res.status(status).send({
      status,
      message,
      data,
      error: null,
    });
  }

  static errorResponse(res: Response, err: any): Response {
    // TODO: Extra configs
    // logger.error(err);
    // console.error(err);

    let status = HTTP_CODES.SERVER_ERROR;
    let error = ERRORS.SERVER_ERROR;
    let message = MESSAGES.SOMETHING_WENT_WRONG;

    if (err.message) {
      message = err.message;
    }

    if (err.errors && err.errors[0] && err.errors[0].message) {
      status = HTTP_CODES.BAD_REQUEST;
      message = err.errors[0].message;
    }

    if (err.name) {
      error = err.name;
    }

    if (err.status) {
      status = err.status;
    }

    return res.status(status).send({
      status,
      error,
      message,
      data: null,
    });
  }
}

export default Utils;
