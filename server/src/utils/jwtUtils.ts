import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AuthUser } from '../types/express.js';
import { ApiError } from './apiError.js';

export interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, config.jwtSecret, options);
};

export const verifyToken = (token: string): AuthUser => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role as any,
    };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token has expired. Please log in again.');
    }
    throw ApiError.unauthorized('Invalid authorization token.');
  }
};
