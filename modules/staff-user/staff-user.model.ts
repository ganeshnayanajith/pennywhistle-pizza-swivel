import { Schema, model, Document, Types } from 'mongoose';
import { StaffUserRolesEnum } from '../../lib/enum';

export interface IStaffUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: StaffUserRolesEnum;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IStaffUser>({
  _id: Types.ObjectId,
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(StaffUserRolesEnum) },
}, { timestamps: true });

export const StaffUser = model<IStaffUser>('StaffUser', userSchema);
