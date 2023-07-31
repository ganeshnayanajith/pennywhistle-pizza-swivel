import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductSizeEnum } from '../../../lib/enum';

export default class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsEnum(ProductSizeEnum)
  size: ProductSizeEnum;

  @IsNumber()
  price: number;

  constructor(name: string, sku: string, size: ProductSizeEnum, price: number) {
    this.name = name;
    this.sku = sku;
    this.size = size;
    this.price = price;
  }
}