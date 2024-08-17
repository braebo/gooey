<script lang="ts">
	import '../styles/app.scss'

	import { setupViewTransition } from 'sveltekit-view-transition'
	import Header from '$lib/components/Header/Header.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import { Fractils } from 'fractils'

	setupViewTransition()

	const { children } = $props()
</script>

<PageTitle />

<Fractils />

<Header />

<div class="page">
	{@render children?.()}
</div>

<style>
	.page {
		--sidebar-bg: color-mix(in lch, var(--bg-a), var(--bg-b) 50%);

		--bg-img: linear-gradient(
			in hsl 24deg,
			color-mix(in lab, var(--bw), var(--bg-a)) 0%,
			color-mix(in lch, var(--bg-b) 20%, var(--bg-c) 45%)
		);

		--primary: light-dark(var(--bg-a), var(--bg-a));
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
