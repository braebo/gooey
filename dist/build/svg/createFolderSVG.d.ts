import type { Folder } from '../Folder';
export declare function createFolderSvg(folder: Folder): HTMLDivElement;
export declare function createFolderConnector(folder: Folder, icon: HTMLDivElement): {
    container: HTMLDivElement;
    svg: SVGSVGElement;
    path: SVGPathElement;
    update: (height?: number) => {
        length: number;
    };
};
export declare function animateConnector(folder: Folder, action: 'open' | 'close', { instant }?: {
    instant?: boolean;
} | undefined): Promise<Animation | void>;
