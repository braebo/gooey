import { getOS, isApple, isIPad, isMac } from './ua';
/**
 * Returns the `metaKey` on Mac, and `ctrlKey` on other platforms.
 */
export function modKey(event) {
    return isMac() ? event.metaKey : event.ctrlKey;
}
export function modIcon() {
    return isApple() ? MODIFIER_KEY_DATA.metaKey.mac.icon : MODIFIER_KEY_DATA.ctrlKey.windows.icon;
}
/**
 * Returns the relevant keyboard modifier key data for the caller's OS.
 * @param type - The type of modifier key to retrieve.
 * @param request - The request object (only required on the server).
 * @returns The modifier key data for the given type and OS.  If the OS is not recognized, the key
 * name is returned as-is.
 *
 * To get the modifier key data for a specific OS, see {@link MODIFIER_KEY_DATA}.
 */
export function getModifierKey(type, request) {
    if (isIPad(request)) {
        return MODIFIER_KEY_DATA[type].mac;
    }
    const os = getOS(request);
    switch (os) {
        case 'mac':
        case 'windows':
        case 'linux':
            return MODIFIER_KEY_DATA[type][os];
        default:
            return {
                icon: type.replace('Key', ''),
                name: type.replace('Key', ''),
                key: type.replace('Key', ''),
            };
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
};
