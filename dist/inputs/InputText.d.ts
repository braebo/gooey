import { State } from "../shared/state.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptions } from "./Input.js";

//#region src/inputs/InputText.d.ts
type TextInputOptions = InputOptions<string> & {
  readonly __type?: 'TextInputOptions';
  /**
   * The maximum number of characters that can be entered.
   * @default 50
   */
  maxLength?: number;
};
interface TextControllerElements extends ElementMap {
  container: HTMLElement;
  input: HTMLInputElement;
}
declare class InputText extends Input<string, TextInputOptions, TextControllerElements> {
  #private;
  readonly __type: "InputText";
  readonly initialValue: string;
  readonly state: State<string>;
  constructor(options: Partial<TextInputOptions>, folder: Folder);
  set: (v?: string | Event) => this | undefined;
  refresh: () => this;
  dispose(): void;
}
//#endregion
export { InputText, TextInputOptions };
//# sourceMappingURL=InputText.d.ts.map