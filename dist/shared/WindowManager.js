import { nanoid } from "./nanoid.js";
import { Logger } from "./logger.js";
import { RESIZABLE_DEFAULTS, Resizable } from "./resizable.js";
import { isObject } from "./is.js";
import { EventManager } from "./EventManager.js";
import { DRAGGABLE_DEFAULTS, Draggable } from "./draggable.js";
import { resolveOpts } from "./resolveOpts.js";

//#region src/shared/WindowManager.ts
const WINDOWMANGER_STORAGE_DEFAULTS = {
	__type: "WindowManagerStorageOptions",
	key: "window-manager",
	size: true,
	position: true,
	debounce: 50
};
const WINDOWMANAGER_DEFAULTS = {
	__type: "WindowManagerOptions",
	resizable: RESIZABLE_DEFAULTS,
	draggable: DRAGGABLE_DEFAULTS,
	zFloor: 10,
	preserveZ: false,
	bounds: void 0,
	obstacles: void 0,
	localStorage: void 0
};
/**
* Manages multiple draggable and/or resizable {@link WindowInstance}s.
*
* {@link WindowManager.windows|`windows`} can be added, removed, and their
* z-index values are managed to ensure the most recently selected element is on top.
* @todo Add examples
*/
var WindowManager = class {
	/**
	* A map of all windows managed by the instance.  The key is the window's id specified in the
	* options for each window.
	*/
	windows = /* @__PURE__ */ new Map();
	/**
	* The initial {@link WindowManagerOptions} provided.
	*/
	opts;
	_log = new Logger("WindowManager", { fg: "lightseagreen" });
	_evm = new EventManager();
	constructor(options) {
		options ??= WINDOWMANAGER_DEFAULTS;
		options.__type = "WindowManagerOptions";
		this.opts = Object.freeze(this._resolveOptions(options));
		this._log.fn("constructor").debug({
			opts: this.opts,
			options,
			this: this
		});
	}
	add = (node, options) => {
		const instance = new WindowInstance(this, node, options);
		this.windows.set(instance.id, instance);
		const listenerId = this._evm.listen(node, "grab", this.select);
		return {
			window: instance,
			destroy: () => {
				instance.dispose();
				this.windows.delete(instance.id);
				this._evm.unlisten(listenerId);
			}
		};
	};
	update() {
		this.windows.forEach(({ resizableInstance, draggableInstance }) => {
			if (draggableInstance) draggableInstance.update();
			if (resizableInstance) resizableInstance.size = resizableInstance.size;
		});
	}
	applyZ() {
		let i = 0;
		for (const instance of this.windows.values()) instance.node.style.setProperty("z-index", String(this.opts.zFloor + i++));
		return this;
	}
	select = (e) => {
		const target_node = e.currentTarget;
		const instance = this.windows.get(target_node.id);
		if (!instance) throw new Error("Unable to resolve instance from selected node: " + target_node.id);
		if (this.windows.size > 1) {
			const initialZ = target_node.style.getPropertyValue("z-index");
			target_node.style.setProperty("z-index", String(this.opts.zFloor + this.windows.size));
			if (target_node.dataset["keepZ"] === "true" || this.opts.preserveZ) addEventListener("pointerup", () => target_node.style.setProperty("z-index", initialZ), { once: true });
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
		if (opts.draggable) opts.draggable = { ...opts.draggable };
		if (opts.resizable) opts.resizable = { ...opts.resizable };
		opts.bounds = options?.bounds ?? (isObject(options?.draggable) ? options.draggable.bounds : defaults.bounds);
		if (opts.bounds) {
			if (opts.draggable) opts.draggable.bounds = opts.bounds;
			if (opts.resizable) opts.resizable.bounds = opts.bounds;
		}
		if (opts.draggable) opts.draggable.margin ||= 16;
		if (typeof options?.localStorage !== "undefined") {
			if (options.localStorage === true) opts.localStorage = WINDOWMANGER_STORAGE_DEFAULTS;
			else if (typeof options.localStorage === "object") {
				opts.localStorage = Object.assign({}, WINDOWMANGER_STORAGE_DEFAULTS, options.localStorage);
				if (isObject(opts.draggable)) if (opts.localStorage.position === false) opts.draggable.localStorageKey = void 0;
				else opts.draggable.localStorageKey = opts.localStorage.key;
				if (isObject(opts.resizable)) opts.resizable.localStorageKey = opts.localStorage.key;
			}
		}
		return opts;
	}
	/**
	* Dispose of the instance and all windows.
	*/
	dispose() {
		this._log.fn("dispose").debug(this);
		this._evm?.dispose();
		for (const instance of this.windows.values()) instance?.dispose();
		this.windows.clear();
	}
};
/**
* Builds a window's localStorage key, i.e. `"my-app::wm::inspector::position"`.  An empty
* `prefix` is dropped.
*/
function windowStorageKey(prefix, storageId, suffix) {
	return [
		prefix,
		"wm",
		storageId,
		suffix
	].filter(Boolean).join("::");
}
/**
* A single window in a window manager.
*/
var WindowInstance = class {
	draggableInstance;
	resizableInstance;
	id;
	/**
	* The stable identity used to key this window's persisted position / size.
	* @see {@link WindowInstanceOptions.storageId}
	*/
	storageId;
	/**
	* The window's current size -- the {@link Resizable.size|resizable's own state}, so it
	* follows both a drag on a grabber and a call to {@link resize}, and persists with it.
	*/
	size;
	get position() {
		return this.draggableInstance?.position ?? {
			x: 0,
			y: 0
		};
	}
	set position(position) {
		const p = Object.assign({}, this.position, position);
		this.draggableInstance?.moveTo(p);
	}
	moveTo;
	moveBy;
	/**
	* Resizes the window, clamped to the bounds and the node's own css min / max values.  An
	* omitted dimension is left alone.
	* @see {@link Resizable.resize}
	*/
	resize;
	constructor(manager, node, options) {
		this.manager = manager;
		this.node = node;
		const authoredNodeId = node.id || void 0;
		this.id = authoredNodeId || options?.id || `wm-instance-${nanoid(8)}`;
		node.id ||= this.id;
		this.storageId = options?.storageId ?? authoredNodeId ?? `${manager.windows.size}`;
		const opts = manager._resolveOptions(options, manager.opts);
		const dragOpts = opts.draggable;
		const resizeOpts = opts.resizable;
		if (options?.localStorage === false) {
			if (dragOpts) dragOpts.localStorageKey = void 0;
			if (resizeOpts) resizeOpts.localStorageKey = void 0;
		} else {
			if (typeof dragOpts === "object" && dragOpts.localStorageKey !== void 0) dragOpts.localStorageKey = windowStorageKey(dragOpts.localStorageKey, this.storageId, "position");
			if (typeof resizeOpts === "object" && resizeOpts.localStorageKey !== void 0) resizeOpts.localStorageKey = windowStorageKey(resizeOpts.localStorageKey, this.storageId, "size");
		}
		this.draggableInstance = new Draggable(node, dragOpts || { disabled: true });
		this.resizableInstance = new Resizable(node, resizeOpts || { disabled: true });
		if (opts?.preserveZ) node.dataset["keepZ"] = "true";
		this.moveTo = this.draggableInstance.moveTo.bind(this.draggableInstance);
		this.moveBy = this.draggableInstance.moveBy.bind(this.draggableInstance);
		this.resize = this.resizableInstance.resize.bind(this.resizableInstance);
		this.size = this.resizableInstance.size;
	}
	dispose() {
		this.resizableInstance?.dispose();
		this.draggableInstance?.dispose();
	}
};

//#endregion
export { WINDOWMANAGER_DEFAULTS, WINDOWMANGER_STORAGE_DEFAULTS, WindowInstance, WindowManager };
//# sourceMappingURL=WindowManager.js.map