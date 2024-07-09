import type { Input, ValidInputValue } from './inputs/Input';
/**
 * A recorded "action" callback that can be re-played forwards or backwards.
 */
export type Commit<V extends ValidInputValue = ValidInputValue> = {
    from: V;
    to: V;
    target: Input<V>;
    setter?: (v: V) => void;
};
export declare class UndoManager {
    pointer: number;
    maxHistory: number;
    stack: Commit[];
    /**
     * Ignores's all commits while `true`.
     */
    lockedExternally: boolean;
    /**
     * Ignores's all commits while `true`.
     */
    private _lockedInternally;
    constructor();
    commit<V>(commit: Commit<V>, _debounce?: number): void;
    undo: () => void;
    redo: () => void;
    clear(): void;
}
