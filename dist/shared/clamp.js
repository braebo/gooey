//#region src/shared/clamp.ts
/**
* Clamps a value between a min and max.
*/
const clamp = (value, min, max) => {
	return Math.max(Math.min(value, max), min);
};

//#endregion
export { clamp };
//# sourceMappingURL=clamp.js.map