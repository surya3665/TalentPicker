import { Document } from "mongoose";
export type UserRole = 'admin' | 'company' | 'candidate';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  resume?: string;
  companyName?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}