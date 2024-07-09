import type { JavascriptStyleProperty } from './css-types';
type Selector = `#${string}` | `.${string}`;
type Anchor = Element | Selector | 'mouse' | 'node' | null;
type Anchors = {
    x: Anchor;
    y: Anchor;
};
/**
 * Options for the tooltip.
 */
export interface TooltipOptions {
    readonly __type?: 'TooltipOptions';
    /**
     * The text to display in the tooltip.  Can be a string, number, or a function that returns a string or number.
     */
    text: string | (() => string);
    /**
     * The placement of the tooltip relative to the element.  Can be `'top'`, `'bottom'`, `'left'`, or `'right'`.
     */
    placement: 'top' | 'bottom' | 'left' | 'right';
    /**
     * The element to which the tooltip is placed relative to.  Can be a selector,
     * an element, or the string literal `'mouse'` to use the pointer position.
     *
     * Can also be an object with unique `x` and `y` anchors for each axis.
     *
     * By default, the node that the tooltip is attached to will be used as the anchor.
     *
     * @example { x: 'mouse', y: undefined }
     */
    anchor: Anchor | Anchors;
    /**
     * Delay in milliseconds before the tooltip is shown.
     * @defaultValue 250
     */
    delay: number;
    /**
     * Delay in milliseconds before the tooltip is hidden.
     * @defaultValue 0
     */
    delayOut: number;
    /**
     * An optional x-axis offset (any valid css unit).
     * @defaultValue '0%'
     */
    offsetX: string;
    /**
     * An optional y-axis offset (any valid css unit).
     * @defaultValue '0%'
     */
    offsetY: string;
    /**
     * Animation in/out duration times / easing.
     */
    animation: {
        /**
         * The tooltip reveal animation duration in ms.
         * @defaultValue 300
         */
        duration: KeyframeAnimationOptions['duration'];
        /**
         * The tooltip hide animation duration in ms.
         * @defaultValue 150
         */
        durationOut: KeyframeAnimationOptions['duration'];
        /**
         * The tooltip reveal and hide animation easing.
         * @defaultValue 'cubic-bezier(0.23, 1, 0.320, 1)'
         */
        easing: KeyframeAnimationOptions['easing'];
    };
    /**
     * Custom style overrides for the tooltip element (all valid CSS properties are allowed).
     * i.e. { padding: '4px 8px', color: 'var(--fg-a, #fff)' }
     * @defaultValue undefined
     */
    style?: Partial<Record<JavascriptStyleProperty, string>>;
    /**
     * If specified, the container element for the tooltip.
     * @defaultValue document.body
     */
    parent?: HTMLElement;
    /**
     * Hides the tooltip on click if `true`.
     * @defaultValue false
     */
    hideOnClick: boolean;
}
export declare const TOOLTIP_DEFAULTS: TooltipOptions;
export declare class Tooltip {
    /**
     * The node that the tooltip is attached to.
     */
    node: HTMLElement | undefined | null;
    readonly __type: "Tooltip";
    /**
     * The tooltip element itself.
     */
    element: HTMLDivElement | undefined | null;
    /**
     * The parent element of the tooltip.
     */
    parent: HTMLElement | undefined | null;
    /**
     * Whether the tooltip is currently showing.
     */
    showing: boolean;
    opts: TooltipOptions;
    private _text;
    private _evm;
    private _animPositions;
    private _delayInTimer;
    private _delayOutTimer;
    constructor(
    /**
     * The node that the tooltip is attached to.
     */
    node: HTMLElement | undefined | null, options?: Partial<TooltipOptions>);
    refresh(): void;
    /**
     * The text to display in the tooltip.  Assigning a new value will update the tooltip text.
     */
    get text(): string | (() => string);
    set text(text: string | (() => string));
    get placement(): "bottom" | "left" | "right" | "top";
    set placement(v: "bottom" | "left" | "right" | "top");
    get offsetX(): string;
    set offsetX(v: string);
    get offsetY(): string;
    set offsetY(v: string);
    /**
     * Animates the tooltip into view.
     */
    show: () => void;
    /**
     * Animates the tooltip out of view.
     */
    hide: () => void;
    /**
     * Whether the tooltip is currently mounted to the DOM.
     * @internal
     */
    private _mounted;
    mount(): void;
    unmount(): void;
    private _updatePosition;
    private _mouse;
    private _getAnchorRects;
    private _watcherId?;
    /**
     * Determines if the tooltip should watch any anchors for movement.
     */
    private _maybeWatchAnchor;
    private _watchingAnchor;
    private _watchingFinished;
    private _watchTimeout;
    /**
     * Keeps the tooltip position in sync with the anchor when an anchor's
     * transform is in transition while the tooltip is showing.
     * @todo - watch animation events too?
     */
    private _watch;
    dispose(): void;
    static style: string;
}
/**
 * A wrapper function that creates a new {@link Tooltip} instance and returns
 * an object with `update` and `destroy` methods, compatible with Svelte actions.
 *
 * @example Vanilla
 * ```js
 * import { tooltip } from 'lib/actions/tooltip'
 *
 * const el = document.querySelector('div')
 * const tip = tooltip(el, { text: 'Hello, world!', placement: 'top' })
 * ```
 *
 * @example Svelte
 * ```svelte
 * <script>
 * 	import { tooltip } from 'lib/actions/tooltip'
 * </script>
 *
 * <div use:tooltip={{ text: 'Hello, world!', placement: 'top' }}>
 * 	Hover me!
 * </div>
 * ```
 */
export declare const tooltip: (node: HTMLElement, options?: Partial<TooltipOptions>) => {
    update(opts: TooltipOptions): void;
    destroy(): void;
};
/**
 * A simple animation loop.  Return `true` to cancel.
 */
export declare function tickLoop(cb: () => boolean | undefined): void;
export {};
