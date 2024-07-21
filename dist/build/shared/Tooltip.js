import { __decorate, __metadata } from './../external/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.18.1_tslib@2.6.3_typescript@5.5.3/external/tslib/tslib.es6.js';
import { deepMergeOpts } from './deepMergeOpts.js';
import { EventManager } from './EventManager.js';
import { styled } from './decorators/styled.js';
import { entries } from './object.js';
import { create } from './create.js';
import { toFn } from './toFn.js';

const TOOLTIP_DEFAULTS = {
    __type: 'TooltipOptions',
    text: '',
    placement: 'top',
    anchor: 'node',
    delay: 250,
    delayOut: 0,
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
        this.parent = options?.parent ?? document.getElementById('svelte') ?? document.body;
        this.element = create('div', {
            classes: ['fractils-tooltip'],
            innerHTML: String(this._text()),
            style: options?.style,
        });
        if (opts.style) {
            for (const [key, value] of entries(opts.style)) {
                if (key && value) {
                    this.element?.style.setProperty(key, value);
                }
            }
        }
        this._evm.listen(node, 'pointerenter', this.show);
        this._evm.listen(node, 'pointerleave', this.hide);
        this._evm.listen(node, 'pointermove', this._updatePosition);
        this._evm.listen(node, 'click', () => {
            if (opts.hideOnClick)
                this.hide();
            else
                this.refresh();
        });
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
        this.element.innerHTML = String(this._text());
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
    show = () => {
        if (this.showing)
            return;
        if (!this.text)
            return;
        clearTimeout(this._delayInTimer);
        clearTimeout(this._delayOutTimer);
        this._delayInTimer = setTimeout(async () => {
            if (this.element)
                this.parent?.appendChild(this.element);
            this.showing = true;
            this.element?.animate([
                { opacity: '0', transform: this._animPositions.from },
                { opacity: '1', transform: this._animPositions.to },
            ], {
                duration: this.opts.animation.duration,
                easing: this.opts.animation.easing,
                fill: 'forwards',
            });
            this._updatePosition();
            this._maybeWatchAnchor();
        }, this.opts.delay);
    };
    /**
     * Animates the tooltip out of view.
     */
    hide = () => {
        clearTimeout(this._delayInTimer);
        clearTimeout(this._delayOutTimer);
        this._delayOutTimer = setTimeout(async () => {
            if (this.showing) {
                this.showing = false;
                if (this._watcherId) {
                    this._evm.unlisten(this._watcherId);
                }
                await this.element?.animate([
                    { opacity: '1', transform: this._animPositions.to },
                    { opacity: '0', transform: this._animPositions.from },
                ], {
                    duration: this.opts.animation.durationOut,
                    easing: this.opts.animation.easing,
                    fill: 'forwards',
                }).finished;
                this.unmount();
            }
        }, this.opts.delayOut);
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
        if (this.element)
            this.parent?.appendChild(this.element);
    }
    unmount() {
        if (!this._mounted)
            return;
        this._mounted = false;
        if (this.element)
            this.parent?.removeChild(this.element);
    }
    _updatePosition = (e) => {
        if (!this.element)
            return;
        const tooltipRect = this.element.getBoundingClientRect();
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
        let left = 0;
        let top = 0;
        const baseOffset = 4;
        this.element.classList.add('fractils-tooltip-' + this.placement);
        switch (this.placement) {
            case 'top':
                left = anchor.x.left + window.scrollX + anchor.x.width / 2 - tooltipRect.width / 2;
                top = anchor.y.top + window.scrollY - tooltipRect.height - baseOffset;
                break;
            case 'bottom':
                left = anchor.x.left + window.scrollX + anchor.x.width / 2 - tooltipRect.width / 2;
                top = anchor.y.top + window.scrollY + anchor.y.height + baseOffset;
                break;
            case 'left':
                left = anchor.x.left + window.scrollX - tooltipRect.width - baseOffset;
                top = anchor.y.top + window.scrollY + anchor.y.height / 2 - tooltipRect.height / 2;
                break;
            case 'right':
                left = anchor.x.left + window.scrollX + anchor.x.width + baseOffset;
                top = anchor.y.top + window.scrollY + anchor.y.height / 2 - tooltipRect.height / 2;
                break;
        }
        const parentRect = this.parent?.getBoundingClientRect();
        if (!parentRect)
            return;
        this.element.style.left = `calc(${left - parentRect.left}px + ${this.opts.offsetX})`;
        this.element.style.top = `calc(${top - parentRect.top}px + ${this.opts.offsetY})`;
    };
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
                : this.node?.querySelector(el) ?? document.querySelector(el);
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
		.fractils-tooltip {
			position: absolute;

			min-width: 3rem;
			max-width: auto;
			min-height: auto;
			max-height: auto;
			padding: 4px 8px;

			opacity: 0;
			color: var(--fg-a, #fff);
			background-color: var(--bg-a, #000);
			border-radius: var(--radius-sm, 4px);
			box-shadow: var(--shadow, 0rem 0.0313rem 0.0469rem hsl(var(--shadow-color) / 0.02),
				0rem 0.125rem 0.0938rem hsl(var(--shadow-color) / 0.02),
				0rem 0.1563rem 0.125rem hsl(var(--shadow-color) / 0.025),
				0rem 0.1875rem 0.1875rem hsl(var(--shadow-color) / 0.05),
				0rem 0.3125rem 0.3125rem hsl(var(--shadow-color) / 0.05),
				0rem 0.4375rem 0.625rem hsl(var(--shadow-color) / 0.075));

			text-align: center;
			font-size: var(--font-size-sm, 12px);
			font-family: var(--gooey-font, var(--font-a, 'fredoka'));
			letter-spacing: 1px;

			z-index: 1000;
			pointer-events: none;
			transition: opacity 0.1s;
		}

		.fractils-tooltip .fractils-hotkey {
			filter: contrast(1.1);
			background: var(--fractils-hotkey_background, #1118);
			background: var(--fractils-hotkey_background, color-mix(in sRGB, var(--bg-c) 66%, transparent));
			color: var(--fractils-hotkey_color, var(--fg-a, #fff));
			padding: 0px 3px;
			border-radius: 2px;
			box-shadow: 0 0 2px rgba(0, 0, 0, 0.33);
		}

		:root[theme='dark'] .fractils-tooltip .fractils-hotkey {
			background: var(--fractils-hotkey_background, color-mix(in sRGB, var(--bg-d) 100%, transparent));
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
