import { Request, Response, NextFunction } from 'express';
import { CreateProductDTO, UpdateProductDTO } from './dtos';
import ProductService from './product.service';
import CustomHttpError from '../../lib/custom-http-error';
import { HTTP_CODES, ERRORS } from '../../lib/constant';
import Utils from '../../lib/utils';
import ProductValidator from './product.validator';
import { AuthRequest } from '../../lib/security/auth-request';
import QueryValidator from '../../lib/validators/query.validator';

class ProductController {
  async createProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const productData: CreateProductDTO = await ProductValidator.createValidation(req.body);
      const result = await ProductService.createProduct(productData);
      Utils.successResponse(res, HTTP_CODES.CREATED, 'Product created successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const result = await ProductService.getProduct(productId);
      if (!result) {
        throw new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, 'Product not found');
      }
      Utils.successResponse(res, HTTP_CODES.OK, 'Product data fetched successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async getProductsAndCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, limit } = await QueryValidator.isValidSkipLimitTwenty(req.query);
      const result = await ProductService.getProductsAndCount(skip, limit);
      Utils.successResponse(res, HTTP_CODES.OK, 'Products data fetched successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const productData: UpdateProductDTO = await ProductValidator.updateValidation(req.body);
      const result = await ProductService.updateProduct(productId, productData);
      if (!result) {
        throw new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, 'Product not found');
      }
      Utils.successResponse(res, HTTP_CODES.OK, 'Product updated successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const result = await ProductService.deleteProduct(productId);
      if (!result) {
        throw new CustomHttpError(HTTP_CODES.NOT_FOUND, ERRORS.NOT_FOUND_ERROR, 'Product not found');
      }
      Utils.successResponse(res, HTTP_CODES.OK, 'Product deleted successfully', result);
    } catch (err) {
      Utils.errorResponse(res, err);
    }
  }
}

export default new ProductController();
