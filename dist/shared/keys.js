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
/** The built-in elements `attachShadow()` accepts; any custom element (a name with a hyphen) can too. */
const SHADOW_HOST_TAGS = new Set([
	"article",
	"aside",
	"blockquote",
	"div",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"main",
	"nav",
	"p",
	"section",
	"span"
]);
/**
* `true` when a keyboard event comes from a field with its own native text undo: a writable
* `<textarea>`, a text-type `<input>`, or a `contenteditable` element.  Read through
* `composedPath()`, so a field inside an open shadow root is still seen from a `window`
* listener.  A closed shadow root hides its field, so a key from inside one counts too.
*/
function isEditableTextTarget(event) {
	const target = event.composedPath?.()[0] ?? event.target;
	if (!target || typeof target !== "object") return false;
	if (target instanceof HTMLTextAreaElement) return !target.readOnly && !target.disabled;
	if (target instanceof HTMLInputElement) return !target.readOnly && !target.disabled && TEXT_INPUT_TYPES.has(target.type);
	return Boolean(target.isContentEditable) || isClosedShadowFocus(target);
}
/**
* `true` when the target looks like a closed shadow host with focus somewhere inside it, where
* the field that has it can't be seen: a shadow-capable element with no open root and no
* `tabindex`, since a key only lands on an element that can't take focus itself by retargeting
* out of its shadow.  An element with any `tabindex` (a skip-link `<main tabindex="-1">`, a
* dialog panel) can be focused by a click, so it keeps gooey's undo.  Accepted misses: a closed
* host that sets `tabindex` and holds a text field, and a scroll container reached by Tab.
*/
function isClosedShadowFocus(target) {
	if (!(target instanceof HTMLElement) || target.shadowRoot !== null) return false;
	const tag = target.localName;
	if (tag === "body" || tag === "html") return false;
	if (!tag.includes("-") && !SHADOW_HOST_TAGS.has(tag)) return false;
	return !target.hasAttribute("tabindex");
}

//#endregion
export { isEditableTextTarget, modIcon, modKey };
//# sourceMappingURL=keys.js.map