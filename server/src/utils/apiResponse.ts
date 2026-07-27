import { Response } from 'express';

export class ApiResponse {
  static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T,
    meta?: Record<string, any>
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta && { meta }),
    });
  }

  static ok<T>(res: Response, message: string, data: T, meta?: Record<string, any>): Response {
    return ApiResponse.success(res, 200, message, data, meta);
  }

  static created<T>(res: Response, message: string, data: T): Response {
    return ApiResponse.success(res, 201, message, data);
  }
}
