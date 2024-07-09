import { __decorate, __metadata } from './node_modules/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.18.1_tslib@2.6.3_typescript@5.5.3/node_modules/tslib/tslib.es6.js';
import theme_default from './styles/themes/default.js';
import theme_scout from './styles/themes/scout.js';
import theme_flat from './styles/themes/flat.js';
import style from './styles/gui.scss.js';
import { WindowManager, WINDOWMANAGER_DEFAULTS } from './shared/WindowManager.js';
import { deepMergeOpts } from './shared/deepMergeOpts.js';
import { styled } from './shared/decorators/styled.js';
import { resolveOpts } from './shared/resolveOpts.js';
import { PresetManager } from './PresetManager.js';
import { Themer } from './styles/themer/Themer.js';
import settingsIcon from './svg/settings-icon.js';
import { GUI_VARS } from './styles/GUI_VARS.js';
import { UndoManager } from './UndoManager.js';
import { select } from './shared/select.js';
import { nanoid } from './shared/nanoid.js';
import { Logger } from './shared/logger.js';
import { create } from './shared/create.js';
import { state } from './shared/state.js';
import { place } from './shared/place.js';
import { Folder } from './Folder.js';
import { o } from './shared/l.js';

var Gui_1;
//⌟
//· Constants ····················································································¬
const GUI_STORAGE_DEFAULTS = {
    __type: 'GuiStorageOptions',
    key: 'fracgui',
    closed: true,
    theme: true,
    presets: true,
    position: false,
    size: false,
};
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
            default: 'fracgui-draggable',
            dragging: 'fracgui-dragging',
            cancel: 'fracgui-cancel',
            dragged: 'fracgui-dragged',
        },
    },
};
const GUI_DEFAULTS = {
    __type: 'GuiOptions',
    title: 'gui',
    storage: false,
    closed: false,
    position: 'top-right',
    margin: 16,
    container: 'body',
    theme: 'default',
    themeMode: 'dark',
    themes: [theme_default, theme_flat, theme_scout],
    resizable: true,
    draggable: true,
    loadDefaultFont: true,
};
//⌟
/**
 * The root Gui instance.  This is the entry point for creating
 * a gui.  You can create multiple root guis, but each gui
 * can only have one root.
 */
