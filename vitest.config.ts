import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		browser: {
			enabled: true,
			name: 'chrome',
		},
		projects: [
			{
				test: {
					name: 'gooey',
					include: ['src/**/*.test.ts'],
					browser: {
						provider: 'webdriverio',
						name: 'chrome',
						enabled: true,
						viewport: { width: 800, height: 1000 },
					},
				},
			},
			{
				test: {
					name: 'www',
					include: ['www/**/*.test.ts'],
				},
			},
		],
	},
})
