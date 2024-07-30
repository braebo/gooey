import type { ValidInput } from '../inputs/Input';
import { Tooltip } from '../shared/Tooltip';
import { CopySVG } from '../svg/CopySVG';
export declare class CopyButton {
    #private;
    container: HTMLElement;
    text: () => string;
    message: string;
    input?: ValidInput | undefined;
    button: HTMLDivElement;
    icon: CopySVG;
    /**
     * When the copy animation is active, this is `true` and the button has an `active` class.
     */
    active: boolean;
    /**
     * When the copy animation is outroing, this is `true` and the button has an `outro` class.
     */
    outro: boolean;
    tooltip: Tooltip;
    constructor(container: HTMLElement, text: () => string, message?: string, input?: ValidInput | undefined);
    copy: () => void;
}
