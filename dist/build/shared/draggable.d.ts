import type { ElementOrSelector, ElementsOrSelectors } from './select';
import type { Placement, PlacementOptions } from './place';
import { type Writable } from './store';
/**
 * Represents a dom element's bounding rectangle.
 */
export interface VirtualRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export type DraggablePlacementOptions = PlacementOptions & {
    /**
     * The position to place the gooey.
     */
    position: Placement | {
        x: number;
        y: number;
    };
};
/**
 * Data passed to listeners of the {@link DraggableOptions.onDragStart|onDragStart},
 * {@link DraggableOptions.onDrag|onDrag}, {@link DraggableOptions.onDragEnd|onDragEnd}, and
 * {@link DraggableOptions.onCollision|onCollision} events.
 */
export type DragEventData = {
    /**
     * The node on which the draggable is applied
     */
    rootNode: HTMLElement;
    /**
     * Total horizontal movement from the node's original position.
     */
    x: number;
    /**
     * Total vertical movement from the node's original position.
     */
    y: number;
    /**
     * The complete event object.
     */
    eventTarget: EventTarget;
};
export type DraggableOptions = {
    __type?: 'DraggableOptions';
    /**
     * The boundary to which the draggable element is limited to.
     *
     * Valid values:
     *
     * - `undefined` - defaults to `document.documentElement`
     * - An `HTMLElement` or query selector string, _i.e. `.container` or `#container`_
     * - `'parent'` - the element's {@link HTMLElement.offsetParent|offsetParent}
     * - `'body'` - `document.body`
     * - `false` - no boundary
     * - `{ top: number, right: number, bottom: number, left: number }` - A custom {@link VirtualRect rect} relative to the viewport.
     *
     * **Note**: Make sure the bounds is smaller than the node's min size.
     * @default undefined
     */
    bounds?: ElementOrSelector;
    /**
     * Axis on which the element can be dragged on.
     * - `both` - Element can move in any direction
     * - `x` - Only horizontal movement possible
     * - `y` - Only vertical movement possible
     * - `none` - No movement at all
     * @default 'both'
     */
    axis: 'both' | 'x' | 'y' | 'none';
    /**
     * Custom transform function. If provided, this function will be used to
     * apply the DOM transformations to the root node to move it.
     *
     * You can return a {@link https://developer.mozilla.org/docs/Web/CSS/transform | transform} property
     * return nothing to apply your own transformations via
     * {@link https://developer.mozilla.org/docs/Web/CSS/transform | node.style.transform}
     * @default undefined
     */
    transform?: (data: DragEventData) => {
        x: number;
        y: number;
    } | void | undefined;
    /**
     * Applies `user-select: none` to the `<body />` element when dragging. `false` disables it.
     * @default true
     */
    userSelectNone: boolean;
    /**
     * Ignore touch events with more than 1 touch. Helpful for preserving pinch-to-zoom behavior on a pages with multiple draggable's.
     * @default false
     */
    ignoreMultitouch: boolean;
    /**
     * Disables dragging altogether.
     * @default false
     */
    disabled: boolean;
    /**
     * The default position of the draggable element.
     * @default { x: 0, y: 0 }
     */
    position?: {
        x?: number;
        y?: number;
    } | Placement;
    /**
     * The margin in pixels to apply to the initial position.
     * @default 0
     */
    margin: number | {
        x: number;
        y: number;
    };
    /**
     * An element or selector (or any combination of the two) for element(s) inside
     * the parent node upon which dragging should be disabled when clicked.
     * @default undefined
     */
    cancel: ElementsOrSelectors;
    /**
     * CSS Selector of an element or multiple elements inside the parent node on
     * which `use:draggable` is applied).  If provided, only clicking and dragging
     * handles will activate dragging.
     *
     * @default undefined
     */
    handle: ElementsOrSelectors;
    /**
     * Element's or selectors which will act as collision obstacles for the draggable element.
     */
    obstacles: ElementsOrSelectors;
    classes: {
        /**
         * Class to apply on the element on which `use:draggable` is applied.
         *
         * __Note:__ If `handle` is provided, this class will still be applied
         * to the draggable element itself, __NOT__ the handle element.
         * @default 'fractils-draggable'
         */
        default: string;
        /**
         * Class to apply on the element when it is dragging.
         * @default 'fractils-dragging'
         */
        dragging: string;
        /**
         * Class to apply on the element if it has been dragged at least once.
         * @default 'fractils-dragged'
         */
        dragged: string;
        /**
         * Elements with this class will disable dragging when clicked.
         * @default 'fractils-cancel'
         */
        cancel: string;
    };
    /**
     * Fires on `pointerdown` for the element / valid handle elements.
     */
    onDragStart: (data: DragEventData) => void;
    /**
     * Fires on `pointermove` while dragging.
     */
    onDrag: (data: DragEventData) => void;
    /**
     * Fires on `pointerup`.
     */
    onDragEnd: (data: DragEventData) => void;
    /**
     * Fires when the element collides with an obstacle.
     */
    onCollision: (data: {
        x: number;
        y: number;
    }) => void;
    /**
     * If provided, the position will persist in local storage under this key.
     * @default undefined
     */
    localStorageKey?: string;
};
export declare const DRAGGABLE_DEFAULTS: DraggableOptions;
/**
 * Make an element draggable.  Supports touch, mouse, and pointer events,
 * and has options for bounds / obstacle collision detection, programatic
 * position control, custom transforms, and more.
 *
 * @example
 * ```js
 * import { Draggable } from 'fractils'
 *
 * const element = document.createElement('div')
 *
 * const draggable = new Draggable(element, {
 * 	bounds: 'body'
 * })
 * ```
 */
