import type { DestructuredVars, ThemeVars } from '../shared/css-custom-properties';
import type { ExtendedVars } from '../styles/themer/types';
export type GuiCoreVars = DestructuredVars<typeof GUI_VARS_STRUCTURED, typeof VAR_PREFIX>;
export declare const VAR_PREFIX: "fracgui";
declare const GUI_VARS_STRUCTURED: ThemeVars;
export declare const GUI_VARS: ExtendedVars;
export {};