let Gui = class Gui {
    static { Gui_1 = this; }
    __type = 'Gui';
    id = nanoid();
    folder;
    static style = style;
    /**
     * The initial options passed to the gui.
     */
    opts;
    /**
     * Whether the gui root folder is currently collapsed.
     */
    closed;
    /**
     * The {@link PresetManager} instance for the gui.
     */
    presetManager;
    /**
     * Whether any of the inputs have been changed from their default values in the active preset.
     */
    dirty = false;
    wrapper;
    container;
    settingsFolder;
    static settingsFolderTitle = 'fracgui-settings-folder';
    /**
     * The {@link UndoManager} instance for the gui, handling undo/redo functionality.
     * @internal
     */
    _undoManager = new UndoManager();
    themer;
    // themeEditor?: ThemeEditor
    windowManager;
    /**
     * `false` if this {@link Gui}'s {@link WindowManager} belongs to an existing, external
     * instance _(i.e. a separate {@link Gui} instance or custom {@link WindowManager})_.  The
     * {@link WindowManager} will be disposed when this {@link Gui} is disposed.
     * @internal
     */
    _isWindowManagerOwner = false;
    /**
     * The time of the gui's creation.
     * @internal
     */
    _birthday = Date.now();
    /**
     * The number of milliseconds post-instantiation to watch for adders for repositioning.
     * @internal
     */
    _honeymoon = 1000;
    _theme;
    _log;
    // Forwarding the Folder API...
    on;
    addFolder(title, options) {
        if (this._honeymoon && this._birthday - Date.now() < 1000) {
            this._honeymoon = false;
            this._reveal(true);
        }
        return this.folder.addFolder(title, {
            ...options,
            // @ts-expect-error @internal
            gui: this,
        });
    }
    add;
    addMany;
    addButtonGrid;
    addSelect;
    addButton;
    addText;
    addNumber;
    addSwitch;
    addColor;
    constructor(options) {
        //· Setup ················································································¬
        const opts = deepMergeOpts([GUI_DEFAULTS, options ?? {}], {
            concatArrays: false,
        });
        opts.container ??= document.body;
        let reposition = false;
        /** Resolve storage separately since {@link GUI_DEFAULTS.storage} is `false`.  */
        if (typeof opts.storage === 'object') {
            opts.storage = Object.assign({}, GUI_STORAGE_DEFAULTS, opts.storage);
        }
        const storageOpts = resolveOpts(opts.storage, GUI_STORAGE_DEFAULTS);
        if (storageOpts) {
            opts.storage = {
                ...storageOpts,
                key: `${storageOpts.key}::${opts.title?.toLowerCase().replaceAll(/\s/g, '-')}`,
            };
            // When storage is on, repositioning after animating-in is disabled unless this is the
            // _very_ first page load.
            if (!(`${opts.storage.key}::wm::0::position` in localStorage)) {
                reposition = true;
            }
        }
        else {
            reposition = true;
        }
        this.opts = opts;
        this._log = new Logger(`Gui ${this.opts.title}`, { fg: 'palevioletred' });
        this._log.fn('constructor').info({ options, opts });
        if (this.opts.loadDefaultFont !== false) {
            const ff = new FontFace('fredoka', `url(${encodeURI?.('https://cdn.jsdelivr.net/fontsource/fonts/fredoka:vf@latest/latin-wdth-normal.woff2')})`, {
                style: 'normal',
                display: 'swap',
                weight: '300 700',
                stretch: '75% 125%',
                unicodeRange: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
            });
            ff.load().then(font => {
                // @ts-expect-error - ¯\_(ツ)_/¯
                document.fonts.add(font);
            });
        }
        this.container = select(this.opts.container)[0];
        this.wrapper = create('div', {
            classes: ['fracgui-wrapper'],
            style: {
                display: 'contents',
            },
            parent: this.container,
        });
        this.folder = new Folder({
            ...this.opts,
            __type: 'FolderOptions',
            container: this.wrapper,
            // @ts-expect-error @internal
            gui: this,
        });
        // Not stoked about this.
        this.on = this.folder.on.bind(this.folder);
        // this.addFolder = this.folder.addFolder.bind(this.folder)
        this.add = this.folder.add.bind(this.folder);
        this.addMany = this.folder.addMany.bind(this.folder);
        this.addButtonGrid = this.folder.addButtonGrid.bind(this.folder);
        this.addSelect = this.folder.addSelect.bind(this.folder);
        this.addButton = this.folder.addButton.bind(this.folder);
        this.addText = this.folder.addText.bind(this.folder);
        this.addNumber = this.folder.addNumber.bind(this.folder);
        this.addSwitch = this.folder.addSwitch.bind(this.folder);
        this.addColor = this.folder.addColor.bind(this.folder);
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
        //⌟
        this.closed = state(!!this.opts.closed, {
            key: this.opts.storage ? `${this.opts.storage.key}::closed` : undefined,
        });
        this.folder.elements.toolbar.settingsButton = this._createSettingsButton(this.folder.elements.toolbar.container);
        this.settingsFolder = this.addFolder(Gui_1.settingsFolderTitle, {
            closed: false,
            // @ts-expect-error @internal
            _headerless: true,
        });
        this.settingsFolder.element.classList.add('fracgui-folder-alt');
        this.themer = this.opts._themer ?? this._createThemer(this.settingsFolder);
        this.theme = this.opts.theme;
        this.presetManager = this._createPresetManager(this.settingsFolder);
        this.windowManager ??= this._createWindowManager(this.opts, this.opts.storage);
        // Give the user a chance to add folders / inputs before positioning.
        this._reveal(reposition);
        // setTimeout(this.settingsFolder.close)
        return this;
    }
    async _reveal(reposition) {
        // In case dispose() was called before this resolved...
        if (!this.container)
            return;
        // Append a non-animating, full-size clone to get the proper rect.
        const ghost = this.wrapper.cloneNode(true);
        ghost.style.visibility = 'hidden';
        this.container.prepend(ghost);
        // This is the only way to get the correct future rect afaik 😅
        const rect = ghost.children[0].getBoundingClientRect();
        ghost.remove();
        if (typeof this.opts.position === 'string') {
            const placementPosition = place(rect, this.opts.position, {
                bounds: this.opts.container,
                margin: this.opts.margin,
            });
            // Use the rect to correct the window manager's positioning when storage is off.
            if (reposition || (this.opts.storage && this.opts.storage.position === false)) {
                const win = this.windowManager?.windows.get(this.folder.element.id);
                if (win?.draggableInstance) {
                    win.draggableInstance.position = placementPosition;
                }
            }
        }
        // Now that we're in position and inputs are loaded, we can animate-in.
        this.container.appendChild(this.wrapper);
        this.folder.element.animate([{ opacity: 0 }, { opacity: 1 }], {
            fill: 'none',
            duration: 400,
        });
    }
    _createPresetManager(settingsFolder) {
        const { presets, defaultPreset, storage } = this.opts;
        let localStorageKey;
        if (typeof storage === 'object' && storage.presets) {
            localStorageKey = storage.key + '::presets';
        }
        return new PresetManager(this, settingsFolder, {
            presets,
            defaultPreset,
            localStorageKey,
        });
    }
    _createWindowManager(options, storageOpts) {
        if (this.windowManager)
            return this.windowManager; // ??
        let dragOpts = undefined;
        if (this.opts.draggable) {
            dragOpts = Object.assign({}, GUI_WINDOWMANAGER_DEFAULTS.draggable);
            dragOpts.handle = this.folder.elements.header;
            dragOpts.position = this.opts.position;
            dragOpts.localStorageKey = storageOpts && storageOpts.key ? storageOpts.key : undefined;
            dragOpts.bounds = this.container;
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
            .info({ windowManagerOpts, options, opts: this.opts, dragOpts, resizeOpts });
        const windowManager = new WindowManager({
            ...windowManagerOpts,
            draggable: dragOpts,
            resizable: resizeOpts,
        });
        this._isWindowManagerOwner = true;
        windowManager.add(this.folder.element, {
            id: this.id,
            // The rest of the options will inherit from the WindowManager instance.
        });
        return windowManager;
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
     * Saves the current gui state as a preset.
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
    id = nanoid(10)) {
        const preset = {
            __type: 'GuiPreset',
            __version: 0,
            id,
            title,
            data: this.folder.save(),
        };
        return preset;
    }
    /**
     * Loads a given preset into the gui, updating all inputs.
     */
    load(preset) {
        this._log.fn('load').info({ preset });
        // todo - this isn't working, it's being unset immediately somewhere...
        this.dirty = false;
        this.lockCommits(preset);
        this.folder.load(preset.data);
        Promise.resolve().then(() => this.unlockCommits());
    }
    _undoLock = false;
    lockCommit = { from: undefined };
    /**
     * Commits a change to the input's value to the undo manager.
     */
    commit(commit) {
        if (this._undoLock) {
            this._log.fn('commit').info('LOCKED: prevented commit while locked');
            return;
        }
        this._log.fn('commit').info('commited', commit);
        this._undoManager?.commit(commit);
    }
    /**
     * Prevents the input from registering undo history, storing the initial
     * for the eventual commit in {@link unlockCommits}.
     */
    lockCommits = (from) => {
        // this._undoLock = true
        this._undoManager.lockedExternally = true;
        this.lockCommit.from = from;
        this._log.fn(o('lock')).info('commit', { from, lockCommit: this.lockCommit });
    };
    /**
     * Unlocks commits and saves the current commit stored in lock.
     */
    unlockCommits = (commit) => {
        commit ??= {};
        commit.target ??= this;
        commit.from ??= this.lockCommit.from;
        // this._undoLock = false
        this._undoManager.lockedExternally = false;
        this.commit(commit);
        this._log.fn(o('unlock')).info('commit', { commit, lockCommit: this.lockCommit });
    };
    _createThemer(folder) {
        this._log.fn('createThemer').info({ folder });
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
        this.folder.evm.add(finalThemer.mode.subscribe(() => {
            if (this.settingsFolder) ;
        }));
        const uiFolder = folder.addFolder('ui', { closed: true });
        // Fully desaturate the ui folder's header connector to svg.
        uiFolder.on('mount', () => {
            uiFolder.graphics?.connector?.svg.style.setProperty('filter', 'saturate(0.1)');
            uiFolder.graphics?.icon.style.setProperty('filter', 'saturate(0)');
        });
        if (folder) {
            uiFolder.addSelect({
                title: 'theme',
                labelKey: 'title',
                options: finalThemer.themes.value,
                binding: {
                    target: finalThemer,
                    key: 'theme',
                },
            });
            uiFolder.addButtonGrid({
                title: 'mode',
                activeOnClick: true,
                value: [
                    ['light', 'dark', 'system'].map(m => ({
                        text: m,
                        onClick: () => finalThemer?.mode.set(m),
                        active: () => finalThemer?.mode.value === m,
                    })),
                ],
            });
            // }
        }
        return finalThemer;
    }
    _createSettingsButton(parent) {
        const button = create('button', {
            parent,
            classes: ['fracgui-toolbar-item', 'fracgui-settings-button'],
            innerHTML: settingsIcon,
            tooltip: {
                text: () => {
                    return this.settingsFolder?.closed.value ? 'Open Settings' : 'Close Settings';
                },
                placement: 'left',
                delay: 750,
                delayOut: 0,
                hideOnClick: true,
            },
        });
        button.addEventListener('click', () => {
            this.settingsFolder.toggle();
            this.folder.elements.toolbar.settingsButton?.classList.toggle('open', !this.settingsFolder.closed.value);
        });
        return button;
    }
    dispose = () => {
        this._log.fn('dispose').info(this);
        this.themer?.dispose();
        // this.themeEditor?.dispose()
        if (this._isWindowManagerOwner) {
            this.windowManager?.dispose();
            this.container?.remove();
        }
        this.settingsFolder?.dispose();
        this.folder?.dispose();
    };
};
Gui = Gui_1 = __decorate([
    styled,
    __metadata("design:paramtypes", [Object])
], Gui);

export { GUI_DEFAULTS, GUI_STORAGE_DEFAULTS, GUI_WINDOWMANAGER_DEFAULTS, Gui };
//# sourceMappingURL=Gui.js.map
