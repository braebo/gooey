import type { ColorValue } from './color'

import { Color } from './color'
import * as grammar from './regex'

/** The color strings the model parses — hex, `rgb()`, `rgba()`, `hsl()`, `hsla()`. */
const COLOR_STRINGS = Object.values(grammar).filter(value => value instanceof RegExp)

/** A color value's format: the color string it matches, or the keys it carries. */
function shapeOf(value: ColorValue | Color[keyof Color]) {
	if (typeof value === 'string') {
		return COLOR_STRINGS.find(pattern => pattern.test(value))
	}
	if (typeof value === 'object' && value !== null) {
		return Object.keys(value).sort().join()
	}
	return undefined
}

/**
 * Each format Color can write, keyed by its shape, mapped to the first accessor that writes it —
 * declaration order settles `rgb` over its 0-1 twin `rgbf`.  An accessor's shape doesn't depend on
 * the color, so one Color maps them all.
 */
const ACCESSORS = new Map<RegExp | string, keyof Color>()
const sample = new Color()
/** Always true for a prototype key — it narrows `name` to `keyof Color` without a cast. */
const isColorKey = (name: string): name is keyof Color => name in Color.prototype
for (const [name, descriptor] of Object.entries(
	Object.getOwnPropertyDescriptors(Color.prototype),
)) {
	if (!descriptor.get || !isColorKey(name)) continue
	const shape = shapeOf(sample[name])
	if (shape && !ACCESSORS.has(shape)) ACCESSORS.set(shape, name)
}

/**
 * The Color accessor that projects a color into `field`'s own format — `hexString` for
 * `'#0000ff'`, `hsla` for `{ h, s, l, a }`, `color` for a Color.
 */
export function colorAccessorFor(field: ColorValue): keyof Color {
	const shape = shapeOf(field)
	const accessor = shape && ACCESSORS.get(shape)

	if (!accessor) {
		throw new Error(
			`gooey can't bind ${JSON.stringify(field)} as a color: bind a hex, rgb(), hsl(), color object, or Color.`,
		)
	}

	return accessor
}
