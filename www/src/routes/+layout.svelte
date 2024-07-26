<script lang="ts">
	import '../styles/app.scss'

	import { setupViewTransition } from 'sveltekit-view-transition'
	import Header from '$lib/components/Header/Header.svelte'
	import PageTitle from '$lib/components/PageTitle.svelte'
	import { Fractils } from 'fractils'

	setupViewTransition()
</script>

<PageTitle />

<Fractils />

<Header />

<!-- svelte-ignore slot_element_deprecated -->
<slot />

<style>
	:global(body) {
		overflow: hidden;
		max-height: 100vh;
	}
	:global(:root[theme='light'] body) {
		background-image: linear-gradient(75deg, var(--bw), var(--bg-c));
	}

	:global(:root[theme='dark'] body) {
		background-image: linear-gradient(
			24deg,
			color-mix(in lab, var(--bw), var(--bg-a)) 0%,
			color-mix(in lch, var(--bg-b) 20%, var(--bg-c) 45%)
		);
	}
</style>
