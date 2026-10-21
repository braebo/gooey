//#region src/shared/hexToRgb.ts
/**
* Converts a hex color string to an array of rgb values.
* @param hex - A css hex color string, i.e. `#fff` or `#ffffff`
*/
function hexToRgb(hex) {
	const bigint = parseInt(hex.replace("#", ""), 16);
	return [
		bigint >> 16 & 255,
		bigint >> 8 & 255,
		bigint & 255
	].join(", ");
}

//#endregion
export { hexToRgb };
//# sourceMappingURL=hexToRgb.js.map