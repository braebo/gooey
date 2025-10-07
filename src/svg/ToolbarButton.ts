import type { StyleDefinition } from '../shared/css-types'
import type { TooltipOptions } from '../shared/Tooltip'
import type { Folder } from '../Folder'

import { styled } from '../shared/decorators/styled'
import { create } from '../shared/create'

export interface ToolbarButtonConfig {
	icon: string // SVG markup as string
	tooltip?: Partial<TooltipOptions>
	onClick?: (e: MouseEvent, folder: Folder) => void
	className?: string
	style?: StyleDefinition
}

@styled
export class ToolbarButton {
	class = 'gooey-toolbar-button'
	element: HTMLElement & { tooltip?: any }
	classes: string[]

	constructor(folder: Folder, config: ToolbarButtonConfig) {
		this.classes = [this.class, 'gooey-cancel']
		if (config.className) this.classes.push(config.className)

		const parent = folder.elements.toolbar.container

		// Remove existing button with same class if present (optional, for idempotency)
		if (config.className) {
			const existing = parent.querySelector(`.${config.className}`)
			if (existing) existing.remove()
		}

		this.element = create('div', {
			parent,
			classes: this.classes,
			innerHTML: config.icon,
			tooltip: config.tooltip,
			style: config.style,
			onclick: e => {
				e.stopPropagation()
				e.preventDefault()
				config.onClick?.(e, folder)
			},
		})
	}

	static style = /*css*/ `
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
	`
}
