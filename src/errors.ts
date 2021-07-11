import type {
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from "express";

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
 * @returns Nothing
 */
export function handleError(
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

export default <ErrorRequestHandler>handleError;