export declare class Draggable {
    node: HTMLElement;
    static initialized: boolean;
    opts: DraggableOptions & {
        margin: {
            x: number;
            y: number;
        };
    };
    /**
     * Disables user interaction with the draggable element.
     */
    disabled: boolean;
    /**
     * Used in  {@link update} to account for the difference between
     * the node's position and the user's exact click position on the node.
     */
    clickOffset: {
        x: number;
        y: number;
    };
    /**
     * The distance between the pointer's position and the node's position.
     */
    clientToNodeOffset: {
        x: number;
        y: number;
    };
    boundsEl?: HTMLElement;
    handleEls: HTMLElement[];
    cancelEls: HTMLElement[];
    obstacleEls: HTMLElement[];
    /**
     * A rectangle representing the draggable element's boundary, if any.
     */
    bounds: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    private _storage?;
    private _position;
    /**
     * An observable store that updates the draggable element's position.
     */
    positionStore: Writable<{
        x: number;
        y: number;
    }>;
    /**
     * @todo I think we can just remove this and let the user add their
     * own event listeners if they want to target a specific element.
     */
    eventTarget?: HTMLElement;
    /**
     * Whether the draggable element is currently being dragged.
     */
    private _active;
    /**
     * The original value of `user-select` on the body element
     * used to restore the original value after dragging when
     * {@link DraggableOptions.userSelectNone|userSelectNone} is `true`.
     */
    private _bodyOriginalUserSelectVal;
    /**
     * Updates the {@link bounds} property to account for any changes in the
     * DOM or this instance's {@link DraggableOptions.bounds|bounds} option.
     */
    private _recomputeBounds;
    /**
     * This node's DOMRect, cached for use via {@link rect}.
     */
    private _rect;
    /**
     * The {@link EventManager} for this draggable instance.
     */
    private _evm;
    /**
     * A callback to release the pointer capture using the
     * {@link PointerEvent.pointerId | pointerId} and reset the cursor.
     */
    private _releaseCapture;
    /**
     * Internal logger for infoging. Automatically bypassed in non-dev environments.
     */
    private _log;
    constructor(node: HTMLElement, options?: Partial<DraggableOptions>);
    /**
     * Programmatically sets the position of the draggable element.
     */
    get position(): {
        x: number;
        y: number;
    };
    set position(v: {
        x: number;
        y: number;
    });
    /**
     * The x position of the draggable element's transform offset.
     */
    get x(): number;
    set x(v: number);
    /**
     * The y position of the draggable element's transform offset.
     */
    get y(): number;
    set y(v: number);
    /**
     * Whether the draggable element can move in the x direction,
     * based on the {@link DraggableOptions.axis|axis} option.
     */
    get canMoveX(): boolean;
    /**
     * Whether the draggable element can move in the x direction,
     * based on the {@link DraggableOptions.axis|axis} option.
     */
    get canMoveY(): boolean;
    get eventData(): DragEventData;
    get isControlled(): boolean;
    dragStart: (e: PointerEvent) => void;
    /**
     * This target node's cached {@link DOMRect}
     */
    get rect(): DOMRect;
    private _updateRect;
    drag: (e: PointerEvent) => void;
    dragEnd: () => void;
    resize: () => void;
    /**
     * Moves the {@link node|draggable element} to the specified position, adjusted
     * for collisions with {@link obstacleEls obstacles} or {@link boundsRect bounds}.
     */
    moveTo(target: {
        x: number;
        y: number;
    }): void;
    update(v?: {
        x: number;
        y: number;
    }): void;
    /**
     * Updates the {@link position} property in local storage.
     */
    updateLocalStorage: () => void;
    clearLocalStorage: () => void;
    /**
     * Resolves a {@link DraggableOptions.position} option into an `{x,y}` vector
     * depending on its type:
     * - `undefined` -> {@link DRAGGABLE_DEFAULTS.position}
     * - {@link Placement} -> {@link place}
     * - `{x,y}` -> itself *(merged with {@link DRAGGABLE_DEFAULTS.position}*
     * if it's a partial.)
     */
    resolvePosition(pos: DraggableOptions['position']): {
        x: number;
        y: number;
    };
    /**
     * Used to account for the scale of the draggable element when calculating positions.
     */
    private _getScale;
    /**
     * Resolves the {@link DraggableOptions.bounds|bounds} and returns a
     * function that updates the {@link bounds} property when called.
     */
    private _resolveBounds;
    private _cancelElementContains;
    private _callEvent;
    private _emitDragStart;
    private _emitDragEnd;
    private _emitDrag;
    private _emitUpdate;
    disposed: boolean;
    dispose(): void;
}
/**
 * Events fired by the draggable svelte action.
 */
export interface DragEvents {
    'on:dragStart': (e: DragEventData) => void;
    'on:drag': (e: DragEventData) => void;
    'on:dragEnd': (e: DragEventData) => void;
    'on:collision': (e: {
        x: number;
        y: number;
    }) => void;
    'on:update': (e: CustomEvent<Draggable>) => void;
}
/**
 * A svelte action to make an element draggable.
 *
 * @example
 * ```svelte
 * <script>
 * 	import { draggable } from 'fractils'
 * </script>
 *
 * <div use:draggable> Drag Me </div>
 * ```
 * @todo - Finish this -- I've never actually used or spent time on it..
 */
export declare function draggable(node: HTMLElement, options?: Partial<DraggableOptions>): {
    destroy: () => void;
    update: (options: Partial<DraggableOptions> | undefined) => void;
};
