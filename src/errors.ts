import type { Request, Response, NextFunction } from "express";

/**
 * @deprecated This was only used for express.js, we're migrating to Koa now.
 */
export class NodeError extends Error {
    statusCode?: number;
    constructor(message: string, statusCode?: number) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.statusCode = statusCode;
    }
}

/**
 * @deprecated This was only used for express.js, we're migrating to Koa now.
 */
export class ValidationError extends Error {
    statusCode?: number;
    constructor(message: string, statusCode?: number) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.statusCode = statusCode || 400;
    }
}

/**
 * @deprecated This was only used for express.js, we're migrating to Koa now.
 */
export class BitcoindError extends Error {
    statusCode?: number;
    error: unknown = undefined;
    constructor(
        message: string,
        error: unknown = undefined,
        statusCode?: number
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
    }
}

/**
 * @deprecated This was only used for express.js, we're migrating to Koa now.
 */
export class LndError extends Error {
    statusCode?: number;
    error: unknown = undefined;
    constructor(
        message: string,
        error: unknown = undefined,
        statusCode?: number
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
    }
}

/**
 * @deprecated This was only used for express.js, we're migrating to Koa now.
 */
export type CustomError =
    | NodeError
    | ValidationError
    | LndError
    | BitcoindError;

/**
 * Express error handler to make sure errors a logged and return the right status code
 *
 * @param err The error
 * @param req The expres request
 * @param res The express response
 * @param next The next function
 * @deprecated This was only used for express.js, we're migrating to Koa now.
 * @returns Nothing
 */
export function errorHandlerMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const statusCode = (<CustomError>err).statusCode || 500;
    const route = req.url || "";
    const message = err.message || "";

    console.warn(`[WARNING] ${message} on ${route} with ${statusCode}`);
    console.warn(err.stack);

    res.status(statusCode).json(message);

    return next();
}
