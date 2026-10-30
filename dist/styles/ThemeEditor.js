import { Logger } from "../shared/logger.js";
import { entries } from "../shared/object.js";
import { CSS_VAR_INNER } from "../shared/css-custom-properties.js";
import { isColor } from "../shared/color/color.js";
import { Gooey } from "../Gooey.js";

//#region src/styles/ThemeEditor.ts
/**
* A gooey window that edits the {@link targetGooey}'s themes.
*
* Edits land on a working copy of the active theme and preview live on every gooey the
* themer styles.  Saving writes the copy into {@link Themer.userThemes}, which persists it.
* A theme from code is never overwritten: saving one stores an edited copy beside it, since
* the code is its record.
*/
var ThemeEditor = class {
	gooey;
	_log;
	/** The working copy of the active theme; edits land here until {@link save}. */
	_draft;
	/** The title of the stored theme {@link _draft} was copied from. */
	_source;
	/** The title the next {@link save} stores the draft under. */
	_title;
	_dirty = false;
	_ready = false;
	/** {@link generate} is building inputs, which emit their starting values; those aren't edits. */
	_generating = false;
	/** The first {@link generate}, a tick after construction. */
	_firstGenerate;
	_themeInput;
	_titleInput;
	_actions;
	_varFolders = [];
	get folder() {
		return this.gooey.folder;
	}
	get themer() {
		return this.targetGooey.themer;
	}
	/** Whether the theme being edited is one of the {@link Themer.userThemes}. */
	get isUserTheme() {
		return this.themer.userThemes.value.some((t) => t.title === this._source);
	}
	/** Whether the draft has edits that aren't saved. */
	get dirty() {
		return this._dirty;
	}
	constructor(targetGooey) {
		this.targetGooey = targetGooey;
		this._log = new Logger(`ThemeEditor ${targetGooey.folder.title}`, {
			fg: "DarkCyan",
			deferred: false
		});
		if (!targetGooey.themer) throw new Error("Themer not found.");
		const opts = targetGooey.opts;
		this.gooey = new Gooey({
			title: "Theme Editor",
			container: targetGooey.container,
			storage: opts.storage ? { key: opts.storage.key } : false,
			_windowManager: targetGooey.windowManager,
			_themer: targetGooey.themer
		});
		this._themeInput = this.folder.addSelect("theme", this.themer.theme.value.title, { options: this.#titles() });
		this._themeInput.on("change", (title) => this.select(title));
		this._titleInput = this.folder.addText("title", this.themer.theme.value.title);
		this._titleInput.on("change", (v) => {
			if (v === this._title) return;
			this._title = v;
			this.#markDirty();
		});
		this._actions = this.folder.addButtonGrid("actions", [[
			{
				text: "new",
				onClick: () => this.create()
			},
			{
				text: "save",
				onClick: () => this.save(),
				disabled: () => !this._dirty
			},
			{
				text: "revert",
				onClick: () => this.revert(),
				disabled: () => !this._dirty
			},
			{
				text: "delete",
				onClick: () => this.delete(),
				disabled: () => !this.isUserTheme
			}
		]], { applyActiveClass: false });
		this.folder.evm.add(this.themer.themes.subscribe(() => {
			this._themeInput.options = this.#titles();
			this.#syncTitle();
		}));
		this.folder.evm.add(this.themer.theme.subscribe((t) => {
			this.gooey.folder.title = `${opts?.title} · ${t.title}`;
			if (t === this._draft) return;
			this.#load(t);
		}));
		this._firstGenerate = setTimeout(() => {
			this._ready = true;
			this.generate();
		}, 0);
	}
	/** Closes the editor; unsaved edits stop painting. */
	dispose() {
		clearTimeout(this._firstGenerate);
		if (this._dirty) this.revert();
		this.gooey.dispose();
	}
	/**
	* The vars of the theme being edited.
	*/
	get vars() {
		return this._draft.vars;
	}
	/**
	* Makes a theme the active one, dropping unsaved edits.
	*/
	select(title) {
		if (title === this._draft.title) return this;
		const theme = this.themer.getTheme(title);
		if (!theme) {
			this._log.error(`theme "${title}" not found`);
			return this;
		}
		this.themer.theme.set(theme);
		return this;
	}
	/**
	* Sets one var on the draft and previews it.
	* @param group - The theme's var group, i.e. `color` or `core`.
	* @param mode - `base`, `dark`, or `light`.
	* @param key - The var's key without the prefix, i.e. `bg-a`.
	*/
	setVar(group, mode, key, value) {
		const vars = this._draft.vars;
		vars[group] ??= {
			base: {},
			dark: {},
			light: {}
		};
		vars[group][mode] ??= {};
		vars[group][mode][key] = value;
		this.#markDirty();
		this.themer.theme.set(this._draft);
		return this;
	}
	/**
	* Adds a new user theme copied from the draft (unsaved edits included) and selects it.
	* @param title - Defaults to the title field; suffixed if taken.
	*/
	create(title = this._title) {
		this.themer.create({
			...this._draft,
			title
		});
		this.#adopt(this.themer.userThemes.value.at(-1));
		return this;
	}
	/**
	* Stores the draft in {@link Themer.userThemes}.  A user theme is updated in place (and
	* renamed, if the title field changed); a theme from code is stored as a copy.
	*/
	save() {
		const title = this._title;
		const source = this._source;
		const renamed = this.isUserTheme && title !== source;
		this.themer.create({
			...this._draft,
			title
		}, { overwrite: this.isUserTheme && !renamed });
		this.#adopt(this.themer.userThemes.value.at(-1));
		if (renamed) this.themer.delete(source);
		return this;
	}
	/**
	* Drops unsaved edits.
	*/
	revert() {
		const theme = this.themer.getTheme(this._source);
		if (theme) this.themer.theme.set(theme);
		return this;
	}
	/**
	* Deletes the theme being edited, if it's a user theme.  Themes from code can't be deleted.
	*/
	delete() {
		if (!this.isUserTheme) return this;
		this.themer.delete(this._source);
		if (this.themer.theme.value === this._draft) this.themer.theme.set(this.themer.themes.value[0]);
		return this;
	}
	/**
	* (Re)builds a folder of inputs per var group.
	*/
	generate = () => {
		this._generating = true;
		try {
			this.#generate();
		} finally {
			this._generating = false;
		}
	};
	#generate() {
		for (const folder of this._varFolders.splice(0)) folder.dispose();
		for (const [group, def] of entries(this._draft.vars)) {
			const groupFolder = this.folder.addFolder(group, { closed: true });
			this._varFolders.push(groupFolder);
			for (const [mode, vars] of entries(def)) {
				if (!vars || !Object.keys(vars).length) continue;
				const modeFolder = groupFolder.addFolder(mode, { closed: true });
				const nested = /* @__PURE__ */ new Map();
				for (const [key, value] of entries(vars)) {
					const i = key.lastIndexOf("_");
					let parent = modeFolder;
					if (i > 0) {
						const path = key.slice(0, i);
						if (!nested.has(path)) nested.set(path, modeFolder.addFolder(path, { closed: true }));
						parent = nested.get(path);
					}
					this.#addInput(parent, key.slice(i + 1), this.#display(value), (v) => {
						if (this._generating) return;
						if (isColor(v)) v = v.hex8String;
						this.setVar(group, mode, key, String(v));
					});
				}
			}
		}
	}
	/** Copies a stored theme into the draft and rebuilds the inputs. */
	#load(theme) {
		this._draft = structuredClone(theme);
		this._source = theme.title;
		this._title = theme.title;
		this._dirty = false;
		this.#syncTitle();
		this._actions.refresh();
		if (this._ready) this.generate();
	}
	/** Makes a just-saved theme the active one; the inputs already show its values. */
	#adopt(saved) {
		this._draft = structuredClone(saved);
		this._source = saved.title;
		this._title = saved.title;
		this._dirty = false;
		this.themer.theme.set(this._draft);
		this.#syncTitle();
		this._actions.refresh();
	}
	#markDirty() {
		this._dirty = true;
		this._actions.refresh();
	}
	#titles() {
		return this.themer.themes.value.map((t) => t.title);
	}
	/** Points the theme select and the title field at the draft. */
	#syncTitle() {
		if (!this._draft) return;
		const title = this._draft.title;
		this._themeInput.select({
			label: title,
			value: title
		});
		if (this._titleInput.value !== this._title) this._titleInput.set(this._title);
	}
	/** Shows a `var(--x)` reference as the value it currently resolves to. */
	#display(value) {
		return value.replace(CSS_VAR_INNER, (str, name) => this.targetGooey.wrapper.style.getPropertyValue(name).trim() || str);
	}
	#addInput(folder, title, value, onChange) {
		if (/^\d+(\.\d+)?$/.test(value)) {
			const v = parseFloat(value);
			const av = Math.abs(v);
			folder.addNumber(title, v, {
				min: Math.min(0, av),
				max: Math.max(0, av < 1 ? 1 : av * 3),
				step: av < 1 ? .01 : av < 10 ? .1 : 1
			}).on("change", (v$1) => onChange(v$1));
			return;
		}
		folder.add(title, value, { onChange });
	}
};

//#endregion
export { ThemeEditor };
//# sourceMappingURL=ThemeEditor.js.map