import { Document, Types } from 'mongoose';

export enum UserRole {
  PATIENT = 'Patient',
  INSURER = 'Insurer',
  ADMIN = 'Admin',
}

export interface IUser {
  _id: Types.ObjectId;
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserDocument extends Omit<IUser, 'id'>, Document {}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}
