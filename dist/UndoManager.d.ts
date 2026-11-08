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
   * Ignores all commits while `true`.
   */
  lockedExternally: boolean;
  /**
   * `true` while an undo or redo replays a commit, so the replay isn't recorded as a change.
   */
  private _replaying;
  constructor();
  commit<V>(commit: Commit<V>, _debounce?: number): void;
  undo: () => void;
  redo: () => void;
  /**
   * Writes a commit's value back.  The lock spans the write alone, so a replay that commits
   * nothing (a color's setter writes its state directly) can't leave it set for the next real
   * change to be swallowed by.
   */
  private _replay;
  clear(): void;
}
//#endregion
export { Commit, UndoManager };
//# sourceMappingURL=UndoManager.d.ts.map