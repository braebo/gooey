import type { ElementMap, InputOptions } from './Input';
import type { Tooltip } from '../shared/Tooltip';
import type { State } from '../shared/state';
import type { Folder } from '../Folder';
import { Input } from './Input';
/**
 * Options for the {@link InputSwitch} class.
 */
export type SwitchInputOptions = InputOptions<boolean> & {
    readonly __type?: 'SwitchInputOptions';
    /**
     * Text to display in various parts of the switch.
     */
    labels?: {
        /** Text to display when the state is `true` */
        true: {
            /**
             * Represents the `true` state, i.e. `'on' | 'active' | 'enabled'`
             * @default 'on'
             */
            state?: string;
            /**
             * Represents, i.e. `'turn on' | 'activate' | 'enable'`.
             * Displayed on the tooltip when the switch is `false`.
             * @default 'Enable'
             */
            verb?: string;
        };
        /** Text to display when the state is `false` */
        false: {
            /**
             * Represents the `false` state, i.e. `'off' | 'inactive' | 'disabled'`
             * @default 'off'
             */
            state?: string;
            /**
             * Represents the action, i.e. `'turn off' | 'deactivate' | 'disable'`.
             * Displayed on the tooltip when the switch is `true`.
             * @default 'Disable'
             */
            verb?: string;
        };
    };
};
export declare const SWITCH_INPUT_DEFAULTS: {
    readonly __type: "SwitchInputOptions";
    readonly value: true;
    readonly labels: {
        readonly true: {
            readonly state: "on";
            readonly verb: "Enable";
        };
        readonly false: {
            readonly state: "off";
            readonly verb: "Disable";
        };
    };
};
export interface SwitchInputElements extends ElementMap {
    container: HTMLElement;
    input: HTMLButtonElement & {
        tooltip: Tooltip;
    };
    thumb: HTMLDivElement;
    stateText: HTMLDivElement;
}
/**
 * A switch {@link Input} for booleans.
 */
export declare class InputSwitch extends Input<boolean, SwitchInputOptions, SwitchInputElements> {
    #private;
    readonly __type: "InputSwitch";
    readonly state: State<boolean>;
    initialValue: boolean;
    constructor(options: Partial<SwitchInputOptions>, folder: Folder);
    set(v?: boolean): this;
    refresh(v?: boolean): this;
    dispose(): void;
}
