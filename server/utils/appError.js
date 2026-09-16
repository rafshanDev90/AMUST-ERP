export const AppError = ( message, statusCode) =>{
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
}

export const createNotFoundError = (message = 'Resource not found') => {
    return AppError(message, 404);
};

export const createBadRequestError = (message = "Bad request data") => createApiError(400, message);
export const createForbiddenError = (message = "Access denied") => createApiError(403, message);