import { Tooltip } from './Tooltip.js';
import { create } from './create.js';
import { append } from './mount.js';
import { CopySVG } from '../svg/CopySVG.js';

class CopyButton {
    container;
    text;
    message;
    input;
    button;
    icon;
    /**
     * When the copy animation is active, this is `true` and the button has an `active` class.
     */
    active = false;
    /**
     * When the copy animation is outroing, this is `true` and the button has an `outro` class.
     */
    outro = false;
    #completeTimeout;
    tooltip;
    constructor(container, text, message = 'Copy', input) {
        this.container = container;
        this.text = text;
        this.message = message;
        this.input = input;
        const button = create('div', {
            classes: ['copy-button'],
            title: 'Copy',
            attributes: {
                'aria-label': 'Copy',
                title: 'Copy',
            },
        });
        const svgContainer = create('div', {
            classes: ['copy-button-svg-container'],
        });
        this.button = button;
        this.icon = new CopySVG();
        this.button.addEventListener('click', this.copy);
        append(container, this.button, svgContainer, this.icon.svg);
        this.tooltip = new Tooltip(this.button, {
            text: message,
            placement: 'top',
            offsetY: '6px',
            delay: 600,
            style: input
                ? () => ({
                    '--fg-a': this.input?.folder.gooey?.wrapper.style.getPropertyValue('--gooey-fg-a'),
                    '--bg-a': this.input?.folder.gooey?.wrapper.style.getPropertyValue('--gooey-bg-a'),
                    '--bg-b': this.input?.folder.gooey?.wrapper.style.getPropertyValue('--gooey-bg-b'),
                })
                : undefined,
        });
    }
    copy = () => {
        if (typeof navigator === 'undefined')
            return;
        if (this.active)
            return;
        let text = this.text();
        if (!text)
            return;
        if (typeof text === 'object')
            text = JSON.stringify(text);
        navigator.clipboard?.writeText?.(text);
        clearTimeout(this.#completeTimeout);
        this.#animateIn();
    };
    #animateIn = () => {
        this.active = true;
        this.tooltip.show();
        this.button.blur();
        this.button.classList.add('active');
        this.icon.svg.classList.add('active');
        this.icon.front.setAttribute('x', '5.5');
        this.icon.front.setAttribute('y', '5.5');
        this.icon.front.setAttribute('rx', '10');
        this.icon.front.setAttribute('ry', '10');
        this.tooltip.text = 'Copied!';
        setTimeout(this.#animateOut, 1250);
    };
    #animateOut = () => {
        this.active = false;
        this.outro = true;
        this.button.classList.remove('active');
        this.icon.svg.classList.remove('active');
        this.icon.svg.classList.add('outro');
        this.button.classList.add('outro');
        this.icon.front.setAttribute('x', '8');
        this.icon.front.setAttribute('y', '8');
        this.icon.front.setAttribute('rx', '1');
        this.icon.front.setAttribute('ry', '1');
        // setTimeout(this.#complete, 500)
        setTimeout(this.#complete, 900);
    };
    #complete = () => {
        this.button.classList.remove('outro');
        this.icon.svg.classList.remove('outro');
        this.outro = false;
        this.tooltip.hide();
        clearTimeout(this.#completeTimeout);
        this.#completeTimeout = setTimeout(() => {
            this.tooltip.text = this.message;
        }, 300);
    };
}

export { CopyButton };
//# sourceMappingURL=CopyButton.js.map
