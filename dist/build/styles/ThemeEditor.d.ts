import type { VariableDefinition } from '../styles/themer/types';
import type { Folder } from '../Folder';
import { Gui } from '../Gui';
export declare class ThemeEditor {
    targetGui: Gui;
    gui: Gui;
    private _log;
    get folder(): Folder;
    constructor(targetGui: Gui);
    dispose(): void;
    get vars(): {
        color: import("../styles/themer/types").ColorTheme;
    } & {
        [x: string]: VariableDefinition;
    };
    generate: () => void;
}
