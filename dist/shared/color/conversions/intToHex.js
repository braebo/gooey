//#region src/shared/color/conversions/intToHex.ts
/**
* Convert number into to 2-digit hex
* @param int - number to convert
*/
function intToHex(int) {
	return int.toString(16).padStart(2, "0");
}

//#endregion
export { intToHex };
//# sourceMappingURL=intToHex.js.map