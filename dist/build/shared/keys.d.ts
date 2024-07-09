/**
 * Returns the `metaKey` on Mac, and `ctrlKey` on other platforms.
 */
export declare function modKey(event: KeyboardEvent | PointerEvent): boolean;
export declare function modIcon(): "⌘" | "Ctrl";
export type ModifierMap = Record<'metaKey' | 'altKey' | 'shiftKey' | 'ctrlKey', PlatformData>;
export type PlatformData = Record<'mac' | 'windows' | 'linux', KeyData>;
export type KeyData = Record<'icon' | 'name' | 'key', string>;
/**
 * Returns the relevant keyboard modifier key data for the caller's OS.
 * @param type - The type of modifier key to retrieve.
 * @param request - The request object (only required on the server).
 * @returns The modifier key data for the given type and OS.  If the OS is not recognized, the key
 * name is returned as-is.
 *
 * To get the modifier key data for a specific OS, see {@link MODIFIER_KEY_DATA}.
 */
export declare function getModifierKey(type: 'metaKey' | 'altKey' | 'shiftKey' | 'ctrlKey', request?: Request): {
    icon: string;
    name: string;
    key: string;
};
/**
 * A map of the keyboard modifier icon, name, and keycode information for Mac, Windows, and Linux.
 *
 * @see {@link getModifierKey}
 */
export declare const MODIFIER_KEY_DATA: {
    readonly metaKey: {
        readonly mac: {
            readonly icon: "⌘";
            readonly name: "command";
            readonly key: "meta";
        };
        readonly windows: {
            readonly icon: "⊞ Win";
            readonly name: "windows";
            readonly key: "win";
        };
        readonly linux: {
            readonly icon: "Super";
            readonly name: "super";
            readonly key: "meta";
        };
    };
    readonly altKey: {
        readonly mac: {
            readonly icon: "⌥";
            readonly name: "option";
            readonly key: "alt";
        };
        readonly windows: {
            readonly icon: "Alt";
            readonly name: "alt";
            readonly key: "alt";
        };
        readonly linux: {
            readonly icon: "Alt";
            readonly name: "alt";
            readonly key: "alt";
        };
    };
    readonly shiftKey: {
        readonly mac: {
            readonly icon: "⇧";
            readonly name: "shift";
            readonly key: "shift";
        };
        readonly windows: {
            readonly icon: "Shift";
            readonly name: "shift";
            readonly key: "shift";
        };
        readonly linux: {
            readonly icon: "Shift";
            readonly name: "shift";
            readonly key: "shift";
        };
    };
    readonly ctrlKey: {
        readonly mac: {
            readonly icon: "⌃";
            readonly name: "control";
            readonly key: "ctrl";
        };
        readonly windows: {
            readonly icon: "Ctrl";
            readonly name: "control";
            readonly key: "ctrl";
        };
        readonly linux: {
            readonly icon: "Ctrl";
            readonly name: "control";
            readonly key: "ctrl";
        };
    };
};
