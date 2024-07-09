type Constructor<T = any> = new (...args: any[]) => T;
export interface Disableable {
    /**
     * Whether the controller is disabled.  Assign it to a function to
     * dynamically determine the disabled state.  Reading it will always
     * return a boolean.
     */
    get disabled(): boolean;
    set disabled(value: boolean | (() => boolean));
}
/**
 * A class decorator that adds a `disabled` property to a class that implements an `enable` and
 * disable` method. The `disabled` property can be set to either a static boolean, or a function
 * that returns a boolean value.  The `disabled` state can be refreshed by assigning it to itself,
 * which is particularly useful when passing a function that depends on some external state.
 *
 * A private property, a getter, and a setter are added to the class:
 * - `private _disabled: () => boolean` - The internal function that determines the disabled state.
 * - `get disabled(): boolean` - The current disabled state.
 * - `set disabled(boolean | (() => boolean))` - Set the disabled state to either a static boolean or a
 *  function that returns a boolean.
 */
export declare function disableable<T extends Constructor<{
    enable(): void;
    disable(): void;
}>>(constructor: T): T & Constructor<Disableable>;
export {};
