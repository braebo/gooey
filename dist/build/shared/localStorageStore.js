import { writable } from './store.js';
import { cancelDefer, defer } from './defer.js';

// https://github.com/babichjacob/svelte-localstorage
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
const localStorageStore = (key, initial, options) => {
    let currentValue = initial;
    const verbose = !!options?.verbose;
    const { set: setStore, ...readableStore } = writable(initial, () => {
        if (options?.browserOverride || !!globalThis.localStorage) {
            getAndSetFromLocalStorage();
            const updateFromStorageEvents = (event) => {
                if (event.key === key)
                    getAndSetFromLocalStorage();
            };
            window.addEventListener('storage', updateFromStorageEvents);
            return () => window.removeEventListener('storage', updateFromStorageEvents);
        }
        else
            return () => { };
    });
    let serialize = JSON.stringify;
    let deserialize = JSON.parse;
    const type = initial instanceof Map ? 'Map' : initial instanceof Set ? 'Set' : '';
    const isMapOrSet = ['Map', 'Set'].includes(type);
    if (isMapOrSet) {
        serialize = (value) => JSON.stringify(Array.from(value.entries()));
        deserialize = (value) => {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                if (initial instanceof Map)
                    return new Map(parsed);
                if (initial instanceof Set)
                    return new Set(parsed);
                return parsed;
            }
            // prettier-ignore
            if (verbose)
                console.error(`Failed to deserialize ${type} from localStorageStore:`, { parsed, value, initial, key, options });
            return value;
        };
    }
    const set = (value) => {
        currentValue = value;
        if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = deserialize(value);
        }
        setStore(value);
        setItem(value);
        options?.onChange?.(value);
    };
    let setItem = (value) => {
        try {
            value = serialize(value);
            globalThis.localStorage?.setItem(key, value);
        }
        catch (error) {
            if (verbose)
                console.error(`Failed to set localStorageStore value:`, { error, key, value });
        }
    };
    if (options?.defer) {
        let setDeferId;
        const _ = setItem;
        setItem = (value) => {
            cancelDefer(setDeferId);
            setDeferId = defer(() => {
                _(value);
            });
        };
    }
    if (options?.debounce) {
        let timeout = setTimeout ?? (() => void 0);
        let timeoutId;
        const _ = setItem;
        setItem = (value) => {
            clearTimeout(timeoutId);
            timeoutId = timeout(() => {
                _(value);
            }, options.debounce);
        };
    }
    const getAndSetFromLocalStorage = () => {
        let localValue = null;
        try {
            localValue = globalThis.localStorage?.getItem(key) ?? null;
        }
        catch (error) {
            if (verbose)
                console.error(`Failed to get localStorageStore value:`, { error, key });
        }
        if (localValue === null) {
            set(initial);
        }
        else {
            try {
                const parsed = deserialize(localValue);
                setStore(parsed);
                currentValue = parsed;
            }
            catch (e) {
                if (verbose) {
                    console.error(`Failed to parse localStorageStore value:`, { key, localValue });
                    console.error(e);
                }
            }
        }
    };
    const update = (fn) => {
        set(fn(currentValue));
    };
    return { ...readableStore, set, update };
};

export { localStorageStore };
//# sourceMappingURL=localStorageStore.js.map
