export interface Styled {
    initialized: boolean;
    stylesheet: HTMLStyleElement;
}
/**
 * A class decorator that creates a style element in the head of the document when the class is
 * instantiated.  The style element is created with the `style` property of the class.  The style
 * element is only created once, and subsequent instantiations of the class will not create another
 * style element.
 */
export declare function styled<T extends {
    new (...args: any[]): {};
    style: string;
}>(constructor: T): T & Styled;
