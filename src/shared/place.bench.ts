/**
 * The OG place is marginally faster (around 1.05x) on average.
 */

import { select } from './select'
import { bench } from 'vitest'

bench('place', () => {
    place('window', 'top-right')
    place('window', 'center-center')
})

bench('placeOG', () => {
	placeOG('window', 'top-right')
	placeOG('window', 'center-center')
})

function place(node: any, placement = 'top-right', options = {}) {
	const { bounds, margin } = Object.assign(
		{
			bounds: undefined,
			margin: 10,
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

	const m =
		typeof margin === 'number'
			? { x: margin, y: margin }
			: Object.assign({ x: 0, y: 0 }, margin)

	const LEFT = m.x
	const RIGHT = b.width - rect.width - m.x
	const TOP = m.y
	const BOTTOM = b.height - rect.height - m.y
	const CENTER_X = b.width / 2 - rect.width / 2
	const CENTER_Y = b.height / 2 - rect.height / 2

	switch (placement) {
		case 'center':
		case 'center-center': {
			return { x: CENTER_X, y: CENTER_Y }
		}
		case 'top-left':
		case 'left-top': {
			return { x: LEFT, y: TOP }
		}
		case 'top-center':
		case 'center-top': {
			return { x: CENTER_X, y: TOP }
		}
		case 'top-right':
		case 'right-top': {
			return { x: RIGHT, y: TOP }
		}
		case 'bottom-left':
		case 'left-bottom': {
			return { x: LEFT, y: BOTTOM }
		}
		case 'bottom-center':
		case 'center-bottom': {
			return { x: CENTER_X, y: BOTTOM }
		}
		case 'bottom-right':
		case 'right-bottom': {
			return { x: RIGHT, y: BOTTOM }
		}
		case 'left-center':
		case 'center-left': {
			return { x: LEFT, y: CENTER_Y }
		}
		case 'right-center':
		case 'center-right': {
			return { x: RIGHT, y: CENTER_Y }
		}
		default:
			throw new Error('Invalid placement: ' + placement)
	}
}

function placeOG(node: any, placement = 'top-right', options = {}) {
	const { bounds, margin } = Object.assign(
		{
			bounds: undefined,
			margin: 10,
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

	const m =
		typeof margin === 'number'
			? { x: margin, y: margin }
			: Object.assign({ x: 0, y: 0 }, margin)

	switch (placement) {
		case 'center':
		case 'center-center':
			return { x: b.width / 2 - rect.width / 2, y: b.height / 2 - rect.height / 2 }
		case 'top-left':
		case 'left-top':
			return { x: m.x, y: m.y }
		case 'top-center':
		case 'center-top':
			return { x: b.width / 2 - rect.width / 2, y: m.y }
		case 'top-right':
		case 'right-top':
			return { x: b.width - rect.width - m.x, y: m.y }
		case 'bottom-left':
		case 'left-bottom':
			return { x: m.x, y: b.height - rect.height - m.y }
		case 'bottom-center':
		case 'center-bottom':
			return { x: b.width / 2 - rect.width / 2, y: b.height - rect.height - m.y }
		case 'bottom-right':
		case 'right-bottom':
			return { x: b.width - rect.width - m.x, y: b.height - rect.height - m.y }
		case 'left-center':
		case 'center-left':
			return { x: m.x, y: b.height / 2 - rect.height / 2 }
		case 'right-center':
		case 'center-right':
			return { x: b.width - rect.width - m.x, y: b.height / 2 - rect.height / 2 }
		default:
			throw new Error('Invalid placement: ' + placement)
	}
}
