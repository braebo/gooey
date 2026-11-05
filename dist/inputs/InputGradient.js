import { CSS_COLORS } from "../shared/css-colors.js";
import { Logger } from "../shared/logger.js";
import { state } from "../shared/state.js";
import { create } from "../shared/create.js";
import { Input } from "./Input.js";
import { NumberController } from "../controllers/NumberController.js";
import { Color, isColor, isColorFormat } from "../shared/color/color.js";
import { InputColor } from "./InputColor.js";

//#region src/inputs/InputGradient.ts
const GRADIENT_INPUT_DEFAULTS = {
	__type: "GradientInputOptions",
	value: [{
		offset: 0,
		color: "#000000"
	}, {
		offset: 1,
		color: "#ffffff"
	}],
	step: .01,
	mode: "hex",
	expanded: false
};
/** A gradient never has fewer stops than this; removing past it is refused. */
const MIN_STOPS = 2;
/** A dragged stop this many pixels above or below the strip is removed on release. */
const REMOVE_DISTANCE = 24;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
/**
* Normalizes a colour to `'#rrggbb'`, or `'#rrggbbaa'` when it isn't opaque.  Throws on anything
* that isn't a colour.
*/
function toColorString(v) {
	if (typeof v === "string") {
		const hex = v.trim().toLowerCase();
		if (/^#[0-9a-f]{6}$/.test(hex)) return hex;
		if (/^#[0-9a-f]{8}$/.test(hex)) return hex.endsWith("ff") ? hex.slice(0, 7) : hex;
	}
	let color;
	if (isColor(v)) color = v;
	else if (typeof v === "string") {
		const s = v.trim();
		const named = CSS_COLORS[s.toLowerCase()];
		if (named) color = new Color(named);
		else if (isColorFormat(s)) color = new Color(s);
	} else if (v && typeof v === "object" && isColorFormat(v)) color = new Color(v);
	if (!color) throw new Error(`InputGradient received an invalid color: ${JSON.stringify(v)}`);
	return color.alpha < 1 ? color.hex8String : color.hexString;
}
/**
* Sorts stops by offset, keeping equal offsets in the order they came.  Returns where the stop at
* `track` ended up, so a selection can follow a stop that was dragged past its neighbour.
*/
function sortStops(stops, track = -1) {
	const order = stops.map((_, i) => i).sort((a, b) => stops[a].offset - stops[b].offset || a - b);
	return [order.map((i) => stops[i]), order.indexOf(track)];
}
/**
* Normalizes anything an {@link InputGradient} accepts into a fresh, sorted {@link GradientValue}:
* offsets clamped into `0..1` (a missing one spaces the stops evenly), colours as hex.  Throws on
* anything else, and on fewer than two stops.
*/
function toGradient(v) {
	if (!Array.isArray(v) || v.length < MIN_STOPS) throw new Error(`InputGradient received an invalid gradient: ${JSON.stringify(v)} -- expected at least ${MIN_STOPS} stops, like [{ offset: 0, color: '#000' }, { offset: 1, color: '#fff' }].`);
	return sortStops(v.map((stop, i) => {
		const even = i / (v.length - 1);
		if (!(stop && typeof stop === "object" && !isColor(stop) && "color" in stop)) return {
			offset: even,
			color: toColorString(stop)
		};
		const { offset, color } = stop;
		if (offset !== void 0 && (typeof offset !== "number" || !Number.isFinite(offset))) throw new Error(`InputGradient received an invalid offset: ${JSON.stringify(offset)}`);
		return {
			offset: offset === void 0 ? even : clamp(offset, 0, 1),
			color: toColorString(color)
		};
	}))[0];
}
function copyStops(stops) {
	return stops.map(({ offset, color }) => ({
		offset,
		color
	}));
}
function gradientEqual(a, b) {
	if (!a || a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (Math.abs(a[i].offset - b[i].offset) > 1e-9) return false;
		if (a[i].color !== b[i].color) return false;
	}
	return true;
}
const pct = (offset) => `${+(offset * 100).toFixed(2)}%`;
/**
* Renders a {@link GradientValue} as a CSS `linear-gradient()`.
* @param direction - The gradient line's direction, as CSS takes it: `'90deg'`, `'to bottom'`...
* @default 'to right'
* @example
* ```ts
* gradientToString([{ offset: 0, color: '#000000' }, { offset: 1, color: '#ffffff' }])
* // 'linear-gradient(to right, #000000 0%, #ffffff 100%)'
* ```
*/
function gradientToString(stops, direction = "to right") {
	return `linear-gradient(${direction}, ${stops.map((s) => `${s.color} ${pct(s.offset)}`).join(", ")})`;
}
/**
* The colour a {@link GradientValue} has at `t` (`0..1`), as `'#rrggbb'` or `'#rrggbbaa'`.
* Blends in premultiplied sRGB, the way CSS paints a `linear-gradient()` of hex colours, so the
* colour matches what the strip shows.  Before the first stop is the first colour, after the last
* is the last.
* @example
* ```ts
* const usage = gooey.addGradient('usage', ['#3b82f6', '#22c55e', '#eab308', '#ef4444'])
* circle.style.color = sampleGradient(usage.value, 0.29)
* ```
*/
function sampleGradient(stops, t) {
	if (!stops.length) throw new Error("sampleGradient received no stops.");
	t = clamp(Number.isFinite(t) ? t : 0, 0, 1);
	const first = stops[0];
	const last = stops[stops.length - 1];
	if (t <= first.offset) return first.color;
	if (t >= last.offset) return last.color;
	let i = 1;
	while (stops[i].offset < t) i++;
	const a = stops[i - 1];
	const b = stops[i];
	const span = b.offset - a.offset;
	const k = span > 0 ? (t - a.offset) / span : 1;
	const ca = new Color(a.color).rgba;
	const cb = new Color(b.color).rgba;
	const aa = ca.a ?? 1;
	const ab = cb.a ?? 1;
	const alpha = aa + (ab - aa) * k;
	const channel = (x, y) => alpha > 0 ? Math.round((x * aa + (y * ab - x * aa) * k) / alpha) : Math.round(x + (y - x) * k);
	return toColorString({
		r: channel(ca.r, cb.r),
		g: channel(ca.g, cb.g),
		b: channel(ca.b, cb.b),
		a: +alpha.toFixed(3)
	});
}
/**
* The selected stop's colour editor: an {@link InputColor} that lives inside the gradient's row,
* not in the folder.  The gradient owns the value, so the undo step and the folder's `change`
* are the gradient's to make.
*/
var StopColor = class extends InputColor {
	get undoManager() {}
	emit(event, v = this.state.value) {
		this._evm.emit(event, v);
		return this;
	}
};
/**
* A gradient editor: a strip of the gradient with a handle per colour stop, and the selected
* stop's offset and colour below it.  The colour is edited with gooey's own colour picker.  Its
* value is a list of `{ offset, color }` stops, sorted by `offset` -- plain data that serializes
* as-is, and that {@link gradientToString} and {@link sampleGradient} read.
*
* - Drag a stop to move it, or press the strip to add one there (it takes the colour already
*   under it, and can be dragged straight away).
* - Drag a stop off the strip, or press `Delete` / `Backspace` on a focused one, to remove it.
*   A gradient keeps at least two stops.
* - The arrow keys move a focused stop, by ten steps with `shift`.
*
* @example
* ```ts
* const heat = gooey.addGradient('heat', [
* 	{ offset: 0, color: '#3b82f6' },
* 	{ offset: 0.5, color: '#eab308' },
* 	{ offset: 1, color: '#ef4444' },
* ])
* heat.on('change', stops => (el.style.background = gradientToString(stops)))
* ```
*/
var InputGradient = class extends Input {
	__type = "InputGradient";
	state;
	initialValue;
	/** The selected stop's offset field. */
	offsetController;
	/** The selected stop's colour input. */
	colorInput;
	#log;
	#selected = 0;
	/** The value a drag, a field drag, or a colour-picker gesture started from; `null` between. */
	#gestureFrom = null;
	#drag = null;
	/** Set while the colour input is being pointed at the selected stop, so it isn't an edit. */
	#syncing = false;
	constructor(options, folder) {
		const opts = Object.assign({}, GRADIENT_INPUT_DEFAULTS, options, { __type: "GradientInputOptions" });
		super(opts, folder);
		this.#log = new Logger(`InputGradient ${opts.title}`, { fg: "hotpink" });
		this.#log.fn("constructor").debug({
			opts,
			this: this
		});
		const raw = this.resolveInitialValue(opts);
		this.initialValue = toGradient(raw);
		this.state = state(toGradient(raw));
		if (opts.binding) {
			const { target, key } = opts.binding;
			this._evm.add(this.state.subscribe((v) => {
				if (gradientEqual(this.#read(target[key]), v)) return;
				target[key] = copyStops(v);
			}));
		}
		this._dirty = () => !gradientEqual(this.state.value, this.initialValue);
		const container = create("div", {
			classes: ["gooey-input-gradient-container"],
			parent: this.elements.content
		});
		const track = create("div", {
			classes: ["gooey-input-gradient-track"],
			parent: container
		});
		const strip = create("div", {
			classes: ["gooey-input-gradient-strip"],
			parent: track
		});
		const stops = create("div", {
			classes: ["gooey-input-gradient-stops"],
			parent: track
		});
		const editor = create("div", {
			classes: ["gooey-input-gradient-editor"],
			parent: container
		});
		this.offsetController = new NumberController(this, opts, editor);
		const offset = this.offsetController.element;
		offset.classList.add("gooey-input-gradient-offset");
		offset.setAttribute("aria-label", "offset");
		offset.min = "0";
		offset.max = "1";
		this._evm.listen(offset, "input", () => {
			const n = offset.valueAsNumber;
			if (Number.isFinite(n)) this.#moveStop(this.#selected, clamp(n, 0, 1));
		});
		this._evm.listen(offset, "dragStart", () => this.#beginGesture());
		this._evm.listen(offset, "dragEnd", () => this.#endGesture());
		this.colorInput = new StopColor({
			title: "",
			value: this.state.value[0].color,
			mode: opts.mode,
			expanded: opts.expanded,
			resettable: false,
			saveable: false
		}, folder);
		this.colorInput.element.classList.add("gooey-input-gradient-color");
		editor.appendChild(this.colorInput.element);
		this.colorInput.on("change", (color) => this.#onColor(color));
		this._evm.listen(this.colorInput.element, "pointerdown", () => {
			this.#beginGesture();
			addEventListener("pointerup", this.#endColorGesture, { once: true });
			addEventListener("pointercancel", this.#endColorGesture, { once: true });
		}, { capture: true });
		this.elements.controllers = {
			container,
			track,
			strip,
			stops,
			handles: [],
			editor: {
				container: editor,
				offset,
				color: this.colorInput
			}
		};
		this._evm.listen(track, "pointerdown", this.#onPointerDown);
		this._evm.listen(track, "pointermove", this.#onPointerMove);
		this._evm.listen(track, "pointerup", this.#onPointerUp);
		this._evm.listen(track, "pointercancel", this.#onPointerUp);
		this._evm.listen(track, "lostpointercapture", this.#onPointerUp);
		this._evm.listen(stops, "keydown", this.#onKeyDown);
		this._evm.listen(stops, "focusin", (e) => {
			const i = this.elements.controllers.handles.indexOf(e.target);
			if (i !== -1) this.select(i);
		});
		this._evm.add(this.state.subscribe(() => this.refresh()));
	}
	/** The index of the selected stop -- the one the editor below the strip shows. */
	get selected() {
		return this.#selected;
	}
	/**
	* Selects the stop at `index`, so the offset field and colour picker edit it.
	*/
	select(index) {
		const next = clamp(Math.round(index), 0, this.state.value.length - 1);
		if (next === this.#selected) return this;
		this.#selected = next;
		this.refresh();
		return this;
	}
	/**
	* Sets the gradient.  Takes `{ offset, color }` stops in any order, stops without an offset,
	* or bare colours (spaced evenly).  The value is stored sorted by offset, colours as hex.
	*/
	set(v) {
		this.#log.fn("set").debug({
			v,
			this: this
		});
		const next = toGradient(v);
		if (!this.#gestureFrom) this.commit({
			from: copyStops(this.state.value),
			to: copyStops(next)
		});
		this.state.set(next);
		this.emit("change", copyStops(next));
		return this;
	}
	refresh(v) {
		this.#log.fn("refresh").debug({
			v,
			this: this
		});
		const els = this.elements.controllers;
		if (!els.handles) return this;
		const stops = this.state.value;
		this.#selected = clamp(this.#selected, 0, stops.length - 1);
		const selected = stops[this.#selected];
		els.strip.style.setProperty("--gradient", gradientToString(stops));
		const handles = els.handles;
		const hadFocus = handles.includes(document.activeElement);
		while (handles.length < stops.length) {
			const handle = create("div", {
				classes: ["gooey-input-gradient-stop"],
				parent: els.stops,
				attributes: {
					role: "slider",
					tabindex: "0",
					"aria-valuemin": "0",
					"aria-valuemax": "1"
				}
			});
			handles.push(handle);
		}
		while (handles.length > stops.length) handles.pop().remove();
		for (const [i, stop] of stops.entries()) {
			const handle = handles[i];
			handle.style.left = pct(stop.offset);
			handle.style.setProperty("--color", stop.color);
			handle.setAttribute("aria-valuenow", String(stop.offset));
			handle.setAttribute("aria-label", `stop ${i + 1}: ${stop.color}`);
			handle.classList.toggle("selected", i === this.#selected);
			handle.classList.toggle("dragging", i === this.#drag?.index);
			handle.classList.toggle("removing", i === this.#drag?.index && this.#drag.removing);
		}
		if (hadFocus && document.activeElement !== handles[this.#selected]) handles[this.#selected].focus({ preventScroll: true });
		const offset = els.editor.offset;
		if (document.activeElement !== offset || offset.valueAsNumber !== selected.offset) offset.value = String(+selected.offset.toFixed(4));
		if (toColorString(this.colorInput.state.value) !== selected.color) {
			this.#syncing = true;
			try {
				this.colorInput.set(selected.color);
			} finally {
				this.#syncing = false;
			}
		}
		super.refresh(stops);
		return this;
	}
	/**
	* Pulls the bound field into state on {@link refresh} -- only when it says a different
	* gradient, since an array never compares equal in the store and would re-notify forever.
	*/
	readBinding() {
		if (!this.opts.binding) return;
		const next = this.#read(this.opts.binding.target[this.opts.binding.key]);
		if (next && !gradientEqual(next, this.state.value)) this.state.set(next);
	}
	enable() {
		this.colorInput.enable();
		super.enable();
		return this;
	}
	disable() {
		this.colorInput.disable();
		super.disable();
		return this;
	}
	save(overrides = {}) {
		return super.save({
			value: copyStops(this.state.value),
			...overrides
		});
	}
	load(json) {
		super.load(json);
		this.initialValue = copyStops(this.state.value);
		this.elements.resetBtn.classList.toggle("dirty", this._dirty());
	}
	dispose() {
		removeEventListener("pointerup", this.#endColorGesture);
		removeEventListener("pointercancel", this.#endColorGesture);
		this.offsetController.dispose();
		this.colorInput.dispose();
		super.dispose();
	}
	/** Parses a bound field's value, or `undefined` if it isn't a gradient. */
	#read(v) {
		try {
			return toGradient(v);
		} catch {
			return;
		}
	}
	#beginGesture() {
		this.#gestureFrom ??= copyStops(this.state.value);
	}
	#endGesture() {
		const from = this.#gestureFrom;
		if (!from) return;
		this.#gestureFrom = null;
		const to = copyStops(this.state.value);
		if (!gradientEqual(from, to)) this.commit({
			from,
			to
		});
	}
	#endColorGesture = () => {
		removeEventListener("pointerup", this.#endColorGesture);
		removeEventListener("pointercancel", this.#endColorGesture);
		this.#endGesture();
	};
	#snap(n, coarse = false) {
		const step = coarse ? .05 : this.opts.step ?? GRADIENT_INPUT_DEFAULTS.step;
		return clamp(+(Math.round(n / step) * step).toFixed(4), 0, 1);
	}
	/** Moves the stop at `index` to `offset`; the selection follows it through the re-sort. */
	#moveStop(index, offset) {
		const stops = copyStops(this.state.value);
		if (stops[index].offset === offset) return;
		stops[index].offset = offset;
		const [sorted, moved] = sortStops(stops, index);
		this.#selected = moved;
		if (this.#drag) this.#drag.index = moved;
		this.set(sorted);
	}
	#removeStop(index) {
		const stops = this.state.value;
		if (stops.length <= MIN_STOPS) return;
		this.#selected = clamp(index > 0 ? index - 1 : 0, 0, stops.length - 2);
		this.set(stops.filter((_, i) => i !== index));
	}
	#onColor(color) {
		if (this.#syncing) return;
		const hex = toColorString(color);
		const stops = copyStops(this.state.value);
		if (stops[this.#selected].color === hex) return;
		stops[this.#selected].color = hex;
		this.set(stops);
	}
	/** The offset under a pointer, from `0` at the start of the lane to `1` at its end. */
	#offsetAt(clientX) {
		const rect = this.elements.controllers.stops.getBoundingClientRect();
		return (clientX - rect.left) / (rect.width || 1);
	}
	#onPointerDown = (e) => {
		if (this.disabled || e.button !== 0 || this.#drag) return;
		const { track, stops: lane, handles } = this.elements.controllers;
		const handle = e.target.closest?.(".gooey-input-gradient-stop");
		let index = handles.indexOf(handle);
		let dx = 0;
		this.#beginGesture();
		if (index === -1) {
			const offset = this.#snap(this.#offsetAt(e.clientX));
			const stops = copyStops(this.state.value);
			stops.push({
				offset,
				color: sampleGradient(stops, offset)
			});
			const [sorted, added] = sortStops(stops, stops.length - 1);
			index = added;
			this.#selected = added;
			this.set(sorted);
		} else {
			const rect = handles[index].getBoundingClientRect();
			dx = rect.left + rect.width / 2 - e.clientX;
			this.#selected = index;
		}
		e.preventDefault();
		try {
			track.setPointerCapture(e.pointerId);
		} catch {}
		this.#drag = {
			index,
			pointerId: e.pointerId,
			dx,
			removing: false
		};
		track.classList.add("dragging");
		lane.classList.add("dragging");
		this.refresh();
		handles[this.#selected]?.focus({ preventScroll: true });
	};
	#onPointerMove = (e) => {
		const drag = this.#drag;
		if (!drag || e.pointerId !== drag.pointerId) return;
		const rect = this.elements.controllers.track.getBoundingClientRect();
		const removing = (e.clientY < rect.top - REMOVE_DISTANCE || e.clientY > rect.bottom + REMOVE_DISTANCE) && this.state.value.length > MIN_STOPS;
		if (removing !== drag.removing) {
			drag.removing = removing;
			this.refresh();
		}
		this.#moveStop(drag.index, this.#snap(this.#offsetAt(e.clientX + drag.dx), e.shiftKey));
	};
	#onPointerUp = (e) => {
		const drag = this.#drag;
		if (!drag || e.pointerId !== drag.pointerId) return;
		this.#drag = null;
		const { track, stops } = this.elements.controllers;
		if (track.hasPointerCapture?.(e.pointerId)) track.releasePointerCapture(e.pointerId);
		track.classList.remove("dragging");
		stops.classList.remove("dragging");
		if (drag.removing && e.type === "pointerup") this.#removeStop(drag.index);
		this.#endGesture();
		this.refresh();
	};
	#onKeyDown = (e) => {
		const index = this.elements.controllers.handles.indexOf(e.target);
		if (index === -1 || this.disabled) return;
		const step = (this.opts.step ?? GRADIENT_INPUT_DEFAULTS.step) * (e.shiftKey ? 10 : 1);
		const offset = this.state.value[index].offset;
		switch (e.key) {
			case "ArrowLeft":
			case "ArrowDown":
				this.#moveStop(index, this.#snap(offset - step));
				break;
			case "ArrowRight":
			case "ArrowUp":
				this.#moveStop(index, this.#snap(offset + step));
				break;
			case "Home":
				this.#moveStop(index, 0);
				break;
			case "End":
				this.#moveStop(index, 1);
				break;
			case "Delete":
			case "Backspace":
				this.#removeStop(index);
				break;
			default: return;
		}
		e.preventDefault();
		e.stopPropagation();
	};
};

//#endregion
export { InputGradient, gradientToString, sampleGradient, toGradient };
//# sourceMappingURL=InputGradient.js.map