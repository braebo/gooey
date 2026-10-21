import { styled } from "../shared/decorators/styled.js";
import { __decorateMetadata } from "../_virtual/_@oxc-project_runtime@0.95.0/helpers/decorateMetadata.js";
import { __decorate } from "../_virtual/_@oxc-project_runtime@0.95.0/helpers/decorate.js";
import { create } from "../shared/create.js";

//#region src/svg/TerminalSvg.ts
let TerminalSvg = class TerminalSvg$1 {
	class = "gooey-terminal-icon";
	element;
	classes = [this.class, "gooey-cancel"];
	constructor(folder) {
		const parent = folder.elements.toolbar.container;
		let style = void 0;
		if (folder.isRoot) this.classes.push("gooey-terminal-icon-root");
		const existing = parent.querySelector(`.${this.class}`);
		if (existing) existing.remove();
		this.element = create("div", {
			parent,
			classes: this.classes,
			innerHTML: `
                <svg class="icon terminal" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" x2="20" y1="19" y2="19"></line>
                </svg>
                `.replaceAll(/\t|\n/g, ""),
			tooltip: {
				text: `console.log`,
				delay: 1500,
				placement: "top",
				offsetX: folder.isRoot ? `8px` : `-8px`,
				style: folder.gooey?._getStyles
			},
			style,
			onclick: (e) => {
				e.stopPropagation();
				e.preventDefault();
				console.log(folder);
			}
		});
	}
	static style = `
        .gooey-terminal-icon {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 18px;
            height: 18px;

            color: var(--gooey-fg-d);
            opacity: 0.1;
            border-radius: 3px;

            transition-duration: 0.2s;
            transition-property: opacity, background;
            transition-delay: 0.25s, 0s;
            
            pointer-events: auto;
            cursor: pointer;
            z-index: 1;

            &:hover {
                opacity: 0.75;
                background: var(--gooey-bg-b);
            }
        }

    `;
};
TerminalSvg = __decorate([styled, __decorateMetadata("design:paramtypes", [Object])], TerminalSvg);

//#endregion
export { TerminalSvg };
//# sourceMappingURL=TerminalSvg.js.map