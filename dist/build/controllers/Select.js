import { __decorate, __metadata } from './../external/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.18.1_tslib@2.6.3_typescript@5.5.3/external/tslib/tslib.es6.js';
import { disableable } from '../shared/decorators/disableable-class-decorator.js';
import { getScrollParent } from '../shared/scrollParent.js';
import { EventManager } from '../shared/EventManager.js';
import { isState } from '../shared/state.js';
import { values } from '../shared/object.js';
import { create } from '../shared/create.js';
import { Logger } from '../shared/logger.js';

let Select = class Select {
    __type = 'Select';
    element;
    _opts;
    elements;
    /**
     * All options in the select controller.
     */
    options;
    /**
     * A map of all options by their (internally generated) id.
     */
    optionMap = new Map();
    /**
     * Whether the dropdown is currently visible.
     */
    expanded = false;
    /**
     * The initial selected option.
     */
    initialValue;
    /**
     * The initial options array.
     */
    initialOptions;
    /**
     * When true, clicking clicks will be ignored.
     */
    disableClicks = false;
    /**
     * Used to prevent infinite loops when updating internally.
     */
    bubble = true;
    /**
     * The currently selected option.
     */
    _selected;
    /**
     * The currently selected option preserved when hot-swapping on:hover.
     */
    _currentSelection;
    /**
     * The parent element that the selected element is scrolling in.
     */
    _scrollParent;
    _evm = new EventManager([
        'change',
        'refresh',
        'cancel',
        'open',
        'close',
    ]);
    /**
     * Used to subscribe to {@link SelectInputEvents}.
     */
    on = this._evm.on.bind(this._evm);
    _log;
    constructor(options) {
        const opts = {
            ...options,
            selected: toLabeledOption(options.selected ? options.selected : options.options[0]),
            options: options.options.map(o => toLabeledOption(o)),
            selectOnHover: options.selectOnHover ?? true,
        };
        this._opts = opts;
        if (options?.title) {
            this._log = new Logger(`Select ${options.title}`, { fg: 'burlywood' });
        }
        else {
            this._log = new Logger('Select', { fg: 'blueviolet' });
        }
        this._selected = this._currentSelection = this.initialValue = this._opts.selected;
        this.options = this.initialOptions = this._opts.options;
        const container = create('div', {
            classes: ['gooey-controller-select-container'],
            parent: options.container,
        });
        this.element = container;
        const selected = create('div', {
            classes: ['gooey-controller-select-selected'],
            parent: container,
            textContent: String(this.getLabel(this.selected)),
        });
        this._evm.listen(selected, 'click', () => {
            if (this.disableClicks) {
                return;
            }
            this.toggle();
        });
        const dropdown = create('div', { classes: ['gooey-controller-select-dropdown'] });
        this.elements = {
            container,
            selected,
            dropdown,
            options: [],
        };
        for (const option of this.options) {
            this.add(option);
        }
        this.disabled = this._opts.disabled;
        this._log.fn('constructor').info({ opts: this._opts, this: this });
    }
    /**
     * The currently selected option. Assigning a new value will update the UI.
     */
    get selected() {
        return this._selected;
    }
    set selected(v) {
        this._log.fn('set selected').info(v);
        const newValue = isState(v) ? toLabeledOption(v.value) : toLabeledOption(v);
        this._selected = newValue;
        this.elements.selected.innerHTML = newValue.label;
        if (!this.bubble) {
            this.bubble = true;
            return;
        }
        this._evm.emit('change', this.selected);
    }
    getLabel(v) {
        if (isState(v)) {
            return v.value.label;
        }
        else {
            return v.label;
        }
    }
    /**
     * Adds an option to the select controller.
     * @param option The option to add.
     * @returns The id of the added option.
     */
    add(option) {
        const opt = toLabeledOption(option);
        const el = create('div', {
            classes: ['gooey-controller-select-option'],
            parent: this.elements.dropdown,
            innerText: opt.label,
        });
        const id = this._evm.listen(el, 'click', this.select);
        el.dataset['optionId'] = id;
        this.optionMap.set(id, {
            option: opt,
            element: el,
        });
        this.elements.options.push(el);
        this._log.fn('add').info({ option, added: this.optionMap.get(id), id, this: this });
        return this;
    }
    /**
     * Removes an option from the select controller by id.
     */
    remove(
    /**
     * The id of the option to remove.
     */
    id, 
    /**
     * If false, the select controller will not attempt to select a new fallback option
     * when the removed option is also the currently selection one.
     * @default false
     */
    autoSelectFallback = false) {
        const found = this.optionMap.get(id);
        if (!found) {
            console.error({ this: this });
            throw new Error('No option found in map for id: ' + id);
        }
        const btn = found;
        this._log.fn('remove').info({ btn, id, this: this });
        // If the selected option is being removed, select the next option in the list.
        if (autoSelectFallback &&
            JSON.stringify(this.selected.value) === JSON.stringify(btn.option.value)) {
            const nextIndex = this.options.indexOf(btn.option) + 1;
            const fallback = this.options[nextIndex % this.options.length];
            // this.selected = next
            // this.select(next)
            this._log
                .fn('remove')
                .info('Auto-selecting fallback btn', { fallback, btn, id, this: this });
            this.select(fallback, false);
        }
        this.elements.options = this.elements.options.filter(el => el !== btn.element);
        btn.element.remove();
        this.options = this.options.filter(o => o.label !== btn.option.label);
        this.optionMap.delete(id);
    }
    /**
     * Removes all options and their elements.
     */
    clear() {
        this._log.fn('clear').info({ this: this });
        for (const id of this.optionMap.keys()) {
            this.remove(id, false);
        }
        this.options = [];
        this.optionMap.clear();
    }
    select = (v, 
    /**
     * When `false`, the select controller won't call {@link onChange}
     * to notify the parent Input or other listeners of the change.
     * @default true
     */
    bubble = true) => {
        if (this.disabled) {
            return this;
        }
        this._log.fn('select').info('v', v, { this: this });
        if (v instanceof Event) {
            const target = v.target;
            const id = target.dataset['optionId'];
            if (typeof id !== 'string') {
                console.error({ target });
                throw new Error('No option id found on select click');
            }
            const option = this.optionMap.get(id);
            if (!option) {
                console.error({ target });
                throw new Error('No option found in map');
            }
            for (const [, { element }] of this.optionMap) {
                element.classList.toggle('selected', element === option.element);
            }
            this.close();
            this.selected = option.option;
        }
        else {
            const newValue = toLabeledOption(v);
            if (isState(newValue)) {
                this.selected = newValue.value;
            }
            else if (isLabeledOption(newValue)) {
                this.bubble = bubble;
                this.selected = newValue;
            }
            else {
                throw new Error('Invalid value: ' + newValue);
            }
        }
        return this;
    };
    /**
     * Updates the UI to reflect the current state of the source.
     */
    refresh = () => {
        this._log.fn('refresh').info({ this: this });
        // Make sure the selected value text is in the selected div.
        this.elements.selected.innerHTML = this.selected.label;
        return this;
    };
    /**
     * Toggles the dropdown's visibility.
     */
    toggle = () => {
        this._log.fn('toggle').info({ this: this });
        if (this.expanded) {
            this._evm.emit('cancel');
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * Shows the dropdown.
     */
    open = () => {
        this.expanded = true;
        this._opts.input.folder.gooey.wrapper.appendChild(this.elements.dropdown);
        this.elements.dropdown.classList.add('expanded');
        this.elements.selected.classList.add('active');
        this.updatePosition();
        // We need to monitor the selected element's scroll parent for scroll events to keep the dropdown position synced up.
        this._scrollParent ??= getScrollParent(this.elements.selected);
        this._scrollParent?.addEventListener('scroll', this.updatePosition);
        this._evm.listen(window, 'keydown', this._closeOnEscape, {}, 'dropdown');
        this._evm.listen(window, 'click', this._clickOutside, {}, 'dropdown');
        if (this._opts.selectOnHover) {
            this._currentSelection = this.selected;
            for (const [, { option, element }] of this.optionMap) {
                element.classList.toggle('selected', option.label === this.selected.label);
                // todo - these listeners could be one listener on the dropdown that gets the option id from the target's dataset.
                const select = () => {
                    this._log
                        .fn('on(mouseenter)')
                        .info('currentSelection', { option, element, this: this });
                    this.select(option);
                };
                this._evm.listen(element, 'mouseenter', select, {}, 'dropdown');
            }
        }
        this._evm.emit('open');
        setTimeout(() => {
            this.elements.dropdown.style.pointerEvents = 'all';
        }, 200);
    };
    /**
     * Positions the dropdown to the selected element.
     */
    updatePosition = () => {
        if (!this.expanded)
            return;
        this.elements.dropdown.style.setProperty('width', 'unset');
        this.elements.dropdown.style.setProperty('top', 'unset');
        const { dropdown, selected } = this.elements;
        const gooeyScrollTop = this._opts.input.folder.root.elements.content.scrollTop;
        const { top, left } = selected.getBoundingClientRect();
        this.elements.dropdown.style.setProperty('width', `${Math.max(selected.offsetWidth, dropdown.offsetWidth)}px`);
        this.elements.dropdown.style.setProperty('top', `${top + selected.offsetHeight - gooeyScrollTop}px`);
        this.elements.dropdown.style.setProperty('left', `${left + selected.offsetWidth / 2 - dropdown.offsetWidth / 2}px`);
    };
    /**
     * Hides the dropdown.
     */
    close = () => {
        this.expanded = false;
        this.elements.dropdown.classList.remove('expanded');
        this.elements.selected.classList.remove('active');
        this.elements.dropdown.style.pointerEvents = 'none';
        this._evm.clearGroup('dropdown');
        this._evm.emit('close');
        setTimeout(() => {
            this.elements.dropdown.remove();
        }, 200);
    };
    /**
     * Closes the dropdown if the escape key was pressed.  If {@link selectOnHover}
     * is enabled, the current selection will be re-selected to restore the original
     * value.
     */
    _closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            this._cancel();
        }
    };
    _clickOutside = (e) => {
        const path = e.composedPath();
        if (!path.includes(this.elements.selected) && !path.includes(this.elements.dropdown)) {
            this._cancel();
        }
    };
    _cancel() {
        this.close();
        if (this._opts.selectOnHover) {
            this.select(this._currentSelection);
        }
        this._evm.emit('cancel');
    }
    enable() {
        this.elements.selected.classList.remove('disabled');
        this.elements.selected.removeAttribute('disabled');
        return this;
    }
    disable() {
        this.elements.selected.classList.add('disabled');
        this.elements.selected.setAttribute('disabled', 'true');
        return this;
    }
    dispose() {
        for (const el of values(this.elements)) {
            if (Array.isArray(el)) {
                el.forEach(e => e.remove());
            }
            else
                el.remove();
        }
        this._scrollParent?.removeEventListener('scroll', this.updatePosition);
        removeEventListener('click', this._clickOutside);
        this._evm.dispose();
    }
};
Select = __decorate([
    disableable,
    __metadata("design:paramtypes", [Object])
], Select);
function isLabeledOption(v) {
    return typeof v === 'object' && Object.keys(v).length === 2 && 'label' in v && 'value' in v;
}
function toLabeledOption(v) {
    if (isLabeledOption(v))
        return v;
    if (['string', 'number'].includes(typeof v)) {
        return {
            label: String(v),
            value: v,
        };
    }
    if (isState(v)) {
        if (isLabeledOption(v.value))
            return v.value;
        return {
            label: String(v.value),
            value: v,
        };
    }
    if (v && typeof v === 'object') {
        return {
            label: JSON.stringify(v),
            value: v,
        };
    }
    console.error('Invalid option:', v, '. Please provide a named option ({ label: string, value: T })' +
        'and place your value in the `value` property.');
    throw new Error('Missing label:' + JSON.stringify(v), { cause: { v } });
}
function fromLabeledOption(v) {
    function rtrn(v) {
        return v;
    }
    if (isLabeledOption(v))
        return rtrn(v.value);
    if (isState(v)) {
        const t = v.value;
        if (isLabeledOption(t)) {
            return rtrn(t.value);
        }
        else {
            return rtrn(t);
        }
    }
    return v;
}

export { Select, fromLabeledOption, isLabeledOption, toLabeledOption };
//# sourceMappingURL=Select.js.map
