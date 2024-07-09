import { localStorageStore } from './localStorageStore.js';
import { writable, get } from './store.js';

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
function state(defaultValue, options) {
    const store = options?.key
        ? localStorageStore(options.key, defaultValue, {
            debounce: options?.debounce,
            onChange: options?.onChange,
        })
        : writable(defaultValue);
    function enhanceStore(enhancer) {
        if (enhancer)
            enhancer(store);
    }
    if (Array.isArray(defaultValue)) {
        enhanceStore(store => {
            store.push = (item) => {
                store.update(arr => [...arr, item]);
            };
        });
    }
    else if (defaultValue instanceof Map) {
        enhanceStore(store => {
            store.setKey = (key, value) => {
                store.update(map => {
                    map.set(key, value);
                    return map;
                });
            };
            store.deleteKey = key => {
                store.update(map => {
                    const newMap = new Map(map);
                    newMap.delete(key);
                    return newMap;
                });
            };
        });
    }
    enhanceStore(store => {
        if (defaultValue instanceof Set) {
            store.add = item => {
                store.update(set => new Set(set).add(item));
            };
            store.delete = item => {
                store.update(set => {
                    const newSet = new Set(set);
                    newSet.delete(item);
                    return newSet;
                });
            };
        }
    });
    // if (options?.set) store.set = options.set
    return {
        ...store,
        isState: true,
        get value() {
            return get(store);
        },
        set value(v) {
            if (v === undefined)
                throw new Error('Cannot set state to undefined');
            store.set(v);
        },
        refresh() {
            store.set(get(store));
        },
    };
}
function isState(v) {
    // if (typeof v === 'undefined') return false
    return v.isState === true;
}
function fromState(state) {
    return (isState(state) ? state.value : state);
}
// //- Test cases
// {
// 	const numArray = state([1, 2, 3])
// 	numArray.push(4)
// 	const myMap = state(new Map<string, number>())
// 	myMap.setKey('key1', 100)
// 	myMap.set(new Map())
// 	const mySet = state(new Set<number>())
// 	mySet.set(new Set())
// 	mySet.add(5)
// 	const myString = state('hello')
// 	myString.set('world')
// 	type MyType = 'foo' | 'bar'
// 	const myType = state<MyType>('foo')
// 	myType.set('bar')
// 	type Foo = { foo: string }
// 	const myObject = state<Foo>({ foo: 'bar' })
// 	myObject.set({ foo: 'baz' })
// }

export { fromState, isState, state };
//# sourceMappingURL=state.js.map
