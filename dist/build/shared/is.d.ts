export declare function isTouchEvent(e: Event): e is TouchEvent;
export declare function isMouseEvent(e: Event): e is PointerEvent;
export declare function isDefined<T>(value: T | undefined): value is T;
export declare function isString(value: unknown): value is string;
export declare function isHTMLElement(value: unknown): value is HTMLElement;
export declare function isObject(value: unknown): value is Record<string, unknown>;
export declare function isNumber(value: unknown): value is number;
