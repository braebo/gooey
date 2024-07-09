// The custom-regions extension is recommended for this file.
import { InputButtonGrid } from './inputs/InputButtonGrid';
import { InputSwitch } from './inputs/InputSwitch';
import { InputButton } from './inputs/InputButton';
import { InputSelect } from './inputs/InputSelect';
import { InputNumber } from './inputs/InputNumber';
import { InputColor } from './inputs/InputColor';
import { InputText } from './inputs/InputText';
import { isLabeledOption } from './controllers/Select';
import { animateConnector, createFolderConnector, createFolderSvg } from './svg/createFolderSVG';
import { composedPathContains } from './shared/cancelClassFound';
import { isColor, isColorFormat } from './shared/color/color';
import { EventManager } from './shared/EventManager';
import { TerminalSvg } from './svg/TerminalSvg';
import { Search } from './toolbar/Search';
import { create } from './shared/create';
import { Logger } from './shared/logger';
import { nanoid } from './shared/nanoid';
import { state } from './shared/state';
import { toFn } from './shared/toFn';
import { DEV } from 'esm-env';
import { Gui } from './Gui';
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
});
/**
 * Internal folder creation api defaults.
 */
const INTERNAL_FOLDER_DEFAULTS = {
    __type: 'InternalFolderOptions',
    parentFolder: undefined,
    isRoot: true,
    _skipAnimations: true,
    gui: undefined,
    _headerless: false,
};
//⌟
/**
 * Folder is a container for organizing and grouping {@link Input|Inputs} and child Folders.
 *
 * This class should not be instantiated directly.  Instead, use the {@link Gui.addFolder} method.
 *
 * @example
 * ```typescript
 * const gui = new Gui()
 * const folder = gui.addFolder({ title: 'My Folder' })
 * folder.addNumber({ title: 'foo', value: 5 })
 * ```
 */
