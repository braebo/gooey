import { Resizable, RESIZABLE_DEFAULTS } from './resizable.js';
import { Draggable, DRAGGABLE_DEFAULTS } from './draggable.js';
import { EventManager } from './EventManager.js';
import { resolveOpts } from './resolveOpts.js';
import { Logger } from './logger.js';
import { nanoid } from './nanoid.js';
import { isObject } from './is.js';
import { state } from './state.js';

const WINDOWMANGER_STORAGE_DEFAULTS = {
    __type: 'WindowManagerStorageOptions',
    key: 'window-manager',
    size: true,
    position: true,
    debounce: 50,
};
const WINDOWMANAGER_DEFAULTS = {
    __type: 'WindowManagerOptions',
    resizable: RESIZABLE_DEFAULTS,
    draggable: DRAGGABLE_DEFAULTS,
    zFloor: 10,
    preserveZ: false,
    bounds: undefined,
    obstacles: undefined,
    localStorage: undefined,
};
/**
 * Manages multiple draggable and/or resizable {@link WindowInstance}s.
 *
 * {@link WindowManager.windows|`windows`} can be added, removed, and their
 * z-index values are managed to ensure the most recently selected element is on top.
 * @todo Add examples
 */
class WindowManager {
    /**
     * A map of all windows managed by the instance.  The key is the window's id specified in the
     * options for each window.
     */
    windows = new Map();
    /**
     * The initial {@link WindowManagerOptions} provided.
     */
    opts;
    _log = new Logger('WindowManager', { fg: 'lightseagreen' });
    _evm = new EventManager();
    constructor(options) {
        options ??= WINDOWMANAGER_DEFAULTS;
        options.__type = 'WindowManagerOptions';
        this.opts = Object.freeze(this._resolveOptions(options));
        this._log.fn('constructor').info({ opts: this.opts, options, this: this });
    }
    add = (node, options) => {
        const instance = new WindowInstance(this, node, options);
        this.windows.set(instance.id, instance);
        const listenerId = this._evm.listen(node, 'grab', this.select);
        return {
            destroy: () => {
                instance.dispose();
                this.windows.delete(instance.id);
                this._evm.unlisten(listenerId);
            },
        };
    };
    update() {
        this.windows.forEach(({ resizableInstance, draggableInstance }) => {
            if (draggableInstance)
                draggableInstance.update();
            if (resizableInstance)
                resizableInstance.size = resizableInstance.size;
        });
    }
    applyZ() {
        let i = 0;
        for (const instance of this.windows.values()) {
            instance.node.style.setProperty('z-index', String(this.opts.zFloor + i++));
        }
        return this;
    }
    select = (e) => {
        const target_node = e.currentTarget;
        const instance = this.windows.get(target_node.id);
        if (!instance) {
            throw new Error('Unable to resolve instance from selected node: ' + target_node.id);
        }
        // this.#animate(node)
        if (this.windows.size > 1) {
            const initialZ = target_node.style.getPropertyValue('z-index');
            target_node.style.setProperty('z-index', String(this.opts.zFloor + this.windows.size));
            if (target_node.dataset['keepZ'] === 'true' || this.opts.preserveZ) {
                addEventListener('pointerup', () => target_node.style.setProperty('z-index', initialZ), {
                    once: true,
                });
            }
            else {
                this.windows.delete(instance.id);
                this.windows.set(instance.id, instance);
                this.applyZ();
            }
        }
        return this;
    };
    _resolveOptions(options, defaults = WINDOWMANAGER_DEFAULTS) {
        const opts = {};
        opts.zFloor = options?.zFloor ?? defaults.zFloor;
        opts.preserveZ = options?.preserveZ ?? defaults.preserveZ;
        opts.draggable = resolveOpts(options?.draggable, defaults.draggable);
        opts.resizable = resolveOpts(options?.resizable, defaults.resizable);
        opts.obstacles = options?.obstacles ?? defaults.obstacles;
        opts.bounds =
            options?.bounds ??
                (isObject(options?.draggable) ? options.draggable.bounds : defaults.bounds);
        if (typeof options?.obstacles === 'undefined') {
            if (opts.obstacles) {
                if (isObject(opts.draggable)) {
                    opts.draggable.obstacles = opts.obstacles;
                }
                if (isObject(opts.resizable)) {
                    opts.resizable.obstacles = opts.obstacles;
                }
            }
        }
        else {
            if (isObject(opts.draggable)) {
                if (typeof opts.draggable.obstacles === 'undefined') {
                    opts.draggable.obstacles = options.obstacles;
                }
            }
        }
        if (opts.bounds) {
            if (opts.draggable) {
                if (isObject(options?.draggable) && options?.draggable.bounds) {
                    opts.draggable.bounds = options.draggable.bounds;
                }
                opts.draggable.bounds = opts.bounds;
            }
            if (opts.resizable) {
                opts.resizable.bounds = opts.bounds;
            }
        }
        // Resolve localStorage options.
        if (typeof options?.localStorage !== 'undefined') {
            if (options.localStorage === true) {
                opts.localStorage = WINDOWMANGER_STORAGE_DEFAULTS;
            }
            else if (typeof options.localStorage === 'object') {
                opts.localStorage = Object.assign({}, WINDOWMANGER_STORAGE_DEFAULTS, options.localStorage);
                if (isObject(opts.draggable)) {
                    if (opts.localStorage.position === false) {
                        opts.draggable.localStorageKey = undefined;
                    }
                    else {
                        opts.draggable.localStorageKey = opts.localStorage.key;
                    }
                }
                if (isObject(opts.resizable)) {
                    opts.resizable.localStorageKey = opts.localStorage.key;
                }
            }
        }
        return opts;
    }
    /**
     * Dispose of the instance and all windows.
     */
    dispose() {
        this._log.fn('dispose').info(this);
        this._evm?.dispose();
        for (const instance of this.windows.values()) {
            instance?.dispose();
        }
        this.windows.clear();
    }
}
/**
 * A single window in a window manager.
 */
