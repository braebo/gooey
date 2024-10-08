import type { StyleDefinition } from '../shared/css-types'
import type { Tooltip } from '../shared/Tooltip'
import type { Folder } from '../Folder'

import { styled } from '../shared/decorators/styled'
import { create } from '../shared/create'

@styled
export class TerminalSvg {
	class = 'gooey-terminal-icon'
	element: HTMLElement & { tooltip: Tooltip }
	classes = [this.class, 'gooey-cancel']

	constructor(folder: Folder) {
		const parent = folder.elements.header
		let style = undefined as StyleDefinition | undefined

		if (folder.isRoot) this.classes.push('gooey-terminal-icon-root')

		const existing = parent.querySelector(`.${this.class}`)
		if (existing) {
			existing.remove()
		}

		this.element = create('div', {
			parent,
			classes: this.classes,
			innerHTML: /*html*/ `
                <svg class="icon terminal" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" x2="20" y1="19" y2="19"></line>
                </svg>
                `.replaceAll(/\t|\n/g, ''),
			tooltip: {
				text: `console.log`,
				delay: 1500,
				placement: folder.isRoot ? 'right' : 'left',
				offsetX: folder.isRoot ? `${8}px` : `${-8}px`,
				// @ts-expect-error - @internal
				style: folder.gooey?._getStyles,
			},
			style,
			onclick: e => {
				e.stopPropagation()
				e.preventDefault()
				console.log(folder)
			},
		})
	}

	static style = /*css*/ `
        .gooey-terminal-icon {
            display: grid;
            place-items: center;
            
            position: absolute;
            right: 0.25rem;
            top: 0;
            bottom: 0;
            margin: auto 0;

            width: 20px;
            height: 20px;

            color: var(--gooey-fg-d);
            transform: translateY(15%);
            opacity: 0;
            /* opacity: 0.075; */
            border-radius: 3px;

            transition-duration: 0.2s;
            transition-property: opacity, background;
            transition-delay: 0.25s, 0s;

            z-index: 1;
            
            cursor: pointer;

            &:hover {
                background: var(--gooey-bg-b);
            }
        }

        .gooey-terminal-icon-root {
            right: unset;
            left: 0.33rem;
            top: -0.25rem;
        }

        .gooey-terminal-icon:hover {
            opacity: 0.75;
        }
    `
}
