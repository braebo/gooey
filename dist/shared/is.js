//#region src/shared/is.ts
function isDefined(value) {
	return value !== void 0;
}
function isString(value) {
	return typeof value === "string";
}
function isHTMLElement(value) {
	return value instanceof HTMLElement;
}
function isObject(value) {
	return !!value && typeof value === "object";
}

//#endregion
export { isDefined, isHTMLElement, isObject, isString };
//# sourceMappingURL=is.js.map