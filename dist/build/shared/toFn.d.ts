/**
 * Coerces a value to a function.
 */
export declare function toFn<T>(v: T | (() => T)): () => T;
