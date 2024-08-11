import { RenameSVG } from './svg/RenameSVG.js';
import { persist } from './shared/persist.js';
import { Tooltip } from './shared/Tooltip.js';
import { Logger } from './shared/logger.js';
import { nanoid } from './shared/nanoid.js';
import { isType } from './shared/isType.js';
import { SaveSVG } from './svg/SaveSVG.js';
import { state } from './shared/state.js';
import { r } from './shared/l.js';

class PresetManager {
    gooey;
    parentFolder;
    __type = Object.freeze('PresetManager');
    __version = '2'; // todo - this needs to be settable externally (added to GooeyOptions)
    defaultPreset;
    activePreset;
    presets;
    folder;
    _version;
    _defaultPresetId = 'gooey-default-preset';
    _defaultPresetTitle = 'default';
    _presetSnapshot;
    _presetsInput;
    _manageInput;
    _renamePresetButton;
    _initialized = false;
    _log;
    constructor(gooey, parentFolder, options) {
        this.gooey = gooey;
        this.parentFolder = parentFolder;
        this._log = new Logger(`PresetManager ${gooey.folder.title}`, { fg: 'slateblue' });
        this._log.fn('constructor').debug({ options, this: this });
        this.opts = options;
        this.opts.localStorageKey ??= 'gooey::presets';
        const storageKey = this.opts.localStorageKey;
        this._validateVersion(storageKey);
        this.activePreset = state(this.opts.defaultPreset ?? {}, {
            key: storageKey + '::active',
        });
        this._log.fn('constructor').debug('activePreset', this.activePreset.value);
        this.presets = state(this.opts.presets ?? [], {
            key: storageKey,
        });
        if (this.opts.autoInit !== false) {
            this.init();
        }
        if (Object.keys(this.activePreset.value).length &&
            this.activePreset.value.id !== this._defaultPresetId) {
            Promise.resolve().then(() => {
                this._log.fn('constructor').debug('loading active preset', this.activePreset.value);
                this.gooey.load(this.activePreset.value);
                this.gooey._undoManager.clear();
            });
        }
        else {
            this._log.fn('constructor').debug('No active preset found. Loading default.');
        }
    }
    opts;
    get defaultPresetIsActive() {
        return this.activePreset.value.id === this._defaultPresetId;
    }
    async init() {
        if (this.opts.disabled) {
            this._log.debug('Aborting initialization: disabled by options.');
            return;
        }
        this._initialized = true;
        await Promise.resolve();
        this.folder = await this.addGui(this.parentFolder, this.opts.defaultPreset);
        this._refresh();
        return this;
    }
    /**
     * Set the active preset.
     */
    set(value) {
        this._log.fn('set').debug({ value, this: this });
        this.activePreset.set(value);
    }
    _renamePreset(title) {
        this._log.fn('_renamePreset').debug({ this: this, title });
        if (!this._isInitialized())
            throw new Error('PresetManager not initialized.');
        const active = this.activePreset.value;
        this.presets.update(presets => {
            if (!active)
                throw new Error('No preset found.');
            if (active.id === this._defaultPresetId) {
                throw new Error('Cannot rename default preset.');
            }
            active.title = title;
            this.activePreset.set(active);
            return presets.map(p => (p.id === active.id ? active : p));
        });
        this._refresh();
    }
    _resolveUnusedTitle(title) {
        this._log.fn('resolveUnusedTitle').debug({ this: this, title });
        if (!this._isInitialized())
            throw new Error('PresetManager not initialized.');
        const presets = this.presets.value;
        let i = 0;
        let newTitle = title;
        while (presets.some(p => p.title === newTitle)) {
            i++;
            newTitle = title + ` (${i})`;
        }
        return newTitle;
    }
    _resolveDefaultPreset() {
        const newDefaultPreset = this.gooey.save(this._defaultPresetTitle, this._defaultPresetId, this.__version);
        const existingIndex = this.presets.value.findIndex(p => p.id === this._defaultPresetId);
        if (existingIndex === -1) {
            this.presets.push(newDefaultPreset);
        }
        else {
            this.presets.update(presets => {
                presets[existingIndex] = newDefaultPreset;
                return presets;
            });
        }
        return newDefaultPreset;
    }
    async addGui(parentFolder, defaultPreset) {
        this._log.fn('add').debug({ this: this, parentFolder, defaultPreset });
        if (!this._isInitialized())
            throw new Error('PresetManager not initialized.');
        const presetsFolder = parentFolder.addFolder('presets', {
            ...this.opts.folderOptions,
            saveable: false,
            // @ts-expect-error - @internal
            gooey: this.gooey,
        });
        presetsFolder.element.classList.add('gooey-folder-alt');
        // Fully desaturate the presets folder's header connector to svg.
        presetsFolder.on('mount', () => {
            presetsFolder.graphics.connector.svg.style.setProperty('filter', 'saturate(0.1)');
            presetsFolder.graphics.icon.style.setProperty('filter', 'saturate(0)');
        });
        this.defaultPreset = defaultPreset ?? this._resolveDefaultPreset();
        if (!Object.keys(this.activePreset.value).length) {
            this._log.fn('add').debug('No active preset found. Setting active to default.');
            this.activePreset.set(this.defaultPreset);
        }
        if (!this.activePreset.value) {
            throw new Error('No active preset.');
        }
        if (!this.activePreset.value.id) {
            throw new Error('No active preset id.');
        }
        /**
         * Download the active preset as a JSON file.
         */
        const download = (preset) => {
            // const preset = this.activePreset.value
            const title = Array.isArray(preset)
                ? this.gooey.folder.title + ' presets'
                : preset.title;
            const blob = new Blob([JSON.stringify(preset, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };
        const upload = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files?.[0];
                if (!file)
                    return;
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const text = e.target?.result;
                    const data = JSON.parse(text);
                    if (Array.isArray(data)) {
                        for (const preset of data) {
                            if (isType(preset, 'GooeyPreset')) {
                                this.put(preset);
                            }
                            else {
                                console.warn('Invalid preset:', preset);
                            }
                        }
                    }
                    else {
                        if (isType(data, 'GooeyPreset')) {
                            this.put(data);
                        }
                        else {
                            console.warn('Invalid preset:', data);
                        }
                    }
                    this._refresh();
                };
                reader.readAsText(file);
            };
            input.click();
        };
        const createIcon = (name, contents) => 
        /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="gooey-icon gooey-icon-${name}">${contents}</svg>`;
        //? Preset Management Buttons
        this._manageInput = presetsFolder.addButtonGrid('', [
            [
                {
                    text: 'update',
                    id: 'update',
                    onClick: () => {
                        const { id, title } = this.activePreset.value;
                        const current = this.gooey.save(title, id, this.__version);
                        this.put(current);
                    },
                    disabled: () => this.defaultPresetIsActive,
                },
                {
                    text: 'delete',
                    onClick: () => {
                        let index = undefined;
                        this.presets.update(presets => {
                            index = presets.findIndex(p => p.id === this.activePreset.value.id);
                            presets.splice(index, 1);
                            return presets;
                        });
                        this.activePreset.set(this.presets.value[index ?? 0] ?? this.defaultPreset);
                        this._refresh();
                    },
                    disabled: () => this.defaultPresetIsActive,
                },
                {
                    text: createIcon('copy', 
                    /*html*/ `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>`),
                    id: 'copy',
                    tooltip: {
                        text: 'Copy',
                        delay: 0,
                        placement: 'bottom',
                        hideOnClick: true,
                        // @ts-expect-error - @internal
                        style: this.gooey?._getStyles,
                    },
                    style: { maxWidth: '1.5rem', padding: '0.3rem' },
                    onClick: () => {
                        navigator.clipboard?.writeText(JSON.stringify(this.activePreset.value, null, 2));
                    },
                    disabled: () => this.defaultPresetIsActive,
                },
                {
                    text: createIcon('paste', 
                    /*html*/ `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>`),
                    id: 'paste',
                    tooltip: {
                        text: 'Paste',
                        delay: 0,
                        placement: 'bottom',
                        hideOnClick: true,
                        // @ts-expect-error - @internal
                        style: this.gooey?._getStyles,
                    },
                    style: { maxWidth: '1.5rem', padding: '0.3rem' },
                    onClick: async ({ button }) => {
                        button.disabled = true;
                        try {
                            const text = await navigator.clipboard.readText();
                            console.log(text);
                            if (text) {
                                const preset = JSON.parse(text);
                                if (typeof preset === 'object' &&
                                    preset.__type === 'GooeyPreset') {
                                    this.put(preset);
                                }
                            }
                        }
                        catch (e) {
                            // todo - need a toast / err msg / overlay for errors
                            console.error(e);
                        }
                        button.disabled = false;
                    },
                    disabled: () => this.defaultPresetIsActive,
                },
                {
                    text: createIcon('download', 
                    /*html*/ `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`),
                    id: 'download',
                    tooltip: {
                        text: 'Download',
                        delay: 0,
                        placement: 'bottom',
                        hideOnClick: true,
                        // @ts-expect-error - @internal
                        style: this.gooey?._getStyles,
                    },
                    style: { maxWidth: '1.5rem', padding: '0.3rem' },
                    onClick: () => {
                        download(this.activePreset.value);
                    },
                    disabled: () => this.defaultPresetIsActive,
                },
                {
                    text: createIcon('download-all', 
                    /*html*/ `<path stroke-linecap="round" stroke-linejoin="round" d="M21 14v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 11v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 17v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path stroke-linecap="round" stroke-linejoin="round" d="m7 8 5 5 5-5" /><path  stroke-linecap="round" stroke-linejoin="round" d="M12 13V1" />`),
                    id: 'download-all',
                    tooltip: {
                        text: 'Download All',
                        delay: 0,
                        placement: 'bottom',
                        hideOnClick: true,
                        // offsetY: '0.1rem',
                        // @ts-expect-error - @internal
                        style: this.gooey?._getStyles,
                    },
                    style: { maxWidth: '1.5rem', padding: '0.3rem' },
                    onClick: () => {
                        download(this.presets.value);
                    },
                    disabled: () => this.presets.value.length <= 1,
                },
                {
                    id: 'upload',
                    text: createIcon('upload', 
                    /*html*/ `<path stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path stroke-linecap="round" stroke-linejoin="round" d="m17 8-5-5-5 5" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v12" />`),
                    tooltip: {
                        text: 'Upload',
                        delay: 0,
                        placement: 'bottom',
                        hideOnClick: true,
                        // @ts-expect-error - @internal
                        style: this.gooey?._getStyles,
                    },
                    style: { maxWidth: '1.5rem', padding: '0.3rem' },
                    onClick: () => {
                        upload();
                    },
                },
            ],
        ], {
            order: 1,
            resettable: false,
        });
        //? Presets Select Input
        this._presetsInput = presetsFolder.addSelect('', this.presets.value, {
            labelKey: 'title',
            order: 0,
            value: this.activePreset.value,
            resettable: false,
        });
        let first = true;
        this._presetsInput.on('change', ({ value }) => {
            if (first) {
                this._log
                    .fn("_presetsInput.on('change')")
                    .debug('Skipping initial change.', { value, this: this });
                first = false;
                return;
            }
            this._log.fn('_presetsInput.on(change)').debug({ value, this: this });
            this.gooey.load(value);
            this.activePreset.set(value);
            this._refreshInputs();
        });
        this._presetsInput.on('open', () => {
            this._log.fn('_presetsInput.on(open)').debug();
            this._presetSnapshot = this.gooey.save('__snapshot__');
        });
        this._presetsInput.on('cancel', () => {
            this._log.fn('_presetsInput.on(cancel)').debug();
            if (this._presetSnapshot) {
                this.gooey.load(this._presetSnapshot);
                this._refreshInputs();
            }
        });
        //? New Preset Button
        const newPresetButton = new SaveSVG();
        newPresetButton.element.tooltip = new Tooltip(newPresetButton.element, {
            text: 'Save',
            delay: 0,
            placement: 'bottom',
            hideOnClick: true,
        });
        this._presetsInput.listen(newPresetButton.element, 'click', () => {
            this._log.fn('newPresetButton.on(click)').debug();
            this.put();
        });
        //? Rename Preset Button
        this._renamePresetButton = new RenameSVG();
        this._renamePresetButton.element.tooltip = new Tooltip(this._renamePresetButton.element, {
            delay: 0,
            placement: 'bottom',
            hideOnClick: true,
            text: () => {
                if (this._renamePresetButton.element.classList.contains('active')) {
                    return ``;
                }
                else {
                    return this.defaultPresetIsActive ? `Can't rename default preset` : `Rename`;
                }
            },
            // @ts-expect-error - @internal
            style: this.gooey._getStyles,
        });
        this._presetsInput.listen(this._renamePresetButton.element, 'click', this._toggleRename);
        this._presetsInput.elements.content.prepend(this._renamePresetButton.element);
        this._presetsInput.elements.content.prepend(newPresetButton.element);
        // Refresh the disabled state.
        this._refreshInputs();
        return presetsFolder;
    }
    /**
     * Updates a preset if it exists, adds it as a new preset if not, or creates a new one from the
     * current state and adds it if none is provided.
     */
    put(
    /**
     * The preset to update or add.  If not provided, a new preset is created from the current
     * state.
     */
    preset) {
        this._log.fn('saveNewPreset');
        if (!this._isInitialized()) {
            throw new Error('PresetManager not initialized.');
        }
        if (!this._presetsInput) {
            throw new Error('No select input.');
        }
        const initialPresetCount = this.presets.value.length;
        preset ??= this.gooey.save(this._resolveUnusedTitle('preset'), nanoid(), this.__version);
        const existing = this.presets.value.find(p => p.id === preset.id);
        if (!existing) {
            this._log.fn('put').debug('pushing preset:', { preset, existing });
            this.presets.push(preset);
        }
        else {
            this._log.fn('put').debug('preset exists. replacing with:', { preset, existing });
            this.presets.update(presets => {
                const index = presets.findIndex(p => p.id === preset.id);
                presets[index] = preset;
                return presets;
            });
        }
        this.set(preset);
        this._refresh();
        if (initialPresetCount === 1) {
            this._enableRename(false);
        }
    }
    /**
     * Delete a preset.
     */
    delete(preset) {
        this._log.fn('delete').debug({ this: this, preset });
        if (!this._isInitialized()) {
            throw new Error('PresetManager not initialized.');
        }
        const id = typeof preset === 'string' ? preset : preset.id;
        this.presets.update(presets => {
            const index = presets.findIndex(p => p.id === id);
            if (index === -1) {
                throw new Error(r('Error deleting preset:') + ' Preset not found.');
            }
            presets.splice(index, 1);
            return presets;
        });
        this.activePreset.set(this.presets.value[0] ?? this.defaultPreset);
    }
    _isInitialized() {
        return this._initialized;
    }
    _toggleRename = () => {
        if (this._presetsInput.select.elements.selected.getAttribute('contenteditable')) {
            this._handleRename();
        }
        else {
            this._enableRename();
        }
    };
    /**
     * When the rename button is active, clicking it to disable triggers a blur event which
     * disables it immediately before the click event is triggered, re-enabling it.
     *
     * The latch and timer prevent that from happening.
     */
    _blurLatch = false;
    _blurLatchTimer;
    /**
     * Disables the dropdown, making the select's text editable.
     */
    _enableRename = (cursorToEnd = true) => {
        this._log.fn('_enableRename').debug({ this: this });
        const el = this._presetsInput.select.elements.selected;
        if (this.defaultPresetIsActive) {
            this._log.warn('Cannot rename default preset.');
            return;
        }
        if (this._blurLatch) {
            this._blurLatch = false;
            clearTimeout(this._blurLatchTimer);
            return;
        }
        this._renamePresetButton.element.classList.add('active');
        this._presetsInput.select.disableClicks = true;
        el.setAttribute('contenteditable', 'true');
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        if (cursorToEnd) {
            range.collapse(false);
        }
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        // Handle rename / cancel.
        this.folder.evm.listen(el, 'blur', this._handleRename, {}, 'preset-manager-rename');
        this.folder.evm.listen(window, 'keydown', this._handleKeydown, {}, 'preset-manager-rename');
    };
    _handleRename = (e) => {
        this._log.fn('_disableRename').debug({ e, this: this });
        this._presetsInput.select.disableClicks = false;
        this._presetsInput.select.elements.selected.removeAttribute('contenteditable');
        this._renamePresetButton.element.classList.remove('active');
        this.folder.evm.clearGroup('preset-manager-rename');
        if (e?.type === 'blur') {
            // If this is a click event targetting the rename button, trigger the latch.
            this._blurLatch = true;
            clearTimeout(this._blurLatchTimer);
            setTimeout(() => {
                this._blurLatch = false;
            }, 300);
            // Commit the rename if the title has changed.
            const text = e.target?.textContent ?? '';
            if (text !== this.activePreset.value.title) {
                this._renamePreset(text);
            }
        }
    };
    _handleKeydown = (e) => {
        this._log.fn('_handleKeydown').debug({ key: e.key, e, this: this });
        if (e.key === 'Enter') {
            e.preventDefault();
            this._handleRename();
        }
        if (e.key === 'Escape') {
            this._handleRename();
        }
    };
    _validateVersion(key) {
        // Make sure we get the current version unmodified first.
        let localVersion = null;
        try {
            localVersion = JSON.parse(localStorage.getItem(key + '::version') ?? '');
        }
        catch (e) { }
        // Initialize the persistant version.
        this._version = persist(key + '::version', this.__version);
        // If the version is different, remove presets from storage.
        if (localVersion !== this.__version) {
            localStorage.removeItem(key);
            this._version.set(this.__version);
        }
    }
    _refreshInputs() {
        const disableRename = this.defaultPresetIsActive;
        this._renamePresetButton.element.classList.toggle('disabled', disableRename);
        this._renamePresetButton.element.toggleAttribute('disabled', disableRename);
        this._manageInput.refresh();
        this._log.fn('_refreshInputs').debug({ disableRename, this: this });
    }
    /**
     * Refresh the presets input.
     */
    _refresh() {
        this._log.fn('_refresh').debug('Refreshing options and setting input.', { this: this });
        this._presetsInput.options = this.presets.value.map(o => ({ label: o.title, value: o }));
        const activePreset = this.activePreset.value;
        this._presetsInput.set({ label: activePreset.title, value: activePreset });
        this._refreshInputs();
    }
    dispose() {
        this._initialized = false;
        this._presetsInput.dispose();
        this._renamePresetButton.element.tooltip.dispose();
        this._renamePresetButton.element.remove;
    }
}

export { PresetManager };
//# sourceMappingURL=PresetManager.js.map
