import { __decorate, __metadata } from './../external/.pnpm/@rollup_plugin-typescript@11.1.6_rollup@4.18.1_tslib@2.6.3_typescript@5.5.3/external/tslib/tslib.es6.js';
import { styled } from '../shared/decorators/styled.js';
import { create } from '../shared/create.js';

let TerminalSvg = class TerminalSvg {
    class = 'gooey-terminal-icon';
    element;
    classes = [this.class, 'gooey-cancel'];
    constructor(folder) {
        const parent = folder.isRoot ? folder.elements.header : folder.elements.title;
        if (folder.isRoot)
            this.classes.push('gooey-terminal-icon-root');
        this.element = create('div', {
            parent,
            classes: this.classes,
            innerHTML: /*html*/ `
                <svg class="icon terminal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" x2="20" y1="19" y2="19"></line>
                </svg>
                `.replaceAll(/\t|\n/g, ''),
            tooltip: {
                text: '<code>console.log(folder)</code>',
                delay: 1500,
                placement: 'right',
            },
            onclick: e => {
                e.stopPropagation();
                e.preventDefault();
                console.log(folder);
            },
        });
    }
    static style = /*css*/ `
        .gooey-terminal-icon {
            position: absolute;
            right: -1.5rem;
            top: 0;
            bottom: 0;

            width: 16px;
            height: 16px;

            color: var(--gooey-fg-d);
            transform: translateY(15%);
            opacity: 0;

            transition: opacity 0.2s;
            transition-delay: 0.5s;

            z-index: 1;
        }

        .gooey-terminal-icon-root {
            right: unset;
            left: 0.5rem;
            top: 0.25rem;
        }


        .gooey-terminal-icon:hover {
            opacity: 0.75;
        }

        .gooey-terminal-icon svg {
            width: 100%;
            height: 100%;
        }
    `;
};
TerminalSvg = __decorate([
    styled,
    __metadata("design:paramtypes", [Function])
], TerminalSvg);

export { TerminalSvg };
//# sourceMappingURL=TerminalSvg.js.map
