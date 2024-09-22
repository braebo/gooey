import theme_default from './styles/themes/vanilla.js';
import theme_scout from './styles/themes/scout.js';
import theme_flat from './styles/themes/flat.js';
import style from './styles/gooey.css.js';
import { WindowManager, WINDOWMANAGER_DEFAULTS } from './shared/WindowManager.js';
import { persist } from './shared/persist.js';
import { deepMergeOpts } from './shared/deepMergeOpts.js';
import { resolveOpts } from './shared/resolveOpts.js';
import { PresetManager } from './PresetManager.js';
import { Themer } from './styles/themer/Themer.js';
import settingsIcon from './svg/settings-icon.js';
import { GUI_VARS } from './styles/GOOEY_VARS.js';
import { UndoManager } from './UndoManager.js';
import { select } from './shared/select.js';
import { nanoid } from './shared/nanoid.js';
import { Logger } from './shared/logger.js';
import { create } from './shared/create.js';
import { place } from './shared/place.js';
import { Folder } from './Folder.js';
import { o } from './shared/l.js';

//#endregion
//#region Constants ····················································································¬
const GUI_STORAGE_DEFAULTS = {
    __type: 'GooeyStorageOptions',
    key: 'default',
    closed: true,
    theme: true,
    presets: true,
    position: false,
    size: false,
};
/**
 * The default {@link WindowManagerOptions} for a {@link Gooey}'s
 * {@link Gooey.windowManager|window manager}.  These are handled internally via the private
 * {@link GooeyOptionsInternal._windowManager|gooey options}.
 * @internal
 */
const GUI_WINDOWMANAGER_DEFAULTS = {
    __type: 'WindowManagerOptions',
    preserveZ: false,
    zFloor: 0,
    bounds: undefined,
    obstacles: undefined,
    resizable: {
        grabberSize: 9,
        color: 'var(--bg-d)',
        sides: ['right', 'left'],
        corners: [],
    },
    draggable: {
        bounds: undefined,
        classes: {
            default: 'gooey-draggable',
            dragging: 'gooey-dragging',
            cancel: 'gooey-cancel',
            dragged: 'gooey-dragged',
        },
    },
};
/**
 * The default values for {@link GooeyOptions}.
 */
const GUI_DEFAULTS = {
    __type: 'GooeyOptions',
    title: 'gooey',
    storage: true,
    closed: false,
    position: 'top-right',
    margin: 16,
    container: 'body',
    theme: 'vanilla',
    themeMode: 'dark',
    themes: [theme_default, theme_flat, theme_scout],
    resizable: true,
    draggable: true,
    loadDefaultFont: true,
    settingsFolder: {
        closed: true,
        uiFolder: { closed: true, presetId: 'gooey_settings__ui_folder' },
        presetsFolder: { closed: true, presetId: 'gooey_settings__presets_folder' },
    },
    offset: { x: 0, y: 0 },
};
/**
 * Methods inherited from {@link Folder} to forward to the gooey.
 * @remarks Gooey _used to_ extend {@link Folder}, but that caused more problems than it solved...
 */
// prettier-ignore
const FORWARDED_METHODS = ['on', 'add', 'addMany', 'addButtonGrid', 'addSelect', 'addButton', 'addText', 'addNumber', 'addSwitch', 'addColor', 'bind', 'bindMany', 'bindButtonGrid', 'bindSelect', 'bindButton', 'bindText', 'bindNumber', 'bindSwitch', 'bindColor', 'open', 'close', 'show', 'hide', 'toggle', 'toggleHidden'];
/**
 * A customizable GUI toolkit for quickly creating interactive controls panels.
 */
