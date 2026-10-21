import { styled } from "../shared/decorators/styled.js";
import { __decorateMetadata } from "../_virtual/_@oxc-project_runtime@0.95.0/helpers/decorateMetadata.js";
import { __decorate } from "../_virtual/_@oxc-project_runtime@0.95.0/helpers/decorate.js";
import { create } from "../shared/create.js";

//#region src/svg/ToolbarButton.ts
let ToolbarButton = class ToolbarButton$1 {
	class = "gooey-toolbar-button";
	element;
	classes;
	constructor(folder, config) {
		this.classes = [this.class, "gooey-cancel"];
		if (config.className) this.classes.push(config.className);
		const parent = folder.elements.toolbar.container;
		if (config.className) {
			const existing = parent.querySelector(`.${config.className}`);
			if (existing) existing.remove();
		}
		this.element = create("div", {
			parent,
			classes: this.classes,
			innerHTML: config.icon,
			tooltip: config.tooltip,
			style: config.style,
			onclick: (e) => {
				e.stopPropagation();
				e.preventDefault();
				config.onClick?.(e, folder);
			}
		});
	}
	static style = `
		.gooey-toolbar-button {
			display: flex;
			align-items: center;
			justify-content: center;
			
            width: 20px;
			height: 20px;
			margin: auto 0;

            color: var(--gooey-fg-d);
            opacity: 0.7;
			border-radius: 3px;
			
            /* transition: opacity 0.2s, background 0.2s; */
            transition-duration: 0.2s;
            transition-property: opacity, background;
            transition-delay: 0.25s, 0s;

            pointer-events: auto;
            cursor: pointer;
            z-index: 1;

            &:hover {
                opacity: 1;
                background: var(--gooey-bg-b);
            }
		}
	`;
};
ToolbarButton = __decorate([styled, __decorateMetadata("design:paramtypes", [Object, Object])], ToolbarButton);

//#endregion
export { ToolbarButton };
//# sourceMappingURL=ToolbarButton.js.map