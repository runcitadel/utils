import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * This safe handler is used to wrap our api method
 * so that we always fallback and return an exception
 * if there is an error inside of an async function
 *
 * @param handler The handler function to run safely
 * @deprecated This was only used for express.js, we're migrating to Koa now.
 * @returns The handler function wrapped safely
 */
export function safeHandler(
    handler: (request: Request, res: Response, next: NextFunction) => unknown
): RequestHandler {
    return async (request: Request, res: Response, next: NextFunction) => {
        try {
            return await handler(request, res, next);
        } catch (error) {
            return next(error);
        }
    };
}
