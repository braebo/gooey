import { isApple, isMac } from "./ua.js";

//#region src/shared/keys.ts
/**
* Returns the `metaKey` on Mac, and `ctrlKey` on other platforms.
*/
function modKey(event) {
	return isMac() ? event.metaKey : event.ctrlKey;
}
function modIcon() {
	return isApple() ? MODIFIER_KEY_DATA.metaKey.mac.icon : MODIFIER_KEY_DATA.ctrlKey.windows.icon;
}
/**
* A map of the keyboard modifier icon, name, and keycode information for Mac, Windows, and Linux.
*
* @see {@link getModifierKey}
*/
const MODIFIER_KEY_DATA = {
	metaKey: {
		mac: {
			icon: "⌘",
			name: "command",
			key: "meta"
		},
		windows: {
			icon: "⊞ Win",
			name: "windows",
			key: "win"
		},
		linux: {
			icon: "Super",
			name: "super",
			key: "meta"
		}
	},
	altKey: {
		mac: {
			icon: "⌥",
			name: "option",
			key: "alt"
		},
		windows: {
			icon: "Alt",
			name: "alt",
			key: "alt"
		},
		linux: {
			icon: "Alt",
			name: "alt",
			key: "alt"
		}
	},
	shiftKey: {
		mac: {
			icon: "⇧",
			name: "shift",
			key: "shift"
		},
		windows: {
			icon: "Shift",
			name: "shift",
			key: "shift"
		},
		linux: {
			icon: "Shift",
			name: "shift",
			key: "shift"
		}
	},
	ctrlKey: {
		mac: {
			icon: "⌃",
			name: "control",
			key: "ctrl"
		},
		windows: {
			icon: "Ctrl",
			name: "control",
			key: "ctrl"
		},
		linux: {
			icon: "Ctrl",
			name: "control",
			key: "ctrl"
		}
	}
};
/**
* The `<input>` types that hold editable text, and so carry the browser's own undo stack. A
* range, checkbox or colour well has none: Cmd/Ctrl+Z there belongs to gooey's undo.
*/
const TEXT_INPUT_TYPES = new Set([
	"text",
	"search",
	"url",
	"tel",
	"email",
	"password",
	"number"
]);
/**
* `true` when a keyboard event comes from a field with its own native text undo: a writable
* `<textarea>`, a text-type `<input>`, or a `contenteditable` element.  Read through
* `composedPath()`, so a field inside a shadow root is still seen from a `window` listener.
*/
function isEditableTextTarget(event) {
	const target = event.composedPath?.()[0] ?? event.target;
	if (!target || typeof target !== "object") return false;
	if (target instanceof HTMLTextAreaElement) return !target.readOnly && !target.disabled;
	if (target instanceof HTMLInputElement) return !target.readOnly && !target.disabled && TEXT_INPUT_TYPES.has(target.type);
	return Boolean(target.isContentEditable);
}

//#endregion
export { isEditableTextTarget, modIcon, modKey };
//# sourceMappingURL=keys.js.map