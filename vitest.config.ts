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
						provider: 'playwright',
						enabled: true,
						viewport: { width: 800, height: 1000 },
						instances: [
							{
								browser: 'chromium',
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
