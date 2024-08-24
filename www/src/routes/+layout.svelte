<script lang="ts">
	import '../styles/app.scss'

	import { setupViewTransition } from 'sveltekit-view-transition'
	import NavMobile from '$lib/components/Nav/NavMobile.svelte'
	import Header from '$lib/components/Header/Header.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import { device } from '$lib/device.svelte'
	import { Tree } from '$lib/utils/tree'
	import { page } from '$app/stores'

	setupViewTransition()

	const { children } = $props()

	const links = new Tree($page.data.routes as string[]).root.children!
</script>

<PageTitle />

<Header />

{#if device.mobile}
	<NavMobile {links} />
{/if}

<div class="page">
	{@render children?.()}
</div>

<style>
	.page {
		--bg-ab: color-mix(in lab, var(--bg-a), var(--bg-b) 20%);
		--sidebar-bg: var(--bg-ab);

		--bg-img: linear-gradient(
			in hsl 24deg,
			color-mix(in lab, var(--bw), var(--bg-a)) 0%,
			color-mix(in lch, var(--bg-b) 20%, var(--bg-c) 45%)
		);

		--primary: light-dark(var(--bg-ab), var(--bg-a));
		--secondary: light-dark(var(--bg-b), color-mix(in lch, var(--bg-a) 66%, var(--bg-b)));
	}

	:global(:root[theme='light']) .page {
		--bg-img: linear-gradient(
			in lab 24deg,
			color-mix(in hsl, var(--bw), var(--bg-a)) 10%,
			color-mix(in hsl, var(--bg-b) 20%, var(--bg-e) 45%)
		);
	}

	.page {
		display: flex;
		gap: 1rem;

		width: 100%;
		min-height: 100vh;

		background-image: var(--bg-img);

		z-index: 0;
	}
</style>
