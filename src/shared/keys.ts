import { getOS, isApple, isIPad, isMac } from './ua'

/**
 * Returns the `metaKey` on Mac, and `ctrlKey` on other platforms.
 */
export function modKey(event: KeyboardEvent | PointerEvent) {
	return isMac() ? event.metaKey : event.ctrlKey
}

export function modIcon() {
	return isApple() ? MODIFIER_KEY_DATA.metaKey.mac.icon : MODIFIER_KEY_DATA.ctrlKey.windows.icon
}

export type ModifierMap = Record<'metaKey' | 'altKey' | 'shiftKey' | 'ctrlKey', PlatformData>
export type PlatformData = Record<'mac' | 'windows' | 'linux', KeyData>
export type KeyData = Record<'icon' | 'name' | 'key', string>

/**
 * Returns the relevant keyboard modifier key data for the caller's OS.
 * @param type - The type of modifier key to retrieve.
 * @param request - The request object (only required on the server).
 * @returns The modifier key data for the given type and OS.  If the OS is not recognized, the key
 * name is returned as-is.
 *
 * To get the modifier key data for a specific OS, see {@link MODIFIER_KEY_DATA}.
 */
export function getModifierKey(
	type: 'metaKey' | 'altKey' | 'shiftKey' | 'ctrlKey',
	request?: Request,
): {
	icon: string
	name: string
	key: string
} {
	if (isIPad(request)) {
		return MODIFIER_KEY_DATA[type].mac
	}

	const os = getOS(request)

	switch (os) {
		case 'mac':
		case 'windows':
		case 'linux':
			return MODIFIER_KEY_DATA[type][os]
		default:
			return {
				icon: type.replace('Key', ''),
				name: type.replace('Key', ''),
				key: type.replace('Key', ''),
			}
	}
}

/**
 * A map of the keyboard modifier icon, name, and keycode information for Mac, Windows, and Linux.
 *
 * @see {@link getModifierKey}
 */
export const MODIFIER_KEY_DATA = {
	metaKey: {
		mac: {
			icon: '⌘',
			name: 'command',
			key: 'meta',
		},
		windows: {
			icon: '⊞ Win',
			name: 'windows',
			key: 'win',
		},
		linux: {
			icon: 'Super',
			name: 'super',
			key: 'meta',
		},
	},
	altKey: {
		mac: {
			icon: '⌥',
			name: 'option',
			key: 'alt',
		},
		windows: {
			icon: 'Alt',
			name: 'alt',
			key: 'alt',
		},
		linux: {
			icon: 'Alt',
			name: 'alt',
			key: 'alt',
		},
	},
	shiftKey: {
		mac: {
			icon: '⇧',
			name: 'shift',
			key: 'shift',
		},
		windows: {
			icon: 'Shift',
			name: 'shift',
			key: 'shift',
		},
		linux: {
			icon: 'Shift',
			name: 'shift',
			key: 'shift',
		},
	},
	ctrlKey: {
		mac: {
			icon: '⌃',
			name: 'control',
			key: 'ctrl',
		},
		windows: {
			icon: 'Ctrl',
			name: 'control',
			key: 'ctrl',
		},
		linux: {
			icon: 'Ctrl',
			name: 'control',
			key: 'ctrl',
		},
	},
} as const satisfies ModifierMap

/**
 * The `<input>` types that hold editable text, and so carry the browser's own undo stack. A
 * range, checkbox or colour well has none: Cmd/Ctrl+Z there belongs to gooey's undo.
 */
const TEXT_INPUT_TYPES = new Set(['text', 'search', 'url', 'tel', 'email', 'password', 'number'])

/**
 * `true` when a keyboard event comes from a field with its own native text undo: a writable
 * `<textarea>`, a text-type `<input>`, or a `contenteditable` element.  Read through
 * `composedPath()`, so a field inside a shadow root is still seen from a `window` listener.
 */
export function isEditableTextTarget(event: Event): boolean {
	const target = (event.composedPath?.()[0] ?? event.target) as HTMLElement | null
	if (!target || typeof target !== 'object') return false
	if (target instanceof HTMLTextAreaElement) return !target.readOnly && !target.disabled
	if (target instanceof HTMLInputElement) {
		return !target.readOnly && !target.disabled && TEXT_INPUT_TYPES.has(target.type)
	}
	return Boolean(target.isContentEditable)
}
