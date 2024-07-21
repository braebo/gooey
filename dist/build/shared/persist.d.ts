export type PersistedValue<T> = {
    get(): T;
    set(newValue: T): void;
    update(cb: (v: T) => T): void;
    value: T;
};
/**
 * Persists a value in localStorage.
 * @returns An object with a `get` and `set` method that syncs with localStorage.
 *
 * @example
 * ```ts
 * // Let's say 'foo' is already "42" in localStorage:
 *
 * const foo = persist('foo', 5) // initial value won't be used
 *
 * foo.value // 42
 * // or
 * foo.get() // 42
 *
 * foo.value = 123
 * // or
 * foo.set(123)
 *
 * localStorage.getItem('foo') // "123"
 * ```
 */
export declare function persist<T>(
/**
 * The key to store the value under in local storage.
 */
key: string, 
/**
 * The initial value to store if the key is'nt found in local storage.
 * @default undefined
 */
initialValue?: T | undefined, 
/**
 * Whether to print a warning if localStorage is not available.
 * @default false
 */
quiet?: boolean): PersistedValue<T>;
