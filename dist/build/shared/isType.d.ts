export declare function isType<const T extends any, const U extends string = string>(value: T | boolean | undefined, type: U): value is NonNullable<T> & {
    __type: U;
};
export declare function isType(value: any, type: 'number'): value is number;
export declare function isType(value: any, type: 'string'): value is string;
export declare function isType(value: any, type: 'boolean'): value is boolean;
export declare function isType(value: any, type: 'function'): value is (...args: any[]) => any;
