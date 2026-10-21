import { InputNumber, NumberInputOptions } from "../inputs/InputNumber.js";

//#region src/controllers/NumberButtonsController.d.ts
declare class NumberButtonsController {
  input: InputNumber;
  opts: NumberInputOptions;
  parent?: HTMLElement | undefined;
  elements: {
    container: HTMLDivElement;
    increment: HTMLDivElement;
    decrement: HTMLDivElement;
  };
  constructor(input: InputNumber, opts: NumberInputOptions, parent?: HTMLElement | undefined);
  rampChange(direction?: number): void;
  rampChangeUp(): void;
  rampChangeDown(): void;
}
//#endregion
export { NumberButtonsController };
//# sourceMappingURL=NumberButtonsController.d.ts.map