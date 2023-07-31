import { Schema, Document, Types, model } from 'mongoose';
import { OrderStatusEnum, OrderTypeEnum } from '../../lib/enum';

export interface IOrderItem extends Document {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
}

const orderItemSchema = new Schema<IOrderItem>({
  _id: Types.ObjectId,
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

export interface IOrder extends Document {
  _id: Types.ObjectId;
  totalItemQuantity: number;
  totalPrice: number;
  status: OrderStatusEnum;
  type: OrderTypeEnum;
  orderItems: IOrderItem[];
}

const orderSchema = new Schema<IOrder>(
  {
    totalItemQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: Object.values(OrderStatusEnum), required: true },
    type: { type: String, enum: Object.values(OrderTypeEnum), required: true },
    orderItems: { type: [ orderItemSchema ], required: true },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', orderSchema);

