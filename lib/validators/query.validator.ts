import Joi from 'joi';
import CustomHttpError from '../custom-http-error';
import { ERRORS, HTTP_CODES } from '../constant';
import { OrderStatusEnum } from '../enum';

const schemaSkipLimitTwenty = Joi.object().keys({
  skip: Joi.number().default(0),
  limit: Joi.number().default(20),
});

const schemaGetOrdersReport = Joi.object().keys({
  skip: Joi.number().default(0),
  limit: Joi.number().default(20),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).message('Date must be in the format yyyy-mm-dd'),
  status: Joi.string().valid(OrderStatusEnum.Pending, OrderStatusEnum.Cancelled, OrderStatusEnum.ReadyToPickUpFromStore, OrderStatusEnum.ReadyToDeliverToHome, OrderStatusEnum.Delivered, OrderStatusEnum.PickedUpFromStore, OrderStatusEnum.Completed),
});

class QueryValidator {
  isValidSkipLimitTwenty(obj: any) {
    const { value, error } = schemaSkipLimitTwenty.validate(obj);
    if (error) {
      return Promise.reject(new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.BAD_REQUEST_ERROR, error.message));
    }
    return Promise.resolve(value);
  }

  isValidGetOrdersReport(obj: any) {
    const { value, error } = schemaGetOrdersReport.validate(obj);
    if (error) {
      return Promise.reject(new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.BAD_REQUEST_ERROR, error.message));
    }
    return Promise.resolve(value);
  }
}

export default new QueryValidator();