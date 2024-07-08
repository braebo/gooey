/**
 * Coerces a value to a function.
 */
export function toFn(v) {
    if (typeof v === 'function') {
        return v;
    }
    return () => v;
}