class WindowInstance {
    manager;
    node;
    draggableInstance;
    resizableInstance;
    id;
    position = state({ x: 0, y: 0 });
    size = state({ width: 0, height: 0 });
    constructor(manager, node, options) {
        this.manager = manager;
        this.node = node;
        this.id = node.id || options?.id || `wm-instance-${nanoid(8)}`;
        node.id ||= this.id;
        // @ts-expect-error - yoink
        const opts = manager._resolveOptions(options, manager.opts);
        const dragOpts = opts.draggable;
        const resizeOpts = opts.resizable;
        // Respect disabled localStorage for individual windows independently of the manager.
        if (options?.localStorage === false) {
            if (dragOpts)
                dragOpts.localStorageKey = undefined;
            if (resizeOpts)
                resizeOpts.localStorageKey = undefined;
        }
        else {
            // Construct a unique draggable localStorage key for each window.
            if (typeof dragOpts === 'object' && dragOpts.localStorageKey !== undefined) {
                const dragKeyParts = [];
                if (typeof dragOpts.localStorageKey === 'undefined') {
                    if (typeof manager.opts.localStorage === 'object') {
                        dragKeyParts.push(manager.opts.localStorage.key);
                    }
                    else {
                        dragKeyParts.push(WINDOWMANGER_STORAGE_DEFAULTS.key);
                    }
                }
                else if (dragOpts.localStorageKey) {
                    dragKeyParts.push(dragOpts.localStorageKey);
                }
                dragKeyParts.push('wm', `${this.manager.windows.size}`, 'position');
                dragOpts.localStorageKey = dragKeyParts.join('::');
            }
            // Construct a unique resizable localStorage key for each window.
            if (typeof resizeOpts === 'object' && resizeOpts.localStorageKey !== undefined) {
                const resizeKeyParts = [];
                if (typeof resizeOpts.localStorageKey === 'undefined') {
                    if (typeof manager.opts.localStorage === 'object') {
                        resizeKeyParts.push(manager.opts.localStorage.key);
                    }
                    else {
                        resizeKeyParts.push(WINDOWMANGER_STORAGE_DEFAULTS.key);
                    }
                }
                else if (resizeOpts.localStorageKey) {
                    resizeKeyParts.push(resizeOpts.localStorageKey);
                }
                resizeKeyParts.push('wm', `${this.manager.windows.size}`, 'size');
                resizeOpts.localStorageKey = resizeKeyParts.join('::');
            }
        }
        this.draggableInstance = new Draggable(node, dragOpts || { disabled: true });
        this.resizableInstance = new Resizable(node, resizeOpts || { disabled: true });
        if (opts?.preserveZ) {
            node.dataset['keepZ'] = 'true';
        }
    }
    dispose() {
        this.resizableInstance?.dispose();
        this.draggableInstance?.dispose();
    }
}

export { WINDOWMANAGER_DEFAULTS, WINDOWMANGER_STORAGE_DEFAULTS, WindowInstance, WindowManager };
//# sourceMappingURL=WindowManager.js.map
