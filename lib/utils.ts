import { Response } from 'express';
import { ERRORS, MESSAGES, HTTP_CODES, SALT_ROUNDS } from './constant';
import logger from './logger';
import jwt from 'jsonwebtoken';
import secretConfigs from '../secret-configs';
import bcrypt from 'bcrypt';
import CustomHttpError from './custom-http-error';

class Utils {
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);
      return Promise.resolve(hashedPassword);
    } catch (error) {
      return Promise.reject(new CustomHttpError(HTTP_CODES.SERVER_ERROR, ERRORS.SERVER_ERROR, 'Error hashing password'));
    }
  }

  static async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const result = await bcrypt.compare(password, hashedPassword);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(new CustomHttpError(HTTP_CODES.SERVER_ERROR, ERRORS.SERVER_ERROR, 'Error comparing passwords'));
    }
  }

  static async generateToken(data: any): Promise<string> {
    try {
      const opts: jwt.SignOptions = {
        expiresIn: '1d',
      };
      const token: string = jwt.sign(data, secretConfigs.JWT_SECRET, opts);
      return Promise.resolve(token);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  static async decodeToken(token: string): Promise<any> {
    try {
      const payload: any = await jwt.verify(token, secretConfigs.JWT_SECRET);
      return Promise.resolve(payload);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
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
