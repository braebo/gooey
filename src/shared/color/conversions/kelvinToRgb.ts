import type { RgbColor } from '../types/objects'

import { clamp } from '../../clamp'

/**
 * Converts a {@link KelvinColor} temperature to an approximate {@link RgbColor} object.
 * @param kelvin - {@link KelvinColor | Kelvin} temperature to convert.
 */
export function kelvinToRgb(kelvin: number): RgbColor {
	const temp = kelvin / 100

	let r: number
	let g: number
	let b: number

	if (temp < 66) {
		r = 255
		g =
			-155.25485562709179 -
			0.44596950469579133 * (g = temp - 2) +
			104.49216199393888 * Math.log(g)
		b =
			temp < 20
				? 0
				: -254.76935184120902 +
					0.8274096064007395 * (b = temp - 10) +
					115.67994401066147 * Math.log(b)
	} else {
		r =
			351.97690566805693 +
			0.114206453784165 * (r = temp - 55) -
			40.25366309332127 * Math.log(r)
		g =
			325.4494125711974 +
			0.07943456536662342 * (g = temp - 50) -
			28.0852963507957 * Math.log(g)
		b = 255
	}

	return {
		r: clamp(Math.floor(r), 0, 255),
		g: clamp(Math.floor(g), 0, 255),
		b: clamp(Math.floor(b), 0, 255),
	}
}
