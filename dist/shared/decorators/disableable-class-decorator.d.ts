//#region src/shared/decorators/disableable-class-decorator.d.ts
interface Disableable {
  /**
   * Whether the controller is disabled.  Assign it to a function to
   * dynamically determine the disabled state.  Reading it will always
   * return a boolean.
   */
  get disabled(): boolean;
  set disabled(value: boolean | (() => boolean));
}
//#endregion
export { Disableable };
//# sourceMappingURL=disableable-class-decorator.d.ts.map