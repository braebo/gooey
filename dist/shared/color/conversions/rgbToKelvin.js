import { kelvinToRgb } from "./kelvinToRgb.js";

//#region src/shared/color/conversions/rgbToKelvin.ts
const KELVIN_MIN = 2e3;
const KELVIN_MAX = 4e4;
/**
* Convert an {@link RgbColor} object to an approximate {@link KelvinColor['kelvin'] | kelvin} temperature.
* @param kelvin - {@link KelvinColor['kelvin'] | kelvin} temperature to convert.
*/
function rgbToKelvin(rgb) {
	const { r, b } = rgb;
	const eps = .4;
	let minTemp = KELVIN_MIN;
	let maxTemp = KELVIN_MAX;
	let temp;
	while (maxTemp - minTemp > eps) {
		temp = (maxTemp + minTemp) * .5;
		const rgb$1 = kelvinToRgb(temp);
		if (rgb$1.b / rgb$1.r >= b / r) maxTemp = temp;
		else minTemp = temp;
	}
	return temp;
}

//#endregion
export { rgbToKelvin };
//# sourceMappingURL=rgbToKelvin.js.map