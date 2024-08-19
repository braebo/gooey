import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		browser: {
			provider: 'webdriverio',
			name: 'chrome',
			enabled: true,
		},
	},
})
