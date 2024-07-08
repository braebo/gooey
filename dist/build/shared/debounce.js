/**
 * Creates a debounced version of a function.  The debounced function delays
 * invoking `func` until after `duration` milliseconds have elapsed since the
 * last time the debounced function was invoked.
 */
export function debounce(func, duration = 50) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            func(...args);
        }, duration);
    };
}
/**
 * Creates a debounced version of a function.  Unlike {@link debounce},
 * `debounceAsync` accepts a sync _or_ async callback, and returns a
 * promise that resolves when the callback fires.
 *
 * @example
 * ```ts
 * async function log() {
 * 	console.log('FIRST')
 * 	await wait(1000)
 * 	console.log('LAST')
 * }
 *
 * const logDebounce = debounceAsync(log, 500)
 *
 * for (let i = 0; i < 3; i++) {
 * 	console.log(i)
 * 	logDebounce().then(() => {
 * 		console.log('DONE')
 * 	})
 * }
 *
 * // Output:
 *
 * // 0
 * // 1
 * // 2
 * // FIRST
 * // DONE
 * // LAST
 * ```
 */
export function debounceAsync(func, wait) {
    let timeout;
    // Initialize with no-op functions to avoid checking for undefined later.
    let pendingPromise = {
        resolve: () => { },
        reject: () => { },
    };
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const result = func(...args);
            Promise.resolve(result).then(pendingPromise.resolve, pendingPromise.reject);
            // Reset pendingPromise with no-op functions after resolving or rejecting.
            pendingPromise = { resolve: () => { }, reject: () => { } };
        }, wait);
        // Return a new promise that assigns its resolve and reject to pendingPromise.
        // This ensures the promise returned by the most recent call controls the outcome.
        return new Promise((resolve, reject) => {
            pendingPromise = { resolve, reject };
        });
    };
}
