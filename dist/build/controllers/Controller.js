import { EventManager } from '../shared/EventManager';
import { toFn } from '../shared/toFn';
export class Controller {
    /**
     * Whether the controller has been disposed.
     */
    disposed = false;
    _disabled;
    /**
     * Whether the controller is disabled.  A function can be used to
     * dynamically determine the disabled state.
     */
    get disabled() {
        return this._disabled();
    }
    set disabled(v) {
        this._disabled = typeof v === 'function' ? v : () => v;
        this._disabled() ? this.disable() : this.enable();
    }
    constructor(opts) {
        this._disabled = toFn(opts.disabled);
    }
    get on() {
        return this._evm.on;
    }
    get listen() {
        return this._evm.on;
    }
    get emit() {
        return this._evm.emit;
    }
    enable() {
        this.disabled = false;
    }
    disable() {
        this.disabled = false;
    }
    dispose() {
        this.disposed = true;
        this._evm.dispose();
    }
}
