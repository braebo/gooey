import { State } from "../shared/state.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptions, ValidInput } from "./Input.js";

//#region src/inputs/InputArray.d.ts
type ArrayInputOptions<T = any> = InputOptions<T[]> & {
  readonly __type?: 'ArrayInputOptions';
  /**
   * The maximum number of items to display.  Items beyond this count are not rendered, and a
   * small note is displayed instead.  They remain part of the array's value.
   * @default 20
   */
  maxItems?: number;
  /**
   * Whether the array folder should be closed by default.
   * @default true
   */
  closed?: boolean;
};
interface ArrayControllerElements extends ElementMap {
  container: HTMLElement;
  content: HTMLElement;
}
declare class InputArray<T = any> extends Input<T[], ArrayInputOptions<T>, ArrayControllerElements> {
  #private;
  readonly __type: "InputArray";
  readonly initialValue: T[];
  readonly state: State<T[]>;
  /**
   * The internal folder that contains the individual array item inputs.
   */
  folder: Folder;
  /**
   * Individual inputs for each (rendered) array item.
   */
  items: ValidInput[];
  constructor(options: Partial<ArrayInputOptions<T>>, folder: Folder);
  private _createArrayItems;
  private _createItemInput;
  private _updateArrayItem;
  set: (v: T[]) => this;
  private _recreateItems;
  refresh: () => this;
  dispose(): void;
}
//#endregion
export { ArrayInputOptions, InputArray };
//# sourceMappingURL=InputArray.d.ts.map