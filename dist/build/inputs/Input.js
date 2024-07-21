import { EventManager } from '../shared/EventManager.js';
import { state, isState } from '../shared/state.js';
import { keys, values } from '../shared/object.js';
import { create } from '../shared/create.js';
import { Logger } from '../shared/logger.js';
import { toFn } from '../shared/toFn.js';
import { o } from '../shared/l.js';

const INPUT_TYPE_MAP = Object.freeze({
    InputText: 'TextInputOptions',
    InputTextArea: 'TextAreaInputOptions',
    InputNumber: 'NumberInputOptions',
    InputColor: 'ColorInputOptions',
    InputSelect: 'SelectInputOptions',
    InputButton: 'ButtonInputOptions',
    InputButtonGrid: 'ButtonGridInputOptions',
    InputSwitch: 'SwitchInputOptions',
});
Object.freeze(keys(INPUT_TYPE_MAP));
Object.freeze(values(INPUT_TYPE_MAP));
//⌟
/**
 * An input that can be added to a {@link Folder}.  This class is extended by all
 * {@link ValidInput} classes. Inputs occupy a single row in a folder, and are in charge of
 * managing a single state value.  Inputs often combine multiple controllers to provide a rich
 * user interface for interacting with the input's value.
 *
 * @template TValueType - The type of value this input manages.
 * @template TOptions - The options object for this input, determined by the input class
 * responsible for the {@link TValueType}.
 * @template TElements - A map of all HTMLElement's created by this input.
 * @template TEvents - A map of all events emitted by this input.
 * @template TType - A string-literal type brand.  Identical to the input class name.
 */
