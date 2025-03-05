export const ErrorTypes = {
    NOT_FOUND: "NOT_FOUND",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    INTERNAL_ERROR: "INTERNAL_ERROR",
  };
  
  export const createErrorResponse = (
    type,
    message,
    req,
    additionalData = {}
  ) => {
    const errors = {
      [ErrorTypes.NOT_FOUND]: {
        status: 404,
        code: "RESOURCE_NOT_FOUND",
      },
      [ErrorTypes.VALIDATION_ERROR]: {
        status: 400,
        code: "VALIDATION_ERROR",
      },
      [ErrorTypes.UNAUTHORIZED]: {
        status: 401,
        code: "UNAUTHORIZED",
      },
      [ErrorTypes.FORBIDDEN]: {
        status: 403,
        code: "FORBIDDEN",
      },
      [ErrorTypes.INTERNAL_ERROR]: {
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  
    const error = errors[type];
  
    return {
      status: "error",
      code: error.code,
      message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      ...additionalData,
    };
  };