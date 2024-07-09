import type { JavascriptStyleProperty } from './css-types';
import type { TooltipOptions } from './Tooltip';
import { Tooltip } from './Tooltip';
export type CreateOptions<T extends HTMLElement | HTMLInputElement = HTMLElement, K extends keyof T = keyof T, TK extends T[K] = T[K]> = {
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
export declare function create<const K extends keyof HTMLElementTagNameMap, TOptions extends CreateOptions<HTMLElementTagNameMap[K]>, TElement = HTMLElementTagNameMap[K] & {
    dataset: TOptions['dataset'];
}>(tagname: K, options?: TOptions): TOptions extends {
    tooltip: Partial<TooltipOptions>;
} ? TElement & {
    tooltip: Tooltip;
} : TElement;