class Input {
    folder;
    opts;
    /**
     * Unique identifier for the input. Also used for saving and loading presets.
     * @default `<folder_title>:<input_type>:<input_title>`
     */
    id;
    /**
     * Whether the input was initialized with a bind target/key.
     * @default false
     */
    bound = false;
    /**
     * All HTMLElement's created by this input.
     */
    elements = {
        controllers: {},
    };
    /**
     * Whether the controllers should bubble their events up to the input and it's listeners.
     * If false, the next update will be silent, after which the flag will be reset to true.
     */
    bubble = false;
    _title = '';
    _index;
    // #firstUpdate = true
    _disabled;
    _hidden;
    /**
     * Prevents the input from registering commits to undo history until
     * {@link unlock} is called.
     */
    _undoLock = false;
    /**
     * The commit object used to store the initial value of the input when
     * {@link lock} is called.
     */
    lockCommit = {};
    /**
     * The input's {@link EventManager}.
     */
    _dirty;
    _evm = new EventManager(['change', 'refresh']);
    listen = this._evm.listen.bind(this._evm);
    on = this._evm.on.bind(this._evm);
    __log;
    constructor(options, folder) {
        this.folder = folder;
        this.opts = options;
        this.opts.saveable ??= true;
        this.opts.resettable ??= true;
        this.id = this.opts.presetId ?? `${folder.presetId}_${this.opts.title}__${this.opts.__type}`;
        this.__log = new Logger(`SuperInput${this.opts.__type.replaceAll(/Options|Input/g, '')} ${this.opts.title}`, { fg: 'skyblue' });
        this.__log.fn('super constructor').debug({ presetId: this.id, options, this: this });
        this._title = this.opts.title ?? '';
        this._disabled = toFn(this.opts.disabled ?? false);
        this._hidden = toFn(this.opts.hidden ?? false);
        this._index = this.opts.order ?? this.folder.inputs.size;
        this._index += 1;
        this._dirty = () => this.value !== this.initialValue;
        this.elements.container = create('div', {
            classes: ['gooey-input-container'],
            parent: this.folder.elements.content,
        });
        // Make the right side full-width if the title is empty.
        if (!this.title) {
            this.element.style.setProperty('--gooey-input-section-1_width', '0px');
        }
        this.elements.drawerToggle = create('div', {
            classes: ['gooey-input-drawer-toggle'],
            parent: this.elements.container,
        });
        this.elements.title = create('div', {
            classes: ['gooey-input-title'],
            parent: this.elements.container,
            textContent: this.title,
        });
        this.elements.content = create('div', {
            classes: ['gooey-input-content'],
            parent: this.elements.container,
        });
        this.elements.resetBtn = create('div', {
            classes: ['gooey-input-reset-btn'],
            // parent: this.elements.content,
            parent: this.elements.title,
            tooltip: {
                text: 'Reset',
                placement: 'left',
                delay: 0,
            },
            onclick: () => {
                this.__log.fn('reset').debug('resetting to initial value', this.initialValue);
                this.set(this.initialValue);
            },
        });
        this.elements.drawer = create('div', {
            classes: ['gooey-input-drawer'],
            parent: this.elements.content,
        });
        this._evm.listen(this.elements.drawerToggle, 'click', () => {
            console.log(this);
        });
        if ('onChange' in options) {
            this._evm.on('change', options.onChange);
        }
        Promise.resolve().then(() => {
            this.index = this.index;
        });
    }
    get value() {
        return this.state.value;
    }
    /**
     * The title displayed on this Input's label.
     */
    get title() {
        return this._title;
    }
    set title(v) {
        this._title = v;
        this.elements.title.textContent = v;
    }
    /**
     * The main Element.  Usually a container div for the rest of the Input's
     * {@link Input.elements|`elements`}.
     */
    get element() {
        return this.elements.container;
    }
    get index() {
        return this._index;
    }
    set index(v) {
        this._index = v;
        this.elements.container.style.order = v.toString();
    }
    get undoManager() {
        return this.folder.gooey?._undoManager;
    }
    /**
     * Whether the input is disabled.  A function can be used to dynamically determine the
     * disabled state.
     */
    get disabled() {
        return this._disabled();
    }
    set disabled(v) {
        this._disabled = toFn(v);
        this._disabled() ? this.disable() : this.enable();
    }
    /**
     * Completely hides the Input from view when set to `true`.
     */
    get hidden() {
        return this.elements.container.classList.contains('hidden');
    }
    set hidden(v) {
        this._hidden = toFn(v);
        this.elements.container.classList.toggle('hidden', this._hidden());
    }
    /**
     * Wether the current state value differs from the initial state value.
     * @internal
     */
    get dirty() {
        return this._dirty();
    }
    resolveState(opts) {
        if (opts.binding) {
            const s = state(opts.binding.target[opts.binding.key]);
            this._evm.add(s.subscribe(v => {
                opts.binding.target[opts.binding.key] = v;
            }));
            return s;
        }
        else {
            return state(opts.value);
        }
    }
    resolveInitialValue(opts) {
        const value = opts.binding ? opts.binding.target[opts.binding.key] : opts.value;
        return isState(value) ? value.value : value;
    }
    /**
     * Called from subclasses at the end of their `set` method to emit the `change` event.
     */
    _emit(event, v = this.state.value) {
        if (this.opts.resettable) {
            this.elements.resetBtn.classList.toggle('dirty', this._dirty());
        }
        // @ts-expect-error
        this._evm.emit(event, v);
        // Let the folder know one of its inputs has changed.
        if (event === 'change') {
            this.folder.evm.emit('change', this);
        }
        return this;
    }
    /**
     * Prevents the input from registering undo history, storing the initial
     * for the eventual commit in {@link unlock}.
     */
    lock = (from = this.state.value) => {
        this._undoLock = true;
        this.lockCommit.from = from;
        this.__log.fn(o('lock')).debug('lockCommit:', this.lockCommit);
    };
    /**
     * Unlocks commits and saves the current commit stored in lock.
     */
    unlock = (commit) => {
        this.__log.fn(o('unlock')).debug('commit', { commit, lockCommit: this.lockCommit });
        commit ??= {};
        commit.target ??= this;
        commit.to ??= this.state.value;
        commit.from ??= this.lockCommit.from;
        this._undoLock = false;
        this.commit(commit);
    };
    /**
     * Commits a change to the input's value to the undo manager.
     */
    commit(commit) {
        commit.from ??= this.state.value;
        commit.target ??= this;
        if (this._undoLock) {
            this.__log.fn('commit').debug('prevented commit while locked');
            return;
        }
        this.__log.fn('commit').debug('commited', commit);
        this.undoManager?.commit(commit);
    }
    /**
     * Enables the input and any associated controllers.
     */
    enable() {
        this._disabled = toFn(false);
        return this;
    }
    /**
     * Disables the input and any associated controllers. A disabled input's state can't be
     * changed or interacted with.
     */
    disable() {
        this._disabled = toFn(true);
        return this;
    }
    /**
     * Refreshes the value of any controllers to match the current input state.
     */
    refresh(v = this.state.value) {
        if (!this.opts.resettable)
            return;
        if (this.opts.binding) {
            this.state.set(this.opts.binding.target[this.opts.binding.key]);
        }
        this.elements.resetBtn.classList.toggle('dirty', this._dirty());
        this._evm.emit('refresh', v);
        return this;
    }
    save(overrides = {}) {
        if (this.opts.saveable !== true) {
            throw new Error('Attempted to save unsaveable Input: ' + this.title);
        }
        const preset = {
            __type: INPUT_TYPE_MAP[this.__type],
            title: this.title,
            value: this.state.value,
            disabled: this.disabled,
            presetId: this.id,
            hidden: this.hidden,
            order: this.index,
            resettable: this.opts.resettable ?? true,
        };
        this.__log.fn('save').debug(preset);
        return Object.assign(preset, overrides);
    }
    load(json) {
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        this.id = data.presetId;
        this.disabled = data.disabled;
        this.hidden = data.hidden;
        this.initialValue = data.value;
        this.set(data.value);
    }
    dispose() {
        this.__log.fn('dispose').debug(this);
        this._evm.dispose();
        const rm = (elOrObj) => {
            if (elOrObj instanceof HTMLElement || elOrObj instanceof SVGElement) {
                elOrObj.remove();
            }
            else if (typeof elOrObj === 'object') {
                for (const k in elOrObj) {
                    rm(elOrObj[k]);
                }
            }
        };
        rm(this.elements);
    }
}

export { INPUT_TYPE_MAP, Input };
//# sourceMappingURL=Input.js.map
