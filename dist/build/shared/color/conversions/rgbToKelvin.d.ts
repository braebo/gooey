import type { RgbColor } from '../types/objects';
/**
 * Convert an {@link RgbColor} object to an approximate {@link KelvinColor['kelvin'] | kelvin} temperature.
 * @param kelvin - {@link KelvinColor['kelvin'] | kelvin} temperature to convert.
 */
export declare function rgbToKelvin(rgb: RgbColor): number;
