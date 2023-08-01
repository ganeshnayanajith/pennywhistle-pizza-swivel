import { LoginStaffUserDTO } from './dtos';
import DTOValidator from '../../lib/validators/dto-validator';
import { CreateStaffUserDTO } from './dtos';

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

  async createValidation(createStaffUserDTO: CreateStaffUserDTO) {
    try {
      const { username, password, role } = createStaffUserDTO;
      const createDTO: CreateStaffUserDTO = new CreateStaffUserDTO(username, password, role);
      await DTOValidator.validateDTO(createDTO);
      return Promise.resolve(createDTO);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default new StaffUserValidator();
