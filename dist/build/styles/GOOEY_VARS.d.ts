import type { DestructuredVars, ThemeVars } from '../shared/css-custom-properties';
import type { ExtendedVars } from './themer/types';
export type GooeyCoreVars = DestructuredVars<typeof GUI_VARS_STRUCTURED, typeof VAR_PREFIX>;
export declare const VAR_PREFIX: "gooey";
declare const GUI_VARS_STRUCTURED: ThemeVars;
export declare const GUI_VARS: ExtendedVars;
export {};
