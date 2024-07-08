import type { ElementMap, InputEvents, InputOptions, ValidInputValue } from './Input';
import type { LabeledOption } from '../controllers/Select';
import type { State } from '../shared/state';
import type { Folder } from '../Folder';
import { Select } from '../controllers/Select';
import { type Disableable } from '../shared/decorators/disableable-class-decorator';
import { Input } from './Input';
export type SelectInputOptions<T = ValidInputValue> = Omit<InputOptions<T | {
    label: string;
    value: T;
}>, 'onChange' | 'value'> & {
    __type?: 'SelectInputOptions';
    onChange?: (value: LabeledOption<T>) => void;
} & ({
    labelKey?: never;
    value?: {
        label: string;
        value: T;
    };
    options: {
        label: string;
        value: T;
    }[] | (() => {
        label: string;
        value: T;
    }[]);
} | {
    labelKey: keyof T;
    value?: T;
    options: T[] | (() => T[]);
});
export declare const SELECT_INPUT_DEFAULTS: SelectInputOptions;
export interface SelectControllerElements<T> extends ElementMap {
    container: HTMLElement;
    select: Select<T>['elements'];
}
export interface SelectInputEvents<T> extends InputEvents<LabeledOption<T>> {
    preview: LabeledOption<T>;
    open: void;
    close: void;
    cancel: void;
}
export interface InputSelect extends Disableable {
}
export declare class InputSelect<T = unknown> extends Input<LabeledOption<T>, SelectInputOptions<T>, SelectControllerElements<T>, SelectInputEvents<T>> {
    #private;
    readonly __type: "InputSelect";
    readonly initialValue: LabeledOption<T>;
    state: State<LabeledOption<T>>;
    set options(v: SelectInputOptions['options']);
    get options(): LabeledOption<T>[];
    /**
     * The select controller instance.
     */
    select: Select<T>;
    /**
     * The currently selected option as a labeled option.
     */
    labeledSelection: LabeledOption<T>;
    private _log;
    constructor(options: Partial<SelectInputOptions<T>>, folder: Folder);
    resolveOptions(providedOptions: SelectInputOptions['options']): LabeledOption<T>[];
    resolveInitialValue(opts: SelectInputOptions<T>): {
        label: any;
        value: any;
    };
    resolveInitialLabel(initialValue: this['initialValue'], opts: SelectInputOptions<T>): string;
    get targetObject(): Record<any, any> | undefined;
    get targetKey(): any;
    get targetValue(): T;
    set targetValue(v: T);
    /**
     * Selects the given {@link LabeledOption} and updates the ui.
     */
    set(value: LabeledOption<T>): this;
    enable(): this;
    disable(): this;
    refresh: () => this;
    dispose(): void;
}
