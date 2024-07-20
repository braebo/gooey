/// <reference types="mdsvex/globals" />

declare global {
	namespace App {
		interface Locals {
			theme: 'light' | 'dark' | 'system'
		}
		interface PageData {
			theme: 'light' | 'dark' | 'system'
			routes: Array<keyof typeof import('../.svelte-kit/types/route_meta_data.json')>
		}
		// interface Platform {}
	}
}

export {}
