import { JavascriptStyleProperty } from "./css-types.js";
import { Tooltip, TooltipOptions } from "./Tooltip.js";

//#region src/shared/create.d.ts
type CreateOptions<T extends HTMLElement | HTMLInputElement = HTMLElement, K extends keyof T = keyof T, TK extends T[K] = T[K]> = {
  parent?: Element | Document;
  classes?: string[];
  id?: string;
  dataset?: Record<string, string>;
  textContent?: string;
  innerText?: string;
  cssText?: string;
  style?: Partial<Record<JavascriptStyleProperty, string | number>>;
  variables?: Record<`--${string}`, string | number>;
  type?: string;
  attributes?: Record<string, string>;
  value?: any;
  tooltip?: Partial<TooltipOptions>;
  innerHTML?: string;
  children?: HTMLElement[];
  min?: number;
  max?: number;
  step?: number;
  tooltipInstance?: Tooltip;
  onclick?: (e: MouseEvent) => void;
} & Partial<Record<K, TK | unknown>>;
//#endregion
export { CreateOptions };
//# sourceMappingURL=create.d.ts.map