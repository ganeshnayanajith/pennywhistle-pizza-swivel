import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductSizeEnum } from '../../../lib/enum';

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
  @IsEnum(ProductSizeEnum)
  size?: ProductSizeEnum;

  @IsOptional()
  @IsNumber()
  price?: number;

  constructor(name?: string, sku?: string, size?: ProductSizeEnum, price?: number) {
    this.name = name;
    this.sku = sku;
    this.size = size;
    this.price = price;
  }
}