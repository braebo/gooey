import type { InputOptions, ValidInput } from '../inputs/Input';
import type { Tooltip } from '../shared/Tooltip';
export declare class NumberController<TInput extends ValidInput = ValidInput, TOptions extends InputOptions<any> = InputOptions> {
    input: TInput;
    opts: TOptions;
    parent?: HTMLElement | undefined;
    element: HTMLInputElement & {
        tooltip: Tooltip;
    };
    dragEnabled: boolean;
    dragging: boolean;
    hovering: boolean;
    delta: number;
    private _log;
    constructor(input: TInput, opts: TOptions, parent?: HTMLElement | undefined);
    hoverStart: (e: PointerEvent) => void;
    hoverEnd: (e: PointerEvent) => void;
    dragKeyHeld: (e: KeyboardEvent | PointerEvent) => boolean;
    cancelDrag: (e: KeyboardEvent | PointerEvent) => void;
    maybeEnableDrag: (e: KeyboardEvent | PointerEvent) => void;
    maybeDragStart: () => void;
    dragStart: () => Promise<void>;
    dragEnd: () => void;
    drag: (e: PointerEvent) => void;
    dispose(): void;
}
