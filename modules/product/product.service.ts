import { IProduct, Product } from './product.model';
import { CreateProductDTO, UpdateProductDTO } from './dtos';
import { Types } from 'mongoose';
import logger from '../../lib/logger';

class ProductService {
  async createProduct(productData: CreateProductDTO): Promise<IProduct> {
    try {
      // extracting data from the CreateProductDTO object
      const { name, sku, size, price } = productData;

      // generating a new unique ObjectId for the product
      const productId = new Types.ObjectId();

      // creating a new Product instance with the provided data
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
      // finding the product in the database with the provided productId
      const product = await Product.findById(productId).exec();
      return Promise.resolve(product);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async getProductsAndCount(skip: number, limit: number): Promise<{ count: number, products: IProduct[] }> {
    try {
      const [ count, products ] = await Promise.all([
        Product.countDocuments({}),
        Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ]);
      return Promise.resolve({ count, products });
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async updateProduct(productId: string, productData: UpdateProductDTO): Promise<IProduct | null> {
    try {
      // updating the product in the database with the provided productData
      const product = await Product.findByIdAndUpdate(productId, productData, { new: true }).exec();
      return Promise.resolve(product);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }

  async deleteProduct(productId: string): Promise<IProduct | null> {
    try {
      // deleting the product from the database with the provided productId
      const product = await Product.findByIdAndDelete(productId).exec();
      return Promise.resolve(product);
    } catch (error) {
      logger.error(error);
      return Promise.reject(error);
    }
  }
}

export default new ProductService();
