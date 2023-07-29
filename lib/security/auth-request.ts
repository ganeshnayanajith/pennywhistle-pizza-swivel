import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    username?: string;
    role: string;
  };
}
