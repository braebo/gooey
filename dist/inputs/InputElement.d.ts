import { State } from "../shared/state.js";
import { Folder } from "../Folder.js";
import { ElementMap, Input, InputOptions } from "./Input.js";

//#region src/inputs/InputElement.d.ts

/**
 * The content mounted by an {@link InputElement}.  Either an existing element, or a mount function
 * that receives the input's container.  A mount function may return a cleanup function, which runs
 * when the content is replaced or the input is disposed.
 */
type ElementContent = HTMLElement | ((container: HTMLElement) => void | (() => void) | undefined);
type ElementInputOptions = InputOptions<ElementContent> & {
  readonly __type?: 'ElementInputOptions';
  /**
   * The element or mount function to render in the input's content area.
   */
  value?: ElementContent;
};
interface ElementControllerElements extends ElementMap {
  container: HTMLElement;
}
/**
 * An input that mounts arbitrary content in its content area instead of a controller.  Use it to
 * put consumer-rendered DOM -- a chart, a markdown card, a preview -- in a folder alongside normal
 * inputs.  It has no value to serialize, so it opts out of presets by default.
 *
 * @example
 * ```ts
 * const card = gooey.addElement('Notes', container => {
 * 	container.innerHTML = renderMarkdown(notes)
 * 	return () => container.replaceChildren()
 * })
 *
 * card.set(someOtherElement)
 * ```
 */
declare class InputElement extends Input<ElementContent, ElementInputOptions, ElementControllerElements> {
  #private;
  readonly __type: "InputElement";
  readonly initialValue: ElementContent;
  readonly state: State<ElementContent>;
  constructor(options: Partial<ElementInputOptions>, folder: Folder);
  /**
   * The container the content is mounted into.
   */
  get container(): HTMLElement;
  /**
   * Replaces the mounted content, running the previous mount function's cleanup first.
   */
  set: (v: ElementContent) => this;
  refresh: () => this;
  dispose(): void;
}
//#endregion
export { ElementContent, ElementInputOptions, InputElement };
//# sourceMappingURL=InputElement.d.ts.map