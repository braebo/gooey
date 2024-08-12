import { DEV } from './external/.pnpm/esm-env@1.0.0/external/esm-env/prod-ssr.js';
import { InputSwitch } from './inputs/InputSwitch.js';
import { InputButton } from './inputs/InputButton.js';
import { InputSelect } from './inputs/InputSelect.js';
import { InputNumber } from './inputs/InputNumber.js';
import { InputColor } from './inputs/InputColor.js';
import { InputText } from './inputs/InputText.js';
import { isLabeledOption } from './controllers/Select.js';
import { InputButtonGrid } from './inputs/InputButtonGrid.js';
import { animateConnector, createFolderSvg, createFolderConnector } from './svg/createFolderSVG.js';
import { isColor, isColorFormat } from './shared/color/color.js';
import { composedPathContains } from './shared/cancelClassFound.js';
import { state, fromState } from './shared/state.js';
import { EventManager } from './shared/EventManager.js';
import { TerminalSvg } from './svg/TerminalSvg.js';
import { Search } from './toolbar/Search.js';
import { create } from './shared/create.js';
import { select } from './shared/select.js';
import { Logger } from './shared/logger.js';
import { nanoid } from './shared/nanoid.js';
import { defer } from './shared/defer.js';
import { toFn } from './shared/toFn.js';
import './styles/themes/vanilla.js';
import './styles/themes/scout.js';
import './styles/themes/flat.js';
import './svg/RenameSVG.js';
import './shared/Tooltip.js';
import './svg/SaveSVG.js';
import './styles/themer/defaultTheme.js';
import './styles/GOOEY_VARS.js';

// The custom-regions extension is recommended for this file.
//⌟
//· Contants ·····················································································¬
const FOLDER_DEFAULTS = Object.freeze({
    presetId: '',
    title: '',
    children: [],
    closed: false,
    hidden: false,
    controls: new Map(),
    saveable: true,
    disabled: false,
});
/**
 * Internal folder creation api defaults.
 */
const INTERNAL_FOLDER_DEFAULTS = {
    __type: 'InternalFolderOptions',
    parentFolder: undefined,
    isRoot: true,
    _skipAnimations: true,
    gooey: undefined,
    _headerless: false,
};
//⌟
/**
 * Folder is a container for organizing and grouping {@link Input|Inputs} and child Folders.
 *
 * This class should not be instantiated directly.  Instead, use the {@link Gooey.addFolder} method.
 *
 * @example
 * ```typescript
 * const gooey = new Gooey()
 * const folder = gooey.addFolder({ title: 'My Folder' })
 * folder.addNumber({ title: 'foo', value: 5 })
 * ```
 */
