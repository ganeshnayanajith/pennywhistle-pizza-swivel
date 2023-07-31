import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from '../../../lib/enum';

export class UpdateOrderStatusDTO {
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  constructor(status: OrderStatusEnum) {
    this.status = status;
  }
}