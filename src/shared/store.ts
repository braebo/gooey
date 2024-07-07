/** Cleanup logic callback. */
type Invalidator<T> = (value?: T) => void

/** Pair of subscriber and invalidator. */
type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator<T>]

/** Callback to inform of a value updates. */
type Subscriber<T> = (value: T) => void

/** Unsubscribes from value updates. */
type Unsubscriber = () => void

/** Callback to update a value. */
type Updater<T> = (value: T) => T

/**
 * Start and stop notification callbacks.
 * This function is called when the first subscriber subscribes.
 *
 * @param set - Function that sets the value of the store.
 * @param update - Function that sets the value of the store after passing thecurrent value to the
 * update function.
 * @returns Optionally, a cleanup function that is called when the last remaining subscriber
 * unsubscribes.
 */
type StartStopNotifier<T> = (
	set: (value: T) => void,
	update: (fn: Updater<T>) => void,
) => void | (() => void)

/** Readable interface for subscribing. */
export interface Readable<T> {
	/**
	 * Subscribe on value changes.
	 * @param run subscription callback
	 * @param invalidate cleanup callback
	 */
	subscribe(this: void, run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber
}

/** Writable interface for both updating and subscribing. */
export interface Writable<T> extends Readable<T> {
	/**
	 * Set value and inform subscribers.
	 * @param value to set
	 */
	set(this: void, value: T): void

	/**
	 * Update value using callback and inform subscribers.
	 * @param updater callback
	 */
	update(this: void, updater: Updater<T>): void
}

/**
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function safe_not_equal(a: unknown, b: unknown): boolean {
	return a != a
		? b == b
		: a !== b || (a !== null && typeof a === 'object') || typeof a === 'function'
}

const noop = () => {}

function subscribe_to_store<T>(
	store: Readable<T> | null | undefined,
	run: (value: T) => void,
	invalidate?: (value: T) => void,
): () => void {
	if (store == null) {
		// @ts-expect-error
		run(undefined)

		// @ts-expect-error
		if (invalidate) invalidate(undefined)

		return noop
	}

	// Svelte store takes a private second argument
	// @ts-expect-error
	const unsub = store.subscribe(run, invalidate)

	// Also support RxJS
	// @ts-expect-error
	return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub
}

const subscriber_queue: Array<SubscribeInvalidateTuple<any> | any> = []

/**
 * Creates a `Readable` store that allows reading by subscription.
 *
 * https://svelte.dev/docs/svelte-store#readable
 */
export function readable<T>(value: T, start: StartStopNotifier<T>): Readable<T> {
	return {
		subscribe: writable(value, start).subscribe,
	}
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 *
 * https://svelte.dev/docs/svelte-store#writable
 * @param value - initial value
 */
export function writable<T>(value: T, start: StartStopNotifier<T> = noop): Writable<T> {
	let stop: Unsubscriber | null = null

	const subscribers: Set<SubscribeInvalidateTuple<T>> = new Set()

	function set(new_value: T): void {
		if (safe_not_equal(value, new_value)) {
			value = new_value
			if (stop) {
				// store is ready
				const run_queue = !subscriber_queue.length
				for (const subscriber of subscribers) {
					subscriber[1]()
					subscriber_queue.push(subscriber, value)
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1])
					}
					subscriber_queue.length = 0
				}
			}
		}
	}

	function update(fn: Updater<T>): void {
		set(fn(/** @type {T} */ value))
	}

	function subscribe(run: Subscriber<T>, invalidate: Invalidator<T> = noop): Unsubscriber {
		/** @type {SubscribeInvalidateTuple<T>} */
		const subscriber: SubscribeInvalidateTuple<T> = [run, invalidate]
		subscribers.add(subscriber)
		if (subscribers.size === 1) {
			stop = start(set, update) || noop
		}
		run(/** @type {T} */ value)
		return () => {
			subscribers.delete(subscriber)
			if (subscribers.size === 0 && stop) {
				stop()
				stop = null
			}
		}
	}

	return { set, update, subscribe }
}

/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 *
 * https://svelte.dev/docs/svelte-store#get
 * @template T
 * @param {Readable<T>} store
 * @returns {T}
 */
export function get<T>(store: Readable<T>): T {
	let value: T | undefined
	subscribe_to_store(store, _ => (value = _))()
	return value as T
}
