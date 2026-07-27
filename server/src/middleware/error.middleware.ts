import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error = ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`);
  next(error);
};

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  let error = err;

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid format for field '${err.path}': ${err.value}`;
    error = ApiError.badRequest(message);
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation failed for submitted data', errors);
  }

  // Handle Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate value '${value}' entered for field '${field}'. Please use another value.`;
    error = ApiError.badRequest(message);
  }

  // Handle Multer File Limit / Type Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = ApiError.badRequest('File size too large. Maximum allowed size is 5MB.');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const errors = error.errors || [];

  if (statusCode >= 500) {
    logger.error(`[Unhandled Exception] ${message}`, { stack: err.stack });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};
