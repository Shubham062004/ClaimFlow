export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: any[];
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, errors: any[] = [], isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message: string, errors: any[] = []): ApiError {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized access. Please login.'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden. You do not have permission to perform this action.'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'Requested resource not found.'): ApiError {
    return new ApiError(404, message);
  }

  static internal(message = 'Internal server error occurred.'): ApiError {
    return new ApiError(500, message, [], false);
  }
}
