/**
 * A stringify replacer that handles circular references, undefined values, and functions.
 * - Circular references are replaced with the string `[Circular ~<path>]`
 * where `<path>` is the path to the circular reference relative to the
 * root object, i.e. `[Circular ~.b.c]`.
 * - Functions are replaced with the string `"[Function]"`.
 * - `undefined` values are replaced with the string `"undefined"`.
 *
 * @param obj - The object to stringify.
 * @param indentation - Number of spaces for indentation. Optional.
 */
export declare const stringify: (input: unknown, indentation?: number) => string;
/**
 * A replacer function for `JSON.stringify` that handles circular references,
 * undefined values, and functions with strings.
 * @see {@link stringify}
 */
export declare function serialize(stack: unknown[]): (this: unknown, key: string, value: unknown) => unknown;
