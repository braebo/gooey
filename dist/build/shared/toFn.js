/**
 * Coerces a value to a function.
 */
function toFn(v) {
    if (typeof v === 'function') {
        return v;
    }
    return () => v;
}

export { toFn };
//# sourceMappingURL=toFn.js.map
