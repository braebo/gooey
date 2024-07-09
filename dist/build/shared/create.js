import { Tooltip } from './Tooltip.js';
import { entries } from './object.js';

function create(tagname, options) {
    const el = globalThis?.document?.createElement(tagname);
    if (options) {
        if (options.classes)
            el.classList.add(...options.classes);
        if (options.id)
            el.id = options.id;
        if (options.innerHTML)
            el.innerHTML = options.innerHTML;
        if (options.textContent)
            el.textContent = options.textContent;
        if (options.innerText)
            el.innerText = options.innerText;
        if (options.cssText)
            el.style.cssText = options.cssText;
        if (options.dataset)
            Object.assign(el.dataset, options.dataset);
        if (options.value && el instanceof HTMLInputElement)
            el.value = options.value;
        if (options.type)
            el.setAttribute('type', options.type);
        if (options.min)
            el.setAttribute('min', String(options.min));
        if (options.max)
            el.setAttribute('max', String(options.max));
        if (options.step)
            el.setAttribute('step', String(options.step));
        if (options.attributes) {
            for (const [key, value] of entries(options.attributes)) {
                el.setAttribute(key, value);
            }
        }
        if (options.style) {
            for (const [key, value] of entries(options.style)) {
                el.style[key] = String(value);
            }
        }
        if (options.variables) {
            for (const [key, value] of entries(options.variables)) {
                el.style.setProperty(key, String(value));
            }
        }
        if (options.parent)
            options.parent.appendChild(el);
        if (options.tooltip) {
            // @ts-expect-error
            el.tooltip = {};
            if (options.tooltipInstance) {
                // @ts-expect-error
                el.tooltip = options.tooltipInstance;
            }
            else {
                // @ts-expect-error
                el.tooltip = new Tooltip(el, options.tooltip);
            }
        }
        if (options.children) {
            for (const child of options.children ?? []) {
                if (el === null)
                    throw new Error('This should never happen');
                if (child) {
                    el.appendChild(child);
                }
            }
        }
        if (options.onclick) {
            el.addEventListener('click', options.onclick);
        }
    }
    return el;
}

export { create };
//# sourceMappingURL=create.js.map
