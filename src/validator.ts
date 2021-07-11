import validator from "validator";

import { ValidationError } from "./errors.js";

// Max length is listed here:
// https://github.com/lightningnetwork/lnd/blob/fd1f6a7bc46b1e50ff3879b8bd3876d347dbb73d/channeldb/invoices.go#L84
const MAX_MEMO_LENGTH = 1024;
const MIN_PASSWORD_LENGTH = 12;

/**
 * Checks if a string only contains alpha numeric characters
 *
 * @param string The string to check
 */
export function isAlphanumeric(string: string): void {
    isDefined(string);

    if (!validator.isAlphanumeric(string)) {
        throw new ValidationError(
            "Must include only alpha numeric characters."
        );
    }
}

/**
 * Checks if a string only contains alpha numeric characters and spaces
 *
 * @param string The string to check
 */
export function isAlphanumericAndSpaces(string: string): void {
    isDefined(string);

    if (!validator.matches(string, "^[a-zA-Z0-9\\s]*$")) {
        throw new ValidationError(
            "Must include only alpha numeric characters and spaces."
        );
    }
}

/**
 * Checks if a value has a boolean type
 *
 * @param value The value to check
 */
export function isBoolean(value: unknown): void {
    if (value !== true && value !== false) {
        throw new ValidationError("Must be true or false.");
    }
}

/**
 * Checks if a string represents a decimal number
 *
 * @param string The string to check
 */
export function isDecimal(string: string): void {
    if (!validator.isDecimal(string)) {
        throw new ValidationError("Must be decimal.");
    }
}

/**
 * Checks if something is defined
 *
 * @param value The thing to check
 */
export function isDefined(value: unknown): void {
    if (value === undefined) {
        throw new ValidationError("Must define variable.");
    }
}

/**
 * Checks if a string is long enough for a password
 *
 * @param string The string to check
 */
export function isMinPasswordLength(password: string): void {
    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new ValidationError(
            "Must be " + MIN_PASSWORD_LENGTH + " or more characters."
        );
    }
}

/**
 * Checks if a string or number is a positive interger
 *
 * @param string The string or number to check
 */
export function isPositiveInteger(amount: string | number): void {
    if (!validator.isInt(String(amount), { gt: 0 })) {
        throw new ValidationError("Must be positive integer.");
    }
}

/**
 * Checks if a string or number is a positive interger or zero
 *
 * @param string The string or number to check
 */
export function isPositiveIntegerOrZero(amount: unknown): void {
    if (!validator.isInt(String(amount), { gt: -1 })) {
        throw new ValidationError("Must be positive integer.");
    }
}

/**
 * Checks if a value is a string
 *
 * @param value The object to check
 */
export function isString(value: unknown): void {
    if (typeof value !== "string") {
        throw new ValidationError("Object must be of type string.");
    }
}

/**
 * Checks if a string has a valid length for a memo
 *
 * @param string The string to check
 */
export function isValidMemoLength(string: string): void {
    if (Buffer.byteLength(string, "utf8") > MAX_MEMO_LENGTH) {
        throw new ValidationError(
            "Must be less than " + MAX_MEMO_LENGTH + " bytes."
        );
    }
}
