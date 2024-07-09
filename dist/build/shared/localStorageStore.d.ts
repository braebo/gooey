import { type Writable } from './store';
export interface StateOptions<T> extends Partial<Writable<T>> {
    /**
     * If provided, localStorage updates will be debounced by
     * the specified number of milliseconds. If both `debounce`
     * and `throttle` are provided, `debounce` will take precedence.
     * @default undefined
     */
    debounce?: number;
    /**
     * If true, localStorage updates will be deferred using
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback | requestIdleCallback},
     * falling back to `requestAnimationFrame` and finally `setTimeout` with
     * a timeout of 0. Particularly useful in hot code paths like render loops.
     * @remarks
     * Deferring can significantly reduce the performance impact of many syncronous localStorage
     * updates running on the main thread. At the time of writing, `requestIdleCallback` is still
     * in Safari Technology Preview, hence the fallbacks.
     * @default false
     */
    defer?: boolean;
    /**
     * Optional callback function that runs after the store is
     * updated and all subscribers have been notified.
     * @default undefined
     */
    onChange?: (v: T) => void;
    /**
     * Log errors to the console.
     * @default import.meta.env.DEV
     */
    verbose?: boolean;
    /**
     * Used for testing.
     * @default false
     * @internal
     */
    browserOverride?: boolean;
}
/**
 * An observable store that uses localStorage to store data asyncronously.
 * It supports Maps and Sets, debouncing and deferring localStorage updates,
 * and syncronizes with localStorage events across tabs.
 * @param key - The key to store the data under.
 * @param initial - The initial value of the store.
 * @param options - {@link StateOptions}
 * @example
 * ```ts
 * const store = localStorageStore('foo', 5)
 * ```
 */
export declare const localStorageStore: <T>(key: string, initial: T, options?: StateOptions<T>) => Writable<T>;
