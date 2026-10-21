//#region src/shared/color/conversions/intToHexDigit.ts
/**
* Convert a 0-255 channel into its nearest single hex digit, as shorthand hex spells it.
* @param int - number to convert
*/
function intToHexDigit(int) {
	return Math.round(int / 17).toString(16);
}

//#endregion
export { intToHexDigit };
//# sourceMappingURL=intToHexDigit.js.map