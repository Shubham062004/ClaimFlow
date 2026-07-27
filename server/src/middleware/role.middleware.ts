import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types.js';
import { ApiError } from '../utils/apiError.js';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required.');
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      throw ApiError.forbidden(
        `Access denied. Role '${req.user.role}' is not authorized to perform this action.`
      );
    }

    next();
  };
};
