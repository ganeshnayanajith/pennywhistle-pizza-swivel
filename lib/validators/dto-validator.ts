import { validate, ValidationError } from 'class-validator';
import CustomHttpError from '../custom-http-error';
import { ERRORS, HTTP_CODES } from '../constant';

class DTOValidator {

  async validateDTO(dto: any) {
    try {
      const errors: ValidationError[] = await validate(dto);
      if (errors.length > 0) {
        const errorObject = errors[0].constraints;
        // @ts-ignore
        const firstProperty = Object.keys(errorObject)[0];
        // @ts-ignore
        const errorMessage = errorObject[firstProperty];
        return Promise.reject(new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.VALIDATION_ERROR, errorMessage));
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export default new DTOValidator();
