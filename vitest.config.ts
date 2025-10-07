import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		projects: [
			{
				test: {
					name: 'gooey',
					include: ['src/**/*.test.ts'],
					browser: {
						// headless: true,
						provider: 'webdriverio',
						enabled: true,
						viewport: { width: 800, height: 1000 },
						instances: [
							{
								browser: 'chrome',
								viewport: { width: 800, height: 1000 },
							},
						],
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
