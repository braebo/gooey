import { Gooey, type GooeyOptions } from '../../Gooey';
export declare class GooeyTest {
    page: HTMLDivElement;
    constructor();
    addGooey(options?: Partial<GooeyOptions> & {
        height?: number;
    }): Gooey;
}
