import { collisionClampX, collisionClampY } from './collisions';
import { isDefined, isHTMLElement, isString } from './is';
import { writable } from './store';
import { EventManager } from './EventManager';
import { getStyleMap } from './getStyle';
import { persist } from './persist';
import { select } from './select';
import { Logger } from './logger';
import { place } from './place';
import { clamp } from './clamp';
import { DEV } from 'esm-env';
const DEFAULT_CLASSES = {
    default: 'fractils-draggable',
    dragging: 'fractils-dragging',
    dragged: 'fractils-dragged',
    cancel: 'fractils-cancel',
};
export const DRAGGABLE_DEFAULTS = {
    __type: 'DraggableOptions',
    bounds: 'body',
    axis: 'both',
    userSelectNone: true,
    ignoreMultitouch: false,
    disabled: false,
    position: { x: 0, y: 0 },
    placementOptions: { margin: 0 },
    cancel: undefined,
    handle: undefined,
    obstacles: undefined,
    classes: DEFAULT_CLASSES,
    onDragStart: () => { },
    onDrag: () => { },
    onDragEnd: () => { },
    onCollision: () => { },
    transform: undefined,
    localStorageKey: undefined,
};
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
export class Draggable {
    node;
    static initialized = false;
    opts;
    /**
     * Whether the draggable element is currently being dragged.
     */
    #active = false;
    /**
     * Disables user interaction with the draggable element.
     */
    disabled = false;
    /**
     * Used in  {@link update} to account for the difference between
     * the node's position and the user's exact click position on the node.
     */
    clickOffset = { x: 0, y: 0 };
    /**
     * The distance between the pointer's position and the node's position.
     */
    clientToNodeOffset = {
        x: 0,
        y: 0,
    };
    /**
     * An internal representation of the {@link node|node's} bounding rectangle.
     * Used for collision detection and animations.
     */
    rect = { top: 0, right: 0, bottom: 0, left: 0 };
    /**
     * The original value of `user-select` on the body element
     * used to restore the original value after dragging when
     * {@link DraggableOptions.userSelectNone|userSelectNone} is `true`.
     */
    #bodyOriginalUserSelectVal = '';
    boundsEl;
    handleEls;
    cancelEls;
    obstacleEls;
    /**
     * A rectangle representing the draggable element's boundary, if any.
     */
    bounds = {
        left: -Infinity,
        top: -Infinity,
        right: Infinity,
        bottom: Infinity,
    };
    #leftBound = -Infinity;
    #topBound = -Infinity;
    #rightBound = Infinity;
    #bottomBound = Infinity;
    _storage;
    _position = { x: 0, y: 0 };
    /**
     * Programmatically sets the position of the draggable element.
     */
    get position() {
        return this._position;
    }
    set position(v) {
        this._position = v;
        this.moveTo(v);
        this.updateLocalStorage();
    }
    /**
     * Updates the {@link bounds} property to account for any changes in the
     * DOM or this instance's {@link DraggableOptions.bounds|bounds} option.
     */
    #recomputeBounds;
    /**
     * @todo I think we can just remove this and let the user add their
     * own event listeners if they want to target a specific element.
     */
    eventTarget;
    /**
     * An observable store that updates the draggable element's position.
     */
    positionStore;
    /**
     * Cleanup functions (removeEventLister / unsubscribe) to call in {@link dispose}.
     */
    #listeners = new Set();
    #evm = new EventManager();
    /**
     * A callback to release the pointer capture using the
     * {@link PointerEvent.pointerId | pointerId} and reset the cursor.
     */
    #releaseCapture = () => { };
    /**
     * Internal logger for infoging. Automatically bypassed in non-dev environments.
     */
    #log;
    constructor(node, options) {
        this.node = node;
        this.opts = Object.assign({}, DRAGGABLE_DEFAULTS, options);
        this.#log = new Logger('draggable ' + Array.from(this.node.classList).join('.'), {
            fg: 'SkyBlue',
        });
        this.#recomputeBounds = this.#resolveBounds(this.opts.bounds);
        this.opts.position = this.resolvePosition(this.opts.position);
        this.#log.fn('constructor').debug({ opts: this.opts, this: this });
        this.positionStore = writable(this.opts.position);
        this.node.classList.add(this.opts.classes.default);
        const startPosition = this.opts.position;
        // Setup local storage if the key is provided.
        if (options?.localStorageKey) {
            this._storage = persist(options.localStorageKey, startPosition);
            const storagePostion = this._storage.get();
            if (storagePostion) {
                startPosition.x = storagePostion.x;
                startPosition.y = storagePostion.y;
            }
        }
        this.x = startPosition.x;
        this.y = startPosition.y;
        // Prevents mobile touch-event jank.
        this.node.style.setProperty('touch-action', 'none');
        this.handleEls = this.opts.handle ? select(this.opts.handle, this.node) : [this.node];
        this.cancelEls = select(this.opts.cancel, this.node);
        this.obstacleEls = select(this.opts.obstacles);
        // this.#recomputeBounds = this.#resolveRecomputeBounds(this.opts.bounds)
        // this.#recomputeBounds()
        this.#evm.listen(this.node, 'pointerdown', this.dragStart);
        this.#evm.listen(window, 'pointerup', this.dragEnd);
        this.#evm.listen(window, 'pointermove', this.drag);
        this.#evm.listen(window, 'resize', this.resize);
        this.#evm.add(this.positionStore.subscribe(({ x, y }) => {
            this.node.style.setProperty('translate', `${x}px ${y}px 1px`);
        }));
        if (startPosition !== DRAGGABLE_DEFAULTS.position) {
            // Init the virtual rect for updateBounds
            const { top, right, bottom, left } = this.node.getBoundingClientRect();
            this.rect = { top, right, bottom, left };
            this.#recomputeBounds();
            this.#updateBounds();
            this.moveTo(startPosition);
            this._position = { x: this.x, y: this.y };
        }
    }
    /**
     * The x position of the draggable element's transform offset.
     */
    get x() {
        return +this.node.dataset['translateX'] || 0;
    }
    set x(v) {
        this.node.dataset['translateX'] = String(v);
    }
    /**
     * The y position of the draggable element's transform offset.
     */
    get y() {
        return +this.node.dataset['translateY'] || 0;
    }
    set y(v) {
        this.node.dataset['translateY'] = String(v);
    }
    /**
     * Whether the draggable element can move in the x direction,
     * based on the {@link DraggableOptions.axis|axis} option.
     */
    get canMoveX() {
        return /(both|x)/.test(this.opts.axis);
    }
    /**
     * Whether the draggable element can move in the x direction,
     * based on the {@link DraggableOptions.axis|axis} option.
     */
    get canMoveY() {
        return /(both|y)/.test(this.opts.axis);
    }
    get eventData() {
        return {
            x: this.x,
            y: this.y,
            rootNode: this.node,
            eventTarget: this.eventTarget,
        };
    }
    get isControlled() {
        return !!this.opts.position;
    }
    dragStart = (e) => {
        if (this.disabled)
            return;
        // Ignore right-clicks.
        if (e.button === 2)
            return;
        if (this.opts.ignoreMultitouch && !e.isPrimary)
            return;
        // Abort if a cancel element was clicked.
        if (e
            .composedPath()
            .some(n => n.classList?.contains(this.opts.classes.cancel))) {
            return;
        }
        // Refresh the obstacles.
        this.obstacleEls = select(this.opts.obstacles);
        if (DEV) {
            for (const el of this.obstacleEls) {
                el.dataset['outline'] = el.style.outline;
                el.style.outline = '2px dotted #f007';
            }
        }
        // Error handling.
        if (isString(this.opts.handle) &&
            isString(this.opts.cancel) &&
            this.opts.handle === this.opts.cancel) {
            throw new Error("`handle` selector can't be same as `cancel` selector");
        }
        if (this.#cancelElementContains(this.handleEls)) {
            throw new Error("Element being dragged can't be a child of the element on which `cancel` is applied");
        }
        const eventTarget = e.composedPath()[0];
        // Return if the event target is not a handle element.
        if (!this.handleEls.some(e => e.contains(eventTarget) || e.shadowRoot?.contains(eventTarget)))
            return;
        // Make sure it's not a cancel element.
        if (this.#cancelElementContains([eventTarget])) {
            return;
        }
        this.#log.fn('dragStart').debug('Dragging initiated.');
        e.stopPropagation();
        // Resolve the event target.
        this.eventTarget =
            this.handleEls.length === 1
                ? this.node
                : this.handleEls.find(el => el.contains(eventTarget));
        this.#active = true;
        // Store the click offset
        if (this.canMoveX)
            this.clickOffset.x = e.clientX - this.x;
        if (this.canMoveY)
            this.clickOffset.y = e.clientY - this.y;
        // Update the virtual rectangle.
        const { top, right, bottom, left } = this.node.getBoundingClientRect();
        this.rect = { top, right, bottom, left };
        // Update the clientToNodeOffset.
        if (this.bounds)
            this.clientToNodeOffset = { x: e.clientX - left, y: e.clientY - top };
        // Set the initial position (with a forced duration of 0).
        this.positionStore.set({ x: this.x, y: this.y });
        // Update the bounds rect.
        this.#recomputeBounds();
        this.#updateBounds();
        this.node.dispatchEvent(new CustomEvent('grab'));
        // Capture the pointer and store the release callback.
        const { cursor } = getComputedStyle(this.node);
        this.node.setPointerCapture(e.pointerId);
        this.node.style.cursor = 'grabbing';
        this.#releaseCapture = () => {
            // this.node.releasePointerCapture(e.pointerId)
            this.node.style.cursor = cursor;
        };
        // Dispatch custom events
        this.#fireSvelteDragStartEvent();
        this.#fireUpdateEvent();
    };
    drag = (e) => {
        if (!this.#active)
            return;
        e.preventDefault();
        e.stopPropagation();
        // Apply dragging and dragged classes.
        this.node.classList.add(this.opts.classes.dragging);
        this.node.classList.add(this.opts.classes.dragged);
        const x = e.clientX - this.clickOffset.x;
        const y = e.clientY - this.clickOffset.y;
        const target = { x, y };
        // if (this.bounds) this.#clampToBounds(target)
        this.moveTo(target);
        this.#fireSvelteDragEvent();
    };
    dragEnd = () => {
        if (!this.#active)
            return;
        // todo - delete!
        if (DEV) {
            for (const el of this.obstacleEls) {
                el.style.outline = el.dataset['outline'] ?? 'none';
            }
        }
        this.node.classList.remove(this.opts.classes.dragging);
        if (this.opts.userSelectNone) {
            document.body.style.userSelect = this.#bodyOriginalUserSelectVal;
        }
        this.clickOffset = { x: 0, y: 0 };
        this.clientToNodeOffset = { x: 0, y: 0 };
        this._position = { x: this.x, y: this.y };
        // if (this._storage) this._storage.value = this._position
        this.#active = false;
        this.#releaseCapture();
        this.node.dispatchEvent(new CustomEvent('release'));
        setTimeout(() => this.node.classList.remove(this.opts.classes.dragged), 0);
        this.#fireSvelteDragEndEvent();
        this.updateLocalStorage();
    };
    resize = () => {
        this.#recomputeBounds();
        this.#updateBounds();
        this.moveTo(this.position); // works but doesn't preserve original position
    };
    #updateBounds = () => {
        // refresh style left & top
        const styleLeft = parseFloat(this.node.style.left) || 0;
        this.#leftBound = -styleLeft;
        this.#rightBound =
            this.bounds.right - this.bounds.left - (this.rect.right - this.rect.left) - styleLeft;
        const styleTop = parseFloat(this.node.style.top) || 0;
        this.#topBound = -styleTop;
        this.#bottomBound =
            this.bounds.bottom - this.bounds.top - styleTop - (this.rect.bottom - this.rect.top);
        // refresh bounds element padding ...
        if (this.boundsEl) {
            const styleMap = getStyleMap(this.boundsEl);
            // const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
            // 	getStyleMap(this.boundsEl)
            this.#leftBound -= parseFloat(styleMap.get('padding-left'));
            this.#rightBound -= parseFloat(styleMap.get('padding-right'));
            this.#topBound -= parseFloat(styleMap.get('padding-top'));
            this.#bottomBound -= parseFloat(styleMap.get('padding-bottom'));
        }
    };
    /**
     * Moves the {@link node|draggable element} to the specified position, adjusted
     * for collisions with {@link obstacleEls obstacles} or {@link boundsRect bounds}.
     */
    moveTo(target) {
        this.#log.fn('moveTo').debug('Moving to:', target, this);
        if (this.canMoveX) {
            if (this.bounds)
                target.x = clamp(target.x, this.#leftBound, this.#rightBound);
            const deltaX = target.x - this.x;
            if (deltaX !== 0) {
                const x = collisionClampX(deltaX, this.rect, this.obstacleEls);
                // Apply delta to x / virtual rect (!! before checking collisionY !!).
                this.rect.left += x;
                this.rect.right += x;
                this.x += x;
            }
        }
        if (this.canMoveY) {
            if (this.bounds)
                target.y = clamp(target.y, this.#topBound, this.#bottomBound);
            const deltaY = target.y - this.y;
            if (deltaY !== 0) {
                // const y = this.#collisionClampY(deltaY)
                const y = collisionClampY(deltaY, this.rect, this.obstacleEls);
                // Apply delta to y / virtual rect.
                this.rect.top += y;
                this.rect.bottom += y;
                this.y += y;
            }
        }
        // Check for a custom user transform function before applying ours.
        if (!this.opts.transform) {
            // Set the tween and let it animate the position.
            this.positionStore.set({ x: this.x, y: this.y });
        }
        else {
            // Call the user's custom transform function.
            const customTransformResult = this.opts.transform?.({
                x: this.x,
                y: this.y,
                rootNode: this.node,
                eventTarget: this.eventTarget,
            });
            // If the user's custom transform function returns an `{x,y}` object, use it.
            if (customTransformResult &&
                'x' in customTransformResult &&
                'y' in customTransformResult) {
                const { x, y } = customTransformResult;
                this.positionStore.set({ x, y });
            }
        }
        // this.updateLocalStorage()
        this.#fireUpdateEvent();
    }
    update(v = this.position) {
        this.#log.fn('update').debug('Updating position:', v, this);
        this.moveTo(v);
    }
    /**
     * Updates the {@link position} property in local storage.
     */
    updateLocalStorage = () => {
        if (!this.opts.localStorageKey)
            return;
        this.#log
            .fn('updateLocalStorage')
            .debug('Updating position in localStorage:', `{ x: ${this._position.x}, y: ${this._position.y} }`, this);
        if (this._storage) {
            this._storage.set(this._position);
        }
    };
    clearLocalStorage = () => {
        if (this._storage && this.opts.localStorageKey) {
            localStorage.removeItem(this.opts.localStorageKey);
        }
    };
    /**
     * Resolves the {@link DraggableOptions.bounds|bounds} and returns a
     * function that updates the {@link bounds} property when called.
     */
    #resolveBounds(opts) {
        if (!opts)
            return () => void 0;
        // Check for a custom bounds rect.
        if (opts &&
            typeof opts === 'object' &&
            ('left' in opts || 'right' in opts || 'top' in opts || 'bottom' in opts)) {
            return () => {
                this.bounds = {
                    left: -Infinity,
                    right: Infinity,
                    top: -Infinity,
                    bottom: Infinity,
                    ...this.opts.bounds,
                };
            };
        }
        // prettier-ignore
        const node = isHTMLElement(opts) ? opts
            : opts === 'body' ? document.body
                : opts === 'parent' ? this.node.offsetParent
                    : isString(opts) ? select(opts)[0]
                        : !isDefined(opts) ? document.documentElement
                            : undefined;
        // Error handling.
        if (!node)
            throw new Error('Invalid bounds option provided: ' + opts);
        this.boundsEl = node;
        // Add a resize observer to the bounds element to automatically update the bounds.
        const boundsResizeObserver = new ResizeObserver(() => {
            // this.clickOffset = { x: this.rect.left, y: this.rect.top }
            this.resize();
            this.#fireUpdateEvent();
        });
        boundsResizeObserver.observe(node);
        this.#listeners.add(() => boundsResizeObserver.disconnect());
        this.#fireUpdateEvent();
        return () => (this.bounds = node.getBoundingClientRect());
    }
    /**
     * Resolves a {@link DraggableOptions.position} option into an `{x,y}` vector
     * depending on its type:
     * - `undefined` -> {@link DRAGGABLE_DEFAULTS.position}
     * - {@link Placement} -> {@link place}
     * - `{x,y}` -> itself *(merged with {@link DRAGGABLE_DEFAULTS.position}*
     * if it's a partial.)
     */
    resolvePosition(pos) {
        const defaultPos = DRAGGABLE_DEFAULTS.position;
        if (!pos) {
            return defaultPos;
        }
        if (typeof pos === 'string') {
            return place(this.node, pos, {
                bounds: this.boundsEl?.getBoundingClientRect(),
                ...this.opts.placementOptions,
            });
        }
        if (typeof pos === 'object' && ('x' in pos || 'y' in pos)) {
            return { ...defaultPos, ...pos };
        }
        throw new Error('Invalid position: ' + JSON.stringify(pos), {
            cause: {
                defaultPos,
                pos,
            },
        });
    }
    #cancelElementContains = (dragElements) => {
        return this.cancelEls.some(cancelEl => dragElements.some(el => cancelEl.contains(el)));
    };
    #callEvent = (eventName, fn) => {
        const data = this.eventData;
        this.node.dispatchEvent(new CustomEvent(eventName, { detail: data }));
        fn?.(data);
    };
    #fireSvelteDragStartEvent = () => {
        this.#callEvent('dragstart', this.opts.onDragStart);
    };
    #fireSvelteDragEndEvent = () => {
        this.#callEvent('dragend', this.opts.onDragEnd);
    };
    #fireSvelteDragEvent = () => {
        this.#callEvent('drag', this.opts.onDrag);
    };
    #fireUpdateEvent = () => {
        this.node.dispatchEvent(new CustomEvent('update', { detail: this }));
    };
    dispose() {
        this.#evm.dispose();
    }
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
 */
