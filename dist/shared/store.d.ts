//#region src/shared/store.d.ts
/** Cleanup logic callback. */
type Invalidator<T> = (value?: T) => void;
/** Callback to inform of a value updates. */
type Subscriber<T> = (value: T) => void;
/** Unsubscribes from value updates. */
type Unsubscriber = () => void;
/** Callback to update a value. */
type Updater<T> = (value: T) => T;
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

/** Readable interface for subscribing. */
interface Readable<T> {
  /**
   * Subscribe on value changes.
   * @param run subscription callback
   * @param invalidate cleanup callback
   */
  subscribe(this: void, run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber;
}
/** Writable interface for both updating and subscribing. */
interface Writable<T> extends Readable<T> {
  /**
   * Set value and inform subscribers.
   * @param value to set
   */
  set(this: void, value: T): void;
  /**
   * Update value using callback and inform subscribers.
   * @param updater callback
   */
  update(this: void, updater: Updater<T>): void;
}
//#endregion
export { Writable };
//# sourceMappingURL=store.d.ts.map