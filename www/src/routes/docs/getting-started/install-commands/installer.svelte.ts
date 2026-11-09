// TODO - Simplify this wretched InstallCommands.svelte component.

import { PersistedState } from 'runed'

export type Installer = (typeof INSTALLERS)[number]

export const INSTALLERS = ['PNPM', 'NPM', 'BUN', 'JSR', 'CDN'] as const

/** The currently selected installer. */
export const installer = new PersistedState<Installer>('gooey-installer', 'PNPM')
export const bundler = new PersistedState('gooey-installer-bundler', true)
export const jsr = new PersistedState('gooey-installer-jsr', false)

export function getCmd(mode: Installer) {
	switch (mode) {
		case 'NPM':
			return 'npm install'
		case 'PNPM':
			return 'pnpm add'
		case 'BUN':
			return 'bun add'
		case 'JSR':
			return 'npx jsr add'
		case 'CDN':
			return ''
	}
}

/** The module specifier an `import` uses after installing with `mode`. */
export function getImport(mode: Installer) {
	switch (mode) {
		case 'NPM':
		case 'PNPM':
		case 'BUN':
			return 'gooey'
		case 'JSR':
			return '@braebo/gooey'
		case 'CDN':
			return 'https://esm.sh/gooey'
	}
}

export function getLib(mode: Installer) {
	switch (mode) {
		case 'NPM':
		case 'PNPM':
		case 'BUN':
			return '<div class="gooey">gooey</div>'
		case 'JSR':
			return '<div style="transform: translateX(0.4rem);"><span style="color:color-mix(in lch, var(--theme-a), var(--light-e) 25%)">@braebo</span><span style="color:color-mix(in lch, var(--theme-a), var(--light-e) 75%)"><div style="display: inline-block; transform: translateX(2px);">/</span></div><div class="gooey">gooey</div></div>'
		case 'CDN':
			return 'https://esm.sh/<div class="gooey">gooey</div>@latest'
	}
}
