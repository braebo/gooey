import { __decorate, __metadata } from './../external/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.20.0_tslib@2.6.3_typescript@5.5.4/external/tslib/tslib.es6.js';
import { deepMergeOpts } from './deepMergeOpts.js';
import { EventManager } from './EventManager.js';
import { styled } from './decorators/styled.js';
import { entries } from './object.js';
import { toFn } from './toFn.js';

const TOOLTIP_DEFAULTS = {
    __type: 'TooltipOptions',
    text: '',
    placement: 'top',
    anchor: 'node',
    delay: 250,
    delayOut: 50,
    offsetX: '0%',
    offsetY: '0%',
    animation: {
        duration: 300,
        durationOut: 150,
        easing: 'cubic-bezier(0.23, 1, 0.320, 1)',
    },
    style: undefined,
    hideOnClick: false,
};
let Tooltip = class Tooltip {
    node;
    __type = 'Tooltip';
    /**
     * The tooltip element itself.
     */
    element;
    /**
     * The parent element of the tooltip.
     */
    parent;
    /**
     * Whether the tooltip is currently showing.
     */
    showing = false;
    opts;
    _text;
    _style = () => undefined;
    _evm = new EventManager();
    _animPositions;
    _delayInTimer;
    _delayOutTimer;
    constructor(
    /**
     * The node that the tooltip is attached to.
     */
    node, options) {
        this.node = node;
        const opts = deepMergeOpts([TOOLTIP_DEFAULTS, options]);
        this.opts = opts;
        this.placement = opts.placement;
        this._text = toFn(opts.text);
        this.style = opts.style;
        this.parent = options?.parent ?? document.getElementById('svelte') ?? document.body;
        const el = document.createElement('div');
        el.classList.add('gooey-tooltip');
        el.innerHTML = String(this._text());
        this.element = el;
        if (this.style) {
            requestAnimationFrame(() => {
                for (const [key, value] of entries(this.style)) {
                    if (key && value) {
                        this.element.style.setProperty(key, value);
                    }
                }
            });
        }
        this._evm.listen(this.element, 'pointerenter', () => this._hoverIn());
        this._evm.listen(node, 'pointerenter', () => {
            this._hoveringNode = true;
            this.show();
        });
        this._evm.listen(node, 'pointerleave', () => {
            this._hoveringNode = false;
            this.hide();
        });
        this._evm.listen(node, 'pointermove', e => this._updatePosition(e));
        this._evm.listen(node, 'click', () => {
            if (opts.hideOnClick)
                this.hide();
            else
                this.refresh();
        });
        // this.show()
    }
    refresh() {
        if (!this.element)
            return;
        this.element.innerHTML = String(this.text);
        setTimeout(() => this._updatePosition(), 0);
        this._maybeWatchAnchor();
        clearTimeout(this._delayInTimer);
        clearTimeout(this._delayOutTimer);
    }
    /**
     * The text to display in the tooltip.  Assigning a new value will update the tooltip text.
     */
    get text() {
        return this._text();
    }
    set text(text) {
        this._text = toFn(text);
        if (!this.element)
            return;
        const t = this._text();
        this.element.innerHTML = String(typeof t === 'object' ? JSON.stringify(t) : t);
    }
    get style() {
        return this._style();
    }
    set style(style) {
        this._style = toFn(style);
        this.refresh();
    }
    get placement() {
        return this.opts.placement;
    }
    set placement(v) {
        this.opts.placement = v;
        switch (v) {
            case 'top':
                this._animPositions = { from: 'translateY(4px)', to: 'translateY(0)' };
                break;
            case 'bottom':
                this._animPositions = { from: 'translateY(-4px)', to: 'translateY(0)' };
                break;
            case 'left':
                this._animPositions = { from: 'translateX(4px)', to: 'translateX(0)' };
                break;
            case 'right':
                this._animPositions = { from: 'translateX(-4px)', to: 'translateX(0)' };
        }
    }
    get offsetX() {
        return this.opts.offsetX;
    }
    set offsetX(v) {
        this.opts.offsetX = v;
        this._updatePosition();
    }
    get offsetY() {
        return this.opts.offsetY;
    }
    set offsetY(v) {
        this.opts.offsetY = v;
        this._updatePosition();
    }
    /**
     * Animates the tooltip into view.
     */
    show() {
        if (this.showing)
            return this;
        if (!this.text)
            return this;
        const style = this.style;
        if (style) {
            for (const [key, value] of entries(style)) {
                if (key && value) {
                    this.element?.style.setProperty(key, value);
                }
            }
        }
        clearTimeout(this._delayInTimer);
        clearTimeout(this._delayOutTimer);
        this._delayInTimer = setTimeout(async () => {
            this.mount();
            this.showing = true;
            this.element
                ?.animate([
                { opacity: '0', transform: this._animPositions.from },
                { opacity: '1', transform: this._animPositions.to },
            ], {
                duration: this.opts.animation.duration,
                easing: this.opts.animation.easing,
                fill: 'forwards',
            })
                .finished.then(() => {
                if (this.showing) {
                    this.element?.classList.add('showing');
                }
            });
            this._updatePosition();
            this._maybeWatchAnchor();
        }, this.opts.delay);
        return this;
    }
    /**
     * Animates the tooltip out of view.
     * @param force - If `true`, the tooltip will hide immediately regardless of delay or hover state.
     */
    hide(force = false) {
        const hide = async () => {
            if (this.showing) {
                if (!force && (this._hoveringEl || this._hoveringNode)) {
                    queueHide(true);
                    return;
                }
                this.showing = false;
                if (this._watcherId) {
                    this._evm.unlisten(this._watcherId);
                }
                if (!this.element)
                    return;
                this.element.classList.remove('showing');
                await this.element.animate([
                    { opacity: '1', transform: this._animPositions.to },
                    { opacity: '0', transform: this._animPositions.from },
                ], {
                    duration: this.opts.animation.durationOut,
                    easing: this.opts.animation.easing,
                    fill: 'forwards',
                }).finished;
                this.unmount();
            }
        };
        const queueHide = (isRetry = false) => {
            clearTimeout(this._delayInTimer);
            clearTimeout(this._delayOutTimer);
            if (force) {
                hide();
            }
            else {
                const delay = isRetry ? Math.max(250, this.opts.delayOut) : this.opts.delayOut;
                this._delayOutTimer = setTimeout(hide, delay);
            }
        };
        queueHide();
    }
    _hoveringEl = false;
    _hoveringNode = false;
    _hoverIn = () => {
        this._hoveringEl = true;
        this._evm.listen(this.element, 'pointerleave', this._hoverOut, {}, 'hide');
    };
    _hoverOut = () => {
        this._hoveringEl = false;
    };
    /**
     * Whether the tooltip is currently mounted to the DOM.
     * @internal
     */
    _mounted = false;
    mount() {
        if (this._mounted)
            return;
        this._mounted = true;
        if (this.element) {
            this.parent?.appendChild(this.element);
            if (!('maxWidth' in this.element.dataset)) {
                const maxWidth = getComputedStyle(this.element).maxWidth;
                if (maxWidth)
                    this.element.dataset['maxWidth'] = maxWidth;
            }
        }
    }
    unmount() {
        if (!this._mounted)
            return;
        this._mounted = false;
        if (this.element) {
            this.parent?.removeChild(this.element);
            // Reset the max-width in case it was modified during positioning.
            this.element.style.setProperty('max-width', this.element.dataset['maxWidth'] ?? 'initial');
        }
    }
    _updatePosition(e) {
        if (!this.element)
            return;
        const ghost = this.element.cloneNode(true);
        ghost.style.opacity = '0';
        this.parent?.appendChild(ghost);
        const tooltipRect = ghost.getBoundingClientRect();
        ghost.remove();
        if (this.element.innerHTML !== this.text) {
            this.element.innerHTML = String(this.text);
        }
        if (e?.type === 'pointermove') {
            this._mouse = {
                x: e.clientX,
                y: e.clientY,
            };
        }
        // todo - can we safely "cache" the anchor?
        const anchor = this._getAnchorRects();
        if (!anchor)
            return;
        const PADDING = 8;
        const BASE_OFFSET = 4;
        let flipX = false;
        let flipY = false;
        let pos = { x: 0, y: 0 };
        this.element.classList.add('gooey-tooltip-' + this.placement);
        // TODO - Finish this!
        switch (this.placement) {
            case 'top':
                pos = getPlacement('top');
                if (pos.y < 0) {
                    // prettier-ignore
                    const freeSpace = anchor.y.top
                        - BASE_OFFSET
                        - PADDING
                            * 2;
                    const overflow = Math.abs(tooltipRect.height - freeSpace);
                    if (overflow > 0) {
                        if (tooltipRect.height < freeSpace) {
                            pos.y = 0;
                        }
                        else {
                            if (freeSpace < 150) {
                                pos = getPlacement('bottom');
                                flipY = true;
                            }
                            else {
                                this.element.dataset['maxHeight'] ??= this.element.style.maxHeight;
                                this.element.style.setProperty('max-height', `${freeSpace - PADDING}px`);
                            }
                        }
                    }
                }
                break;
            case 'bottom':
                pos = getPlacement('bottom');
                if (pos.y + tooltipRect.height > window.innerHeight) {
                    // prettier-ignore
                    const freeSpace = window.innerHeight
                        - (anchor.y.top + anchor.y.height)
                        - BASE_OFFSET
                        - PADDING
                            * 2;
                    const overflow = Math.abs(tooltipRect.height - freeSpace);
                    if (overflow > 0) {
                        if (tooltipRect.height < freeSpace) {
                            pos.y = window.innerHeight - tooltipRect.height;
                        }
                        else {
                            if (freeSpace < 150) {
                                pos = getPlacement('top');
                                flipY = true;
                            }
                            else {
                                this.element.dataset['maxHeight'] ??= this.element.style.maxHeight;
                                this.element.style.setProperty('max-height', `${freeSpace - PADDING}px`);
                            }
                        }
                    }
                }
                break;
            case 'left':
                pos = getPlacement('left');
                if (pos.x < 0) {
                    const freeSpace = anchor.x.left - BASE_OFFSET - PADDING * 2;
                    const overflow = Math.abs(tooltipRect.width - freeSpace);
                    if (overflow > 0) {
                        if (tooltipRect.width < freeSpace) {
                            pos.x = 0;
                        }
                        else {
                            if (freeSpace < 150) {
                                if (this._text() === 'x (readonly)')
                                    console.log('B');
                                pos = getPlacement('right');
                                flipX = true;
                            }
                            else {
                                if (this._text() === 'x (readonly)')
                                    console.log('C');
                                pos.x = PADDING;
                                this.element.dataset['maxWidth'] ??= this.element.style.maxWidth;
                                this.element.style.setProperty('max-width', `${freeSpace - PADDING}px`);
                            }
                        }
                    }
                }
                break;
            case 'right':
                pos = getPlacement('right');
                if (pos.x + tooltipRect.width > window.innerWidth) {
                    // prettier-ignore
                    const freeSpace = window.innerWidth
                        - (anchor.x.left + anchor.x.width)
                        - BASE_OFFSET
                        - PADDING
                            * 2;
                    const overflow = Math.abs(tooltipRect.width - freeSpace);
                    if (overflow > 0) {
                        if (tooltipRect.width < freeSpace) {
                            pos.x = window.innerWidth - tooltipRect.width;
                        }
                        else {
                            if (freeSpace < 150) {
                                pos = getPlacement('left');
                                flipX = true;
                            }
                            else {
                                // pos.x = window.innerWidth - freeSpace + PADDING
                                this.element.dataset['maxWidth'] ??= this.element.style.maxWidth;
                                this.element.style.setProperty('max-width', `${freeSpace - PADDING}px`);
                            }
                        }
                    }
                }
                break;
        }
        function getPlacement(placement) {
            const p = { x: 0, y: 0 };
            if (!anchor)
                return p;
            // prettier-ignore
            switch (placement) {
                case 'top':
                    p.x = anchor.x.left + window.scrollX + anchor.x.width / 2 - tooltipRect.width / 2;
                    p.y = anchor.y.top + window.scrollY - tooltipRect.height - BASE_OFFSET;
                    break;
                case 'bottom':
                    p.x = anchor.x.left + window.scrollX + anchor.x.width / 2 - tooltipRect.width / 2;
                    p.y = anchor.y.top + window.scrollY + anchor.y.height + BASE_OFFSET;
                    break;
                case 'left':
                    p.x = anchor.x.left + window.scrollX - tooltipRect.width - BASE_OFFSET;
                    p.y = anchor.y.top + window.scrollY + anchor.y.height / 2 - tooltipRect.height / 2;
                    break;
                case 'right':
                    p.x = anchor.x.left + window.scrollX + anchor.x.width + BASE_OFFSET;
                    p.y = anchor.y.top + window.scrollY + anchor.y.height / 2 - tooltipRect.height / 2;
                    break;
            }
            return p;
        }
        const parentRect = this.parent?.getBoundingClientRect();
        if (!parentRect)
            return;
        this.element.style.left = `calc(${pos.x - parentRect.left}px ${flipX ? '-' : '+'} ${this.opts.offsetX})`;
        this.element.style.top = `calc(${pos.y - parentRect.top}px ${flipY ? '-' : '+'} ${this.opts.offsetY})`;
    }
    // todo - mobile touch events support?
    _mouse = { x: 0, y: 0 };
    _getAnchorRects() {
        const getRect = (anchor) => {
            if (!anchor)
                return this.node?.getBoundingClientRect();
            switch (typeof anchor) {
                case 'string': {
                    switch (anchor) {
                        case 'node': {
                            return this.node?.getBoundingClientRect();
                        }
                        case 'mouse': {
                            return {
                                left: this._mouse.x + window.scrollX,
                                top: this._mouse.y + window.scrollY,
                                width: 0,
                                height: 0,
                            };
                        }
                        default: {
                            const el = document.querySelector(anchor);
                            if (el) {
                                return el.getBoundingClientRect();
                            }
                            else {
                                return this.node?.getBoundingClientRect();
                            }
                        }
                    }
                }
                case 'object': {
                    // Unique x and y anchors.
                    if (anchor && 'x' in anchor && 'y' in anchor) {
                        return 'separate';
                    }
                    else if (anchor instanceof HTMLElement) {
                        return anchor.getBoundingClientRect();
                    }
                    else {
                        return this.node?.getBoundingClientRect();
                    }
                }
                default: {
                    return this.node?.getBoundingClientRect();
                }
            }
        };
        const rect = getRect(this.opts.anchor);
        if (rect === 'separate') {
            const x = getRect(this.opts.anchor.x);
            const y = getRect(this.opts.anchor.y);
            if (!x || !y)
                return undefined;
            return { x, y };
        }
        if (!rect)
            return undefined;
        return { x: rect, y: rect };
    }
    _watcherId;
    /**
     * Determines if the tooltip should watch any anchors for movement.
     */
    _maybeWatchAnchor() {
        const maybeWatch = (el) => {
            if (!el)
                return;
            const anchor = el instanceof HTMLElement
                ? el
                : (this.node?.querySelector(el) ?? document.querySelector(el));
            const watchAnchor = () => {
                if (anchor) {
                    this._watch(anchor);
                }
            };
            if (anchor) {
                if (this._watcherId) {
                    this._evm.unlisten(this._watcherId);
                }
                this._watcherId = this._evm.listen(anchor, 'transitionrun', watchAnchor, {}, 'anchor');
            }
        };
        const getAnchor = (anchor) => {
            if (anchor instanceof HTMLElement) {
                return anchor;
            }
            else if (typeof anchor === 'string') {
                return anchor === 'node' ? this.node : anchor === 'mouse' ? null : anchor;
            }
            return null;
        };
        if (this.opts.anchor &&
            typeof this.opts.anchor === 'object' &&
            'x' in this.opts.anchor &&
            'y' in this.opts.anchor) {
            const anchorX = getAnchor(this.opts.anchor.x);
            const anchorY = getAnchor(this.opts.anchor.y);
            if (anchorX === anchorY) {
                maybeWatch(anchorX);
            }
            else {
                maybeWatch(anchorX);
                maybeWatch(anchorY);
            }
        }
        else {
            maybeWatch(getAnchor(this.opts.anchor));
        }
    }
    _watchingAnchor = false;
    _watchingFinished = false;
    _watchTimeout = undefined;
    /**
     * Keeps the tooltip position in sync with the anchor when an anchor's
     * transform is in transition while the tooltip is showing.
     * @todo - watch animation events too?
     */
    _watch(el) {
        if (this._watchingAnchor) {
            return;
        }
        this._watchingFinished = false;
        this._watchingAnchor = true;
        const complete = () => {
            this._watchingFinished = true;
            this._watchingAnchor = false;
            this.element?.style.setProperty('transition-duration', '0.1s');
            if (timeout)
                el.removeEventListener('transitionend', timeout);
        };
        const timeout = () => {
            if (this._watchingFinished)
                return;
            complete();
        };
        if (!this.showing) {
            complete();
            return;
        }
        clearTimeout(this._watchTimeout);
        this._watchTimeout = setTimeout(() => {
            if (!this._watchingFinished) {
                complete();
            }
        }, 500);
        el.removeEventListener('transitionend', timeout);
        el.addEventListener('transitionend', timeout);
        if (!this._watchingFinished) {
            this.node?.style.setProperty('transition-duration', '0s');
            tickLoop(() => {
                if (!this._watchingFinished) {
                    this._updatePosition();
                    return false;
                }
                else {
                    return true;
                }
            });
        }
    }
    dispose() {
        clearTimeout(this._watchTimeout);
        this._evm.dispose();
        this.element?.remove();
    }
    static style = /*css*/ `
		.gooey-tooltip {
			view-transition-name: gooey-tooltip; /* todo - try to get this working */
			
			position: absolute;
			
			width: auto;
			max-width: 420px;
			padding: 5px 7px;

			opacity: 0;
			color: var(--fg-a, #fff);
			background-color: var(--bg-a, #000);
			border-radius: var(--radius-sm, 4px);
			box-shadow: 0rem 0.1563rem 0.125rem hsla(250, 10%, var(--shadow-lightness, 30%), 0.025),
			0rem 0.1875rem 0.1875rem hsla(250, 10%, var(--shadow-lightness, 25%), 0.05),
			0rem 0.3125rem 0.3125rem hsla(250, 10%, var(--shadow-lightness, 25%), 0.05),
			0rem 0.4375rem 0.625rem hsla(250, 10%, var(--shadow-lightness, 25%), 0.075);
			outline: 1px solid var(--bg-b, #222);

			text-align: center;
			font-size: var(--font-size, 0.8rem);
			font-family: var(--font-a, 'fredoka');
			letter-spacing: 1px;

			text-wrap: pretty;
			white-space: pre-wrap;
			font-synthesis: style; /* fredoka doesn't have italics */

			z-index: 1000;
			transition: opacity 0.1s;

			code {
				font-size: var(--font-size, 0.8rem);
				background: var(--bg-b, #1118);
				padding: 2px 4px;
				border-radius: 2px;
				height: fit-content;
			}

			pointer-events: none;

			a {
				color: var(--theme-a, #08f);
				text-decoration: underline;
				text-decoration-thickness: 0.5px;
				text-decoration-skip-ink: auto;
			}

			&.showing {
				pointer-events: auto;
			}
		}

		.gooey-tooltip .gooey-hotkey {
			display: inline-flex;
			
			width: fit-content;
			padding: 1px 2px;
			
			background: #1118;
			background: color-mix(in lch, var(--bg-b), var(--bg-c));
			color: var(--fg-a, #fff);
			outline: 1px solid var(--bg-d, #222);
			box-shadow: 0 0 2px rgba(0, 0, 0, 0.33);
			border-radius: 2px;
		}
	`;
};
Tooltip = __decorate([
    styled,
    __metadata("design:paramtypes", [Object, Object])
], Tooltip);
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
const tooltip = (node, options) => {
    const tt = new Tooltip(node, options);
    return {
        update(opts) {
            Object.assign(tt.opts, opts);
            tt.refresh();
        },
        destroy() {
            tt.dispose();
        },
    };
};
/**
 * A simple animation loop.  Return `true` to cancel.
 */
function tickLoop(cb) {
    requestAnimationFrame(() => {
        if (!cb())
            tickLoop(cb);
    });
}

export { TOOLTIP_DEFAULTS, Tooltip, tickLoop, tooltip };
//# sourceMappingURL=Tooltip.js.map
