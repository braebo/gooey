import type { RgbColor } from '../types/objects';
/**
 * Converts a {@link KelvinColor} temperature to an approximate {@link RgbColor} object.
 * @param kelvin - {@link KelvinColor | Kelvin} temperature to convert.
 */
export declare function kelvinToRgb(kelvin: number): RgbColor;
