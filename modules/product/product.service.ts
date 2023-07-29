import { IProduct, Product } from './product.model';
import { CreateProductDTO, UpdateProductDTO } from './dtos';
import { Types } from 'mongoose';
import logger from '../../lib/logger';

class ProductService {
  async createProduct(productData: CreateProductDTO): Promise<IProduct> {
    try {
      const { name, sku, size, price } = productData;
      const productId = new Types.ObjectId();
      const newProduct = new Product({ _id: productId, name, sku, size, price });
      const product: IProduct = await newProduct.save();
      return Promise.resolve(product);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getProduct(productId: string): Promise<IProduct | null> {
    try {
      const product = await Product.findById(productId).exec();
      return Promise.resolve(product);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async updateProduct(productId: string, productData: UpdateProductDTO): Promise<IProduct | null> {
    try {
      const product = await Product.findByIdAndUpdate(productId, productData, { new: true }).exec();
      return Promise.resolve(product);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async deleteProduct(productId: string): Promise<IProduct | null> {
    try {
      const product = await Product.findByIdAndDelete(productId).exec();
      return Promise.resolve(product);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default new ProductService();
