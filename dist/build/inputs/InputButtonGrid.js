import { ButtonController } from '../controllers/ButtonController';
import { getStyle } from '../shared/getStyle';
import { nanoid } from '../shared/nanoid';
import { Logger } from '../shared/logger';
import { create } from '../shared/create';
import { state } from '../shared/state';
import { toFn } from '../shared/toFn';
import { Input } from './Input';
export const BUTTONGRID_INPUT_DEFAULTS = {
    __type: 'ButtonGridInputOptions',
    value: [[{ text: '', onClick: () => { } }]],
    style: {
        gap: '0.5em',
    },
    activeOnClick: false,
    resettable: false,
};
export class InputButtonGrid extends Input {
    __type = 'InputButtonGrid';
    initialValue = {};
    state = state({});
    buttons = new Map();
    buttonGrid;
    _log;
    constructor(options, folder) {
        const opts = Object.assign({}, BUTTONGRID_INPUT_DEFAULTS, options);
        super(opts, folder);
        this._evm.registerEvents(['click']);
        this.initialValue = opts.value;
        this._log = new Logger(`InputButtonGrid ${opts.title}`, { fg: 'cyan' });
        this._log.fn('constructor').debug({ opts, this: this });
        const container = create('div', {
            classes: ['fracgui-input', 'fracgui-input-buttongrid-container'],
            parent: this.elements.content,
        });
        this.elements.controllers = {
            container,
            buttonGrid: [],
        };
        this.buttonGrid = this.toGrid(this.initialValue);
        this.refresh();
    }
    onClick(callback) {
        this._evm.on('click', () => callback(this.state.value));
    }
    /**
     * Converts a {@link ButtonGridArrays} into a a grid of {@link HTMLButtonElement}
     * elements, and
     *
     * - appends them to the {@link InputButtonGrid.elements.controllers.container}
     */
    toGrid(grid) {
        const instanceGrid = [];
        const rows = grid.length;
        const cols = Math.max(...grid.map(row => row.length));
        // Remove all buttons.
        for (const { element } of this.buttons.values()) {
            element.remove();
        }
        this.buttons.clear();
        for (let i = 0; i < rows; i++) {
            const row = create('div', {
                classes: ['fracgui-controller-buttongrid-row'],
                parent: this.elements.controllers.container,
                style: { gap: '0.5em' },
            });
            instanceGrid[i] = [];
            for (let j = 0; j < cols; j++) {
                const opts = grid[i]?.[j];
                if (opts) {
                    const button = this.addButton(opts, opts.id ?? nanoid(8), i, j);
                    row.appendChild(button.element);
                    instanceGrid[i][j] = button;
                }
            }
        }
        this.elements.container.style.setProperty('height', 
        // getComputedStyle(this.elements.controllers.container).height,
        getStyle(this.elements.controllers.container, 'height'));
        return instanceGrid;
    }
    addButton(opts, id, i, j) {
        const text = toFn(opts.text);
        const tooltip = opts.tooltip
            ? Object.assign({
                placement: 'top',
                delay: 1000,
            }, opts.tooltip)
            : undefined;
        opts.element = create('button', {
            id,
            classes: [
                'fracgui-controller',
                'fracgui-controller-button',
                'fracgui-controller-buttongrid-button',
            ],
            innerHTML: text(),
            dataset: {
                id,
                row: String(i),
                col: String(j),
            },
            style: {
                ...opts.style,
                width: '100%',
            },
            tooltip,
        });
        const btn = new ButtonController(opts);
        if (typeof opts.active !== 'function') {
            if (this.opts.activeOnClick) {
                btn.active = () => {
                    return this.state.value === btn;
                };
            }
        }
        btn.on('click', ({ button }) => {
            this.set(button);
        });
        this.buttons.set(id, btn);
        return btn;
    }
    set(button) {
        this.state.set(button);
        this._emit('click', button);
        this.refresh();
    }
    refresh() {
        this._log.fn('refresh').debug({ this: this });
        for (const btn of this.buttons.values()) {
            btn.refresh();
        }
        super.refresh();
        return this;
    }
    enable() {
        for (const btn of this.buttons.values()) {
            btn.enable();
        }
        super.enable();
        return this;
    }
    disable() {
        for (const btn of this.buttons.values()) {
            btn.disable();
        }
        super.disable();
        return this;
    }
    dispose() {
        for (const btn of this.buttons.values()) {
            btn.dispose();
        }
        this.buttons.clear();
        super.dispose();
    }
}
