import { LoginStaffUserDTO } from './dtos';
import DTOValidator from '../../lib/dto-validator';

class StaffUserValidator {

  async loginValidation(loginStaffUserDTO: LoginStaffUserDTO) {
    try {
      const { username, password } = loginStaffUserDTO;
      const loginDTO: LoginStaffUserDTO = new LoginStaffUserDTO(username, password);
      await DTOValidator.validateDTO(loginDTO);
      return Promise.resolve(loginDTO);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default new StaffUserValidator();
