<script lang="ts">
	import '@fontsource-variable/fredoka'
	import '../styles/app.scss'

	import { setupViewTransition } from 'sveltekit-view-transition'
	import HeroGradient from '$lib/components/HeroGradient.svelte'
	import NavMobile from '$lib/components/Nav/NavMobile.svelte'
	import Header from '$lib/components/Header/Header.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import { defer } from '../../../src/shared/defer'
	import { preloadCode } from '$app/navigation'
	import { device } from '$lib/device.svelte'
	import { Tree } from '$lib/utils/tree'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	setupViewTransition()

	const { children } = $props()

	const links = new Tree($page.data.routes as string[]).root.children!

	onMount(() => {
		if ($page.url.pathname !== '/docs') {
			defer(() => preloadCode('/docs'))
		}
	})
</script>

<PageTitle />

<Header />

{#if device.mobile}
	<NavMobile {links} />
{/if}

<div class="page">
	{@render children?.()}
</div>

<HeroGradient />

<style>
	.page {
		display: flex;
		gap: 1rem;

		width: 100%;
		min-height: 100vh;

		background-color: var(--secondary);

		z-index: 0;
	}
</style>
