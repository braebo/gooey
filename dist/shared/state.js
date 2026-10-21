import { get, writable } from "./store.js";
import { localStorageStore } from "./localStorageStore.js";

//#region src/shared/state.ts
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
* <\/script>
*
* <h1>{$foo} {$bar} {$baz}</h1>
* ```
*/
function state(defaultValue, options) {
	const store = options?.key ? localStorageStore(options.key, defaultValue, {
		debounce: options?.debounce,
		onChange: options?.onChange
	}) : writable(defaultValue);
	function enhanceStore(enhancer) {
		if (enhancer) enhancer(store);
	}
	if (Array.isArray(defaultValue)) enhanceStore((store$1) => {
		store$1.push = (item) => {
			store$1.update((arr) => [...arr, item]);
		};
	});
	else if (defaultValue instanceof Map) enhanceStore((store$1) => {
		store$1.setKey = (key, value) => {
			store$1.update((map) => {
				map.set(key, value);
				return map;
			});
		};
		store$1.deleteKey = (key) => {
			store$1.update((map) => {
				const newMap = new Map(map);
				newMap.delete(key);
				return newMap;
			});
		};
	});
	enhanceStore((store$1) => {
		if (defaultValue instanceof Set) {
			store$1.add = (item) => {
				store$1.update((set) => new Set(set).add(item));
			};
			store$1.delete = (item) => {
				store$1.update((set) => {
					const newSet = new Set(set);
					newSet.delete(item);
					return newSet;
				});
			};
		}
	});
	return {
		...store,
		isState: true,
		get value() {
			return get(store);
		},
		set value(v) {
			if (v === void 0) throw new Error("Cannot set state to undefined");
			store.set(v);
		},
		refresh() {
			store.set(get(store));
		}
	};
}
function isState(v) {
	return typeof v === "object" && v.isState === true;
}
function fromState(state$1) {
	return isState(state$1) ? state$1.value : state$1;
}

//#endregion
export { fromState, isState, state };
//# sourceMappingURL=state.js.map