class Gooey {
    __type = 'Gooey';
    id = nanoid();
    folder;
    elements;
    /**
     * The initial options passed to the gooey.
     */
    opts;
    /**
     * The {@link PresetManager} instance for the gooey.
     */
    presetManager;
    /**
     * Whether any of the inputs have been changed from their default values in the active preset.
     */
    dirty = false;
    /**
     * A transparent (display:contents) wrapper for the Gooey.  Used for the global style variables.
     */
    wrapper;
    /**
     * The main div containing the a Gooey — specifically, the {@link Folder.element}.
     */
    container;
    /**
     * The {@link UndoManager} instance for the gooey, handling undo/redo functionality.
     * @internal
     */
    _undoManager = new UndoManager();
    themer;
    // themeEditor?: ThemeEditor
    windowManager;
    moveTo = () => { };
    moveBy = () => { };
    /**
     * `false` if this {@link Gooey}'s {@link WindowManager} belongs to an existing, external
     * instance _(i.e. a separate {@link Gooey} instance or custom {@link WindowManager})_.  The
     * {@link WindowManager} will be disposed when this {@link Gooey} is disposed.
     * @internal
     */
    _isWindowManagerOwner = false;
    _theme;
    _log;
    _closedMap;
    static _initialized = false;
    constructor(titleOrOptions, options = {}) {
        //#region Setup ················································································¬
        if (!Gooey._initialized && globalThis.document) {
            Gooey._initialized = true;
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(style);
            globalThis.document.adoptedStyleSheets.push(sheet);
        }
        const initialOptions = typeof titleOrOptions === 'string'
            ? {
                ...options,
                title: titleOrOptions,
            }
            : (titleOrOptions ?? {});
        const opts = deepMergeOpts([GUI_DEFAULTS, initialOptions], {
            concatArrays: false,
        });
        opts.container ??= document.body;
        opts.offset ??= { x: 0, y: 0 };
        if (initialOptions.offset?.x)
            opts.offset.x = initialOptions.offset.x;
        if (initialOptions.offset?.y)
            opts.offset.y = initialOptions.offset.y;
        if (typeof opts.storage === 'object') {
            opts.storage = Object.assign({}, GUI_STORAGE_DEFAULTS, opts.storage);
        }
        let storageKey = '';
        const storageOpts = resolveOpts(opts.storage, GUI_STORAGE_DEFAULTS);
        if (!storageOpts) ;
        else {
            storageKey = `${storageOpts.key}::${opts.title?.toLowerCase().replaceAll(/\s/g, '-')}`;
            opts.storage = {
                ...storageOpts,
                key: storageKey,
            };
        }
        this.opts = opts;
        this._log = new Logger(`Gooey ${this.opts.title}`, { fg: 'palevioletred' });
        if (this.opts.loadDefaultFont !== false) {
            this._loadFonts();
        }
        this.elements ??= {};
        this.container = select(this.opts.container)[0];
        this.elements.container = this.container;
        this.wrapper = create('div', {
            classes: ['gooey-wrapper'],
            style: {
                display: 'contents',
            },
        });
        this.elements.wrapper = this.wrapper;
        this.wrapper.style.visibility = 'hidden';
        this.container.append(this.wrapper);
        this._closedMap = persist(`${storageKey || `gooey::${this.opts.title}`}::closed-map`, {});
        this._closedMap;
        this.folder = new Folder({
            ...this.opts,
            __type: 'FolderOptions',
            container: this.wrapper,
            // @ts-expect-error @internal
            gooey: this,
            presetId: this.opts.title,
        });
        // Poor-mans inheritance...
        for (const key of FORWARDED_METHODS) {
            // @ts-expect-error - ¯\_(ツ)_/¯
            this[key] = this.folder[key].bind(this.folder);
        }
        const handleUndoRedo = (e) => {
            if (globalThis.navigator?.userAgent?.match(/mac/i)) {
                if (e.metaKey && e.key === 'z') {
                    e.preventDefault();
                    e.shiftKey ? this._undoManager.redo() : this._undoManager.undo();
                }
            }
            else if (e.ctrlKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    this._undoManager.undo();
                }
                if (e.key === 'y') {
                    e.preventDefault();
                    this._undoManager.redo();
                }
            }
        };
        removeEventListener('keydown', handleUndoRedo);
        addEventListener('keydown', handleUndoRedo);
        //#endregion
        const { button, updateIcon } = this._createSettingsButton(this.folder.elements.toolbar.container);
        this.folder.elements.toolbar.settingsButton = button;
        let settingsFolderClosed = GUI_DEFAULTS.settingsFolder.closed;
        // Use localstorage, if enabled.
        if (typeof opts.storage === 'object' && opts.storage.closed !== false) {
            settingsFolderClosed = this._closedMap.value['gooey_settings'] ?? true;
        }
        else if (opts.settingsFolder?.closed) {
            settingsFolderClosed = opts.settingsFolder.closed;
        }
        this.elements.settingsFolder = this.addFolder('gooey_settings_folder', {
            // @ts-expect-error @internal
            _headerless: true,
            ...opts.settingsFolder,
            closed: settingsFolderClosed,
            saveable: false,
            presetId: 'gooey_settings',
        });
        this.elements.settingsFolder.element.classList.add('gooey-settings-folder', 'gooey-folder-alt');
        updateIcon();
        this.elements.settingsFolder.element.style.setProperty('order', '-99'); // todo - sup with this?
        this.themer =
            this.opts._themer ??
                this._createThemer(this.elements.settingsFolder);
        this.theme = this.opts.theme;
        this.presetManager = this._createPresetManager(this.elements.settingsFolder);
        this.windowManager ??= this._createWindowManager(this.opts, this.opts.storage);
        if (!this.opts.hidden) {
            this._revealing = true;
        }
    }
    get title() {
        return this.folder.title;
    }
    set title(v) {
        this.folder.title = v;
    }
    get closed() {
        return this.folder.closed;
    }
    get hidden() {
        return this.folder.hidden;
    }
    get inputs() {
        return this.folder.inputs;
    }
    get allInputs() {
        // todo - Really don't love this.
        return new Map([...this.folder.allInputs.entries()].filter(
        // Filter out the global settings,
        ([k]) => !k.match(/gooey_settings/) && k !== 'theme' && k !== 'mode'));
    }
    get window() {
        return this.windowManager?.windows.get(this.folder.element.id);
    }
    set theme(theme) {
        this._theme = theme;
        this.folder.element.setAttribute('theme', theme);
        this.folder.element.setAttribute('mode', this.themer.mode.value);
    }
    get theme() {
        return this._theme;
    }
    /**
     * The root {@link folder} {@link Folder.element|element}.
     */
    get element() {
        return this.folder.element;
    }
    /**
     * The position of the window relative to the {@link container}.
     */
    get position() {
        return this.window?.draggableInstance?.position ?? { x: 0, y: 0 };
    }
    set position(v) {
        this.window?.draggableInstance?.moveTo(v);
    }
    revealTimeout;
    revealIdle;
    addFolder(title, options) {
        return this.folder.addFolder(title, {
            ...options,
            // @ts-expect-error @internal
            gooey: this,
        });
    }
    /**
     * Saves the current gooey state as a preset.
     */
    save(
    /**
     * The title of the preset.
     */
    title, 
    /**
     * A unique id for the preset.
     * @defaultValue {@link nanoid|nanoid(10)}
     */
    id = nanoid(10), version) {
        this._log.fn('save').debug({ title, id });
        const preset = {
            __type: 'GooeyPreset',
            __version: version ?? this.presetManager.__version,
            id,
            title,
            data: this.folder.save(),
        };
        return preset;
    }
    /**
     * Loads a given preset into the gooey, updating all inputs.
     */
    load(preset) {
        this._log.fn('load').debug({ preset });
        // todo - this isn't working, it's being unset immediately somewhere...
        this.dirty = false;
        this._lockCommits(preset);
        this.folder.load(preset.data);
        Promise.resolve().then(() => this._unlockCommits());
    }
    _undoLock = false;
    _lockCommit = { from: undefined };
    /**
     * Commits a change to the input's value to the undo manager.
     */
    _commit(commit) {
        if (this._undoLock) {
            this._log.fn('commit').debug('LOCKED: prevented commit while locked');
            return;
        }
        this._log.fn('commit').debug('commited', commit);
        this._undoManager?.commit(commit);
    }
    /**
     * Prevents the input from registering undo history, storing the initial
     * for the eventual commit in {@link _unlockCommits}.
     */
    _lockCommits = (from) => {
        this._undoManager.lockedExternally = true;
        this._lockCommit.from = from;
        this._log.fn(o('lock')).debug('commit', { from, lockCommit: this._lockCommit });
    };
    /**
     * Unlocks commits and saves the current commit stored in lock.
     */
    _unlockCommits = (commit) => {
        commit ??= {};
        commit.target ??= this;
        commit.from ??= this._lockCommit.from;
        this._undoManager.lockedExternally = false;
        this._commit(commit);
        this._log.fn(o('unlock')).debug('commit', { commit, lockCommit: this._lockCommit });
    };
    _loadFonts() {
        const fredoka = new FontFace('fredoka', `url(${encodeURI?.('https://cdn.jsdelivr.net/fontsource/fonts/fredoka:vf@latest/latin-wdth-normal.woff2')})`, {
            style: 'normal',
            display: 'auto',
            weight: '300 700',
            stretch: '75% 125%',
            unicodeRange: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
        });
        fredoka.load().then(font => {
            // @ts-expect-error - ¯\_(ツ)_/¯
            document.fonts.add(font);
        });
        const Inconsolata = new FontFace('Inconsolata', `url(${encodeURI?.('https://cdn.jsdelivr.net/fontsource/fonts/inconsolata:vf@latest/latin-wdth-normal.woff2')})`, {
            style: 'normal',
            display: 'auto',
            weight: '300 700',
            stretch: '75% 125%',
            unicodeRange: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
        });
        Inconsolata.load().then(font => {
            // @ts-expect-error - ¯\_(ツ)_/¯
            document.fonts.add(font);
        });
    }
    _createThemer(folder) {
        this._log.fn('createThemer').debug({ folder });
        let finalThemer = undefined;
        const themer = this.opts._themer;
        const themerOptions = {
            localStorageKey: this.opts.storage ? this.opts.storage.key + '::themer' : undefined,
            mode: this.opts.themeMode,
            autoInit: !this.themer,
            persistent: !!(this.opts.storage && this.opts.storage.theme),
            themes: this.opts.themes,
            theme: this.opts.themes.find(t => t.title === this.opts.theme),
            vars: GUI_VARS,
        };
        themerOptions.vars = deepMergeOpts([GUI_VARS, themerOptions.vars]);
        if (themer) {
            finalThemer = themer;
        }
        else {
            themerOptions.wrapper = this.wrapper;
            finalThemer = new Themer(this.folder.element, themerOptions);
        }
        const uiFolder = folder.addFolder('ui', Object.assign({}, GUI_DEFAULTS.settingsFolder.uiFolder, this.opts.settingsFolder?.uiFolder, { presetId: 'gooey_settings__ui_folder' }));
        if (folder) {
            const themeInput = uiFolder.addSelect('theme', finalThemer.themes.value, {
                presetId: uiFolder.presetId + '__theme_select',
                labelKey: 'title',
                initialValue: finalThemer.theme.value,
            });
            themeInput.on('change', v => {
                finalThemer.theme.set(v.value);
            });
            const modeButtons = uiFolder.addButtonGrid('mode', [
                ['light', 'dark', 'system'].map(m => ({
                    text: m,
                    onClick: () => finalThemer?.mode.set(m),
                    active: () => finalThemer?.mode.value === m,
                })),
            ], {
                presetId: uiFolder.presetId + '__mode_buttons',
                applyActiveClass: true,
            });
            uiFolder.evm.add(finalThemer.mode.subscribe(v => {
                modeButtons.setActive(v);
            }));
        }
        return finalThemer;
    }
    _createSettingsButton(parent) {
        const button = create('button', {
            parent,
            classes: ['gooey-toolbar-item', 'gooey-settings-button'],
            innerHTML: settingsIcon,
            tooltip: {
                text: () => {
                    return this.elements.settingsFolder?.closed.value
                        ? 'Open Settings'
                        : 'Close Settings';
                },
                placement: 'right',
                offsetX: '.5rem',
                delay: 250,
                delayOut: 0,
                hideOnClick: true,
                style: this._getStyles,
            },
        });
        const updateIcon = () => {
            this.folder.elements.toolbar.settingsButton?.classList.toggle('open', !this.elements.settingsFolder.closed.value);
        };
        button.addEventListener('click', () => {
            this.elements.settingsFolder.toggle();
            updateIcon();
            if (this.folder.closed)
                this.folder.open();
        });
        return { button, updateIcon };
    }
    _createPresetManager(settingsFolder) {
        const { presets, defaultPreset, storage } = this.opts;
        let localStorageKey;
        if (typeof storage === 'object' && storage.presets) {
            localStorageKey = storage.key + '::presets';
        }
        let closed = GUI_DEFAULTS.settingsFolder.presetsFolder.closed;
        if (this.opts.settingsFolder?.presetsFolder?.closed) {
            closed = this.opts.settingsFolder.presetsFolder.closed;
        }
        return new PresetManager(this, settingsFolder, {
            presets,
            defaultPreset,
            localStorageKey,
            folderOptions: {
                ...this.opts.settingsFolder?.presetsFolder,
                closed,
            },
        });
    }
    static _parseWidth(str) {
        if (!str)
            return;
        if (!globalThis.window) {
            console.warn('parseCss can only be used in the browser');
            return;
        }
        const dummy = document.createElement('div');
        dummy.style.width = str;
        document.body.appendChild(dummy);
        const width = dummy.getBoundingClientRect().width;
        dummy.remove();
        return width;
    }
    _createWindowManager(options, storageOpts) {
        if (this.windowManager)
            return this.windowManager; // ??
        let dragOpts = undefined;
        if (this.opts.draggable) {
            dragOpts = Object.assign({}, GUI_WINDOWMANAGER_DEFAULTS.draggable, {
                handle: this.folder.elements.header,
                position: this.opts.position,
                localStorageKey: storageOpts && storageOpts.key ? storageOpts.key : undefined,
                bounds: this.container,
            });
            if (storageOpts && storageOpts.position === false) {
                dragOpts.localStorageKey = undefined;
            }
        }
        let resizeOpts = undefined;
        if (this.opts.resizable) {
            resizeOpts = Object.assign({}, GUI_WINDOWMANAGER_DEFAULTS.resizable);
            resizeOpts.bounds = this.container;
            resizeOpts.localStorageKey =
                storageOpts && storageOpts.key ? storageOpts.key : undefined;
            if (storageOpts && storageOpts.size === false) {
                resizeOpts.localStorageKey = undefined;
            }
        }
        if (resizeOpts && this.opts.width) {
            resizeOpts.initialSize = { width: this.opts.width };
            // Update the min-width variable if the provided width is smaller than the default.
            const currentMinWidth = Gooey._parseWidth(this.wrapper.style.getPropertyValue('--gooey-root_min-width'));
            if (currentMinWidth && this.opts.width < currentMinWidth) {
                this.wrapper.style.setProperty('--gooey-root_min-width', `${this.opts.width}px`);
            }
            this.folder.element.style.width = `${this.opts.width}px`;
        }
        // Use the provided window manager if it's an instance.
        if (options?._windowManager instanceof WindowManager) {
            const windowManager = options._windowManager;
            windowManager.add(this.folder.element, {
                id: this.id,
                resizable: resizeOpts,
                draggable: dragOpts,
            });
            return windowManager;
        }
        const windowManagerOpts = resolveOpts({
            ...GUI_WINDOWMANAGER_DEFAULTS,
            draggable: dragOpts,
            resizable: resizeOpts,
        }, WINDOWMANAGER_DEFAULTS);
        this._log
            .fn('_createWindowManager')
            .debug({ windowManagerOpts, options, opts: this.opts, dragOpts, resizeOpts });
        const windowManager = new WindowManager({
            ...windowManagerOpts,
            draggable: dragOpts,
            resizable: resizeOpts,
        });
        this._isWindowManagerOwner = true;
        const { window } = windowManager.add(this.folder.element, {
            // The rest of the options will be inherited from the WindowManager instance.
            id: this.id,
        });
        this.moveTo = window.moveTo;
        this.moveBy = window.moveBy;
        return windowManager;
    }
    _revealing = false;
    _repositionTimeout;
    refreshPosition() {
        this._log.fn('refreshPosition');
        requestAnimationFrame(() => {
            clearTimeout(this._repositionTimeout);
            this._repositionTimeout = setTimeout(() => {
                this._log.fn('refreshPosition').debug('Calling _updatePosition()');
                this._updatePosition();
                if (this._revealing) {
                    this._revealing = false;
                    // Now that we're in position and inputs are loaded, we can animate-in.
                    this.wrapper.style.visibility = 'visible';
                    this.folder.element.animate([{ opacity: 0 }, { opacity: 1 }], {
                        fill: 'none',
                        duration: 150,
                    });
                }
            }, 100);
        });
    }
    /**
     * Resolves and sets the position of the root Gooey {@link element}.
     * This function calculates the correct position based on the specified options,
     * container bounds, and storage settings. It then updates the position of the
     * draggable instance if necessary.d
     */
    _updatePosition() {
        if (!this.container || !this.wrapper)
            return;
        const rect = this.element.getBoundingClientRect();
        if (typeof this.opts.position === 'string') {
            const bounds = this.container.getBoundingClientRect();
            if (!bounds) {
                console.error('Invalid bounds:', this.opts.container);
                throw new Error('Invalid container.');
            }
            const placementPosition = place(rect, this.opts.position, {
                bounds,
                margin: this.opts.margin,
                offset: this.opts.offset,
            });
            const win = this.window;
            if (win?.draggableInstance) {
                win.draggableInstance.position = placementPosition;
            }
        }
    }
    /**
     * todo - Add the public resolved vars to `Themer` and remove this.
     * @internal
     */
    _getStyles = () => {
        return {
            '--fg-a': this.wrapper?.style.getPropertyValue('--gooey-fg-a'),
            '--bg-a': this.wrapper?.style.getPropertyValue('--gooey-bg-a'),
            '--bg-b': this.wrapper?.style.getPropertyValue('--gooey-bg-b'),
            '--font-a': this.wrapper?.style.getPropertyValue('--gooey-font-family'),
            '--shadow-lightness': this.wrapper?.style.getPropertyValue('--gooey-shadow-lightness'),
        };
    };
    dispose = () => {
        this._log.fn('dispose').debug(this);
        this.themer?.dispose();
        // this.themeEditor?.dispose()
        if (this._isWindowManagerOwner) {
            this.windowManager?.dispose();
        }
        this.presetManager.folder.dispose();
        this.elements.settingsFolder?.dispose();
        this.folder?.dispose();
    };
}

export { GUI_DEFAULTS, GUI_STORAGE_DEFAULTS, GUI_WINDOWMANAGER_DEFAULTS, Gooey };
//# sourceMappingURL=Gooey.js.map
