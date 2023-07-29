import { Schema, model, Document } from 'mongoose';

export enum ProductSize {
  Small = 'Small',
  Regular = 'Regular',
  Large = 'Large',
}

export interface IProduct extends Document {
  name: string;
  sku: string;
  size: ProductSize;
  price: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  size: { type: String, enum: Object.values(ProductSize), required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

export const Product = model<IProduct>('Product', productSchema);
