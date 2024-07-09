import type { VariableDefinition } from '../styles/themer/types';
import type { Folder } from '../Folder';
import { Gooey } from '../Gooey';
export declare class ThemeEditor {
    targetGooey: Gooey;
    gooey: Gooey;
    private _log;
    get folder(): Folder;
    constructor(targetGooey: Gooey);
    dispose(): void;
    get vars(): {
        color: import("../styles/themer/types").ColorTheme;
    } & {
        [x: string]: VariableDefinition;
    };
    generate: () => void;
}
