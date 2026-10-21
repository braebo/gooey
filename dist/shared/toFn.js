//#region src/shared/toFn.ts
/**
* Coerces a value to a function.
*/
function toFn(v) {
	if (typeof v === "function") return v;
	return () => v;
}

//#endregion
export { toFn };
//# sourceMappingURL=toFn.js.map