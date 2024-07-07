import { DEV } from 'esm-env'

export type ElementOrSelector = string | HTMLElement | undefined | 'document' | 'window'
export type ElementsOrSelectors = ElementOrSelector | ElementOrSelector[]

/**
 * Takes in any combination of selectors and elements, and
 * resolves them all into an array of HTMLElements.
 * @param input - The elements or selectors to resolve.
 * @param node - The node to search within. Default: `document.documentElement`
 * @example
 * select('div') 			// -> [HTMLDivElement, HTMLDivElement, ...]
 * select(['div', 'span']) 	// -> [HTMLDivElement, HTMLSpanElement, ...]
 * select('#my-id') 		// -> [HTMLElement]
 * const el = document.getElementById('my-id')
 * select(el) 				// -> [HTMLElement]
 * select([el]) 			// -> [HTMLElement]
 * select(undefined)		// -> []
 * select('document')		// -> [HTMLHtmlElement]
 * select('window')			// -> [HTMLHtmlElement]
 */
export function select(
	/**
	 * The elements or selectors to resolve.
	 */
	input: ElementsOrSelectors,
	/**
	 * The node to search within.
	 * @default document.documentElement
	 */
	node?: HTMLElement,
): HTMLElement[] {
	if (typeof window === 'undefined') return []

	if (input === undefined) return []

	const elements = Array.isArray(input) ? input : [input]

	node ??= document.documentElement

	return elements.flatMap((el): HTMLElement[] => {
		if (!el) return []

		if (el instanceof HTMLElement) return [el]
		// @ts-expect-error - (document instanceof Document) is always `true`... so this is fine.
		if (el instanceof Document) {
			return [document.documentElement]
		}

		if (typeof el === 'string') {
			if (el === 'document' || el === 'window') return [document.documentElement]
			if (el.startsWith('#')) {
				const foundEl = document.getElementById(JSON.stringify(el).slice(1))
				if (foundEl) {
					return [foundEl]
				} else {
					if (DEV) {
						console.warn(`No element found width id: `, el)
						console.warn(`Make sure the selector is a child of the target node.`)
						console.warn({ input, node, elements })
					}

					return []
				}
			}
		}

		const foundEls = node!.querySelectorAll<HTMLElement>(el)
		if (foundEls.length === 0) {
			if (DEV) {
				console.warn(`No elements found for selector:`, el)
				console.warn(`Make sure the selector is a child of the target node.`)
				console.warn({ input, node, elements })
			}

			return []
		}
		return Array.from(foundEls)
	})
}
