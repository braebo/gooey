/**
 * @module A modern gooey library for typescript and javascript.
 */
export type { GooeyOptions, GooeyStorageOptions, GooeyPreset, GooeyElements } from './Gooey';
export { Gooey, GUI_DEFAULTS, GUI_STORAGE_DEFAULTS, GUI_WINDOWMANAGER_DEFAULTS } from './Gooey';
export { Folder } from './Folder';
export type { State } from './shared/state';
export { state } from './shared/state';
export type { ColorMode, ColorValue } from './shared/color/color';
export { Color, isColor, isColorFormat, parseColorFormat } from './shared/color/color';
export { Logger, logger } from './shared/logger';
