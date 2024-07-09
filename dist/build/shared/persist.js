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
function persist(
/**
 * The key to store the value under in local storage.
 */
key, 
/**
 * The initial value to store if the key is'nt found in local storage.
 * @default undefined
 */
initialValue = undefined, 
/**
 * Whether to print a warning if localStorage is not available.
 * @default false
 */
quiet = false) {
    const bail = () => {
        if (typeof localStorage === 'undefined') {
            if (!quiet)
                console.warn(`localStorage is not available for key "${key}"`);
            return true;
        }
        else {
            return false;
        }
    };
    return {
        get() {
            if (bail())
                return initialValue;
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : initialValue;
        },
        set(newValue) {
            if (bail())
                return;
            localStorage.setItem(key, JSON.stringify(newValue));
        },
        get value() {
            return this.get();
        },
        set value(v) {
            this.set(v);
        },
    };
}

export { persist };
//# sourceMappingURL=persist.js.map
