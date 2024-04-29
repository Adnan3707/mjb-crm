import { Request, Response, NextFunction } from 'express';
import logger from '../helper/logger';
import HttpStatus from '../constant/httpStatus';

export class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Error handling middleware
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error({
        errorMessage: error.message,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        stackTrace: error.stack,
    });

    // Handle specific error types
    if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
            success: false,
            error: {
                message: error.message,
                // stacktrace: error.stack
            },
        });
    }

    // Handle generic errors
    return res.status(HttpStatus.SERVER_ERROR).json({
        success: false,
        error: {
            message: error.message,
            stacktrace: error.stack
        },
    });
};
