export type CssGradientType = 'linear' | 'radial' | 'conical';
export type CssGradientStops = [number, number | string][];
export declare function cssGradient(type: CssGradientType, direction: string, stops: CssGradientStops): string;
export declare function cssValue(value: number | string): string;
