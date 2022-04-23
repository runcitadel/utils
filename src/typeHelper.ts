import validator from 'validator';

import type {Context} from 'koa';

// Max length is listed here:
// https://github.com/lightningnetwork/lnd/blob/fd1f6a7bc46b1e50ff3879b8bd3876d347dbb73d/channeldb/invoices.go#L84
const MAX_MEMO_LENGTH = 1024;
const MIN_PASSWORD_LENGTH = 12;

/**
 * Checks if a string only contains alpha numeric characters
 *
 * @param string The string to check
 * @param ctx The koa context
 */
export function isAlphanumeric(string: string, ctx: Context): void {
  isDefined(string, ctx);

  if (!validator.isAlphanumeric(string)) {
    ctx.throw('Must include only alpha numeric characters.');
  }
}

/**
 * Checks if a string only contains alpha numeric characters and spaces
 *
 * @param string The string to check
 * @param ctx The koa context
 */
export function isAlphanumericAndSpaces(string: string, ctx: Context): void {
  isDefined(string, ctx);

  if (!validator.matches(string, '^[a-zA-Z0-9\\s]*$')) {
    ctx.throw('Must include only alpha numeric characters and spaces.');
  }
}

/**
 * Checks if a value has a boolean type
 *
 * @param value The value to check
 * @param ctx The koa context
 */
export function isBoolean(value: unknown, ctx: Context): void {
  if (value !== true && value !== false) {
    ctx.throw('Must be true or false.');
  }
}

/**
 * Converts a boolean-like string, boolean or number to a boolean and returns it.
 *
 * For numbers, true equals 1
 * @param value The string or boolean to convert
 */
export function toBoolean(value: unknown): boolean {
  switch (value) {
    case true:
    case 'true':
    case 1:
      return true;
    case false:
    case 'false':
    case 0:
      return false;
    default:
      throw new TypeError('Unsupported value passed to toBoolean()');
  }
}

/**
 * Checks if a value has a boolean-like type
 *
 * @param value The value to check
 * @param ctx The koa context
 */
export function isBooleanLike(value: unknown, ctx: Context): void {
  if (
    value !== 'true' &&
    value !== 'false' &&
    value !== true &&
    value !== false
  ) {
    ctx.throw('Must be true or false.');
  }
}

/**
 * Checks if a string represents a decimal number
 *
 * @param string The string to check
 * @param ctx The koa context
 */
export function isDecimal(string: string, ctx: Context): void {
  if (!validator.isDecimal(string)) {
    ctx.throw('Must be decimal.');
  }
}

/**
 * Checks if something is defined
 *
 * @param value The thing to check
 * @param ctx The koa context
 */
export function isDefined(value: unknown, ctx: Context): void {
  if (value === undefined) {
    ctx.throw('Must define variable.');
  }
}

/**
 * Checks if a string is long enough for a password
 *
 * @param string The string to check
 * @param ctx The koa context
 */
export function isMinPasswordLength(password: string, ctx: Context): void {
  if (password.length < MIN_PASSWORD_LENGTH) {
    ctx.throw('Must be ' + MIN_PASSWORD_LENGTH + ' or more characters.');
  }
}

/**
 * Checks if a string or number is a positive integer
 *
 * @param string The string or number to check
 * @param ctx The koa context
 */
export function isPositiveInteger(amount: string | number, ctx: Context): void {
  if (!validator.isInt(String(amount), {gt: 0})) {
    ctx.throw('Must be positive integer.');
  }
}

/**
 * Checks if a string or number is a positive integer or zero
 *
 * @param string The string or number to check
 * @param ctx The koa context
 */
export function isPositiveIntegerOrZero(amount: unknown, ctx: Context): void {
  if (!validator.isInt(String(amount), {gt: -1})) {
    ctx.throw('Must be positive integer.');
  }
}

/**
 * Checks if a value is a string
 *
 * @param value The object to check
 * @param ctx The koa context
 */
export function isString(value: unknown, ctx: Context): void {
  if (typeof value !== 'string') {
    ctx.throw('Object must be of type string.');
  }
}

/**
 * Checks if a string has a valid length for a memo
 *
 * @param string The string to check
 * @param ctx The koa context
 */
export function isValidMemoLength(string: string, ctx: Context): void {
  if (Buffer.byteLength(string, 'utf8') > MAX_MEMO_LENGTH) {
    ctx.throw('Must be less than ' + MAX_MEMO_LENGTH + ' bytes.');
  }
}
