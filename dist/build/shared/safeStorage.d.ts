export type SafeResult<T, E = Error> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E;
};
/**
 * A safer local storage wrapper using a discriminated union { ok, value } | { ok, error } pattern.
 * @example
 * ```ts
 * const getResult = safeStorage.getItem<{ name: string }>('user')
 * if (getResult.ok) {
 *   console.log('User name:', getResult.value.name)
 * } else {
 *   console.error('Error:', getResult.error.message)
 * }
 *
 * const setResult = safeStorage.setItem('user', { name: 'Alice' })
 * if (setResult.ok) {
 *   console.log('User data saved successfully')
 * } else {
 *   console.error('Error saving user data:', setResult.error.message)
 * }
 * ```
 */
export declare const safeStorage: {
    getItem: <T>(key: string) => SafeResult<T>;
    setItem: <T>(key: string, value: T) => SafeResult<true>;
};
