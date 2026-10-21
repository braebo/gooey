import { Input, ValidInputValue } from "./inputs/Input.js";

//#region src/UndoManager.d.ts

/**
 * A recorded "action" callback that can be re-played forwards or backwards.
 */
type Commit<V extends ValidInputValue = ValidInputValue> = {
  from: V;
  to: V;
  target: Input<V>;
  setter?: (v: V) => void;
};
declare class UndoManager {
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
//#endregion
export { Commit, UndoManager };
//# sourceMappingURL=UndoManager.d.ts.map