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
function select(
/**
 * The elements or selectors to resolve.
 */
input, 
/**
 * The node to search within.
 * @default document.documentElement
 */
node) {
    if (typeof window === 'undefined')
        return [];
    if (input === undefined)
        return [];
    const elements = Array.isArray(input) ? input : [input];
    node ??= document.documentElement;
    return elements.flatMap((el) => {
        if (!el)
            return [];
        if (el instanceof HTMLElement)
            return [el];
        // @ts-expect-error - (document instanceof Document) is always `true`... so this is fine.
        if (el instanceof Document) {
            return [document.documentElement];
        }
        if (typeof el === 'string') {
            if (el === 'document' || el === 'window')
                return [document.documentElement];
            if (el.startsWith('#')) {
                const foundEl = document.getElementById(JSON.stringify(el).slice(1));
                if (foundEl) {
                    return [foundEl];
                }
                else {
                    return [];
                }
            }
        }
        const foundEls = node.querySelectorAll(el);
        if (foundEls.length === 0) {
            return [];
        }
        return Array.from(foundEls);
    });
}

export { select };
//# sourceMappingURL=select.js.map
