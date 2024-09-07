import { select, type ElementOrSelector } from './select'

export type Placement = 'center' | `${TBC}-${LRC}` | `${LRC}-${TBC}`

type LeftRight = 'left' | 'right'
type LRC = LeftRight | 'center'

type TopBottom = 'top' | 'bottom'
type TBC = TopBottom | 'center'

type VirtualRect = Record<string, any> & {
	x: number
	y: number
	width: number
	height: number
}

export const PLACEMENTS = [
	'center',
	'center-center',
	'center-left',
	'center-right',
	'top-center',
	'top-left',
	'top-right',
	'bottom-center',
	'bottom-left',
	'bottom-right',
	'center-top',
	'center-bottom',
	'left-center',
	'left-top',
	'left-bottom',
	'right-center',
	'right-top',
	'right-bottom',
] as const satisfies Placement[]

export type PlacementOptions = Parameters<typeof place>[2]

/**
 * Determines the x and y position of an element relative to
 * a bounding box based on a given {@link Placement} string.
 * Optional {@link PlacementOptions} can be provided to specify
 * the bounding box and a margin.
 *
 * @param node - The element to place.
 * @param placement - The {@link Placement} string.
 * @param options - The {@link PlacementOptions}.
 * @param options.bounds - The bounding box to place the element within.
 * @param options.margin - The margin in pixels to apply to the placement.
 *
 * @example
 * ```ts
 * const { x, y } = place(node, 'top-right', { bounds: window, margin: 10 })
 * ```
 */
export function place(
	node:
		| DOMRect
		| VirtualRect
		| (Record<string, any> & { width: number; height: number })
		| ElementOrSelector,
	placement = 'top-right',
	options?: {
		/**
		 * The bounding box to place the element within.  Can be a
		 * DOMRect, custom {@link VirtualRect}, or `'window'`.
		 * @default 'window'
		 */
		bounds?: DOMRect | VirtualRect | 'window' | ElementOrSelector
		/**
		 * The margin in pixels to apply to the placement.  Can be a number
		 * to apply the same margin to both x and y, or an object with x
		 * and y properties to apply different margins to each axis.
		 * @default 0
		 */
		margin?: number | Partial<{ x: number; y: number }>
	},
): { x: number; y: number } {
	const { bounds, margin } = Object.assign(
		{
			bounds: undefined as VirtualRect | undefined,
			margin: 10 as number | Partial<{ x: number; y: number }>,
		},
		options,
	)

	const rect =
		typeof node === 'string'
			? select(node)[0]?.getBoundingClientRect()
			: node instanceof Element
				? node.getBoundingClientRect()
				: node

	if (!rect) throw new Error('Invalid node: ' + node)

	const b =
		bounds === 'window' && typeof window !== 'undefined'
			? { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }
			: typeof bounds === 'string'
				? select(bounds)[0]?.getBoundingClientRect()
				: (bounds ?? { x: 0, y: 0, width: 100, height: 100 })

	if (!b) throw new Error('Invalid bounds: ' + bounds)

	const m: { x: number; y: number } =
		typeof margin === 'number'
			? { x: margin, y: margin }
			: Object.assign({ x: 0, y: 0 }, margin)

	// prettier-ignore
	switch (placement) {
		case ('center'):
		case ('center-center'): return { x: b.width / 2 - rect.width / 2, y: b.height / 2 - rect.height / 2 }
		case ('top-left'):
		case ('left-top'): return { x: m.x, y: m.y }
		case ('top-center'):
		case ('center-top'): return { x: b.width / 2 - rect.width / 2, y: m.y }
		case ('top-right'):
		case ('right-top'): return { x: b.width - rect.width - m.x, y: m.y }
		case ('bottom-left'):
		case ('left-bottom'): return { x: m.x, y: b.height - rect.height - m.y }
		case ('bottom-center'):
		case ('center-bottom'): return { x: b.width / 2 - rect.width / 2, y: b.height - rect.height - m.y }
		case ('bottom-right'):
		case ('right-bottom'): return { x: b.width - rect.width - m.x, y: b.height - rect.height - m.y }
		case ('left-center'):
		case ('center-left'): return { x: m.x, y: b.height / 2 - rect.height / 2 }
		case ('right-center'):
		case ('center-right'): return { x: b.width - rect.width - m.x, y: b.height / 2 - rect.height / 2 }
		default: throw new Error('Invalid placement: ' + placement)
	}
}
