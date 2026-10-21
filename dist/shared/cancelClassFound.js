//#region src/shared/cancelClassFound.ts
/**
* Checks if an event's composed path contains an element with the provided classname.
*/
function composedPathContains(e, classname) {
	return e.composedPath().some((n) => n.classList?.contains(classname));
}

//#endregion
export { composedPathContains };
//# sourceMappingURL=cancelClassFound.js.map