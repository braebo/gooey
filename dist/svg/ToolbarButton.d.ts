import { StyleDefinition } from "../shared/css-types.js";
import { TooltipOptions } from "../shared/Tooltip.js";
import { Folder } from "../Folder.js";

//#region src/svg/ToolbarButton.d.ts
interface ToolbarButtonConfig {
  icon: string;
  tooltip?: Partial<TooltipOptions>;
  onClick?: (e: MouseEvent, folder: Folder) => void;
  className?: string;
  style?: StyleDefinition;
}
declare class ToolbarButton {
  class: string;
  element: HTMLElement & {
    tooltip?: any;
  };
  classes: string[];
  constructor(folder: Folder, config: ToolbarButtonConfig);
  static style: string;
}
//#endregion
export { ToolbarButton, ToolbarButtonConfig };
//# sourceMappingURL=ToolbarButton.d.ts.map