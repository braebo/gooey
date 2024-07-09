import type { ColorMode, InputColor } from '../../inputs/InputColor';
import { Select } from '../Select';
import { type Disableable } from '../../shared/decorators/disableable-class-decorator';
export interface ColorComponentsOptions {
    container?: HTMLDivElement;
    disabled: boolean | (() => boolean);
}
export declare const COLOR_PICKER_DEFAULTS: {
    readonly disabled: false;
};
export type ColorComponentsElements = {
    container: HTMLDivElement;
    title: HTMLDivElement;
    select: Select<ColorMode>['elements'];
    numbers: {
        a: HTMLInputElement;
        b: HTMLInputElement;
        c: HTMLInputElement;
        d: HTMLInputElement;
    };
    text: HTMLInputElement;
};
export interface ColorComponents extends Disableable {
}
export declare class ColorComponents {
    #private;
    input: InputColor;
    opts: ColorComponentsOptions;
    element: HTMLDivElement;
    elements: ColorComponentsElements;
    select: Select<ColorMode>;
    private _evm;
    private _mode;
    /**
     * Used to prevent inputs from being refreshed externally after they're updated internally.
     */
    private _locked;
    private _log;
    constructor(input: InputColor, options?: Partial<ColorComponentsOptions>);
    get color(): import("../../shared/color/color").Color;
    get mode(): ColorMode;
    set mode(v: ColorMode);
    updateMode: (v?: "rgba" | "hsla" | "hsva" | "rgbaString" | "hex" | "hex8" | "hslaString" | "hsvaString" | "array") => void;
    get a(): number;
    set a(v: number);
    get b(): number;
    set b(v: number);
    get c(): number;
    set c(v: number);
    get d(): number;
    set d(v: number);
    /**
     * Updates the UI to reflect the current state of the source color.
     */
    refresh: () => this;
    disable(): this;
    enable(): this;
    dispose(): void;
}
