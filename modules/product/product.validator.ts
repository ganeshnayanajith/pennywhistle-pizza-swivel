import { CreateProductDTO, UpdateProductDTO } from './dtos';
import DTOValidator from '../../lib/dto-validator';

class ProductValidator {

  async createValidation(createProductDTO: CreateProductDTO) {
    try {
      const { name, sku, size, price } = createProductDTO;
      const createDTO: CreateProductDTO = new CreateProductDTO(name, sku, size, price);
      await DTOValidator.validateDTO(createDTO);
      return Promise.resolve(createDTO);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateValidation(updateProductDTO: UpdateProductDTO) {
    try {
      const { name, sku, size, price } = updateProductDTO;
      const updateDTO: UpdateProductDTO = new UpdateProductDTO(name, sku, size, price);
      await DTOValidator.validateDTO(updateDTO);
      return Promise.resolve(updateDTO);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default new ProductValidator();
