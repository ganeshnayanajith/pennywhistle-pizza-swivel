import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductSize } from '../product.model';

export default class UpdateProductDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsEnum(ProductSize)
  size?: ProductSize;

  @IsOptional()
  @IsNumber()
  price?: number;

  constructor(name?: string, sku?: string, size?: ProductSize, price?: number) {
    this.name = name;
    this.sku = sku;
    this.size = size;
    this.price = price;
  }
}