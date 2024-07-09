import type { ElementOrSelector, ElementsOrSelectors } from './select';
import type { State } from './state';
/**
 * Represents a dom element's bounding rectangle.
 */
export interface VirtualRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
/**
 * The sides of an element that can be resized by the {@link resizable} action.
 */
export type Side = 'top' | 'right' | 'bottom' | 'left';
/**
 * The corners of an element that can be resized by the {@link resizable} action.
 * @see {@link Side}
 */
export type Corner = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
/**
 * Options for the {@link resizable} action.
 */
export interface ResizableOptions {
    __type?: 'ResizableOptions';
    /**
     * To only allow resizing on certain sides, specify them here.
     * @defaultValue ['right', 'bottom']
     */
    sides: Side[];
    /**
     * To only allow resizing on certain corners, specify them here.
     * @defaultValue ['bottom-right']
     */
    corners: ('top-left' | 'top-right' | 'bottom-right' | 'bottom-left')[];
    /**
     * The size of the resize handle in pixels.
     * @defaultValue 6
     */
    grabberSize: number;
    /**
     * Optional callback function that runs when the element is resized.
     * @defaultValue () => void
     */
    onResize: (size: {
        width: number;
        height: number;
    }) => void;
    /**
     * If provided, the size of the element will be persisted
     * to local storage under the specified key.
     * @defaultValue undefined
     */
    localStorageKey?: string;
    /**
     * Use a visible or invisible gutter.
     * @defaultValue false
     */
    visible: boolean;
    /**
     * Gutter css color (if visible = `true`)
     * @defaultValue 'var(--fg-d, #1d1d1d)'
     */
    color: string;
    /**
     * The max opacity (0-1) when hovering/dragging a grabber.
     * @defaultValue 1
     */
    opacity: number;
    /**
     * Border radius of the element.
     * @defaultValue '0.5rem'
     */
    borderRadius: string;
    /**
     * The element to use as the bounds for resizing.
     * @defaultValue window['document']['documentElement']
     */
    bounds: ElementOrSelector;
    /**
     * Element's or selectors which will act as collision obstacles for the draggable element.
     */
    obstacles: ElementsOrSelectors;
    /**
     * Whether to apply different `cursor` values to grabbers.
     */
    cursors: boolean;
    /**
     * The classnames to apply to the resize grabbers, used for styling.
     * @defaultValue { default: 'resize-grabber', active: 'resize-grabbing' }
     */
    classes: {
        /** @defaultValue 'resize-grabber' */
        default: string;
        /** @defaultValue 'resize-grabbing' */
        active: string;
    };
    /**
     * Whether the element is disabled.
     * @defaultValue false
     */
    disabled: boolean;
}
export declare const RESIZABLE_DEFAULTS: ResizableOptions;
/**
 * Makes an element resizable by dragging its edges.  For the
 * svelte-action version, see {@link resizable}.
 *
 * @param node - The element to make resizable.
 * @param options - {@link ResizableOptions}
 *
 * @example Basic
 * ```ts
 * import { Resizable } from 'fractils'
 *
 * const node = document.createElement('div')
 * new Resizable(node)
 * ```
 *
 * @example Advanced
 * ```ts
 * import { Resizable } from 'fractils'
 *
 * const node = document.createElement('div')
 * new Resizable(node, {
 * 	sides: ['left', 'bottom'],
 * 	grabberSize: 3,
 * 	onResize: () => console.log('resized'),
 * 	localStorageKey: 'resizableL::size',
 * 	visible: false,
 * 	color: 'var(--fg-d)',
 * 	borderRadius: '0.5rem',
 * })
 * ```
 */
export declare class Resizable {
    #private;
    node: HTMLElement;
    static readonly type: "Resizable";
    static initialized: boolean;
    id: string;
    opts: ResizableOptions;
    disabled: boolean;
    bounds: HTMLElement;
    obstacleEls: HTMLElement[];
    size: State<{
        width: number;
        height: number;
    }>;
    constructor(node: HTMLElement, options?: Partial<ResizableOptions>);
    get boundsRect(): DOMRect;
    createGrabbers(): void;
    clickOffset: {
        x: number;
        y: number;
    };
    onGrab: (e: PointerEvent) => void;
    get translateX(): number;
    set translateX(v: number);
    get translateY(): number;
    set translateY(v: number);
    get rect(): DOMRect;
    resizeX: (x: number, borderleft?: boolean) => this;
    resizeY: (y: number, bordertop?: boolean) => this;
    /**
     * This is where all the resizing logic happens.
     */
    onMove: (e: PointerEvent) => void;
    onUp: () => void;
    /**
     * Creates the global stylesheet (but only once).
     */
    generateStyles(): void;
    dispose(): void;
}
export declare function isResizableOptions<T extends Record<string, any>>(opts: T): opts is T & ResizableOptions;
