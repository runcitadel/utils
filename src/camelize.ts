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
    object: Record<string, unknown> | string | unknown
): string | Record<string, unknown> | unknown {
    if (typeof object === "string") return camelizeString(object);
    // If object is an array, recursively convert each element
    if (Array.isArray(object)) {
        return object.map((element) => camelize(element));
    }
    if (typeof object !== "object") return object;
    if (typeof object === "object") {
        return Object.entries(<Record<string, unknown>>object).reduce(
            (carry: Record<string, unknown>, [key, value]) => {
                carry[camelizeString(key)] = camelize(value);
                return carry;
            },
            {}
        );
    }
    return "";
}
