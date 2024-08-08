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
