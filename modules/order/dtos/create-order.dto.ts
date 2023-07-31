import { IsEnum, IsNotEmpty, IsString, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { OrderTypeEnum } from '../../../lib/enum';

export class CreateOrderItemDTO {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  quantity: number;

  constructor(productId: string, quantity: number) {
    this.productId = productId;
    this.quantity = quantity;
  }
}

export class CreateOrderDTO {
  @IsNotEmpty()
  @IsEnum(OrderTypeEnum)
  type: OrderTypeEnum;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  orderItems: CreateOrderItemDTO[];

  constructor(type: OrderTypeEnum, orderItems: CreateOrderItemDTO[]) {
    this.type = type;
    this.orderItems = orderItems;
  }
}