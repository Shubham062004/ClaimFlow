import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // 2. Fallback to cookies if available
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication token is missing. Please log in.');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Ensure user still exists in database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw ApiError.unauthorized('The user belonging to this token no longer exists.');
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
