export type ElementOrSelector = string | HTMLElement | undefined | 'document' | 'window';
export type ElementsOrSelectors = ElementOrSelector | ElementOrSelector[];
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
export declare function select(
/**
 * The elements or selectors to resolve.
 */
input: ElementsOrSelectors, 
/**
 * The node to search within.
 * @default document.documentElement
 */
node?: HTMLElement): HTMLElement[];
