/**
 * Creates a debounced version of a function.  The debounced function delays
 * invoking `func` until after `duration` milliseconds have elapsed since the
 * last time the debounced function was invoked.
 */
function debounce(func, duration = 50) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            func(...args);
        }, duration);
    };
}

export { debounce };
//# sourceMappingURL=debounce.js.map
