export declare const defer: typeof requestIdleCallback | typeof requestAnimationFrame | ((fn: () => void) => NodeJS.Timeout);
export declare const cancelDefer: typeof cancelIdleCallback;
