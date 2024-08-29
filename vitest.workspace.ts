import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
	{
		test: {
			name: 'gooey',
			include: ['src/**/*.test.ts'],
			browser: {
				provider: 'webdriverio',
				name: 'chrome',
				enabled: true,
			},
		},
	},
	{
		test: {
			name: 'www',
			include: ['www/**/*.test.ts'],
		},
	},
])
