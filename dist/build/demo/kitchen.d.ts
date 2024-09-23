import { Gooey, type GooeyOptions } from '..';
export declare const kitchen: (opts?: Partial<GooeyOptions>) => {
    readonly gooey: Gooey;
    readonly inputs: {
        readonly text: import("..").InputText;
        readonly number: import("..").InputNumber;
        readonly boolean: import("..").InputSwitch;
        readonly select: import("..").InputSelect<string[]>;
        readonly color: import("..").InputColor;
        readonly button: import("..").InputButton;
    };
    readonly folders: {
        readonly Folder: import("..").Folder;
    };
};
