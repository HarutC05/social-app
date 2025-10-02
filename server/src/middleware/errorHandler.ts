import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
    statusCode?: number;
    details?: any;
}

export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error(
        process.env.NODE_ENV === "production"
            ? err.message
            : err.stack || err.message
    );

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(err.details && { details: err.details }),
    });
}
