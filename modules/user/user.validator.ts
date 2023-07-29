import { RegisterUserDTO } from './dtos';
import { validate, ValidationError } from 'class-validator';
import CustomHttpError from '../../lib/custom-http-error';
import { ERRORS, HTTP_CODES } from '../../lib/constant';

class UserValidator {
  async registerValidation(registerUserDTO: RegisterUserDTO) {
    try {
      const { name, email, mobileNumber, password } = registerUserDTO;
      const userDTO: RegisterUserDTO = new RegisterUserDTO(name, email, mobileNumber, password);
      const errors: ValidationError[] = await validate(userDTO);
      if (errors.length > 0) {
        const errorObject = errors[0].constraints;
        // @ts-ignore
        const firstProperty = Object.keys(errorObject)[0];
        // @ts-ignore
        const errorMessage = errorObject[firstProperty];
        return Promise.reject(new CustomHttpError(HTTP_CODES.BAD_REQUEST, ERRORS.VALIDATION_ERROR, errorMessage));
      }
      return Promise.resolve(userDTO);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default new UserValidator();
