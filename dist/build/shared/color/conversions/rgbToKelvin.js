import { kelvinToRgb } from './kelvinToRgb.js';

const KELVIN_MIN = 2000;
const KELVIN_MAX = 40000;
/**
 * Convert an {@link RgbColor} object to an approximate {@link KelvinColor['kelvin'] | kelvin} temperature.
 * @param kelvin - {@link KelvinColor['kelvin'] | kelvin} temperature to convert.
 */
function rgbToKelvin(rgb) {
    const { r, b } = rgb;
    const eps = 0.4;
    let minTemp = KELVIN_MIN;
    let maxTemp = KELVIN_MAX;
    let temp;
    while (maxTemp - minTemp > eps) {
        temp = (maxTemp + minTemp) * 0.5;
        const rgb = kelvinToRgb(temp);
        if (rgb.b / rgb.r >= b / r) {
            maxTemp = temp;
        }
        else {
            minTemp = temp;
        }
    }
    return temp;
}

export { rgbToKelvin };
//# sourceMappingURL=rgbToKelvin.js.map
