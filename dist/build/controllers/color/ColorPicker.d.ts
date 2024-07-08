import type { InputColor } from '../../inputs/InputColor';
import { type Disableable } from '../../shared/decorators/disableable-class-decorator';
import { type ColorValue } from '../../shared/color/color';
export type LayoutDirection = 'vertical' | 'horizontal' | '';
export type WheelDirection = 'clockwise' | 'anticlockwise' | '';
export interface ColorPickerOptions {
    /**
     * The initial color of the color picker.  Can be any valid {@link ColorValue}.
     * @default '#fff'
     */
    color: ColorValue;
    /**
     * The container element for the color picker.
     */
    container?: HTMLElement;
    /**
     * An array of color swatches.
     */
    swatches: ColorValue[];
    /**
     * The radius of the color picker handle (the little circle
     * that moves around the color picker) in pixels.
     * @default 10
     */
    handleSize: number;
    disabled: boolean | (() => boolean);
}
export declare const COLOR_PICKER_DEFAULTS: ColorPickerOptions;
export type ColorPickerElements = {
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    handle: HTMLDivElement;
    hueSlider: HTMLInputElement;
    alphaSlider: HTMLInputElement;
};
export interface ColorPicker extends Disableable {
}
export declare class ColorPicker {
    input: InputColor;
    opts: ColorPickerOptions;
    elements: ColorPickerElements;
    element: HTMLDivElement;
    private _ctx;
    private _height;
    private _width;
    private _resizeObserver;
    private _gradientWhite;
    private _gradientBlack;
    private _dragging;
    private _lockCursorPosition;
    private _lastColor;
    private _log;
    private _evm;
    on: <K extends "pointerdown" | "pointerup">(event: K, callback: import("../../shared/EventManager").EventCallback<{
        pointerdown: any;
        pointerup: any;
    }[K]>) => string;
    constructor(input: InputColor, options?: Partial<ColorPickerOptions>);
    get canvas(): HTMLCanvasElement;
    get hue(): number;
    get alpha(): number;
    enable: () => this;
    disable: () => this;
    set(v: ColorValue): void;
    setAlpha: (e: InputEvent) => void;
    /**
     * Updates the UI to reflect the current state of the color picker.
     */
    refresh: () => this;
    draw: () => void;
    private _fill;
    private _updateGradients;
    private _pointerUpClickLatch;
    private _onPointerDown;
    private _onPointerMove;
    private _onPointerUp;
    private _onClick;
    /**
     * Updates the color picker's state based on the current mouse position.
     */
    private _updateFromMousePosition;
    /**
     * Maps canvas `x` and `y` coordinates to their respective `s` and `v` color values.
     */
    private _getColorAtPosition;
    private _updateStateFromHue;
    private _updateHandle;
    /**
     * Get the current handle position for a given color.
     */
    private _getHandlePosition;
    private _drawHandle;
    dispose(): void;
}
