import { CreateOrderDTO } from './dtos';
import DTOValidator from '../../lib/dto-validator';

class OrderValidator {

  async createValidation(createOrderDTO: CreateOrderDTO) {
    try {
      const { type, orderItems } = createOrderDTO;
      const createDTO: CreateOrderDTO = new CreateOrderDTO(type, orderItems);
      await DTOValidator.validateDTO(createDTO);
      return Promise.resolve(createDTO);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default new OrderValidator();
