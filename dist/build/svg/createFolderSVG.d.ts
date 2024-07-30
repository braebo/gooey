import type { Folder } from '../Folder';
export declare function createFolderSvg(folder: Folder): HTMLDivElement;
export declare function createFolderConnector(folder: Folder, icon: HTMLDivElement): {
    container: HTMLDivElement;
    svg: SVGSVGElement;
    path: SVGPathElement;
    update: () => void;
};
export declare function animateConnector(folder: Folder, action: 'open' | 'close'): Promise<Animation | void>;
