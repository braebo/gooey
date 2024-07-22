import type { Writable } from './store';
export interface PrimitiveState<T> extends Writable<T> {
    readonly isState: true;
    readonly value: T;
    onChange: (cb: (v: T) => void) => void;
    set(this: void, value: T): void;
    refresh(): void;
}
export interface ArrayState<T> extends PrimitiveState<T[]> {
    push: (item: T) => void;
}
export interface MapState<K, V> extends PrimitiveState<Map<K, V>> {
    /**
     * Set value and inform subscribers.
     *
     * Note: To update a map, use the `setKey` and `deleteKey` methods.
     */
    set: (value: Map<K, V>) => void;
    setKey: (key: K, value: V) => void;
    deleteKey: (key: K) => void;
}
export interface SetState<T> extends PrimitiveState<Set<T>> {
    add: (item: T) => void;
    delete: (item: T) => void;
}
export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
export type UnionState<T> = {
    set: (value: T) => void;
} & Omit<PrimitiveState<T>, 'set'>;
export type State<T> = IsUnion<T> extends true ? UnionState<T> : T extends Array<infer U> ? ArrayState<U> : T extends Map<infer K, infer V> ? MapState<K, V> : T extends Set<infer U> ? SetState<U> : PrimitiveState<T>;
export interface StateOptions<T> extends Partial<Writable<T>> {
    /**
     * If provided, the store will be persisted to local storage
     * under the specified key.
     * @default undefined
     */
    key?: string;
    /**
     * If provided, localStorage updates will be debounced by
     * the specified number of milliseconds. If both `debounce`
     * and `throttle` are provided, `debounce` will take precedence.
     */
    debounce?: number;
    /**
     * Optional callback function that runs after the store is
     * updated and all subscribers have been notified.
     */
    onChange?: (v: T) => void;
}
/**
 * An advanced store factory with additional features:
 *
 * - Support for Maps, Sets, and Arrays (enabling methods like `.push` and `.add`).
 * - A `.get` method for retrieving the current value of the store.
 * - Optional `onChange` callback for adding side effects without subscribing.
 * - Optional `key` argument for persisting the store to local storage.
 *
 * @param defaultValue - The default value of the store.
 * @param options - {@link StateOptions}
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * 	import { state } from 'fractils'
 *
 * 	const foo = state([1, 2, 3], { key: 'foo' }) // persisted to local storage
 * 	foo.push(4)
 * 	foo.push('5') // Type error
 *
 * 	const bar = state(new Map<string, number>())
 * 	bar.setKey('count', 21) // `set` is taken, so we use `setKey` and `deleteKey`
 *
 * 	const baz = state(new Set<number>())
 * 	baz.add(5)
 * 	baz.push(6) // Type error
 * </script>
 *
 * <h1>{$foo} {$bar} {$baz}</h1>
 * ```
 */
export declare function state<T>(defaultValue: T, options?: StateOptions<T>): State<T>;
export declare function isState<T>(v: any): v is State<T>;
export declare function fromState<T>(state: T | State<T>): T;
