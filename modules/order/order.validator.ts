import { CreateOrderDTO, CreateOrderItemDTO } from './dtos';
import DTOValidator from '../../lib/dto-validator';

class OrderValidator {

  async createValidation(createOrderDTO: CreateOrderDTO) {
    try {
      const { type, orderItems }: CreateOrderDTO = createOrderDTO;

      for (const orderItem of orderItems) {
        const createItemDTO: CreateOrderItemDTO = new CreateOrderItemDTO(orderItem.productId, orderItem.quantity);
        await DTOValidator.validateDTO(createItemDTO);
      }

      const createDTO: CreateOrderDTO = new CreateOrderDTO(type, orderItems);
      await DTOValidator.validateDTO(createDTO);
      return Promise.resolve(createDTO);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default new OrderValidator();
