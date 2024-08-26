import { isString, isHTMLElement, isDefined } from './is.js';
import { writable } from './store.js';
import { EventManager } from './EventManager.js';
import { persist } from './persist.js';
import { select } from './select.js';
import { Logger } from './logger.js';
import { place } from './place.js';
import { clamp } from './clamp.js';

const DEFAULT_CLASSES = {
    default: 'fractils-draggable',
    dragging: 'fractils-dragging',
    dragged: 'fractils-dragged',
    cancel: 'fractils-cancel',
};
const DRAGGABLE_DEFAULTS = {
    __type: 'DraggableOptions',
    bounds: 'body',
    axis: 'both',
    userSelectNone: true,
    ignoreMultitouch: false,
    disabled: false,
    position: { x: 0, y: 0 },
    margin: 0,
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
class Draggable {
    node;
    static initialized = false;
    opts;
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
    _storage;
    _position = { x: 0, y: 0 };
    /**
     * An observable store that updates the draggable element's position.
     */
    positionStore;
    /**
     * @todo I think we can just remove this and let the user add their
     * own event listeners if they want to target a specific element.
     */
    eventTarget;
    /**
     * Whether the draggable element is currently being dragged.
     */
    _active = false;
    /**
     * The original value of `user-select` on the body element
     * used to restore the original value after dragging when
     * {@link DraggableOptions.userSelectNone|userSelectNone} is `true`.
     */
    _bodyOriginalUserSelectVal = '';
    /**
     * Updates the {@link bounds} property to account for any changes in the
     * DOM or this instance's {@link DraggableOptions.bounds|bounds} option.
     */
    _recomputeBounds;
    /**
     * This node's DOMRect, cached for use via {@link rect}.
     */
    _rect;
    /**
     * The {@link EventManager} for this draggable instance.
     */
    _evm = new EventManager();
    /**
     * A callback to release the pointer capture using the
     * {@link PointerEvent.pointerId | pointerId} and reset the cursor.
     */
    _releaseCapture = () => { };
    /**
     * Internal logger for infoging. Automatically bypassed in non-dev environments.
     */
    _log;
    constructor(node, options) {
        this.node = node;
        const { margin } = options ?? DRAGGABLE_DEFAULTS;
        const m = typeof margin === 'number'
            ? { x: margin, y: margin }
            : Object.assign({ x: 0, y: 0 }, margin);
        this.opts = Object.assign({}, DRAGGABLE_DEFAULTS, options, { margin: m });
        this._log = new Logger('draggable ' + Array.from(this.node.classList).join('.'), {
            fg: 'SkyBlue',
        });
        this._log.fn('constructor').info({ opts: this.opts, this: this });
        this._rect = this.node.getBoundingClientRect();
        this._recomputeBounds = this._resolveBounds(this.opts.bounds);
        this.opts.position = this.resolvePosition(this.opts.position);
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
        this._evm.listen(this.node, 'pointerdown', this.dragStart);
        this._evm.listen(window, 'pointerup', this.dragEnd);
        this._evm.listen(window, 'pointermove', this.drag);
        this._evm.listen(window, 'resize', this.resize);
        this._evm.add(this.positionStore.subscribe(({ x, y }) => {
            this.node.style.setProperty('translate', `${x}px ${y}px 1px`);
        }));
        if (startPosition !== DRAGGABLE_DEFAULTS.position) {
            this._recomputeBounds();
            this._position = { x: this.x, y: this.y };
            this.moveTo(startPosition);
        }
    }
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
        // Error handling.
        if (isString(this.opts.handle) &&
            isString(this.opts.cancel) &&
            this.opts.handle === this.opts.cancel) {
            throw new Error("`handle` selector can't be same as `cancel` selector");
        }
        // Resolve the event target.
        if (this._cancelElementContains(this.handleEls)) {
            throw new Error("Element being dragged can't be a child of the element on which `cancel` is applied");
        }
        const eventTarget = e.composedPath()[0];
        // Return if the event target is not a handle element.
        if (!this.handleEls.some(e => e.contains(eventTarget) || e.shadowRoot?.contains(eventTarget)))
            return;
        // Make sure it's not a cancel element.
        if (this._cancelElementContains([eventTarget])) {
            return;
        }
        this._log.fn('dragStart').debug('Dragging initiated.');
        e.stopPropagation();
        // Resolve the event target.
        this.eventTarget =
            this.handleEls.length === 1
                ? this.node
                : this.handleEls.find(el => el.contains(eventTarget));
        this._active = true;
        // Store the click offset
        if (this.canMoveX)
            this.clickOffset.x = e.clientX - this.x;
        if (this.canMoveY)
            this.clickOffset.y = e.clientY - this.y;
        // Update the virtual rectangle.
        // const { top, right, bottom, left } = this.node.getBoundingClientRect()
        // this.rect = { top, right, bottom, left }
        this._updateRect();
        // Update the clientToNodeOffset.
        if (this.bounds) {
            this.clientToNodeOffset = {
                x: e.clientX - this.rect.left,
                y: e.clientY - this.rect.top,
            };
        }
        // Set the initial position (with a forced duration of 0).
        this.positionStore.set({ x: this.x, y: this.y });
        // Update the bounds rect.
        this._recomputeBounds();
        // this.#updateBounds()
        this.node.dispatchEvent(new CustomEvent('grab'));
        // Capture the pointer and store the release callback.
        const { cursor } = getComputedStyle(this.node);
        this.node.setPointerCapture(e.pointerId);
        this.node.style.cursor = 'grabbing';
        this._releaseCapture = () => {
            // this.node.releasePointerCapture(e.pointerId)
            this.node.style.cursor = cursor;
        };
        // Dispatch custom events
        this._emitDragStart();
        this._emitUpdate();
    };
    /**
     * Used to account for any scaling or transforms on the node when calculating bounds.
     */
    boundsDiff = { x: 0, y: 0 };
    /**
     * This target node's cached {@link DOMRect}
     */
    get rect() {
        return this._rect;
    }
    _updateRect() {
        this._rect = this.node.getBoundingClientRect();
        this.boundsDiff = {
            x: this.x - this.rect.x,
            y: this.y - this.rect.y,
        };
    }
    drag = (e) => {
        if (!this._active)
            return;
        e.preventDefault();
        e.stopPropagation();
        // Apply dragging and dragged classes.
        this.node.classList.add(this.opts.classes.dragging);
        this.node.classList.add(this.opts.classes.dragged);
        const x = e.clientX - this.clickOffset.x;
        const y = e.clientY - this.clickOffset.y;
        const target = { x, y };
        this.moveTo(target);
        this._emitDrag();
    };
    dragEnd = () => {
        if (!this._active)
            return;
        this.node.classList.remove(this.opts.classes.dragging);
        if (this.opts.userSelectNone) {
            document.body.style.userSelect = this._bodyOriginalUserSelectVal;
        }
        this.clickOffset = { x: 0, y: 0 };
        this.clientToNodeOffset = { x: 0, y: 0 };
        this._position = { x: this.x, y: this.y };
        this._active = false;
        this._releaseCapture();
        this.node.dispatchEvent(new CustomEvent('release'));
        setTimeout(() => this.node.classList.remove(this.opts.classes.dragged), 0);
        this._emitDragEnd();
        this.updateLocalStorage();
    };
    resize = () => {
        this._log.fn('resize').info('current position:', this.position);
        this._recomputeBounds();
        // this.#updateBounds()
        this.moveTo(this.position); // works but doesn't preserve original position
    };
    /**
     * Moves the {@link node|draggable element} to the specified position, adjusted
     * for collisions with {@link obstacleEls obstacles} or {@link boundsRect bounds}.
     */
    moveTo(target) {
        if (this.disabled || this.disposed)
            return;
        this._log.fn('moveTo').info('Moving to:', target, { rect: this.rect, bounds: this.bounds });
        //! todo - DELETE
        if (isNaN(target.x) || isNaN(target.y)) {
            console.error('Invalid target position:', target);
            console.trace(target);
        }
        if (this.bounds) {
            target.x = clamp(target.x, this.bounds.left + this.boundsDiff.x, this.bounds.right + this.boundsDiff.x - (this.rect.right - this.rect.left));
            target.y = clamp(target.y, this.bounds.top + this.boundsDiff.y, this.bounds.bottom + this.boundsDiff.y - (this.rect.bottom - this.rect.top));
        }
        if (this.canMoveX) {
            const deltaX = target.x - this.x;
            if (deltaX !== 0) {
                this.x += deltaX;
            }
        }
        if (this.canMoveY) {
            if (this.bounds)
                target.y = clamp(target.y, this.bounds.top + this.boundsDiff.y, this.bounds.bottom + this.boundsDiff.y);
            const deltaY = target.y - this.y;
            if (deltaY !== 0) {
                this.y += deltaY;
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
        this._emitUpdate();
        this._log.fn('moveTo').info('Moved to:', this.position, { rect: this.rect, bounds: this.bounds });
        if (this.position.x <= 0 || this.position.y <= 0) {
            console.error('Invalid position:', this.position);
            console.trace(this.position);
        }
    }
    update(v = this.position) {
        this._log.fn('update').debug('Updating position:', v, this);
        this.moveTo(v);
    }
    /**
     * Updates the {@link position} property in local storage.
     */
    updateLocalStorage = () => {
        if (!this.opts.localStorageKey)
            return;
        this._log
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
     * Resolves a {@link DraggableOptions.position} option into an `{x,y}` vector
     * depending on its type:
     * - `undefined` -> {@link DRAGGABLE_DEFAULTS.position}
     * - {@link Placement} -> {@link place}
     * - `{x,y}` -> itself *(merged with {@link DRAGGABLE_DEFAULTS.position}*
     * if it's a partial.)
     */
    resolvePosition(pos) {
        const defaultPos = DRAGGABLE_DEFAULTS.position;
        if (!pos || this.disposed) {
            return defaultPos;
        }
        if (typeof pos === 'string') {
            return place(this.node, pos, {
                bounds: this.boundsEl?.getBoundingClientRect(),
                margin: this.opts.margin,
            });
        }
        if (typeof pos === 'object' && ('x' in pos || 'y' in pos)) {
            return {
                x: (pos.x ?? defaultPos.x) + this.opts.margin.x,
                y: (pos.y ?? defaultPos.y) + this.opts.margin.y,
            };
        }
        throw new Error('Invalid position: ' + JSON.stringify(pos), {
            cause: {
                defaultPos,
                pos,
            },
        });
    }
    /**
     * Resolves the {@link DraggableOptions.bounds|bounds} and returns a
     * function that updates the {@link bounds} property when called.
     */
    _resolveBounds(optsBounds) {
        if (this.disposed)
            return () => void 0;
        const resolveUpdater = () => {
            if (!optsBounds)
                return () => void 0;
            // Check for a custom bounds rect.
            if (optsBounds &&
                typeof optsBounds === 'object' &&
                ('left' in optsBounds ||
                    'right' in optsBounds ||
                    'top' in optsBounds ||
                    'bottom' in optsBounds)) {
                return () => {
                    Object.assign(this.bounds, optsBounds);
                };
            }
            // prettier-ignore
            const node = isHTMLElement(optsBounds) ? optsBounds
                : optsBounds === 'body' ? document.body
                    : optsBounds === 'parent' ? this.node.offsetParent
                        : isString(optsBounds) ? select(optsBounds)[0]
                            : !isDefined(optsBounds) ? document.documentElement
                                : undefined;
            // Error handling.
            if (!node) {
                console.error(`Invalid bounds option provided: ${optsBounds}. Aborting.`);
                return;
            }
            this.boundsEl = node;
            // Add a resize observer to the bounds element to automatically update the bounds.
            const boundsResizeObserver = new ResizeObserver(() => {
                this.resize();
                this._emitUpdate();
            });
            boundsResizeObserver.observe(node);
            this._evm.add(() => boundsResizeObserver.disconnect());
            this._emitUpdate();
            return () => {
                const rect = node.getBoundingClientRect();
                this.bounds.left = rect.left;
                this.bounds.top = rect.top;
                this.bounds.right = rect.right;
                this.bounds.bottom = rect.bottom;
            };
        };
        const updateBounds = resolveUpdater();
        return () => {
            updateBounds?.();
            this._updateRect();
        };
    }
    _cancelElementContains = (dragElements) => {
        return this.cancelEls.some(cancelEl => dragElements.some(el => cancelEl.contains(el)));
    };
    _callEvent = (eventName, fn) => {
        const data = this.eventData;
        this.node.dispatchEvent(new CustomEvent(eventName, { detail: data }));
        fn?.(data);
    };
    _emitDragStart = () => {
        this._callEvent('dragstart', this.opts.onDragStart);
    };
    _emitDragEnd = () => {
        this._callEvent('dragend', this.opts.onDragEnd);
    };
    _emitDrag = () => {
        this._callEvent('drag', this.opts.onDrag);
    };
    _emitUpdate = () => {
        this.node.dispatchEvent(new CustomEvent('update', { detail: this }));
    };
    disposed = false;
    dispose() {
        this.disposed = true;
        this._evm.dispose();
    }
}

export { DRAGGABLE_DEFAULTS, Draggable };
//# sourceMappingURL=draggable.js.map
