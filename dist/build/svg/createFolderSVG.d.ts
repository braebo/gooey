import type { Folder } from '../Folder';
export declare function createFolderSvg(folder: Folder): HTMLDivElement;
export declare function createFolderConnector(folder: Folder): {
    container: HTMLDivElement & {
        dataset: unknown;
    };
    svg: SVGSVGElement;
    path: SVGPathElement;
};
export declare function animateConnector(folder: Folder, action: 'open' | 'close'): void;
export declare function updateConnector(folder: Folder, svg: SVGSVGElement, path: SVGPathElement): void;
