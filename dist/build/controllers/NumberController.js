import { modIcon, modKey } from '../shared/keys.js';
import { getStyle } from '../shared/getStyle.js';
import { create } from '../shared/create.js';
import { Logger } from '../shared/logger.js';

class NumberController {
    input;
    opts;
    parent;
    element;
    dragEnabled = false;
    dragging = false;
    hovering = false;
    delta = 0;
    _log;
    constructor(input, opts, parent) {
        this.input = input;
        this.opts = opts;
        this.parent = parent;
        this._log = new Logger(`NumberController ${this.input.title}`, { fg: 'darkgoldenrod' });
        this.element = create('input', {
            type: 'number',
            classes: ['gooey-controller', 'gooey-controller-number'],
            value: String(input.state.value),
            parent,
            tooltip: {
                text: /*html*/ `Hold <span class="fractils-hotkey">${modIcon()}</span> to drag`,
                placement: 'top',
                delay: 1500,
                parent,
                styles: {
                    background: 'var(--gooey-bg-a)',
                    color: 'var(--gooey-fg-a)',
                    '--fractils-hotkey_background': 'var(--gooey-bg-b)',
                    '--fractils-hotkey_color': 'var(--gooey-fg-a)',
                },
            },
        });
        if ('step' in opts) {
            this.element.step = String(opts.step);
        }
        input.listen(this.element, 'pointerenter', this.hoverStart);
    }
    hoverStart = (e) => {
        this._log.fn('hoverStart').debug(e);
        this.hovering = true;
        this.element.classList.add('hovering');
        this.maybeEnableDrag(e);
        this.element.removeEventListener('pointerleave', this.hoverEnd);
        this.element.addEventListener('pointerleave', this.hoverEnd);
        document.removeEventListener('keydown', this.maybeEnableDrag);
        document.addEventListener('keydown', this.maybeEnableDrag);
    };
    hoverEnd = (e) => {
        this._log.fn('hoverEnd').debug(e);
        this.hovering = false;
        this.element.classList.remove('hovering');
        this.cancelDrag(e);
        this.element.removeEventListener('pointerleave', this.hoverEnd);
        document.removeEventListener('keydown', this.maybeEnableDrag);
    };
    dragKeyHeld = (e) => {
        return modKey(e);
    };
    cancelDrag = (e) => {
        this._log.fn('cancelDrag').debug(e);
        this.dragEnabled = e.type === 'keyup' ? this.dragKeyHeld(e) : false;
        document.removeEventListener('keyup', this.cancelDrag);
        this.element.removeEventListener('pointerleave', this.cancelDrag);
        this.element.removeEventListener('pointerdown', this.maybeDragStart);
        if (!this.dragEnabled) {
            this.element.style.cursor = this.element.dataset['cursor'] ?? 'text';
            if (this.dragging) {
                this.dragEnd();
            }
        }
    };
    maybeEnableDrag = (e) => {
        this._log.fn('maybeEnableDrag').debug(e);
        if (this.dragKeyHeld(e)) {
            this.dragEnabled = true;
            document.removeEventListener('keyup', this.cancelDrag);
            document.addEventListener('keyup', this.cancelDrag);
            this.element.removeEventListener('pointerleave', this.cancelDrag);
            this.element.addEventListener('pointerleave', this.cancelDrag);
            this.element.removeEventListener('pointerdown', this.maybeDragStart);
            this.element.addEventListener('pointerdown', this.maybeDragStart);
            this.element.dataset['cursor'] = getStyle(this.element, 'cursor');
            this.element.style.cursor = 'ns-resize';
        }
    };
    maybeDragStart = () => {
        if (this.hovering && this.dragEnabled) {
            this.dragStart();
        }
    };
    dragStart = async () => {
        this._log.fn('dragStart').debug();
        this.dragging = true;
        this.element.dispatchEvent(new Event('dragStart'));
        this.element.tooltip.hide();
        this.element.removeEventListener('pointermove', this.drag);
        this.element.addEventListener('pointermove', this.drag);
        document.removeEventListener('pointerup', this.dragEnd);
        document.addEventListener('pointerup', this.dragEnd);
        this.element.classList.add('dragging');
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock#browser_compatibility
        await this.element.requestPointerLock();
        this.element.blur();
    };
    dragEnd = () => {
        this._log.fn('dragEnd').debug();
        this.dragging = false;
        this.element.classList.remove('dragging');
        this.element.removeEventListener('pointermove', this.drag);
        document.removeEventListener('pointerup', this.dragEnd);
        document.exitPointerLock();
        this.element.dispatchEvent(new Event('dragEnd'));
    };
    drag = (e) => {
        if (!this.dragging)
            return;
        const multiplier = e.shiftKey ? 4 : e.altKey ? 0.1 : 1;
        const direction = Math.sign(e.movementY);
        this.delta += Math.abs(e.movementY);
        if (this.delta > +this.element.step) {
            const amount = +this.element.step * multiplier * -direction;
            this.element.value = String(this.element.valueAsNumber + amount);
            direction === -1
                ? this.element.stepUp(+this.element.step * multiplier)
                : this.element.stepDown(+this.element.step * multiplier);
            this.delta = 0;
            this.element.dispatchEvent(new Event('input'));
        }
    };
    dispose() {
        this.element.removeEventListener('pointerenter', this.hoverStart);
        this.element.removeEventListener('pointerleave', this.hoverEnd);
        this.element.removeEventListener('pointermove', this.drag);
        document.removeEventListener('keydown', this.maybeEnableDrag);
        document.removeEventListener('keyup', this.cancelDrag);
        this.element.removeEventListener('pointerleave', this.cancelDrag);
        this.element.removeEventListener('pointerdown', this.maybeDragStart);
        document.removeEventListener('pointerup', this.dragEnd);
        this.element.tooltip.dispose();
        this.element.remove();
    }
}

export { NumberController };
//# sourceMappingURL=NumberController.js.map
