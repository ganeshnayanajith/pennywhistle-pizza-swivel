import { Schema, Document, Types, model } from 'mongoose';
import { OrderStatusEnum, OrderTypeEnum } from '../../lib/enum';

export interface IOrderItem extends Document {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  totalPrice: number;
}

const orderItemSchema = new Schema<IOrderItem>({
  _id: Types.ObjectId,
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

export interface IOrder extends Document {
  _id: Types.ObjectId;
  type: OrderTypeEnum;
  status: OrderStatusEnum;
  orderItems: IOrderItem[];
  totalItemQuantity: number;
  totalPrice: number;
  userId: Types.ObjectId;
}

const orderSchema = new Schema<IOrder>(
  {
    _id: Types.ObjectId,
    type: { type: String, enum: Object.values(OrderTypeEnum), required: true },
    status: { type: String, enum: Object.values(OrderStatusEnum), required: true },
    orderItems: { type: [ orderItemSchema ], required: true },
    totalItemQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const OrderItem = model<IOrderItem>('OrderItem', orderItemSchema);
export const Order = model<IOrder>('Order', orderSchema);

