//#region src/shared/isType.ts
function isType(value, type) {
	if (typeof value !== "object" || value === null || ["object", "function"].includes(type)) return typeof value === type;
	return "__type" in value && value["__type"] === type;
}

//#endregion
export { isType };
//# sourceMappingURL=isType.js.map