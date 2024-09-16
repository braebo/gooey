class Boilerplate {
	value = $state<'NPM' | 'JSR' | 'CDN'>('NPM')
}

export const importMode = new Boilerplate()

export const IMPORT_MODES = {
	NPM: 'gooey',
	JSR: '@braebo/gooey',
	CDN: 'https://esm.sh/gooey@latest',
	// CDN: 'https://esm.sh/gooey/gooey.min.js',
} as const