class Folder {
    //· Props ····················································································¬
    __type = 'Folder';
    isRoot = true;
    id = nanoid();
    gooey;
    /**
     * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
     * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
     * Therefore, if you want to use presets, you will only need to set this if you:
     * - Use the same title for multiple inputs _in the same {@link Folder}_, or
     * - Leave all titles empty
     * Otherwise, this can be left as the default and presets will work as expected.
     * @default The provided `title`.
     */
    presetId;
    /**
     * Whether this Folder should be saved as a {@link FolderPreset} when saving the
     * {@link GooeyPreset} for the {@link Gooey} this Folder belongs to.  If `false`, this Input will
     * be skipped.
     * @default true
     */
    saveable;
    /**
     * The child folders of this folder.
     */
    children = [];
    /**
     * All inputs added to this folder.
     */
    inputs = new Map();
    /**
     * The root folder.  All folders share a reference to the same root folder.
     */
    root;
    /**
     * The parent folder of this folder (or a circular reference if this is the root folder).
     */
    parentFolder;
    /**
     * The folder containing Gooey instance settings, like the `ui` and `presets` sections.
     */
    settingsFolder;
    /**
     * An observable responsible for the folder's open/closed state.  Setting this value will
     * open/close the folder, and subscribing to this value will allow you to listen for
     * open/close events.
     */
    closed;
    /**
     * The folder's root container element, containing all other related folder {@link elements}.
     */
    element;
    /**
     * All HTMLElements that make up the folder's UI.
     */
    elements = {};
    /**
     * The animated svg graphics belonging to the folder.
     */
    graphics;
    /**
     * The event manager for the folder.  This should rarely need to be accessed directly, since
     * subscribing to events can be done with a Folder's {@link on} method.
     * @internal
     */
    evm = new EventManager(['change', 'refresh', 'toggle', 'mount']);
    /**
     * Equivalent to `addEventListener`.
     */
    on = this.evm.on.bind(this.evm);
    /**
     * The pixel height of the folder header element.
     * @internal
     */
    initialHeaderHeight = 0;
    _title;
    _hidden = false;
    _hiddenFn;
    _disabled = () => false;
    _log;
    /**
     * Used to disable clicking the header to open/close the folder.
     */
    _disabledTimer;
    /**
     * The time in ms to wait after mousedown before disabling toggle for a potential drag.
     */
    _clickTime = 200;
    /**
     * Whether clicking the header to open/close the folder is disabled.
     */
    _clicksDisabled = false;
    _depth = -1;
    /**
     * Maps preset ids to their inputs.
     */
    static _presetIdMap = new Map();
    /**
     * The duration of the open/close and hide/show animations in ms.
     * @default 350
     *
     * @todo This needs to sync with the animation duration in the css.
     */
    _animDuration = 350;
    //⌟
    constructor(options) {
        if (!('container' in options)) {
            throw new Error('Folder must have a container.');
        }
        const opts = Object.assign({}, FOLDER_DEFAULTS, INTERNAL_FOLDER_DEFAULTS, {
            gooey: this.gooey,
            isRoot: true,
        }, options);
        this._log = new Logger(`Folder ${opts.title}`, { fg: 'DarkSalmon' });
        this._log.fn('constructor').debug({ opts, this: this });
        this.isRoot = opts.isRoot;
        if (this.isRoot) {
            this._depth = 0;
            this.parentFolder = this;
            this.root = this;
        }
        else {
            if (!opts.parentFolder) {
                throw new Error('Non-root folders must have a parent folder.');
            }
            this.parentFolder = opts.parentFolder;
            this._depth = this.parentFolder._depth + 1;
            this.root = this.parentFolder.root;
        }
        this.gooey = opts.gooey;
        this._title = opts.title ?? '';
        this.element = this._createElement(opts);
        this.element.style.setProperty('order', opts.order?.toString() ??
            `${this.parentFolder.children.length + this.parentFolder.inputs.size + 1}`);
        this.elements = this._createElements(this.element);
        this.presetId = opts.presetId ?? this._resolvePresetId();
        opts.closed ??= false;
        if (typeof this.gooey.opts.storage === 'object' &&
            typeof this.gooey.opts.storage.closed === 'boolean') {
            // @ts-expect-error @internal
            let closedStorage = this.gooey._closedMap.get()[this.presetId];
            if (typeof closedStorage !== 'undefined')
                opts.closed = closedStorage;
        }
        this.closed = state(opts.closed);
        this.saveable = !!opts.saveable;
        if (this.isRoot || opts.searchable) {
            new Search(this);
        }
        this.element.classList.add('instant');
        this.initialHeaderHeight = this.elements.header.scrollHeight;
        if (typeof opts.hidden === 'function') {
            this._hiddenFn = opts.hidden;
            this._hidden = this._hiddenFn();
        }
        else {
            this._hidden = !!opts.hidden;
        }
        this._disabled = toFn(opts.disabled ?? false);
        this._createGraphics(opts._headerless).then(() => {
            this.evm.emit('mount');
            // Open/close the folder when the closed state changes.
            this.evm.add(this.closed.subscribe(v => {
                v ? this.close() : this.open();
                this.evm.emit('toggle', v);
                // @ts-expect-error @internal
                this.gooey._closedMap.update(m => {
                    m[this.presetId] = v;
                    return m;
                });
            }));
            if (opts.closed) {
                this.closed.set(opts.closed);
            }
            if (this._hidden)
                this.hide(true);
        });
        setTimeout(() => {
            this.element.classList.toggle('disabled', this._disabled());
        }, 100);
    }
    //· Getters/Setters ··········································································¬
    /**
     * The folder's title.  Changing this will update the UI.
     */
    get title() {
        return this._title;
    }
    set title(v) {
        if (v === this._title)
            return;
        this._title = v;
        this.elements.title.animate({
            opacity: 0,
            transform: 'translateY(-0.33rem)',
        }, {
            duration: 75,
            easing: 'ease-out',
            fill: 'forwards',
        }).onfinish = () => {
            this.elements.title.innerHTML = v;
            this.elements.title.animate([
                {
                    opacity: 0,
                    transform: 'translateY(.33rem)',
                },
                {
                    opacity: 1,
                    transform: 'translateY(0rem)',
                },
            ], {
                delay: 0,
                duration: 75,
                easing: 'ease-in',
                fill: 'forwards',
            });
        };
    }
    /**
     * Whether the folder is visible.
     */
    get hidden() {
        return this._hidden;
    }
    /**
     * Whether the input is disabled.  Modifying this value will update the UI.
     */
    get disabled() {
        return this.element.classList.contains('disabled');
    }
    set disabled(v) {
        this.element.classList.toggle('disabled', toFn(v)());
    }
    /**
     * A flat array of all child folders of this folder (and their children, etc).
     */
    get allChildren() {
        return this.children.flatMap(child => [child, ...child.allChildren]);
    }
    /**
     * A flat array of all inputs in all child folders of this folder (and their children, etc).
     * See Input Generators region.
     */
    get allInputs() {
        const allControls = new Map();
        for (const child of [this, ...this.allChildren]) {
            for (const [key, value] of child.inputs.entries()) {
                allControls.set(key, value);
            }
        }
        return allControls;
    }
    isRootFolder() {
        return this.isRoot;
    }
    //⌟
    //· Folders ··················································································¬
    addFolder(title, options) {
        options ??= {};
        options.title ??= title;
        this._log.fn('addFolder').debug({ options, this: this });
        const defaults = Object.assign({}, INTERNAL_FOLDER_DEFAULTS, {
            parentFolder: this,
            depth: this._depth + 1,
            gooey: this.gooey,
        });
        const overrides = {
            __type: 'InternalFolderOptions',
            container: this.elements.content,
            gooey: this.gooey,
            isRoot: false,
        };
        const opts = Object.assign({}, defaults, options, overrides);
        const folder = new Folder(opts);
        folder.on('change', v => this.evm.emit('change', v));
        this.children.push(folder);
        if (opts._headerless) {
            folder.initialHeaderHeight ??= folder.elements.header.scrollHeight;
            folder.elements.header.style.display = 'none';
        }
        return folder;
    }
    _handleClick(event) {
        if (event.button !== 0)
            return;
        this._log.fn('#handleClick').debug({ event, this: this });
        this.element.removeEventListener('pointerup', this.toggle);
        this.element.addEventListener('pointerup', this.toggle, { once: true });
        // Abort if a toolbar button was clicked.
        if (composedPathContains(event, 'gooey-cancel'))
            return this._disableClicks();
        // We need to watch for the mouseup event within a certain timeframe
        // to make sure we don't accidentally trigger a click after dragging.
        clearTimeout(this._disabledTimer);
        // First we delay the drag check to allow for messy clicks.
        this._disabledTimer = setTimeout(() => {
            this.elements.header.removeEventListener('pointermove', this._disableClicks);
            this.elements.header.addEventListener('pointermove', this._disableClicks, {
                once: true,
            });
            // Then we set a timer to disable the drag check.
            this._disabledTimer = setTimeout(() => {
                this.elements.header.removeEventListener('pointermove', this._disableClicks);
                this.element.removeEventListener('pointerup', this.toggle);
                this._clicksDisabled = false;
            }, this._clickTime);
        }, 150);
        if (this._clicksDisabled)
            return;
    }
    _disableClicks = () => {
        if (!this._clicksDisabled) {
            this._clicksDisabled = true;
            this._log.fn('disable').debug('Clicks DISABLED');
        }
        this._clicksDisabled = true;
        clearTimeout(this._disabledTimer);
    };
    _resetClicks() {
        this._log.fn('cancel').debug('Clicks ENABLED');
        removeEventListener('pointerup', this.toggle);
        this._clicksDisabled = false;
    }
    //·· Open/Close ······································································¬
    toggle = () => {
        this._log.fn('toggle').debug();
        clearTimeout(this._disabledTimer);
        if (this._clicksDisabled) {
            this._resetClicks();
            return this;
        }
        // If the folder is being dragged, don't toggle.
        if (this.element.classList.contains('gooey-dragged')) {
            this.element.classList.remove('gooey-dragged');
            return this;
        }
        const state = !this.closed.value;
        this.closed.set(state);
        this.evm.emit('toggle', state);
        return this;
    };
    open(updateState = false) {
        this._log.fn('open').debug();
        this.element.classList.remove('closed');
        this.evm.emit('toggle', false);
        if (updateState)
            this.closed.set(false);
        this._clicksDisabled = false;
        this._toggleClass();
        animateConnector(this, 'open');
        return this;
    }
    close(updateState = false) {
        this._log.fn('close').debug();
        this.element.classList.add('closed');
        if (updateState)
            this.closed.set(true);
        this.evm.emit('toggle', true);
        this._clicksDisabled = false;
        this._toggleClass();
        animateConnector(this, 'close');
        return this;
    }
    static _EASE = {
        show: 'cubic-bezier(.05,1,.56,.91)',
        hide: 'cubic-bezier(0.9, 0, 0.9, 0)',
        slow: 'cubic-bezier(.41,.77,.36,.96)',
    };
    static _SHOW_ANIM = [
        {
            offset: 0,
            gridTemplateRows: '0fr',
            clipPath: 'inset(50%)',
            webkitClipPath: 'inset(50%)',
            easing: Folder._EASE.show,
        },
        {
            offset: 0.1,
            clipPath: 'inset(49% 50%)',
            webkitClipPath: 'inset(49% 50%)',
            easing: Folder._EASE.show,
            filter: 'brightness(10)',
        },
        {
            offset: 0.35,
            clipPath: 'inset(49% 0%)',
            webkitClipPath: 'inset(49% 0%)',
            easing: 'linear',
            filter: 'brightness(1)',
        },
        {
            offset: 0.36,
            clipPath: 'inset(49% 0%)',
            webkitClipPath: 'inset(49% 0%)',
            easing: Folder._EASE.slow,
        },
        {
            offset: 1,
            gridTemplateRows: '1fr',
            clipPath: 'inset(0%)',
            webkitClipPath: 'inset(0%)',
        },
    ];
    static _HIDE_ANIM = [
        {
            offset: 0,
            gridTemplateRows: '0fr',
            clipPath: 'inset(50%)',
            webkitClipPath: 'inset(50%)',
            easing: Folder._EASE.hide,
        },
        {
            offset: 0.1,
            clipPath: 'inset(49% 50%)',
            webkitClipPath: 'inset(49% 50%)',
            filter: 'brightness(10)',
        },
        {
            offset: 0.42,
            clipPath: 'inset(49% 0%)',
            webkitClipPath: 'inset(49% 0%)',
            filter: 'brightness(1)',
        },
        {
            offset: 0.43,
            clipPath: 'inset(49% 0%)',
            webkitClipPath: 'inset(49% 0%)',
            easing: Folder._EASE.slow,
        },
        {
            offset: 1,
            gridTemplateRows: '1fr',
            clipPath: 'inset(0%)',
            webkitClipPath: 'inset(0%)',
        },
    ];
    toggleHidden(
    /**
     * Whether to show the folder instantly, bypassing the animation.
     * @default false
     */
    instant = false) {
        this._log.fn('toggleHidden').debug();
        this.hidden ? this.show(instant) : this.hide(instant);
        return this;
    }
    async show(
    /**
     * Whether to show the folder instantly, bypassing the animation.
     * @default false
     */
    instant = false) {
        this._log.fn('show').debug({ instant });
        this._hidden = false;
        const anim = await this.element.animate(Folder._SHOW_ANIM, {
            duration: instant ? 0 : this._animDuration,
            fill: 'forwards',
        }).finished;
        if (!this._hidden && this.element)
            anim.commitStyles();
        return this;
    }
    async hide(
    /**
     * Whether to show the folder instantly, bypassing the animation.
     * @default false
     */
    instant = false) {
        this._log.fn('hide').debug({ instant });
        this._hidden = true;
        const anim = await this.element.animate(Folder._HIDE_ANIM, {
            duration: instant ? 0 : this._animDuration,
            direction: 'reverse',
            fill: 'forwards',
        }).finished;
        if (this._hidden && this.element)
            anim.commitStyles();
        return this;
    }
    _toggleTimeout;
    _toggleClass = (classname = 'animating') => {
        const classes = Array.isArray(classname) ? classname : [classname];
        this.element.classList.add(...classes);
        clearTimeout(this._toggleTimeout);
        this._toggleTimeout = setTimeout(() => {
            this.element.classList.remove(...classes);
        }, this._animDuration);
    };
    //⌟
    //·· Save/Load ···············································································¬
    _resolvePresetId = (identifiers = [], opts) => {
        const parts = [];
        let id = opts?.presetId;
        if (!id) {
            let folder = this;
            while (!folder.isRoot) {
                parts.unshift(folder.title);
                folder = folder.parentFolder;
            }
            parts.unshift(this.root.title);
        }
        id ??= [...parts, ...identifiers].join('__');
        let i = 0;
        while (this.inputs.has(id)) {
            i++;
            id = i ? `${id}_${i}` : id;
        }
        this._log.fn('resolvePresetId', this.title, ...identifiers).debug({ id, opts, this: this });
        return id;
    };
    save() {
        this._log.fn('save').debug({ this: this });
        if (this.saveable !== true) {
            throw new Error('Attempted to save unsaveable Folder: ' + this.title);
        }
        const preset = {
            __type: 'FolderPreset',
            id: this.presetId,
            title: this.title,
            // closed: this.closed.value,
            hidden: toFn(this._hidden)(),
            children: this.children
                .filter(c => c.title !== this.gooey.settingsFolder.title && c.saveable)
                .map(child => child.save()),
            inputs: Array.from(this.inputs.values())
                .filter(i => i.opts.saveable)
                .map(input => input.save()),
        };
        return preset;
    }
    /**
     * Updates all inputs with values from the {@link FolderPreset}.  If the preset has children,
     * those presets will also be passed to the corresponding child folders'
     * {@link Folder.load|`load`} method.
     */
    load(preset) {
        this._log.fn('load').debug({ preset, this: this });
        // this.closed.set(preset.closed) // todo - global settings?
        if (preset.hidden !== this.hidden) {
            preset.hidden ? this.hide() : this.show(true);
        }
        for (const input of this.inputs.values()) {
            const inputPreset = preset.inputs.find(c => c.presetId === input.opts.presetId);
            if (!inputPreset) {
                console.warn(`Missing input for preset: ${preset.title}`, {
                    preset,
                    input,
                    this: this,
                });
                continue;
            }
            input.load(inputPreset);
        }
        for (const child of this.children) {
            if (!child.saveable)
                continue;
            const folderPreset = preset.children?.find(f => f.id === child.presetId);
            if (!folderPreset) {
                console.warn(`Missing folder for preset: ${preset.title}`, {
                    child,
                    preset,
                    this: this,
                });
                continue;
            }
            child.load(folderPreset);
        }
        return this;
    }
    //⌟
    //⌟
    //· Input Generators ·········································································¬
    /**
     * Updates the ui for all inputs belonging to this folder to reflect their current values.
     */
    refresh() {
        this._log.fn('refresh').debug(this);
        const disabledState = this._disabled();
        if (disabledState !== this.disabled) {
            this.disabled = disabledState;
        }
        const hiddenState = this._hiddenFn?.();
        if (typeof hiddenState !== 'undefined' && hiddenState !== this._hidden) {
            hiddenState ? this.hide() : this.show();
        }
        for (const input of this.inputs.values()) {
            input.refresh();
        }
        return this;
    }
    /**
     * Updates the ui for all inputs in this folder and all child folders recursively.
     */
    refreshAll() {
        for (const input of this.allInputs.values()) {
            input.refresh();
        }
        this.evm.emit('refresh');
        return this;
    }
    /**
     * Registers all new inputs by adding them to the {@link inputs|folder inputs} map, updating
     * the internal preset-id map, and and refreshing the folder icon (debounced slightly).
     */
    _registerInput(input, presetId) {
        let i = 0;
        let titleId = input.title || input.id;
        while (this.inputs.has(titleId)) {
            titleId = `${input.title}_${i}`;
            i++;
        }
        this.inputs.set(titleId, input);
        Folder._presetIdMap.set(input.id, presetId);
        this._refreshIcon();
        return input;
    }
    /**
     * Takes in a title, value, and options, and return an updated options object.
     *
     * Updates:
     * - {@link InputOptions.title|`title`}
     * - {@link InputOptions.value|`value`}
     * - {@link InputOptions.presetId|`presetId`}
     */
    _resolveOpts(t, v, o) {
        o ??= {};
        o.title ??= t;
        if (typeof v !== 'undefined')
            o.value ??= v;
        o.presetId ??= this._resolvePresetId([t]);
        return o;
    }
    add(title, initialValue, options) {
        const opts = this._resolveOpts(title, initialValue, options);
        const input = this._createInput(opts);
        this._registerInput(input, opts.presetId);
        return input;
    }
    //⌟
    //·· Bind ···································································¬
    /**
     * Binds an input to a target object and key.  The input will automatically update the target
     * object's key when the input value changes.
     * @param target - The object to bind the input to.
     * @param key - The key of the target object to bind the input to.
     * @param options - The {@link InputOptions}, the type of which is inferred based on the type
     * of the value at the {@link target} object's {@link key}.
     * @example
     * ```ts
     * const gui = new Gooey()
     *
     * // Some state.
     * const params = { foo: 5, bar: 'baz', qux: true }
     *
     * const numberInput = gui.bind(params, 'foo', { min: 0, max: 10, step: 1 })
     * //    ^? InputNumber
     *
     * // By default, the `title` is inferred from the key.
     * // To override it, use the `title` option:
     * const switchInput = gui.bind(params, 'qux', { title: 'Kwucks' })
     * ```
     */
    bind(target, key, options = {}) {
        const title = options.title ?? key;
        const opts = this._resolveOpts(title, target[key], options);
        opts.value ??= target[key];
        opts.binding = { target, key, initial: opts.value };
        const input = this._createInput(opts);
        this._registerInput(input, opts.presetId);
        return input;
    }
    /**
     * Used to store a ref to the top level folder of a nested generator like `bindMany`.
     */
    #transientRoot = null;
    /**
     * Takes an object and generates a set of inputs based on the object's keys and values.  Any
     * nested objects will result in child folders being created.  Options can be passed to
     * customize the inputs generated, and to exclude/include specific keys.
     * @param target - The object to generate inputs from.
     * @param options - Options to customize the inputs generated, as well as `include` and
     * `exclude` arrays to omit certain keys.
     * @example
     * ```ts
     * const gui = new Gooey()
     *
     * const params = {
     *  myNumber: 5,
     * 	myFolder: {
     *    myOptions: 'foo',
     * 	}
     * }
     *
     * gui.addMany(params, {
     *   myFolder: {
     * folderOptions: title: 'My Folder' }}, // optional folder controls
     * })
     */
    addMany(target, options) {
        let rootFolder = this;
        if (!this.#transientRoot) {
            this.#transientRoot = rootFolder;
        }
        this._walk(target, (options || undefined) ?? {}, rootFolder, new Set(), 'add');
        const finalRoot = this.#transientRoot;
        this.#transientRoot = null;
        return finalRoot;
    }
    bindMany(target, options) {
        let rootFolder = this;
        if (!this.#transientRoot) {
            this.#transientRoot = rootFolder;
        }
        this._walk(target, (options || undefined) ?? {}, rootFolder, new Set(), 'bind');
        const finalRoot = this.#transientRoot;
        this.#transientRoot = null;
        return finalRoot;
    }
    //⌟
    _walk(target, options, folder, seen, mode) {
        if (seen.has(target))
            return;
        seen.add(target);
        for (let [key, value] of Object.entries(target)) {
            if (Array.isArray(options['exclude']) && options['exclude'].includes(key))
                continue;
            if (Array.isArray(options['include']) && !options['include'].includes(key))
                continue;
            const inputOptions = options[key] || {};
            let folderOptions = {};
            if (value === null) {
                const hasValue = 'value' in inputOptions;
                if (!hasValue && mode === 'bind') {
                    console.error(`bindMany() error: target object's key "${key}" is \`null\`, and no valid "value" option was provided as a fallback.`, { key, value, inputOptions });
                    throw new Error('Invalid binding.');
                }
                if (hasValue) {
                    value = inputOptions['value'];
                }
            }
            if (typeof value === 'object') {
                if (isColor(value)) {
                    mode === 'bind'
                        ? folder.bindColor(value, 'color', { title: key, ...inputOptions })
                        : folder.addColor(key, value, inputOptions);
                }
                else {
                    if ('folderOptions' in inputOptions) {
                        folderOptions = inputOptions['folderOptions'];
                    }
                    else if ('folderOptions' in value) {
                        folderOptions = value.folderOptions;
                    }
                    const subFolder = folder.addFolder(key, folderOptions);
                    this._walk(value, inputOptions, subFolder, seen, mode);
                }
            }
            else if ('options' in inputOptions) {
                mode === 'bind'
                    ? folder.bindSelect(target, key, inputOptions)
                    : folder.addSelect(key, inputOptions.options, inputOptions);
            }
            else {
                mode === 'bind'
                    ? folder.bind(target, key, inputOptions)
                    : folder.add(key, value, inputOptions);
            }
        }
    }
    //·· Adders ···································································¬
    /**
     * Adds a new {@link InputNumber} to the folder.
     * @example
     * ```ts
     * const number = gui.addNumber('Foo', true)
     * number.on('change', console.log)
     * ```
     */
    addNumber(title, value, options = {}) {
        const opts = this._resolveOpts(title, value, options);
        const input = new InputNumber(opts, this);
        return this._registerInput(input, opts.presetId);
    }
    bindNumber(target, key, options) {
        const opts = this._resolveBinding(target, key, options);
        return this.addNumber(key, opts.value, opts);
    }
    addText(title, value, options) {
        const opts = this._resolveOpts(title, value, options);
        const input = new InputText(opts, this);
        return this._registerInput(input, opts.presetId);
    }
    bindText(target, key, options) {
        const opts = this._resolveBinding(target, key, options);
        return this.addText(key, opts.value, opts);
    }
    addColor(title, value, options) {
        const opts = this._resolveOpts(title, value, options);
        const input = new InputColor(opts, this);
        return this._registerInput(input, opts.presetId);
    }
    bindColor(target, key, options) {
        const opts = this._resolveBinding(target, key, options);
        return this.addColor(key, opts.value, opts);
    }
    addButton(title, onclick, options) {
        const opts = this._resolveOpts(title, onclick, options);
        opts.onClick = onclick || opts.value;
        const input = new InputButton(opts, this);
        return this._registerInput(input, opts.presetId);
    }
    /**
     * Passes the function at `target[key]` to {@link addButton} as the `onclick` handler.
     */
    bindButton(target, key, options) {
        return this.addButton(key, target[key], options);
    }
    addButtonGrid(title, value, options) {
        const opts = this._resolveOpts(title, value, options);
        const input = new InputButtonGrid(opts, this);
        return this._registerInput(input, opts.presetId);
    }
    bindButtonGrid(target, key, options) {
        return this.addButtonGrid(key, target[key], options);
    }
    /**
     * Adds a new {@link InputSelect} to the folder.
     * @example
     * ```ts
     * // For primitives:
     * gui.addSelect('theme', ['light', 'dark'], { initialValue: 'light' })
     *
     * // For objects:
     * const options = {
     *   foo: { id: 0 },
     *   bar: { id: 1 },
     * }
     *
     * todo - Implement this -- will need to detect that the list has objects and pass a union of
     * todo - their keys to the initialValue type or something?
     * gui.addSelect('foobar', options, { initialValue: 'foo' })
     * ```
     */
    addSelect(title, array, options) {
        const opts = this._resolveOpts(title, array, options);
        opts.options = array;
        opts.value =
            options?.initialValue ?? fromState(array)?.at(0) ?? options?.binding?.initial;
        if (!opts.value) {
            console.warn('No value provided for select:', { title, array, options, opts });
        }
        return this._registerInput(new InputSelect(opts, this), opts.presetId);
    }
    /**
     * todo - Does this work / make sense?  It's just wrapping the list in a function.. which
     * happens internally anyways... I'm not sure what binding to a select should do, other than
     * ensure that the options array is regularly refreshed after interactions... but without a
     * way to listen to changes on the target object's array (i.e. forcing or wrapping with a
     * store), I'm not sure what the behavior should be.
     */
    bindSelect(target, key, options = {}) {
        const opts = this._resolveBinding(target, key, options);
        opts.value = target[key];
        return this.addSelect(key, opts.options, opts);
    }
    /**
     * Adds a new {@link InputSwitch} to the folder.
     * @example
     * ```ts
     * const switch = gui.addSwitch('Foo', true)
     * switch.on('change', console.log)
     * ```
     */
    addSwitch(title, value, options) {
        const opts = this._resolveOpts(title, value, options);
        const input = new InputSwitch(opts, this);
        return this._registerInput(input, opts.presetId);
    }
    /**
     * Binds an {@link InputSwitch} to the `boolean` at the target object's key.
     * @example
     * ```ts
     * const params = { foo: true }
     * const switch = gui.bindSwitch(params, 'foo')
     * ```
     */
    bindSwitch(target, key, options) {
        const opts = this._resolveBinding(target, key, options);
        return this.addSwitch(key, opts.value, opts);
    }
    //⌟
    //·· Helpers ···································································¬
    /**
     * Does validation / error handling.
     * If no title was provided, this method will also assign the binding key to the title.
     * @returns The processed options.
     */
    _validateBinding(options, validate) {
        options.title ??= options.binding?.key;
        // Some (hopefully) helpful error handling.
        if (validate) {
            const b = options.binding;
            let value = options.value;
            if (!value) {
                value = b?.target[b?.key];
            }
            if (!value) {
                if (b) {
                    let err = false;
                    if (typeof b.target === 'undefined') {
                        err = true;
                        console.error(`\x1b[96mgooey\x1b[39m ~ \x1b[91mError\x1b[39m Binding "target" is undefined:`, b);
                    }
                    if (typeof b.key === 'undefined') {
                        err = true;
                        console.error(`\x1b[96mgooey\x1b[39m ~ \x1b[91mError\x1b[39m Binding "key" is undefined:`, b);
                    }
                    if (typeof b.target[b.key] === 'undefined') {
                        err = true;
                        console.error(`\x1b[96mgooey\x1b[39m ~ \x1b[91mError\x1b[39m The provided binding key \x1b[33m"${b.key}"\x1b[39m does not exist on provided \x1b[33mtarget\x1b[39m:`, b);
                    }
                    if (err) {
                        throw new Error('gooey ~ Failed to bind input to the provided target object.', {
                            cause: options,
                        });
                    }
                }
                else {
                    throw new Error('gooey ~ No value or binding provided.', { cause: options });
                }
            }
        }
        return options;
    }
    _createInput(options) {
        this._log.fn('#createInput').debug(this);
        const type = this._resolveType(options);
        options = this._validateBinding(options, false);
        switch (type) {
            case 'InputText':
                return new InputText(options, this);
            case 'InputNumber':
                return new InputNumber(options, this);
            case 'InputColor':
                return new InputColor(options, this);
            case 'InputSelect':
                return new InputSelect(options, this);
            case 'InputButton':
                return new InputButton(options, this);
            case 'InputSwitch':
                return new InputSwitch(options, this);
        }
        throw new Error('Invalid input type: ' + type + ' for options: ' + options);
    }
    _resolveBinding(target, key, options = {}) {
        const title = options.title ?? key;
        const opts = this._resolveOpts(title, target[key], options);
        opts.binding = { target, key, initial: opts.value };
        const res = this._validateBinding(opts, true);
        return res;
    }
    _resolveType(options) {
        this._log.fn('resolveType').debug({ options, this: this });
        let value = options.value ?? options.binding?.target[options.binding.key];
        if ('onClick' in options) {
            return 'InputButton';
        }
        if (('options' in options && Array.isArray(options.options)) || isLabeledOption(value)) {
            value ??= options.options[0];
            options.value ??= value;
            return 'InputSelect';
        }
        switch (typeof value) {
            case 'boolean': {
                // todo:
                // We need some way to differentiate between a switch and a checkbox once the checkbox is added.
                // ^ Why do we need a checkbox?
                return 'InputSwitch';
            }
            case 'number': {
                return 'InputNumber';
            }
            case 'string': {
                if (isColorFormat(value))
                    return 'InputColor';
                // todo:
                // Could detect CSS units like `rem` and `-5px 0 0 3px` for an advanced `CSSTextInput` or something.
                // Or like a "TextComponents" input that can have any number of "components" (like a color picker, number, select, etc) inside a string.
                return 'InputText';
            }
            case 'function': {
                return 'InputButton';
            }
            case 'object': {
                if (Array.isArray(value)) {
                    return 'InputSelect';
                }
                if (isColor(value)) {
                    return 'InputColor';
                }
                if (isLabeledOption(value)) {
                    return 'InputSelect';
                }
                throw new Error('Invalid input view: ' + JSON.stringify(value));
            }
            default: {
                throw new Error('Invalid input view: ' + value);
            }
        }
    }
    //⌟
    //⌟
    //· Elements ·················································································¬
    _createElement(opts) {
        this._log.fn('#createElement').debug({ el: opts.container, this: this });
        if (this.isRoot) {
            const width = opts.width;
            return create('div', {
                id: `gooey-root_${this.id}`,
                classes: ['gooey-root', 'gooey-folder', 'closed'],
                dataset: { theme: this.gooey.theme ?? 'default' },
                parent: select(opts.container)[0],
                style: width ? { width } : undefined,
            });
        }
        return create('div', {
            parent: this.parentFolder.elements.content,
            classes: ['gooey-folder', 'closed'],
        });
    }
    _createElements(element) {
        this._log.fn('#createElements').debug({ element, this: this });
        const header = create('div', {
            parent: element,
            classes: ['gooey-header'],
        });
        header.addEventListener('pointerdown', this._handleClick.bind(this));
        const title = create('div', {
            parent: header,
            classes: ['gooey-title'],
            innerHTML: this.title,
        });
        const toolbar = create('div', {
            parent: header,
            classes: ['gooey-toolbar'],
        });
        const contentWrapper = create('div', {
            classes: ['gooey-content-wrapper'],
            parent: element,
        });
        const content = create('div', {
            classes: ['gooey-content'],
            parent: contentWrapper,
        });
        return {
            header,
            toolbar: {
                container: toolbar,
                // settingsButton,
            },
            title,
            contentWrapper,
            content,
        };
    }
    //⌟
    //· SVG's ····················································································¬
    async _createGraphics(headerless = false) {
        setTimeout(() => {
            new TerminalSvg(this);
        }, 10);
        if (this.isRootFolder())
            return;
        this._log.fn('createGraphics').debug({ this: this });
        if (!this.isRootFolder()) {
            this.graphics = { icon: createFolderSvg(this) };
            this.elements.header.prepend(this.graphics.icon);
            if (!headerless) {
                this.initialHeaderHeight ??= this._resolveHeaderHeight();
                this.graphics.connector = createFolderConnector(this, this.graphics.icon);
                animateConnector(this, this.closed.value ? 'close' : 'open');
            }
        }
    }
    _resolveHeaderHeight() {
        let height = 16 * 1.75;
        const wrapper = this.root?.gooey?.wrapper;
        if (!wrapper) {
            throw new Error('No wrapper found!  This should never happen...');
        }
        const prop = getComputedStyle(wrapper).getPropertyValue('--gooey-header_height');
        if (prop.endsWith('px')) {
            height = parseFloat(prop);
        }
        else if (prop.endsWith('em')) {
            let fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            height = parseFloat(prop) * fontSize;
        }
        return height;
    }
    get hue() {
        const localIndex = this.parentFolder.children.indexOf(this);
        // note: Color will be off if we ever add built-in folders other than "Settings Folder".
        const i = this.parentFolder.isRootFolder() ? localIndex - 1 : localIndex;
        // Don't count the root folder.
        const depth = this._depth - 1;
        // return i * 20 + depth * 80
        if (depth === 0) {
            return i * 30;
        }
        else {
            return this.parentFolder.hue + i * -20;
        }
    }
    get scrollHeight() {
        let height = this.element.scrollHeight;
        height += this.elements.header.scrollHeight;
        for (const child of this.allChildren) {
            height += child.scrollHeight;
            height += this.elements.header.scrollHeight;
        }
        return height;
    }
    #timeout;
    #first = true;
    _refreshIcon() {
        this._log.fn('#refreshIcon').debug(this);
        // Really don't love this...
        if (this.graphics) {
            defer(() => {
                clearTimeout(this.#timeout);
                this.#timeout = setTimeout(() => {
                    const svg = createFolderSvg(this);
                    this.graphics?.icon.replaceWith(svg);
                    if (this.graphics)
                        this.graphics.icon = svg;
                    if (this.#first) {
                        this.graphics?.connector?.update();
                        this.#first = false;
                    }
                    else {
                        this.graphics?.connector?.update();
                    }
                }, 1);
            });
        }
    }
    //⌟
    disposed = false;
    dispose() {
        if (this.disposed && DEV) {
            this._log.fn('dispose').debug('Already disposed.', this);
            return;
        }
        this.elements.header.removeEventListener('click', this.toggle);
        this.elements.header.addEventListener('pointerdown', this._handleClick);
        this.element.remove();
        for (const input of this.inputs.values()) {
            input.dispose();
        }
        for (const child of this.children) {
            child.dispose();
        }
        try {
            this.parentFolder.children.splice(this.parentFolder.children.indexOf(this), 1);
        }
        catch (err) {
            this._log.fn('dispose').error('Error removing folder from parent', { err });
        }
        this.disposed = true;
    }
}
//#region Type Tests ···································································¬
// const testTargetInferer = <T>(_target: T): InferTarget<T> => {
// 	return {} as InferTarget<T>
// }
// const testTarget = {
// 	// number
// 	foo: 5,
// 	// text
// 	bar: 'baz',
// 	// switch
// 	baz: false,
// 	// select
// 	qux: [1, 2, 3],
// 	// nested
// 	quux: { a: 'a', b: 'b' },
// 	// color
// 	quuz: new Color('red'),
// 	// nested
// 	parent: {
// 		child: 'foo',
// 	},
// }
// interface ExpectedTargetInference {
// 	foo: InputNumber
// 	bar: InputText
// 	baz: InputSwitch
// 	qux: InputSelect<number>
// 	quux: {
// 		a: InputText
// 		b: InputText
// 	}
// 	quuz: InputColor
// 	parent: {
// 		child: InputText
// 	}
// }
// function test() {
// 	const inference: ExpectedTargetInference = testTargetInferer(testTarget)
// 	inference // works!
// 	const gui = {} as Gooey
// 	const bindManyTest = gui.bindMany(testTarget, {
// 		foo: { min: 0, max: 10, step: 1 },
// 		parent: {
// 			child: { title: 'Child' },
// 		},
// 	})
// 	bindManyTest
// }
// test
//#endregion

export { Folder };
//# sourceMappingURL=Folder.js.map
