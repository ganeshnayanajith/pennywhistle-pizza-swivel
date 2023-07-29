import { Schema, model, Document, Types } from 'mongoose';
import { UserRolesEnum } from '../../lib/enum';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: UserRolesEnum;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  _id: Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(UserRolesEnum), default: UserRolesEnum.Customer },
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
