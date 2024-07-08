/**
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function safe_not_equal(a, b) {
    return a != a
        ? b == b
        : a !== b || (a !== null && typeof a === 'object') || typeof a === 'function';
}
const noop = () => { };
function subscribe_to_store(store, run, invalidate) {
    if (store == null) {
        // @ts-expect-error
        run(undefined);
        // @ts-expect-error
        if (invalidate)
            invalidate(undefined);
        return noop;
    }
    // Svelte store takes a private second argument
    // @ts-expect-error
    const unsub = store.subscribe(run, invalidate);
    // Also support RxJS
    // @ts-expect-error
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 *
 * https://svelte.dev/docs/svelte-store#readable
 */
export function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe,
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 *
 * https://svelte.dev/docs/svelte-store#writable
 * @param value - initial value
 */
export function writable(value, start = noop) {
    let stop = null;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) {
                // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(/** @type {T} */ value));
    }
    function subscribe(run, invalidate = noop) {
        /** @type {SubscribeInvalidateTuple<T>} */
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set, update) || noop;
        }
        run(/** @type {T} */ value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0 && stop) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 *
 * https://svelte.dev/docs/svelte-store#get
 * @template T
 * @param {Readable<T>} store
 * @returns {T}
 */
export function get(store) {
    let value;
    subscribe_to_store(store, _ => (value = _))();
    return value;
}
