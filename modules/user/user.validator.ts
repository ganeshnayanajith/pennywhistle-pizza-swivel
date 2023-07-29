import { LoginUserDTO, RegisterUserDTO } from './dtos';
import DTOValidator from '../../lib/dto-validator';

class UserValidator {

  async registerValidation(registerUserDTO: RegisterUserDTO) {
    try {
      const { name, email, mobileNumber, password } = registerUserDTO;
      const registerDTO: RegisterUserDTO = new RegisterUserDTO(name, email, mobileNumber, password);
      await DTOValidator.validateDTO(registerDTO);
      return Promise.resolve(registerDTO);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async loginValidation(loginUserDTO: LoginUserDTO) {
    try {
      const { email, password } = loginUserDTO;
      const loginDTO: LoginUserDTO = new LoginUserDTO(email, password);
      await DTOValidator.validateDTO(loginDTO);
      return Promise.resolve(loginDTO);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default new UserValidator();
