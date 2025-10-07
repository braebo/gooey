/**
 * @type {import("shiki").ThemeRegistrationRaw}
 */
export const dark = {
	name: 'serendipity',
	type: 'dark',
	colors: {
		'editor.background': '#0B0B12',
		'editor.foreground': '#D4D4D4',
	},
	settings: [
		{
			name: 'Global settings',
			settings: {
				background: '#15161D',
				foreground: '#777D8F',
			},
		},
		{
			scope: ['comment', 'punctuation.definition.comment'],
			// settings: { foreground: '#35374A' },
			settings: { foreground: '#3E4057' },
		},
		{
			scope: ['constant'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: ['constant.numeric', 'constant.language', 'constant.charcter.escape'],
			settings: { foreground: '#F8D2C9' },
		},
		{
			scope: ['entity.name'],
			settings: { foreground: '#F8D2C9' },
		},
		{
			scope: ['entity.name.section', 'entity.name.tag', 'entity.name.namespace', 'entity.name.type'],
			settings: { foreground: '#94B8FF' },
		},
		{
			scope: ['entity.other.attribute-name', 'entity.other.inherited-class'],
			settings: { foreground: '#9CCFD8', fontStyle: 'italic' },
		},
		{
			scope: ['invalid'],
			settings: { foreground: '#EE8679' },
		},
		{
			scope: ['invalid.deprecated'],
			settings: { foreground: '#8D8F9E' },
		},
		{
			scope: ['keyword'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: ['meta.tag', 'meta.brace'],
			settings: { foreground: '#DEE0EF' },
		},
		{
			scope: ['meta.import', 'meta.export'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: 'meta.directive.vue',
			settings: { foreground: '#9CCFD8', fontStyle: 'italic' },
		},
		{
			scope: 'meta.property-name.css',
			settings: { foreground: '#94B8FF' },
		},
		{
			scope: 'meta.property-value.css',
			settings: { foreground: '#A78BFA' },
		},
		{
			scope: 'meta.tag.other.html',
			settings: { foreground: '#8D8F9E' },
		},
		{
			scope: ['punctuation'],
			settings: { foreground: '#8D8F9E' },
		},
		{
			scope: ['punctuation.accessor'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: ['punctuation.definition.string'],
			settings: { foreground: '#A78BFA' },
		},
		{
			scope: ['punctuation.definition.tag'],
			settings: { foreground: '#6B6D7C' },
		},
		{
			scope: ['storage.type', 'storage.modifier'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: ['string'],
			settings: { foreground: '#A78BFA' },
		},
		{
			scope: ['support'],
			settings: { foreground: '#F8D2C9' },
		},
		{
			scope: ['support.constant'],
			settings: { foreground: '#A78BFA' },
		},
		{
			scope: ['support.function'],
			settings: { foreground: '#EE8679', fontStyle: 'italic' },
		},
		{
			scope: ['variable'],
			settings: {
				foreground: '#F8D2C9',
			},
		},
		{
			scope: ['variable.other', 'variable.language', 'variable.function', 'variable.argument'],
			settings: { foreground: '#DEE0EF' },
		},
		{
			scope: ['variable.parameter'],
			settings: { foreground: '#9CCFD8' },
		},
		// Dim template tags
		{
			scope: [
				'punctuation.definition.tag',
				'entity.name.tag.svelte',
				'punctuation.separator.key-value.svelte',
				'constant.name.attribute.tag.pug',
			],
			settings: { foreground: '#777D8F' },
		},
		// Dim semicolons
		{
			scope: ['punctuation.terminator'],
			settings: { foreground: '#777D8F' },
		},
		// Dim svelte parens in script tag, i.e. - `const x = (a || b) <--`
		{
			scope: ['meta.embedded.block.svelte'],
			settings: { foreground: '#777D8F' },
		},
	],
}

/**
 * @type {import("shiki").ThemeRegistrationRaw}
 */
export const light = {
	name: 'serendipity-light',
	type: 'light',
	colors: {
		'editor.background': '#2D2F3D',
		'editor.foreground': '#DFE0EF',
	},
	settings: [
		{
			name: 'Global settings',
			settings: { background: '#2D2F3D', foreground: '#DFE0EF' },
		},
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: { foreground: '#8f92b3' },
		},
		{
			scope: ['constant'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: ['constant.numeric', 'constant.language', 'constant.charcter.escape'],
			settings: { foreground: '#ffc7ba' },
		},
		{
			scope: ['entity.name'],
			settings: { foreground: '#ffc7ba' },
		},
		{
			scope: ['entity.name.section', 'entity.name.tag', 'entity.name.namespace', 'entity.name.type'],
			settings: { foreground: '#94B8FF' },
		},
		{
			scope: ['entity.other.attribute-name', 'entity.other.inherited-class'],
			settings: { foreground: '#9CCFD8', fontStyle: 'italic' },
		},
		{
			scope: ['invalid'],
			settings: { foreground: '#EE8679' },
		},
		{
			scope: ['invalid.deprecated'],
			settings: { foreground: '#8D8F9E' },
		},
		{
			scope: ['keyword'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: ['meta.tag', 'meta.brace'],
			settings: { foreground: '#DEE0EF' },
		},
		{
			scope: ['meta.import', 'meta.export'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: 'meta.directive.vue',
			settings: { foreground: '#9CCFD8', fontStyle: 'italic' },
		},
		{
			scope: 'meta.property-name.css',
			settings: { foreground: '#94B8FF' },
		},
		{
			scope: 'meta.property-value.css',
			settings: { foreground: '#A78BFA' },
		},
		{
			scope: 'meta.tag.other.html',
			settings: { foreground: '#8D8F9E' },
		},
		{
			scope: ['punctuation'],
			settings: { foreground: '#8D8F9E' },
		},
		{
			scope: ['punctuation.accessor'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: ['punctuation.definition.string'],
			settings: { foreground: '#A78BFA' },
		},
		{
			scope: ['punctuation.definition.tag'],
			settings: { foreground: '#6B6D7C' },
		},
		{
			scope: ['storage.type', 'storage.modifier'],
			settings: { foreground: '#5BA2D0' },
		},
		{
			scope: ['string'],
			settings: { foreground: '#A78BFA' },
		},
		{
			scope: ['support'],
			settings: { foreground: '#ffc7ba' },
		},
		{
			scope: ['support.constant'],
			settings: { foreground: '#A78BFA' },
		},
		{
			scope: ['support.function'],
			settings: { foreground: '#EE8679', fontStyle: 'italic' },
		},
		{
			scope: ['variable'],
			settings: { foreground: '#ffc7ba' },
		},
		{
			scope: ['variable.other', 'variable.language', 'variable.function', 'variable.argument'],
			settings: { foreground: '#f5f5f5' },
		},
		{
			scope: ['variable.parameter'],
			settings: { foreground: '#9CCFD8' },
		},
		// Dim template tags
		{
			scope: [
				'punctuation.definition.tag',
				'entity.name.tag.svelte',
				'punctuation.separator.key-value.svelte',
				'constant.name.attribute.tag.pug',
			],
			settings: { foreground: '#777D8F' },
		},
		// Dim semicolons
		{
			scope: ['punctuation.terminator'],
			settings: { foreground: '#777D8F' },
		},
		// Dim svelte parens in script tag, i.e. - `const x = (a || b) <--`
		{
			scope: ['meta.embedded.block.svelte'],
			settings: { foreground: '#777D8F' },
		},
	],
}

export default { dark, light }
