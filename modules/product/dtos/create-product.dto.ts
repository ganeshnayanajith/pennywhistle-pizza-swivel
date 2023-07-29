import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductSize } from '../product.model';

export default class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsEnum(ProductSize)
  size: ProductSize;

  @IsNumber()
  price: number;

  constructor(name: string, sku: string, size: ProductSize, price: number) {
    this.name = name;
    this.sku = sku;
    this.size = size;
    this.price = price;
  }
}