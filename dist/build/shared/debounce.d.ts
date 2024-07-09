/**
 * Creates a debounced version of a function.  The debounced function delays
 * invoking `func` until after `duration` milliseconds have elapsed since the
 * last time the debounced function was invoked.
 */
export declare function debounce(func: Function, duration?: number): (...args: any[]) => void;
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
export declare function debounceAsync<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => Promise<ReturnType<T>>;
