import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from '../../../lib/enum';

export class UpdateOrderDTO {
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  constructor(status: OrderStatusEnum) {
    this.status = status;
  }
}