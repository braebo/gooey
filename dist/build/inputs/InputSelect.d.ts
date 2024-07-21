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
} & {
    labelKey?: string;
    value?: T;
    options?: Array<T>;
};
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
export declare class InputSelect<TValueType = any> extends Input<LabeledOption<TValueType>, SelectInputOptions<TValueType>, SelectControllerElements<TValueType>, SelectInputEvents<TValueType>> {
    #private;
    readonly __type: "InputSelect";
    readonly initialValue: LabeledOption<TValueType>;
    state: State<LabeledOption<TValueType>>;
    set options(v: SelectInputOptions['options']);
    get options(): LabeledOption<TValueType>[];
    /**
     * The select controller instance.
     */
    select: Select<TValueType>;
    /**
     * The currently selected option as a labeled option.
     */
    labeledSelection: LabeledOption<TValueType>;
    private _log;
    constructor(options: Partial<SelectInputOptions<TValueType>>, folder: Folder);
    resolveOptions(providedOptions: TValueType[]): LabeledOption<TValueType>[];
    resolveInitialValue(opts: SelectInputOptions<TValueType>): LabeledOption<TValueType>;
    resolveInitialLabel(initialValue: this['initialValue'], opts: SelectInputOptions<TValueType>): string;
    get targetObject(): Record<any, any> | undefined;
    get targetKey(): any;
    get targetValue(): TValueType;
    set targetValue(v: TValueType);
    /**
     * Selects the given {@link LabeledOption} and updates the ui.
     */
    set(value: LabeledOption<TValueType>): this;
    enable(): this;
    disable(): this;
    refresh: () => this;
    dispose(): void;
}
