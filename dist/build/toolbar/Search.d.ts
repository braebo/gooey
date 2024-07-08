import type { Folder } from '../Folder';
import { Tooltip } from '../shared/Tooltip';
export declare class Search {
    folder: Folder;
    elements: {
        container: HTMLElement;
        input: HTMLInputElement;
        button: HTMLButtonElement;
        icon: SVGElement;
    };
    needle: string;
    showing: boolean;
    tooltip: Tooltip;
    get defaultTooltipText(): string;
    private _evm;
    constructor(folder: Folder);
    search: (query: string) => void;
    private _expandInput;
    private _collapseInput;
    clear: () => void;
    toggle: (e?: MouseEvent) => void;
    private _tooltipTimeout;
    open: () => void;
    close: () => void;
    private _clickOutside;
    private _escape;
    private _searchIcon;
    dispose(): void;
}