export class Folder {
    //· Props ····················································································¬
    __type = 'Folder';
    isRoot = true;
    id = nanoid();
    gui;
    /**
     * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
     * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
     * Therefore, if you want to use presets, you will only need to set this if you:
     * - Use the same title for multiple inputs _in the same {@link Folder}_, or
     * - Leave all titles empty
     * Otherwise, this can be left as the default and presets will work as expected.
     * @defaultValue {@link title|`title`}
     */
    presetId;
    /**
     * Whether this Folder should be saved as a {@link FolderPreset} when saving the
     * {@link GuiPreset} for the {@link Gui} this Folder belongs to.  If `false`, this Input will
     * be skipped.
     * @defaultValue `true`
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
     * The root folder.  All folders have a reference to the same root folder.
     */
    root;
    parentFolder;
    settingsFolder;
    // closed: State<boolean>
    closed = state(false);
    element;
    elements = {};
    graphics;
    evm = new EventManager(['change', 'refresh', 'toggle', 'mount']);
    on = this.evm.on.bind(this.evm);
    _title;
    _hidden = () => false;
    _log;
    /** Used to disable clicking the header to open/close the folder. */
    _disabledTimer;
    /** The time in ms to wait after mousedown before disabling toggle for a potential drag. */
    _clickTime = 200;
    /** Whether clicking the header to open/close the folder is disabled. */
    _clicksDisabled = false;
    _depth = -1;
    //⌟
    constructor(options) {
        if (!('container' in options)) {
            throw new Error('Folder must have a container.');
        }
        const opts = Object.assign({}, FOLDER_DEFAULTS, INTERNAL_FOLDER_DEFAULTS, {
            gui: this.gui,
            isRoot: true,
        }, options);
        // this.closed = state(opts.closed ?? false)
        // if (opts.title === 'base') {
        // 	console.log(opts.closed)
        // 	console.log(this.closed.value)
        // 	setTimeout(() => {
        // 		console.log(this.closed.value)
        // 	}, 1000)
        // }
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
        this.gui = opts.gui;
        this._title = opts.title ?? '';
        this.element = this._createElement(opts.container);
        this.elements = this._createElements(this.element);
        this.presetId = this.resolvePresetId(opts);
        this.saveable = !!opts.saveable;
        if (this.isRoot || opts.searchable) {
            new Search(this);
        }
        if (opts._skipAnimations) {
            // We need to bypass animations so I can get the rect.
            this.element.classList.add('instant');
            setTimeout(() => {
                this.element.classList.remove('instant');
            }, 0);
        }
        this.hidden = opts.hidden ? toFn(opts.hidden) : () => false;
        // Open/close the folder when the closed state changes.
        this.evm.add(this.closed.subscribe(v => {
            v ? this.close() : this.open();
            this.evm.emit('toggle', v);
        }));
        this._createGraphics(opts._headerless).then(() => {
            if (opts.closed) {
                this.closed.set(opts.closed);
            }
            this.evm.emit('mount');
        });
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
            this.elements.title.textContent = v;
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
        return this._hidden();
    }
    set hidden(v) {
        this._hidden = toFn(v);
        this._hidden() ? this.hide() : this.show();
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
            gui: this.gui,
        });
        const overrides = {
            __type: 'InternalFolderOptions',
            container: this.elements.content,
            isRoot: false,
        };
        const opts = Object.assign({}, defaults, options, overrides);
        const folder = new Folder(opts);
        folder.on('change', v => this.evm.emit('change', v));
        this.children.push(folder);
        this._createSvgs();
        if (opts._headerless) {
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
        if (composedPathContains(event, 'fracgui-cancel'))
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
            return;
        }
        // If the folder is being dragged, don't toggle.
        if (this.element.classList.contains('fracgui-dragged')) {
            this.element.classList.remove('fracgui-dragged');
            return;
        }
        const state = !this.closed.value;
        this.closed.set(state);
        this.evm.emit('toggle', state);
    };
    open(updateState = false) {
        this._log.fn('open').debug();
        this.element.classList.remove('closed');
        if (updateState)
            this.closed.set(false);
        this._clicksDisabled = false;
        this.#toggleAnimClass();
        animateConnector(this, 'open');
    }
    close(updateState = false) {
        this._log.fn('close').debug();
        this.element.classList.add('closed');
        if (updateState)
            this.closed.set(true);
        this._clicksDisabled = false;
        this.#toggleAnimClass();
        animateConnector(this, 'close');
    }
    toggleHidden() {
        this._log.fn('toggleHidden').debug();
        this.element.classList.toggle('hidden');
    }
    hide() {
        this._log.fn('hide').error();
        this.element.classList.add('hidden');
    }
    show() {
        this._log.fn('show').debug();
        this.element.classList.remove('hidden');
    }
    #toggleTimeout;
    #toggleAnimClass = () => {
        this.element.classList.add('animating');
        clearTimeout(this.#toggleTimeout);
        this.#toggleTimeout = setTimeout(() => {
            this.element.classList.remove('animating');
        }, 600); // todo - This needs to sync with the animation duration in the css... smelly.
    };
    //⌟
    //·· Save/Load ···············································································¬
    resolvePresetId = (opts) => {
        this._log.fn('resolvePresetId').debug({ opts, this: this });
        const getPaths = (folder) => {
            if (folder.isRootFolder.bind(folder) || !(folder.parentFolder === this))
                return [folder.title];
            return [...getPaths(folder.parentFolder), folder.title];
        };
        const paths = getPaths(this);
        let presetId = opts?.presetId || paths.join('__');
        if (!presetId) {
            let i = 0;
            for (const child of this.allChildren) {
                if (child.presetId == presetId)
                    i++;
            }
            if (i > 0)
                presetId += i;
        }
        return presetId;
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
            closed: this.closed.value,
            hidden: toFn(this._hidden)(),
            children: this.children
                .filter(c => c.title !== Gui.settingsFolderTitle && c.saveable)
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
        this.closed.set(preset.closed);
        this.hidden = preset.hidden;
        for (const child of this.children) {
            const data = preset.children?.find(f => f.id === child.presetId);
            if (data)
                child.load(data);
        }
        for (const input of this.inputs.values()) {
            const data = preset.inputs.find(c => c.presetId === input.id);
            if (data)
                input.load(data);
        }
    }
    //⌟
    //⌟
    //· Input Generators ·········································································¬
    /**
     * Updates the ui for all inputs belonging to this folder to reflect their current values.
     */
    refresh() {
        this._log.fn('refresh').debug(this);
        for (const input of this.inputs.values()) {
            input.refresh();
        }
    }
    /**
     * Updates the ui for all inputs in this folder and all child folders recursively.
     */
    refreshAll() {
        for (const input of this.allInputs.values()) {
            input.refresh();
        }
        this.evm.emit('refresh');
    }
    addMany(obj, options) {
        const folder = options?.folder ?? this;
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object') {
                if (isColor(value)) {
                    this.addColor({ title: key, value });
                    continue;
                }
                const subFolder = folder.addFolder(key);
                subFolder.addMany(value, { folder: subFolder });
            }
            else {
                const opts = {
                    title: key,
                    value,
                    binding: {
                        target: obj,
                        key,
                    },
                };
                if (typeof value === 'number') {
                    if (value > 0) {
                        ;
                        opts.max = value * 2;
                        opts.step = value / 10;
                        opts.min = 0;
                    }
                    else if (value == 0) {
                        ;
                        opts.min = -1;
                        opts.step = 0.01;
                        opts.max = 1;
                    }
                    else {
                        ;
                        opts.min = value * 2;
                        opts.step = value / 10;
                        opts.max = 0;
                    }
                }
                this.add(opts);
            }
        }
    }
    add(titleOrOptions, maybeOptions) {
        const opts = this._resolveOptions(titleOrOptions, maybeOptions);
        const input = this._createInput(opts);
        this.inputs.set(input.id, input);
        this._refreshIcon();
        return input;
    }
    /**
     * Binds an input to a target object and key.  The input will automatically update the target
     * object's key when the input value changes.
     * @param target - The object to bind the input to.
     * @param key - The key of the target object to bind the input to.
     * @param options - The {@link InputOptions}, the type of which is inferred based on the type
     * of the value at the {@link target} object's {@link key}.
     * @example
     * ```ts
     * const gui = new Gui()
     * const params = { foo: 5, bar: 'baz' }
     * const folder = gui.addFolder('params')
     *
     * const numberInput = folder.bind(params, 'foo', { min: 0, max: 10, step: 1 })
     * //    ^? `InputNumber`
     *
     * const textInput = folder.bind(params, 'bar', { maxLength: 50 })
     * //    ^? `InputText`
     */
    bind(target, key, options) {
        const value = target[key];
        const opts = options ?? {};
        opts.title ??= key;
        opts.binding = { target, key, initial: value };
        const input = this._createInput(opts);
        this.inputs.set(input.id, input);
        this._refreshIcon();
        return input;
    }
    addNumber(titleOrOptions, maybeOptions) {
        const opts = this._resolveOptions(titleOrOptions, maybeOptions);
        const input = new InputNumber(opts, this);
        this.inputs.set(input.id, input);
        this._refreshIcon();
        return input;
    }
    bindNumber(titleOrTarget, keyOrOptions, options) {
        const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
        const input = new InputNumber(opts, this);
        this.inputs.set(input.title, input);
        this._refreshIcon();
        return input;
    }
    addText(titleOrOptions, maybeOptions) {
        const opts = this._resolveOptions(titleOrOptions, maybeOptions);
        const input = new InputText(opts, this);
        this.inputs.set(input.id, input);
        this._refreshIcon();
        return input;
    }
    bindText(titleOrTarget, keyOrOptions, options) {
        const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
        const input = new InputText(opts, this);
        this.inputs.set(input.title, input);
        this._refreshIcon();
        return input;
    }
    addColor(titleOrOptions, maybeOptions) {
        const opts = this._resolveOptions(titleOrOptions, maybeOptions);
        const input = new InputColor(opts, this);
        this.inputs.set(input.id, input);
        this._refreshIcon();
        return input;
    }
    bindColor(titleOrTarget, keyOrOptions, options) {
        const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
        const input = new InputColor(opts, this);
        this.inputs.set(input.title, input);
        this._refreshIcon();
        return input;
    }
    addButton(titleOrOptions, maybeOptions) {
        const opts = this._resolveOptions(titleOrOptions, maybeOptions);
        const input = new InputButton(opts, this);
        this.inputs.set(input.id, input);
        this._refreshIcon();
        return input;
    }
    bindButton(titleOrTarget, keyOrOptions, options) {
        const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
        const input = new InputButton(opts, this);
        this.inputs.set(input.title, input);
        this._refreshIcon();
        return input;
    }
    addButtonGrid(titleOrOptions, maybeOptions) {
        const opts = this._resolveOptions(titleOrOptions, maybeOptions);
        const input = new InputButtonGrid(opts, this);
        this.inputs.set(input.id, input);
        this._refreshIcon();
        return input;
    }
    bindButtonGrid(titleOrTarget, keyOrOptions, options) {
        const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
        const input = new InputButtonGrid(opts, this);
        this.inputs.set(input.title, input);
        this._refreshIcon();
        return input;
    }
    addSelect(titleOrOptions, maybeOptions) {
        const opts = this._resolveOptions(titleOrOptions, maybeOptions);
        const input = new InputSelect(opts, this);
        this.inputs.set(input.id, input);
        this._refreshIcon();
        return input;
    }
    bindSelect(titleOrTarget, keyOrOptions, options) {
        const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
        const input = new InputSelect(opts, this);
        this.inputs.set(input.title, input);
        this._refreshIcon();
        return input;
    }
    addSwitch(titleOrOptions, maybeOptions) {
        const opts = this._resolveOptions(titleOrOptions, maybeOptions);
        const input = new InputSwitch(opts, this);
        this.inputs.set(input.id, input);
        this._refreshIcon();
        return input;
    }
    bindSwitch(titleOrTarget, keyOrOptions, options) {
        const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
        const input = new InputSwitch(opts, this);
        this.inputs.set(input.title, input);
        this._refreshIcon();
        return input;
    }
    /**
     * Does validation / error handling.
     * If no title was provided, this method will also assign the binding key to the title.
     * @returns The processed options.
     */
    _validateOptions(options, validate) {
        if (options.binding?.key && !options.title) {
            options.title = options.binding.key;
        }
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
        options = this._validateOptions(options);
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
    _resolveOptions(titleOrOptions, maybeOptions) {
        const twoArgs = typeof titleOrOptions === 'string' && typeof maybeOptions === 'object';
        const title = twoArgs ? titleOrOptions : maybeOptions?.title ?? '';
        const options = twoArgs ? maybeOptions : titleOrOptions;
        options.title ??= title;
        return options;
    }
    _resolveBinding(titleOrTarget, keyOrOptions, options) {
        let opts;
        let shouldHaveValue = false;
        if (typeof titleOrTarget === 'string') {
            opts = keyOrOptions ?? {};
            opts.title = titleOrTarget;
        }
        else {
            shouldHaveValue = true;
            const target = titleOrTarget;
            const key = keyOrOptions;
            opts = options ?? {};
            opts.binding = { target, key, initial: target[key] };
        }
        return this._validateOptions(opts, shouldHaveValue);
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
    //· Elements ·················································································¬
    _createElement(el) {
        this._log.fn('#createElement').debug({ el, this: this });
        if (this.isRoot) {
            return create('div', {
                id: `fracgui-root_${this.id}`,
                classes: ['fracgui-root', 'fracgui-folder', 'closed'],
                dataset: { theme: this.gui.theme ?? 'default' },
                parent: el,
            });
        }
        return create('div', {
            parent: this.parentFolder.elements.content,
            classes: ['fracgui-folder', 'closed'],
        });
    }
    _createElements(element) {
        this._log.fn('#createElements').debug({ element, this: this });
        const header = create('div', {
            parent: element,
            classes: ['fracgui-header'],
        });
        header.addEventListener('pointerdown', this._handleClick.bind(this));
        const title = create('div', {
            parent: header,
            classes: ['fracgui-title'],
            textContent: this.title,
        });
        const toolbar = create('div', {
            parent: header,
            classes: ['fracgui-toolbar'],
        });
        const contentWrapper = create('div', {
            classes: ['fracgui-content-wrapper'],
            parent: element,
        });
        const content = create('div', {
            classes: ['fracgui-content'],
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
        this._log.fn('createGraphics').debug({ this: this });
        await Promise.resolve();
        if (!this.isRootFolder()) {
            this.graphics = { icon: createFolderSvg(this) };
            this.elements.header.prepend(this.graphics.icon);
            if (!headerless) {
                this.graphics.connector = createFolderConnector(this);
                this.element.prepend(this.graphics.connector.container);
            }
        }
        if (DEV)
            new TerminalSvg(this);
    }
    _createSvgs() {
        this._log.fn('#createSvgs').debug({ this: this });
    }
    get hue() {
        const localIndex = this.parentFolder.children.indexOf(this);
        // note: Color will be off if we ever add built-in folders other than "Settings Folder".
        const i = this.parentFolder.isRootFolder() ? localIndex - 1 : localIndex;
        // Don't count the root folder.
        const depth = this._depth - 1;
        return i * 20 + depth * 80;
    }
    _refreshIcon() {
        this._log.fn('#refreshIcon').debug(this);
        if (this.graphics) {
            this.graphics.icon.replaceWith(createFolderSvg(this)); // Don't love this...
        }
    }
    //⌟
    disposed = false;
    dispose() {
        if (this.disposed && DEV) {
            this._log.fn('dispose').error('Already disposed.', this);
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
