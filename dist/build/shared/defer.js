const defer = typeof globalThis.requestIdleCallback !== 'undefined'
    ? globalThis.requestIdleCallback
    : typeof globalThis.requestAnimationFrame !== 'undefined'
        ? globalThis.requestAnimationFrame
        : (fn) => setTimeout(fn, 0);
const cancelDefer = typeof globalThis?.cancelIdleCallback !== 'undefined'
    ? globalThis.cancelIdleCallback
    : typeof globalThis.cancelAnimationFrame !== 'undefined'
        ? globalThis.cancelAnimationFrame
        : globalThis.clearTimeout;

export { cancelDefer, defer };
//# sourceMappingURL=defer.js.map
