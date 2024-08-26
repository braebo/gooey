import { select } from './select.js';

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
function place(node, placement = 'top-right', options) {
    const { bounds, margin } = Object.assign({
        bounds: undefined,
        margin: 10,
    }, options);
    const rect = typeof node === 'string'
        ? select(node)[0]?.getBoundingClientRect()
        : node instanceof Element
            ? node.getBoundingClientRect()
            : node;
    if (!rect)
        throw new Error('Invalid node: ' + node);
    const b = bounds === 'window' && typeof window !== 'undefined'
        ? { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }
        : typeof bounds === 'string'
            ? select(bounds)[0]?.getBoundingClientRect()
            : (bounds ?? { x: 0, y: 0, width: 100, height: 100 });
    if (!b)
        throw new Error('Invalid bounds: ' + bounds);
    const m = typeof margin === 'number'
        ? { x: margin, y: margin }
        : Object.assign({ x: 0, y: 0 }, margin);
    console.log({ placement, options, bounds: b, node: rect, margin: m });
    console.trace();
    // prettier-ignore
    const resolvePlacement = (placement) => {
        switch (placement) {
            case ('center'):
            case ('center-center'): return { x: b.width / 2 - rect.width / 2, y: b.height / 2 - rect.height / 2 };
            case ('top-left'):
            case ('left-top'): return { x: m.x, y: m.y };
            case ('top-center'):
            case ('center-top'): return { x: b.width / 2 - rect.width / 2, y: m.y };
            case ('top-right'):
            case ('right-top'): return { x: b.width - rect.width - m.x, y: m.y };
            case ('bottom-left'):
            case ('left-bottom'): return { x: m.x, y: b.height - rect.height - m.y };
            case ('bottom-center'):
            case ('center-bottom'): return { x: b.width / 2 - rect.width / 2, y: b.height - rect.height - m.y };
            case ('bottom-right'):
            case ('right-bottom'): return { x: b.width - rect.width - m.x, y: b.height - rect.height - m.y };
            case ('left-center'):
            case ('center-left'): return { x: m.x, y: b.height / 2 - rect.height / 2 };
            case ('right-center'):
            case ('center-right'): return { x: b.width - rect.width - m.x, y: b.height / 2 - rect.height / 2 };
            default: throw new Error('Invalid placement: ' + placement);
        }
    };
    const result = resolvePlacement(placement);
    console.log({ result });
    return result;
}

export { place };
//# sourceMappingURL=place.js.map
