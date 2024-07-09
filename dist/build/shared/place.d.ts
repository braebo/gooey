import { type ElementOrSelector } from './select';
export type Placement = 'center' | `${TBC}-${LRC}` | `${LRC}-${TBC}`;
type LeftRight = 'left' | 'right';
type LRC = LeftRight | 'center';
type TopBottom = 'top' | 'bottom';
type TBC = TopBottom | 'center';
type VirtualRect = Record<string, any> & {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type Vec2 = {
    x: number;
    y: number;
};
export type PlacementOptions = Parameters<typeof place>[2];
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
export declare function place(node: DOMRect | VirtualRect | (Record<string, any> & {
    width: number;
    height: number;
}) | ElementOrSelector, placement?: string, options?: {
    /**
     * The bounding box to place the element within.  Can be a
     * DOMRect, custom {@link VirtualRect}, or `'window'`.
     * @default 'window'
     */
    bounds?: DOMRect | VirtualRect | 'window' | ElementOrSelector;
    /**
     * The margin in pixels to apply to the placement.  Can be a number
     * to apply the same margin to both x and y, or an object with x
     * and y properties to apply different margins to each axis.
     * @default 16
     */
    margin?: number | Vec2;
}): Vec2;
export {};