export function draggable(node, options) {
    const d = new Draggable(node, options ?? {});
    return {
        destroy: () => {
            d.dispose();
        },
        // The update function of a svelte action automatically fires whenever the
        // options object is changed externally, enabling easy reactivity.
        update: (options) => {
            if (!options)
                return;
            // Update all the values that need to be changed
            d.opts.axis = options.axis || DRAGGABLE_DEFAULTS.axis;
            d.disabled = options.disabled ?? DRAGGABLE_DEFAULTS.disabled;
            d.opts.ignoreMultitouch =
                options.ignoreMultitouch ?? DRAGGABLE_DEFAULTS.ignoreMultitouch;
            d.opts.handle = options.handle;
            d.opts.bounds = options.bounds;
            d.opts.cancel = options.cancel;
            d.opts.userSelectNone = options.userSelectNone ?? DRAGGABLE_DEFAULTS.userSelectNone;
            d.opts.transform = options.transform;
            const dragged = d.node.classList.contains(d.opts.classes.dragged);
            d.node.classList.remove(d.opts.classes.default, d.opts.classes.dragged);
            d.opts.classes.default = options?.classes?.default ?? DEFAULT_CLASSES.default;
            d.opts.classes.dragging = options?.classes?.dragging ?? DEFAULT_CLASSES.dragging;
            d.opts.classes.dragged = options?.classes?.dragged ?? DEFAULT_CLASSES.dragged;
            d.node.classList.add(d.opts.classes.default);
            if (dragged)
                d.node.classList.add(d.opts.classes.default);
            if (d.isControlled) {
                if (options.position) {
                    const pos = d.resolvePosition(options.position);
                    d.x = pos.x;
                    d.y = pos.y;
                }
                d.moveTo({ x: d.x, y: d.y });
            }
        },
    };
}
