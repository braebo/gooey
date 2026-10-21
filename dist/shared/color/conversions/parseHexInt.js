//#region src/shared/color/conversions/parseHexInt.ts
/**
* Parse hex str to an int
* @param str - hex string to parse
*/
function parseHexInt(str) {
	if (str.length !== 2) throw new Error("Invalid hex string: " + str);
	return parseInt(str, 16);
}

//#endregion
export { parseHexInt };
//# sourceMappingURL=parseHexInt.js.map