import { isMac, isApple } from './ua.js';

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

export { MODIFIER_KEY_DATA, modIcon, modKey };
//# sourceMappingURL=keys.js.map
