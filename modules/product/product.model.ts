import { Schema, model, Document } from 'mongoose';
import { ProductSizeEnum } from '../../lib/enum';

export interface IProduct extends Document {
  name: string;
  sku: string;
  size: ProductSizeEnum;
  price: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  size: { type: String, enum: Object.values(ProductSizeEnum), required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

export const Product = model<IProduct>('Product', productSchema);
