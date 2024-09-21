import { __decorate, __metadata } from './../../external/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.22.2_tslib@2.7.0_typescript@5.6.2/external/tslib/tslib.es6.js';
import { disableable } from '../../shared/decorators/disableable-class-decorator.js';
import { clamp } from '../../shared/clamp.js';
import { EventManager } from '../../shared/EventManager.js';
import { mapRange } from '../../shared/mapRange.js';
import { debounce } from '../../shared/debounce.js';
import { tooltip } from '../../shared/Tooltip.js';
import { Logger } from '../../shared/logger.js';
import { create } from '../../shared/create.js';

// Box methods adapted from irojs: https://github.com/jaames/iro.js
const COLOR_PICKER_DEFAULTS = {
    color: '#fff',
    swatches: [],
    handleSize: 10,
    container: undefined,
    disabled: false,
};
let ColorPicker = class ColorPicker {
    input;
    opts;
    elements;
    element;
    _ctx;
    _height = 16 * 3;
    _width = 256;
    _resizeObserver;
    _gradientWhite;
    _gradientBlack;
    _dragging = false;
    _lockCursorPosition = false;
    _lastColor;
    _log;
    _evm = new EventManager(['pointerdown', 'pointerup']);
    on = this._evm.on.bind(this._evm);
    constructor(input, options) {
        this.input = input;
        const opts = { ...COLOR_PICKER_DEFAULTS, ...options };
        this.opts = opts;
        this._log = new Logger(`ColorPicker ${input.title}`, { fg: 'lightgreen' });
        this._log.fn('constructor').debug({ opts, this: this });
        this._lastColor = this.input.state.value.clone();
        // Make sure the rect is accurate on mount.
        const style = input.expanded ? {} : { height: '0px' };
        const container = create('div', {
            classes: ['gooey-input-color-picker-container'],
            parent: options?.container ?? input.elements.controllers.container,
            style,
        });
        this.element = container;
        const canvas = create('canvas', {
            classes: ['gooey-input-color-picker-canvas'],
            parent: container,
            height: this._height,
        });
        // Reposition the handle when the canvas is resized.
        const debouncedUpdateHandle = debounce(this._updateHandle, 100);
        this._resizeObserver = new ResizeObserver(() => debouncedUpdateHandle());
        this._resizeObserver.observe(canvas);
        const handle = create('div', {
            classes: ['gooey-input-color-picker-handle'],
            parent: container,
            style: {
                background: input.state.value.hexString,
            },
        });
        const hueSlider = create('input', {
            type: 'range',
            classes: ['gooey-input-range', 'gooey-input-color-picker-hue'],
            parent: container,
            min: 0,
            max: 359,
        });
        this._evm.listen(hueSlider, 'input', this._updateStateFromHue);
        tooltip(hueSlider, {
            parent: container,
            text: () => `${this.input.state.value.hsla.h}`,
            placement: 'top',
            offsetX: '0px',
            anchor: {
                x: 'mouse',
                y: hueSlider.querySelector('#thumb'),
            },
            style: {
                background: 'var(--gooey-bg-a)',
                color: 'var(--gooey-fg-a)',
            },
        });
        const alphaSlider = create('input', {
            type: 'range',
            classes: ['gooey-input-range', 'gooey-input-color-picker-alpha'],
            parent: container,
            min: 0,
            max: 1,
            step: 0.01,
        });
        this._evm.listen(alphaSlider, 'input', this.setAlpha);
        tooltip(alphaSlider, {
            parent: container,
            text: () => `${this.input.state.value.alpha}`,
            placement: 'top',
            offsetX: '0px',
            anchor: {
                x: 'mouse',
                y: alphaSlider.querySelector('#thumb'),
            },
            style: {
                background: 'var(--gooey-bg-a)',
                color: 'var(--gooey-fg-a)',
            },
        });
        this.elements = {
            container,
            canvas,
            handle,
            hueSlider,
            alphaSlider,
        };
        this.disabled = this.opts.disabled;
        this._ctx = canvas.getContext('2d');
        this.canvas.width = this._width;
        // this.refresh()
        this._evm.listen(this.canvas, 'click', this._onClick);
        this._evm.listen(this.canvas, 'pointerdown', this._onPointerDown);
        this._evm.listen(this.input.elements.container, 'pointermove', this._onPointerMove, {
            passive: true,
        });
        this._updateGradients();
        setTimeout(this.draw, 10);
        setTimeout(this._updateHandle, 20);
    }
    get canvas() {
        return this.elements.canvas;
    }
    get hue() {
        return this.input.state.value.hue;
    }
    get alpha() {
        return this.input.state.value.alpha;
    }
    enable = () => {
        if (this.disabled)
            this.disabled = false;
        this.elements.container.classList.remove('gooey-disabled');
        this.elements.alphaSlider.disabled = false;
        this.elements.hueSlider.disabled = false;
        this.elements.canvas.style.pointerEvents = 'auto';
        return this;
    };
    disable = () => {
        if (!this.disabled)
            this.disabled = true;
        this.elements.container.classList.add('gooey-disabled');
        this.elements.alphaSlider.disabled = true;
        this.elements.hueSlider.disabled = true;
        this.elements.canvas.style.pointerEvents = 'none';
        return this;
    };
    set(v) {
        this.input.state.value.set(v);
        this.input.refresh();
        this.refresh();
    }
    setAlpha = (e) => {
        this.input.state.value.alpha = Number(e.target.value);
        this.input.refresh();
    };
    /**
     * Updates the UI to reflect the current state of the color picker.
     */
    refresh = () => {
        this._log.fn('refresh').debug();
        const color = this.input.state.value;
        if (this._lastColor?.hex === color.hex8String)
            return this;
        this._lastColor = color.clone();
        this.elements.hueSlider.value = String(this.hue);
        this.elements.alphaSlider.value = String(this.alpha);
        this.elements.alphaSlider.style.color = color.hexString;
        this.draw();
        if (this._lockCursorPosition) {
            // Update the color only.
            this.elements.handle.style.background = color.hexString;
            this._lockCursorPosition = false;
        }
        else {
            this._updateHandle();
        }
        return this;
    };
    draw = () => {
        this._fill(`hsl(${this.hue}, 100%, 50%)`);
        this._fill(this._gradientWhite);
        this._fill(this._gradientBlack);
    };
    _fill(style) {
        this._ctx.fillStyle = style;
        this._ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    _updateGradients() {
        this._gradientWhite = this._ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        this._gradientWhite.addColorStop(0, 'rgba(255,255,255,1)');
        this._gradientWhite.addColorStop(1, 'rgba(255,255,255,0)');
        this._gradientBlack = this._ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        this._gradientBlack.addColorStop(0, 'rgba(0,0,0,0)');
        this._gradientBlack.addColorStop(1, 'rgba(0,0,0,1)');
    }
    //· Pointer Events ···································································¬
    _pointerUpClickLatch = false;
    _onPointerDown = (e) => {
        this._log.fn('_onPointerDown').debug();
        this._evm.emit('pointerdown');
        this._dragging = true;
        this._updateFromMousePosition(e);
        addEventListener('pointerup', this._onPointerUp, { once: true });
    };
    _onPointerMove = (e) => {
        this._log.fn('_onPointerMove').debug();
        if (this._dragging) {
            this._updateFromMousePosition(e);
        }
    };
    _onPointerUp = () => {
        this._log.fn('_onPointerUp').debug();
        this._evm.emit('pointerup');
        this._dragging = false;
        this._pointerUpClickLatch = true;
    };
    _onClick = (e) => {
        this._log.fn('_onClick');
        if (this._pointerUpClickLatch) {
            this._log.debug('Click latch triggered. Aborting.');
            this._pointerUpClickLatch = false;
            return;
        }
        this._log.debug();
        this._updateFromMousePosition(e);
        this._dragging = false;
    };
    /**
     * Updates the color picker's state based on the current mouse position.
     */
    _updateFromMousePosition(e) {
        this._log.fn('_updateFromMousePosition').debug();
        const { left, top, width, height } = this.canvas.getBoundingClientRect();
        const x = clamp(e.clientX - left, 0, width);
        const y = clamp(e.clientY - top, 0, height);
        const { s, v } = this._getColorAtPosition(x, y);
        this.input.state.value.hsv = { h: this.hue, s, v };
        this.input.set(this.input.state.value);
        this._drawHandle(this._getHandlePosition(this.input.state.value));
    }
    //⌟
    /**
     * Maps canvas `x` and `y` coordinates to their respective `s` and `v` color values.
     */
    _getColorAtPosition = (x, y) => {
        this._log.fn('_getColorAtPosition').debug();
        const { width, height } = this.canvas.getBoundingClientRect();
        const r = this.opts.handleSize / 3;
        return {
            s: mapRange(x, r, width - r, 0, 100),
            v: mapRange(y, r, height - r, 100, 0),
        };
    };
    _updateStateFromHue = (e) => {
        this._log.fn('_updateStateFromHue').debug();
        this._lockCursorPosition = true;
        const hue = Number(e.target.value);
        const { s, v, a } = this.input.state.value.hsva;
        this.input.state.value.hsva = { h: hue, s, v, a };
        this.input.set(this.input.state.value);
        this.elements.handle.style.background = this.input.state.value.hexString;
        this.draw();
    };
    _updateHandle = (color = this.input.state.value) => {
        this._drawHandle(this._getHandlePosition(color));
    };
    /**
     * Get the current handle position for a given color.
     */
    _getHandlePosition = (color) => {
        const { width, height } = this.canvas.getBoundingClientRect();
        const r = this.opts.handleSize / 2;
        return {
            x: mapRange(color.hsv.s, 0, 100, r, width - r),
            y: mapRange(color.hsv.v, 0, 100, height - r, r),
        };
    };
    _drawHandle = (coords) => {
        this.elements.handle.style.transform = `translate(${coords.x}px, ${coords.y}px)`;
        this.elements.handle.style.background = this.input.state.value.hexString;
    };
    dispose() {
        this._ctx = null;
        this.elements.alphaSlider.remove();
        this.elements.hueSlider.remove();
        this.elements.handle.remove();
        this.elements.canvas.remove();
        this.elements.container.remove();
        this._resizeObserver.disconnect();
        this._evm.dispose();
    }
};
ColorPicker = __decorate([
    disableable,
    __metadata("design:paramtypes", [Function, Object])
], ColorPicker);

export { COLOR_PICKER_DEFAULTS, ColorPicker };
//# sourceMappingURL=ColorPicker.js.map
