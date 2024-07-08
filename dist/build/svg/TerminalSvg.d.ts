import type { Tooltip } from '../shared/Tooltip';
import type { Folder } from '../Folder';
export declare class TerminalSvg {
    class: string;
    element: HTMLElement & {
        tooltip: Tooltip;
    };
    classes: string[];
    constructor(folder: Folder);
    static style: string;
}
