export class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Common error factory methods
  export const createNotFoundError = (resource) => {
    return new AppError(`${resource} not found`, 404);
  };
  
  export const createValidationError = (message) => {
    return new AppError(message, 400);
  };
  
  export const createAuthenticationError = () => {
    return new AppError('Not authenticated', 401);
  };
  
  export const createForbiddenError = () => {
    return new AppError('Not authorized to perform this action', 403);
  };