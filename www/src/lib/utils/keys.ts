import { getOS, isApple, isIPad, isMac } from './ua'

/**
 * Returns the `metaKey` on Mac, and `ctrlKey` on other platforms.
 */
export function modKey(event: KeyboardEvent | PointerEvent) {
	return isMac() ? event.metaKey : event.ctrlKey
}

export function modIcon() {
	return isApple() ? MODIFIER_KEY_DATA.meta.mac.icon : MODIFIER_KEY_DATA.ctrl.windows.icon
}

export type ModifierKey = 'cmd' | 'meta' | 'alt' | 'shift' | 'ctrl'
export type ModifierMap = Record<ModifierKey, PlatformData>
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
	type: ModifierKey,
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
				icon: type,
				name: type,
				key: type,
			}
	}
}

/**
 * A map of the keyboard modifier icon, name, and keycode information for Mac, Windows, and Linux.
 *
 * @see {@link getModifierKey}
 */
export const MODIFIER_KEY_DATA = {
	cmd: {
		mac: {
			icon: '⌘',
			name: 'command',
			key: 'cmd',
		},
		windows: {
			icon: 'Ctrl',
			name: 'control',
			key: 'ctrl',
		},
		linux: {
			icon: 'Super',
			name: 'super',
			key: 'meta',
		},
	},
	meta: {
		mac: {
			icon: '⌘',
			name: 'command',
			key: 'meta',
		},
		windows: {
			icon: '⊞',
			name: 'windows',
			key: 'win',
		},
		linux: {
			icon: 'Super',
			name: 'super',
			key: 'meta',
		},
	},
	alt: {
		mac: {
			icon: '⌥',
			name: 'option',
			key: 'option',
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
	shift: {
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
	ctrl: {
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
