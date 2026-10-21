import { State } from "../shared/state.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptions } from "./Input.js";

//#region src/inputs/InputTextArea.d.ts
type TextAreaInputOptions = {
  readonly __type?: 'TextAreaInputOptions';
  /**
   * The maximum number of characters that can be entered.
   * @default 50
   */
  maxLength?: number;
} & InputOptions<string>;
interface TextAreaControllerElements extends ElementMap {
  container: HTMLElement;
  input: HTMLInputElement;
}
declare class InputTextArea extends Input<string, TextAreaInputOptions, TextAreaControllerElements> {
  #private;
  readonly __type: "InputTextArea";
  readonly initialValue: string;
  readonly state: State<string>;
  constructor(options: Partial<TextAreaInputOptions>, folder: Folder);
  set: (v?: string | Event) => this | undefined;
  refresh: () => this;
  dispose(): void;
}
//#endregion
export { InputTextArea, TextAreaInputOptions };
//# sourceMappingURL=InputTextArea.d.ts.map