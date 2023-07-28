import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export default User;
