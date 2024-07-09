import { deepMergeOpts } from './deepMergeOpts.js';
import { nanoid } from './nanoid.js';
import { Logger } from './logger.js';
import { select } from './select.js';
import { state } from './state.js';
import { clamp } from './clamp.js';

// import { collisionClampX, collisionClampY } from './collisions'
const RESIZABLE_DEFAULTS = {
    __type: 'ResizableOptions',
    sides: ['right', 'bottom'],
    corners: ['bottom-right'],
    grabberSize: 6,
    onResize: () => { },
    localStorageKey: undefined,
    visible: false,
    color: 'var(--fg-d, #1d1d1d)',
    opacity: 0.75,
    borderRadius: '50%',
    obstacles: undefined,
    cursors: true,
    classes: {
        default: 'resize-grabber',
        active: 'resize-grabbing',
    },
    bounds: 'document',
    disabled: false,
};
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
class Resizable {
    node;
    static type = 'Resizable';
    static initialized = false;
    id = nanoid(8);
    opts;
    disabled;
    bounds;
    obstacleEls;
    size;
    #activeGrabber = null;
    #listeners = [];
    #cleanupGrabListener = null;
    #cornerGrabberSize;
    #log;
    constructor(node, options) {
        this.node = node;
        this.opts = deepMergeOpts([RESIZABLE_DEFAULTS, options], { concatArrays: false });
        this.disabled = this.opts.disabled;
        this.#log = new Logger('resizable', {
            fg: 'GreenYellow',
            deferred: false,
        });
        this.#log.fn('constructor').info({ opts: this.opts, this: this });
        this.node.classList.add('fractils-resizable');
        this.#cornerGrabberSize = this.opts.grabberSize * 3;
        this.bounds = select(this.opts.bounds)[0] ?? globalThis.document?.documentElement;
        this.obstacleEls = select(this.opts.obstacles);
        this.generateStyles();
        const { offsetWidth: width, offsetHeight: height } = node;
        this.size = state({ width, height }, { key: this.opts.localStorageKey });
        console.log('this.opts.localStorageKey', this.opts.localStorageKey);
        console.log('this.size.value', this.size.value);
        //? Load size from local storage.
        if (this.opts.localStorageKey) {
            const { width, height } = this.size.value;
            if (width === 0 || height === 0) {
                this.size.set({
                    width: this.node.offsetWidth,
                    height: this.node.offsetHeight,
                });
            }
            else {
                if (this.opts.corners.length || this.opts.sides.some(s => s.match(/left|right/))) {
                    node.style.width = width + 'px';
                }
                if (this.opts.corners.length || this.opts.sides.some(s => s.match(/top|bottom/))) {
                    node.style.height = height + 'px';
                }
            }
            node.dispatchEvent(new CustomEvent('resize'));
        }
        this.createGrabbers();
        if (+this.node.style.minWidth > this.boundsRect.width) {
            console.error('Min width is greater than bounds width.');
            return;
        }
        this.size.set({
            width: this.node.offsetWidth,
            height: this.node.offsetHeight,
        });
    }
    get boundsRect() {
        return this.bounds.getBoundingClientRect();
    }
    //? Create resize grabbers.
    createGrabbers() {
        for (const [side, type] of [
            ...this.opts.sides.map(s => [s, 'side']),
            ...this.opts.corners.map(c => [c, 'corner']),
        ]) {
            const grabber = document.createElement('div');
            grabber.classList.add(`${this.opts.classes.default}-${this.id}`);
            grabber.classList.add(`${this.opts.classes.default}-${type}-${this.id}`);
            grabber.classList.add(`${this.opts.classes.default}-${side}-${this.id}`);
            grabber.dataset['side'] = side;
            // grabber.style.setProperty('opacity', this.opts.visible ? '1' : '0')
            grabber.addEventListener('pointerdown', this.onGrab);
            this.#listeners.push(() => grabber.removeEventListener('pointerdown', this.onGrab));
            this.node.appendChild(grabber);
        }
    }
    clickOffset = { x: 0, y: 0 };
    onGrab = (e) => {
        if (this.disabled)
            return;
        this.node.setPointerCapture(e.pointerId);
        this.#activeGrabber = e.currentTarget;
        this.#activeGrabber.classList.add(this.opts.classes.active);
        document.body.classList.add(this.opts.classes.active);
        this.obstacleEls = select(this.opts.obstacles);
        const side = this.#activeGrabber.dataset['side'];
        if (side.match(/top/))
            this.clickOffset.y = e.clientY - this.rect.top;
        if (side.match(/bottom/))
            this.clickOffset.y = e.clientY - this.rect.bottom;
        if (side.match(/left/))
            this.clickOffset.x = e.clientX - this.rect.left;
        if (side.match(/right/))
            this.clickOffset.x = e.clientX - this.rect.right;
        e.preventDefault();
        e.stopPropagation();
        this.#cleanupGrabListener?.();
        document.addEventListener('pointermove', this.onMove);
        this.#cleanupGrabListener = () => document.removeEventListener('pointermove', this.onMove);
        // this.node.dispatchEvent(new CustomEvent('grab', { detail: { side } }))
        this.#computedStyleValues();
        document.addEventListener('pointerup', this.onUp, { once: true });
    };
    get translateX() {
        return +this.node.dataset['translateX'] || 0;
    }
    set translateX(v) {
        this.node.dataset['translateX'] = String(v);
    }
    get translateY() {
        return +this.node.dataset['translateY'] || 0;
    }
    set translateY(v) {
        this.node.dataset['translateY'] = String(v);
    }
    get rect() {
        return this.node.getBoundingClientRect();
    }
    // Private computedStyleValues
    #minWidth = 0;
    #maxWidth = 0;
    #minHeight = 0;
    #maxHeight = 0;
    #boundsRect = {
        left: -Infinity,
        top: -Infinity,
        right: Infinity,
        bottom: Infinity,
    };
    #computedStyleValues = () => {
        const { minWidth, maxWidth, paddingLeft, paddingRight, borderLeftWidth, borderRightWidth, minHeight, maxHeight, paddingTop, paddingBottom, borderTopWidth, borderBottomWidth, } = window.getComputedStyle(this.node);
        const borderBoxX = parseFloat(paddingLeft) +
            parseFloat(paddingRight) +
            parseFloat(borderLeftWidth) +
            parseFloat(borderRightWidth);
        const borderBoxY = parseFloat(paddingTop) +
            parseFloat(paddingBottom) +
            parseFloat(borderTopWidth) +
            parseFloat(borderBottomWidth);
        this.#minWidth = Math.max((parseFloat(minWidth) || 0) + borderBoxX, 25);
        this.#maxWidth = Math.min(parseFloat(maxWidth) || Infinity);
        this.#minHeight = Math.max((parseFloat(minHeight) || 0) + borderBoxY, 25);
        this.#maxHeight = Math.min(parseFloat(maxHeight) || Infinity);
        this.#boundsRect = this.bounds.getBoundingClientRect();
    };
    resizeX = (x, borderleft) => {
        let deltaX;
        if (borderleft) {
            deltaX = x - this.rect.left;
            if (deltaX === 0)
                return this;
            // deltaX = collisionClampX(deltaX, this.rect, this.obstacleEls)
            if (this.#boundsRect)
                deltaX = Math.max(deltaX, this.#boundsRect.left - this.rect.left);
            const newWidth = clamp(this.rect.width - deltaX, this.#minWidth, this.#maxWidth);
            if (newWidth === this.#minWidth)
                deltaX = this.rect.width - newWidth;
            this.translateX += deltaX;
            this.node.style.setProperty('translate', `${this.translateX}px ${this.translateY}px`);
            this.node.style.width = `${newWidth}px`;
        }
        else {
            deltaX = x - this.rect.right;
            if (deltaX === 0)
                return this;
            // deltaX = collisionClampX(deltaX, this.rect, this.obstacleEls)
            if (this.#boundsRect)
                deltaX = Math.min(deltaX, this.#boundsRect.right - this.rect.right);
            const newWidth = clamp(this.rect.width + deltaX, this.#minWidth, this.#maxWidth);
            this.node.style.width = `${newWidth}px`;
        }
        return this;
    };
    resizeY = (y, bordertop) => {
        let deltaY;
        if (bordertop) {
            deltaY = y - this.rect.top;
            if (deltaY != 0) {
                // deltaY = collisionClampY(deltaY, this.rect, this.obstacleEls)
                if (this.#boundsRect)
                    deltaY = Math.max(deltaY, this.#boundsRect.top - this.rect.top);
                const newHeight = clamp(this.rect.height - deltaY, this.#minHeight, this.#maxHeight);
                if (newHeight === this.#minHeight)
                    deltaY = this.rect.height - newHeight;
                this.translateY += deltaY;
                this.node.style.setProperty('translate', `${this.translateX}px ${this.translateY}px`);
                this.node.style.height = `${newHeight}px`;
            }
        }
        else {
            deltaY = y - this.rect.bottom;
            if (deltaY !== 0) {
                // deltaY = collisionClampY(deltaY, this.rect, this.obstacleEls)
                if (this.#boundsRect)
                    deltaY = Math.min(deltaY, this.#boundsRect.bottom - this.rect.bottom);
                const newHeight = clamp(this.rect.height + deltaY, this.#minHeight, this.#maxHeight);
                this.node.style.height = `${newHeight}px`;
            }
        }
        return this;
    };
    /**
     * This is where all the resizing logic happens.
     */
    onMove = (e) => {
        if (!this.#activeGrabber) {
            console.error('No active grabber');
            return;
        }
        const x = e.clientX - this.clickOffset.x;
        const y = e.clientY - this.clickOffset.y;
        const { side } = this.#activeGrabber.dataset;
        this.#log.fn('onMove').debug(side);
        switch (side) {
            case 'top-left':
                this.resizeY(y, true).resizeX(x, true);
                break;
            case 'top-right':
                this.resizeY(y, true).resizeX(x);
                break;
            case 'bottom-right':
                this.resizeY(y).resizeX(x);
                break;
            case 'bottom-left':
                this.resizeY(y).resizeX(x, true);
                break;
            case 'top':
                this.resizeY(y, true);
                break;
            case 'right':
                this.resizeX(x);
                break;
            case 'bottom':
                this.resizeY(y);
                break;
            case 'left':
                this.resizeX(x, true);
                break;
        }
        this.node.dispatchEvent(new CustomEvent('resize'));
        this.size.set({
            width: this.node.offsetWidth,
            height: this.node.offsetHeight,
        });
        this.opts.onResize({
            width: this.node.offsetWidth,
            height: this.node.offsetHeight,
        });
    };
    onUp = () => {
        this.#cleanupGrabListener?.();
        document.body.classList.remove(this.opts.classes.active);
        this.#activeGrabber?.classList.remove(this.opts.classes.active);
        this.node.dispatchEvent(new CustomEvent('release'));
    };
    /**
     * Creates the global stylesheet (but only once).
     */
    generateStyles() {
        this.#log.fn('generateStyles').debug('Generating global styles for', this);
        let css = /*css*/ `
			.resize-grabber-${this.id} {
				position: absolute;
				display: flex;

				opacity: ${this.opts.visible ? this.opts.opacity : 0};
				border-radius: ${this.opts.borderRadius};
				border-radius: inherit;

				transition: opacity 0.1s;
			}

			.fractils-resizable:not(.fractils-grabbing) .resize-grabber-${this.id}:hover {
				opacity: ${this.opts.opacity / 2};
			}

			.resize-grabber-${this.id}:active {
				opacity: ${this.opts.opacity * 0.75};
			}
		`;
        if (this.opts.cursors) {
            css += /*css*/ `
				.resize-grabbing-${this.id} *, .resize-grabber-${this.id}:active {
					cursor: grabbing !important;
				}
			`;
        }
        const cursor = (v) => !this.opts.cursors
            ? ''
            : `
				cursor: ${v};`;
        const offset = this.opts.grabberSize / 2;
        const gradient = `transparent 20%, ${this.opts.color} 33%, ${this.opts.color} 66%, transparent 75%, transparent 100%`;
        const lengthPrcnt = 98;
        if (this.opts.sides.includes('top'))
            css += /*css*/ `
			.${this.opts.classes.default}-top-${this.id} {
				${cursor('ns-resize')}
				top: ${-offset}px;
				left: ${50 - lengthPrcnt * 0.5}%;

				width: ${lengthPrcnt}%;
				height: ${this.opts.grabberSize}px;

				background: linear-gradient(to bottom, ${gradient});
			}
		`;
        if (this.opts.sides.includes('right'))
            css += /*css*/ `
			.${this.opts.classes.default}-right-${this.id} {
				${cursor('ew-resize')}
				right: ${-offset}px;
				top: ${50 - lengthPrcnt * 0.5}%;

				width: ${this.opts.grabberSize}px;
				height: ${lengthPrcnt}%;

				background: linear-gradient(to left, ${gradient});
			}
		`;
        if (this.opts.sides.includes('bottom'))
            css += /*css*/ `
			.${this.opts.classes.default}-bottom-${this.id} {
				${cursor('ns-resize')}
				bottom: ${-offset}px;
				left: ${50 - lengthPrcnt * 0.5}%;

				width: ${lengthPrcnt}%;
				height: ${this.opts.grabberSize}px;

				background: linear-gradient(to top, ${gradient});
			}
		`;
        if (this.opts.sides.includes('left'))
            css += /*css*/ `
				.${this.opts.classes.default}-left-${this.id} {
					${cursor('ew-resize')}
					left: ${-offset}px;
					top: ${50 - lengthPrcnt * 0.5}%;

					width: ${this.opts.grabberSize}px;
					height: ${lengthPrcnt}%;

					background: linear-gradient(to right, ${gradient});
				}
			`;
        css += `.fractils-grabbing .resize-grabber { cursor: default }`;
        const cSize = this.#cornerGrabberSize;
        const opposites = {
            'top-left': '100% 100%',
            'top-right': '0% 100%',
            'bottom-left': '100% 0%',
            'bottom-right': '0% 0%',
        };
        const corner = (corner, cursorValue) => {
            if (!this.opts.corners.includes(corner))
                return;
            const classname = `${this.opts.classes.default}-${corner}-${this.id}`;
            const sides = corner.replace(this.opts.classes.default, '').split('-');
            css += `
				.${classname} {${cursor(cursorValue)}
					${sides[0]}: 0px;
					${sides[1]}: 0px;
					width: ${cSize}px;
					height: ${cSize}px;
				}
				.${classname}::after {
					content: '';
					width: 100%;
					height: 100%;
					background: radial-gradient(farthest-corner at ${opposites[corner]}, transparent 70%, ${this.opts.color} 86%);
					border-radius: 15%;
				}
			`;
        };
        corner('top-left', 'nwse-resize');
        corner('top-right', 'nesw-resize');
        corner('bottom-left', 'nesw-resize');
        corner('bottom-right', 'nwse-resize');
        const styleEl = document.createElement('style');
        styleEl.innerHTML = css;
        document.head.appendChild(styleEl);
    }
    dispose() {
        for (const cleanup of this.#listeners) {
            cleanup();
        }
        this.#cleanupGrabListener?.();
    }
}

export { RESIZABLE_DEFAULTS, Resizable };
//# sourceMappingURL=resizable.js.map
