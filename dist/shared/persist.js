//#region src/shared/persist.ts
/**
* Persists a value in localStorage.
* @returns An object with a `get` and `set` method that syncs with localStorage.
*
* @example
* ```ts
* // Let's say 'foo' is already "42" in localStorage:
*
* const foo = persist('foo', 5) // initial value won't be used
*
* foo.value // 42
* // or
* foo.get() // 42
*
* foo.value = 123
* // or
* foo.set(123)
*
* localStorage.getItem('foo') // "123"
* ```
*/
function persist(key, initialValue = void 0, quiet = false) {
	const bail = () => {
		if (typeof localStorage === "undefined") {
			if (!quiet) console.warn(`localStorage is not available for key "${key}"`);
			return true;
		} else return false;
	};
	let value = initialValue;
	return {
		get() {
			if (bail()) return value;
			const storedValue = localStorage.getItem(key);
			return storedValue ? JSON.parse(storedValue) : value;
		},
		set(newValue) {
			if (bail()) return;
			value = newValue;
			localStorage.setItem(key, JSON.stringify(newValue));
		},
		update(cb) {
			this.set(cb(this.get()));
		},
		get value() {
			return this.get();
		},
		set value(v) {
			this.set(v);
		}
	};
}

//#endregion
export { persist };
//# sourceMappingURL=persist.js.map