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
export const safeStorage = {
    getItem: (key) => {
        try {
            const value = localStorage.getItem(key);
            if (value === null) {
                return { ok: false, error: new Error(`No item found for key: ${key}`) };
            }
            return { ok: true, value: JSON.parse(value) };
        }
        catch (e) {
            return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return { ok: true, value: true };
        }
        catch (e) {
            return { ok: false, error: e instanceof Error ? e : new Error(String(e)) };
        }
    },
};
