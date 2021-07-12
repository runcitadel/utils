import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Converts a string to camelCase
 *
 * @param s The string to convert
 * @returns The converted string
 */
function camelizeString(s: string): string {
    return s.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace("-", "").replace("_", "");
    });
}

/**
 * Recursively converts an object or string to camelCase
 *
 * @param object The object or string to convert
 * @returns The converted string or object
 */
export function camelize(
    object: Record<string, unknown> | string
): string | Record<string, unknown> {
    if (typeof object === "string") return camelizeString(object);
    if (typeof object !== "object") return object;
    if (typeof object === "object") {
        return Object.entries(object).reduce(
            (carry: Record<string, unknown>, [key, value]) => {
                carry[camelizeString(key)] = value;
                return carry;
            },
            {}
        );
    }
    return "";
}

/**
 * Express middleware to convert the request body from snake_case to camelCase
 *
 * This only works if the body has been parsed before (for example by express.json())
 *
 * @param request Express request
 * @param res Express response
 * @param next next function
 */
function camelCaseRequest(
    request: Request,
    res: Response,
    next: NextFunction
): void {
    if (request && request.body) {
        request.body = camelize(request.body);
    }

    next();
}

/**
 * Express middleware to convert the request body from snake_case to camelCase
 *
 * This only works if the body has been parsed before (for example by express.json())
 *
 * @param request Express request
 * @param res Express response
 * @param next next function
 */
export const camelCaseMiddleware: RequestHandler = camelCaseRequest;
