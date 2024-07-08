import type { ColorComponentsElements } from '../controllers/color/ColorComponents';
import type { ColorPickerElements } from '../controllers/color/ColorPicker';
import type { ElementMap, InputOptions, InputPreset } from './Input';
import type { ColorFormat } from '../shared/color/types/colorFormat';
import type { State } from '../shared/state';
import type { Folder } from '../Folder';
import { ColorComponents } from '../controllers/color/ColorComponents';
import { ColorPicker } from '../controllers/color/ColorPicker';
import { Color } from '../shared/color/color';
import { CopyButton } from '../shared/CopyButton';
import { Input } from './Input';
export type ColorMode = (typeof COLOR_MODES)[number];
export declare const COLOR_MODES: readonly ["rgba", "rgbaString", "hsla", "hslaString", "hsva", "hsvaString", "hex", "hex8", "array"];
export interface ColorControllerElements extends ElementMap<ColorPicker> {
    container: HTMLDivElement;
    /**
     * A color swatch that displays the current color and toggles the color-picker when clicked.
     */
    currentColor: {
        container: HTMLDivElement;
        displayBackground: HTMLDivElement;
        display: HTMLDivElement;
        copyButton: CopyButton;
    };
    /**
     * The main input content body.
     */
    body: {
        container: HTMLDivElement;
        /**
         * All elements related to the color picker.
         */
        picker: ColorPickerElements;
        /**
         * Number controllers for rgb/hsl/hsv components.
         */
        components: ColorComponentsElements;
    };
}
export type ColorInputOptions = {
    __type?: 'ColorInputOptions';
    mode?: ColorMode;
    expanded?: boolean;
    onChange?: (value: Color) => void;
} & InputOptions<ColorFormat | Color>;
export declare const COLOR_INPUT_DEFAULTS: {
    readonly __type: "ColorInputOptions";
    readonly value: "#FF0000FF";
    readonly mode: "hex";
    readonly expanded: false;
};
export declare class InputColor extends Input<Color, ColorInputOptions, ColorControllerElements> {
    #private;
    readonly __type: "InputColor";
    initialValue: Color;
    state: State<Color>;
    /**
     * The color picker instance.
     */
    picker: ColorPicker;
    /**
     * RGBA/HSLA/HSVA number component inputs.
     */
    components: ColorComponents;
    /**
     * When `true`, the color picker is visible.
     */
    expanded: boolean;
    private _mode;
    get mode(): ColorMode;
    set mode(v: ColorMode);
    private _log;
    constructor(options: Partial<ColorInputOptions>, folder: Folder);
    set(v: ColorFormat | Color): this;
    refresh: (v?: Color) => this;
    get aTitle(): "r" | "h";
    get bTitle(): "g" | "s";
    get cTitle(): "v" | "b" | "l";
    get dTitle(): string;
    private _createCurrentColor;
    private get _pickerContainer();
    togglePicker: () => Promise<void>;
    open: () => Promise<void>;
    close: (duration?: number) => Promise<void>;
    /**
     * Prevents the range slider from registering undo history commits while dragging on the
     * canvas, storing the initial value on pointerdown for the eventual commit in {@link unlock}.
     */
    private _lock;
    /**
     * Saves the commit stored in #lock on pointerup.
     */
    private _unlock;
    enable(): this;
    disable(): this;
    save(): Omit<InputOptions<any, Record<any, any>>, "title" | "saveable"> & {
        __type: import("./Input").InputOptionType;
        presetId: string;
        title: string;
        value: import("./Input").ValidInputValue;
        disabled: boolean;
        hidden: boolean;
        order: number;
        resettable: boolean;
    } & Partial<InputPreset<ColorInputOptions>>;
    load(json: string | InputPreset<ColorInputOptions>): void;
    dispose(): void;
}
