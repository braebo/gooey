import { deepMergeOpts } from "./shared/deepMergeOpts.js";
import vanilla_default from "./styles/themes/vanilla.js";
import scout_default from "./styles/themes/scout.js";
import flat_default from "./styles/themes/flat.js";
import gooey_css_default from "./styles/gooey-css.js";
import { nanoid } from "./shared/nanoid.js";
import { o } from "./shared/l.js";
import { Logger } from "./shared/logger.js";
import { select } from "./shared/select.js";
import { persist } from "./shared/persist.js";
import { place } from "./shared/place.js";
import { resolveOpts } from "./shared/resolveOpts.js";
import { WINDOWMANAGER_DEFAULTS, WindowManager } from "./shared/WindowManager.js";
import { create } from "./shared/create.js";
import { PresetManager } from "./PresetManager.js";
import { Themer } from "./styles/themer/Themer.js";
import settings_icon_default from "./svg/settings-icon.js";
import { GUI_VARS } from "./styles/GOOEY_VARS.js";
import { UndoManager } from "./UndoManager.js";
import { Folder } from "./Folder.js";

//#region src/Gooey.ts
const GUI_STORAGE_DEFAULTS = {
	__type: "GooeyStorageOptions",
	key: "default",
	closed: true,
	theme: true,
	presets: true,
	position: false,
	size: false
};
/**
* The default {@link WindowManagerOptions} for a {@link Gooey}'s
* {@link Gooey.windowManager|window manager}.  These are handled internally via the private
* {@link GooeyOptionsInternal._windowManager|gooey options}.
* @internal
*/
const GUI_WINDOWMANAGER_DEFAULTS = {
	__type: "WindowManagerOptions",
	preserveZ: false,
	zFloor: 0,
	bounds: void 0,
	obstacles: void 0,
	resizable: {
		grabberSize: 9,
		color: "var(--bg-d)",
		sides: ["right", "left"],
		corners: []
	},
	draggable: {
		bounds: void 0,
		classes: {
			default: "gooey-draggable",
			dragging: "gooey-dragging",
			cancel: "gooey-cancel",
			dragged: "gooey-dragged"
		}
	}
};
/**
* The default values for {@link GooeyOptions}.
*/
const GUI_DEFAULTS = {
	__type: "GooeyOptions",
	title: "gooey",
	storage: true,
	closed: false,
	position: "top-right",
	margin: 16,
	container: "body",
	theme: "vanilla",
	themeMode: "dark",
	themes: [
		vanilla_default,
		flat_default,
		scout_default
	],
	resizable: true,
	draggable: true,
	loadDefaultFont: true,
	settingsFolder: {
		closed: true,
		uiFolder: {
			closed: true,
			presetId: "gooey_settings__ui_folder"
		},
		presetsFolder: {
			closed: true,
			presetId: "gooey_settings__presets_folder"
		}
	},
	offset: {
		x: 0,
		y: 0
	}
};
/**
* Methods inherited from {@link Folder} to forward to the gooey.
* @remarks Gooey _used to_ extend {@link Folder}, but that caused more problems than it solved...
*/
const FORWARDED_METHODS = [
	"on",
	"add",
	"addMany",
	"addButtonGrid",
	"addSelect",
	"addButton",
	"addText",
	"addNumber",
	"addSwitch",
	"addColor",
	"addArray",
	"addElement",
	"addBezier",
	"bind",
	"bindMany",
	"bindButtonGrid",
	"bindSelect",
	"bindButton",
	"bindText",
	"bindNumber",
	"bindSwitch",
	"bindColor",
	"bindArray",
	"bindBezier",
	"open",
	"close",
	"show",
	"hide",
	"toggle",
	"toggleHidden"
];
/**
* A customizable GUI toolkit for quickly creating interactive controls panels.
*/
var Gooey = class Gooey {
	__type = "Gooey";
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
	windowManager;
	moveTo = () => {};
	moveBy = () => {};
	/**
	* `false` if this {@link Gooey}'s {@link WindowManager} belongs to an existing, external
	* instance _(i.e. a separate {@link Gooey} instance or custom {@link WindowManager})_.  The
	* {@link WindowManager} will be disposed when this {@link Gooey} is disposed.
	* @internal
	*/
	_isWindowManagerOwner = false;
	/** {@link GooeyOptions.settingsFolder}, with the `false` case narrowed away. */
	_settingsFolderOpts;
	_isThemerOwner = false;
	_log;
	_closedMap;
	static _initialized = false;
	constructor(titleOrOptions, options = {}) {
		if (!Gooey._initialized && globalThis.document) {
			Gooey._initialized = true;
			const sheet = new CSSStyleSheet();
			sheet.replaceSync(gooey_css_default);
			globalThis.document.adoptedStyleSheets.push(sheet);
		}
		const initialOptions = typeof titleOrOptions === "string" ? {
			...options,
			title: titleOrOptions
		} : titleOrOptions ?? {};
		const opts = deepMergeOpts([GUI_DEFAULTS, initialOptions], { concatArrays: false });
		opts.container ??= document.body;
		opts.offset ??= {
			x: 0,
			y: 0
		};
		if (initialOptions.offset?.x) opts.offset.x = initialOptions.offset.x;
		if (initialOptions.offset?.y) opts.offset.y = initialOptions.offset.y;
		if (typeof opts.storage === "object") opts.storage = Object.assign({}, GUI_STORAGE_DEFAULTS, opts.storage);
		let storageKey = "";
		const storageOpts = resolveOpts(opts.storage, GUI_STORAGE_DEFAULTS);
		if (!storageOpts) {} else {
			storageKey = `${storageOpts.key}::${opts.title?.toLowerCase().replaceAll(/\s/g, "-")}`;
			opts.storage = {
				...storageOpts,
				key: storageKey
			};
		}
		this.opts = opts;
		if (this.opts.parentGooey) {
			const internal = this.opts;
			internal._windowManager ??= this.opts.parentGooey.windowManager;
			internal._themer ??= this.opts.parentGooey.themer;
		}
		this._log = new Logger(`Gooey ${this.opts.title}`, { fg: "palevioletred" });
		if (this.opts.loadDefaultFont !== false) this._loadFonts();
		this.elements ??= {};
		this.container = select(this.opts.container)[0];
		this.elements.container = this.container;
		this.wrapper = create("div", {
			classes: ["gooey-wrapper"],
			style: { display: "contents" }
		});
		this.elements.wrapper = this.wrapper;
		this.wrapper.style.visibility = "hidden";
		this.container.append(this.wrapper);
		this._closedMap = persist(`${storageKey || `gooey::${this.opts.title}`}::closed-map`, {});
		this._closedMap;
		this.folder = new Folder({
			...this.opts,
			__type: "FolderOptions",
			container: this.wrapper,
			gooey: this,
			presetId: this.opts.title
		});
		for (const key of FORWARDED_METHODS) this[key] = this.folder[key].bind(this.folder);
		const handleUndoRedo = (e) => {
			if (globalThis.navigator?.userAgent?.match(/mac/i)) {
				if (e.metaKey && e.key === "z") {
					e.preventDefault();
					e.shiftKey ? this._undoManager.redo() : this._undoManager.undo();
				}
			} else if (e.ctrlKey) {
				if (e.key === "z") {
					e.preventDefault();
					this._undoManager.undo();
				}
				if (e.key === "y") {
					e.preventDefault();
					this._undoManager.redo();
				}
			}
		};
		removeEventListener("keydown", handleUndoRedo);
		addEventListener("keydown", handleUndoRedo);
		const settingsOpts = opts.settingsFolder === false ? void 0 : opts.settingsFolder;
		this._settingsFolderOpts = settingsOpts;
		let updateIcon = () => {};
		if (settingsOpts) {
			const settingsButton = this._createSettingsButton(this.folder.elements.toolbar.container);
			this.folder.elements.toolbar.settingsButton = settingsButton.button;
			updateIcon = settingsButton.updateIcon;
		}
		let settingsFolderClosed = GUI_DEFAULTS.settingsFolder.closed;
		if (typeof opts.storage === "object" && opts.storage.closed !== false) settingsFolderClosed = this._closedMap.value["gooey_settings"] ?? true;
		else if (settingsOpts?.closed) settingsFolderClosed = settingsOpts.closed;
		this.elements.settingsFolder = this.addFolder("gooey_settings_folder", {
			_headerless: true,
			...settingsOpts,
			closed: settingsFolderClosed,
			saveable: false,
			presetId: "gooey_settings",
			hidden: opts.settingsFolder === false
		});
		this.elements.settingsFolder.element.classList.add("gooey-settings-folder", "gooey-folder-alt");
		updateIcon();
		this.elements.settingsFolder.element.style.setProperty("order", "-99");
		const sharedThemer = this.opts._themer;
		if (sharedThemer) {
			this.themer = sharedThemer;
			sharedThemer.attach(this.wrapper);
		} else {
			this.themer = this._createThemer(this.elements.settingsFolder);
			this._isThemerOwner = true;
		}
		const reflect = () => {
			this.folder.element.setAttribute("theme", this.themer.theme.value.title);
			this.folder.element.setAttribute("mode", this.themer.activeMode);
		};
		this.folder.evm.add(this.themer.theme.subscribe(reflect));
		this.folder.evm.add(this.themer.mode.subscribe(reflect));
		this.presetManager = this._createPresetManager(this.elements.settingsFolder);
		this.windowManager ??= this._createWindowManager(this.opts, this.opts.storage);
		this._revealing = true;
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
		return new Map([...this.folder.allInputs.entries()].filter(([k]) => !k.match(/gooey_settings/) && k !== "theme" && k !== "mode"));
	}
	get window() {
		return this.windowManager?.windows.get(this.folder.element.id);
	}
	/**
	* The active theme's title.  Setting it switches the {@link themer} — shared by every
	* gooey under the same {@link GooeyOptions.parentGooey|parentGooey}.
	*/
	get theme() {
		return this.themer.theme.value.title;
	}
	set theme(title) {
		const theme = this.themer.getTheme(title);
		if (!theme) {
			this._log.error(`theme "${title}" not found`, { themes: this.themer.themes.value });
			return;
		}
		this.themer.theme.set(theme);
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
		return this.window?.draggableInstance?.position ?? {
			x: 0,
			y: 0
		};
	}
	set position(v) {
		this.window?.draggableInstance?.moveTo(v);
	}
	/**
	* The narrowest the gooey may be.  See {@link GooeyOptions.minWidth}.
	*/
	get minWidth() {
		return this._readRootVar("min-width");
	}
	set minWidth(v) {
		this._writeRootVar("min-width", v);
	}
	/**
	* The widest the gooey may be.  See {@link GooeyOptions.maxWidth}.
	*/
	get maxWidth() {
		return this._readRootVar("max-width");
	}
	set maxWidth(v) {
		this._writeRootVar("max-width", v);
	}
	/**
	* The tallest the gooey's content may grow before it scrolls.  See
	* {@link GooeyOptions.maxHeight}.
	*/
	get maxHeight() {
		return this._readRootVar("max-height");
	}
	set maxHeight(v) {
		this._writeRootVar("max-height", v);
	}
	_readRootVar(name) {
		const inline = this.folder.element.style.getPropertyValue(`--gooey-root_${name}`);
		if (inline) return inline.trim();
		if (!globalThis.window) return "";
		return getComputedStyle(this.folder.element).getPropertyValue(`--gooey-root_${name}`).trim();
	}
	_writeRootVar(name, value) {
		this.folder.element.style.setProperty(`--gooey-root_${name}`, typeof value === "number" ? `${value}px` : value);
	}
	revealTimeout;
	revealIdle;
	addFolder(title, options) {
		return this.folder.addFolder(title, {
			...options,
			gooey: this
		});
	}
	/**
	* Saves the current gooey state as a preset.
	*/
	save(title, id = nanoid(10), version) {
		this._log.fn("save").debug({
			title,
			id
		});
		return {
			__type: "GooeyPreset",
			__version: version ?? this.presetManager.__version,
			id,
			title,
			data: this.folder.save()
		};
	}
	/**
	* Loads a given preset into the gooey, updating all inputs.
	*/
	load(preset) {
		this._log.fn("load").debug({ preset });
		this.dirty = false;
		this._lockCommits(preset);
		this.folder.load(preset.data);
		Promise.resolve().then(() => this._unlockCommits());
	}
	_undoLock = false;
	_lockCommit = { from: void 0 };
	/**
	* Commits a change to the input's value to the undo manager.
	*/
	_commit(commit) {
		if (this._undoLock) {
			this._log.fn("commit").debug("LOCKED: prevented commit while locked");
			return;
		}
		this._log.fn("commit").debug("commited", commit);
		this._undoManager?.commit(commit);
	}
	/**
	* Prevents the input from registering undo history, storing the initial
	* for the eventual commit in {@link _unlockCommits}.
	*/
	_lockCommits = (from) => {
		this._undoManager.lockedExternally = true;
		this._lockCommit.from = from;
		this._log.fn(o("lock")).debug("commit", {
			from,
			lockCommit: this._lockCommit
		});
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
		this._log.fn(o("unlock")).debug("commit", {
			commit,
			lockCommit: this._lockCommit
		});
	};
	_loadFonts() {
		new FontFace("fredoka", `url(${encodeURI?.("https://cdn.jsdelivr.net/fontsource/fonts/fredoka:vf@latest/latin-wdth-normal.woff2")})`, {
			style: "normal",
			display: "auto",
			weight: "300 700",
			stretch: "75% 125%",
			unicodeRange: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
		}).load().then((font) => {
			document.fonts.add(font);
		});
		new FontFace("Inconsolata", `url(${encodeURI?.("https://cdn.jsdelivr.net/fontsource/fonts/inconsolata:vf@latest/latin-wdth-normal.woff2")})`, {
			style: "normal",
			display: "auto",
			weight: "300 700",
			stretch: "75% 125%",
			unicodeRange: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
		}).load().then((font) => {
			document.fonts.add(font);
		});
	}
	_createThemer(folder) {
		this._log.fn("createThemer").debug({ folder });
		let finalThemer = void 0;
		const themer = this.opts._themer;
		const themerOptions = {
			localStorageKey: this.opts.storage ? this.opts.storage.key + "::themer" : void 0,
			mode: this.opts.themeMode,
			autoInit: !this.themer,
			persistent: !!(this.opts.storage && this.opts.storage.theme),
			themes: this.opts.themes,
			theme: this.opts.themes.find((t) => t.title === this.opts.theme),
			vars: GUI_VARS
		};
		if (themer) finalThemer = themer;
		else finalThemer = new Themer(this.wrapper, themerOptions);
		const uiFolder = folder.addFolder("ui", Object.assign({}, GUI_DEFAULTS.settingsFolder.uiFolder, this._settingsFolderOpts?.uiFolder, { presetId: "gooey_settings__ui_folder" }));
		if (folder) {
			uiFolder.addSelect("theme", {
				value: finalThemer.theme.value,
				options: finalThemer.themes.value
			}).on("change", (v) => {
				finalThemer.theme.set(v);
			});
			const modeButtons = uiFolder.addButtonGrid("mode", [[
				"light",
				"dark",
				"system"
			].map((m) => ({
				text: m,
				onClick: () => finalThemer?.mode.set(m),
				active: () => finalThemer?.mode.value === m
			}))], {
				presetId: uiFolder.presetId + "__mode_buttons",
				applyActiveClass: true
			});
			uiFolder.evm.add(finalThemer.mode.subscribe((v) => {
				modeButtons.setActive(v);
			}));
		}
		return finalThemer;
	}
	_createSettingsButton(parent) {
		const button = create("button", {
			parent,
			classes: ["gooey-toolbar-item", "gooey-settings-button"],
			innerHTML: settings_icon_default,
			tooltip: {
				text: () => {
					return this.elements.settingsFolder?.closed.value ? "Open Settings" : "Close Settings";
				},
				placement: "right",
				offsetX: ".5rem",
				delay: 250,
				delayOut: 0,
				hideOnClick: true,
				style: this._getStyles
			}
		});
		const updateIcon = () => {
			this.folder.elements.toolbar.settingsButton?.classList.toggle("open", !this.elements.settingsFolder.closed.value);
		};
		button.addEventListener("click", () => {
			this.elements.settingsFolder.toggle();
			updateIcon();
			if (this.folder.closed) this.folder.open();
		});
		return {
			button,
			updateIcon
		};
	}
	_createPresetManager(settingsFolder) {
		const { presets, defaultPreset, storage } = this.opts;
		let localStorageKey;
		if (typeof storage === "object" && storage.presets) localStorageKey = storage.key + "::presets";
		let closed = GUI_DEFAULTS.settingsFolder.presetsFolder.closed;
		if (this._settingsFolderOpts?.presetsFolder?.closed) closed = this._settingsFolderOpts.presetsFolder.closed;
		return new PresetManager(this, settingsFolder, {
			presets,
			defaultPreset,
			localStorageKey,
			folderOptions: {
				...this._settingsFolderOpts?.presetsFolder,
				closed
			}
		});
	}
	/**
	* Writes {@link GooeyOptions.width|width} and the sizing limits onto `.gooey-root`.  An
	* explicit limit always wins; `width` only lowers a `min-width` still left at its default.
	*/
	_applyRootSizing() {
		const { width, minWidth, maxWidth, maxHeight } = this.opts;
		if (typeof minWidth !== "undefined") this.minWidth = minWidth;
		if (typeof maxWidth !== "undefined") this.maxWidth = maxWidth;
		if (typeof maxHeight !== "undefined") this.maxHeight = maxHeight;
		if (typeof width === "undefined") return;
		this.folder.element.style.width = `${width}px`;
		if (typeof minWidth === "undefined" && globalThis.window) {
			const currentMinWidth = parseFloat(getComputedStyle(this.folder.element).minWidth);
			if (currentMinWidth && width < currentMinWidth) this.minWidth = width;
		}
	}
	_createWindowManager(options, storageOpts) {
		if (this.windowManager) return this.windowManager;
		let dragOpts = void 0;
		if (this.opts.draggable) {
			dragOpts = Object.assign({}, GUI_WINDOWMANAGER_DEFAULTS.draggable, {
				handle: this.folder.elements.header,
				position: this.opts.position,
				localStorageKey: storageOpts && storageOpts.key ? storageOpts.key : void 0,
				bounds: this.container
			});
			if (storageOpts && storageOpts.position === false) dragOpts.localStorageKey = void 0;
		}
		let resizeOpts = void 0;
		if (this.opts.resizable) {
			resizeOpts = Object.assign({}, GUI_WINDOWMANAGER_DEFAULTS.resizable);
			resizeOpts.bounds = this.container;
			resizeOpts.localStorageKey = storageOpts && storageOpts.key ? storageOpts.key : void 0;
			if (storageOpts && storageOpts.size === false) resizeOpts.localStorageKey = void 0;
		}
		this._applyRootSizing();
		if (resizeOpts && this.opts.width) resizeOpts.initialSize = { width: this.opts.width };
		if (options?._windowManager instanceof WindowManager) {
			const windowManager$1 = options._windowManager;
			const { window: window$1 } = windowManager$1.add(this.folder.element, {
				id: this.id,
				resizable: resizeOpts ?? false,
				draggable: dragOpts ?? false,
				storageId: storageOpts ? storageOpts.key : void 0
			});
			this.moveTo = window$1.moveTo;
			this.moveBy = window$1.moveBy;
			return windowManager$1;
		}
		const windowManagerOpts = resolveOpts({
			...GUI_WINDOWMANAGER_DEFAULTS,
			draggable: dragOpts,
			resizable: resizeOpts
		}, WINDOWMANAGER_DEFAULTS);
		this._log.fn("_createWindowManager").debug({
			windowManagerOpts,
			options,
			opts: this.opts,
			dragOpts,
			resizeOpts
		});
		const windowManager = new WindowManager({
			...windowManagerOpts,
			draggable: dragOpts ?? false,
			resizable: resizeOpts ?? false
		});
		this._isWindowManagerOwner = true;
		const { window } = windowManager.add(this.folder.element, {
			id: this.id,
			storageId: storageOpts ? storageOpts.key : void 0
		});
		this.moveTo = window.moveTo;
		this.moveBy = window.moveBy;
		return windowManager;
	}
	_revealing = false;
	_repositionTimeout;
	refreshPosition() {
		this._log.fn("refreshPosition");
		requestAnimationFrame(() => {
			clearTimeout(this._repositionTimeout);
			this._repositionTimeout = setTimeout(() => {
				this._log.fn("refreshPosition").debug("Calling _updatePosition()");
				this._updatePosition();
				if (this._revealing) {
					this._revealing = false;
					this.wrapper.style.visibility = "visible";
					this.folder.element.animate([{ opacity: 0 }, { opacity: 1 }], {
						fill: "none",
						duration: 150
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
		if (!this.container || !this.wrapper) return;
		const rect = this.element.getBoundingClientRect();
		if (typeof this.opts.position === "string") {
			const stored = this.window?.draggableInstance?.opts.localStorageKey;
			if (stored && globalThis.localStorage?.getItem(stored) !== null) return;
			const bounds = this.container.getBoundingClientRect();
			if (!bounds) {
				console.error("Invalid bounds:", this.opts.container);
				throw new Error("Invalid container.");
			}
			const placementPosition = place(rect, this.opts.position, {
				bounds,
				margin: this.opts.margin,
				offset: this.opts.offset
			});
			const win = this.window;
			if (win?.draggableInstance) win.draggableInstance.position = placementPosition;
		}
	}
	/**
	* todo - Add the public resolved vars to `Themer` and remove this.
	* @internal
	*/
	_getStyles = () => {
		return {
			"--fg-a": this.wrapper?.style.getPropertyValue("--gooey-fg-a"),
			"--bg-a": this.wrapper?.style.getPropertyValue("--gooey-bg-a"),
			"--bg-b": this.wrapper?.style.getPropertyValue("--gooey-bg-b"),
			"--font-a": this.wrapper?.style.getPropertyValue("--gooey-font-family"),
			"--shadow-lightness": this.wrapper?.style.getPropertyValue("--gooey-shadow-lightness")
		};
	};
	dispose = () => {
		this._log.fn("dispose").debug(this);
		if (this._isThemerOwner) this.themer?.dispose();
		else this.themer?.detach(this.wrapper);
		if (this._isWindowManagerOwner) this.windowManager?.dispose();
		this.presetManager?.folder?.dispose();
		this.elements.settingsFolder?.dispose();
		this.folder?.dispose();
	};
};

//#endregion
export { GUI_DEFAULTS, GUI_STORAGE_DEFAULTS, GUI_WINDOWMANAGER_DEFAULTS, Gooey };
//# sourceMappingURL=Gooey.js.map