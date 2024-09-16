<script>
	import Basics from '$lib/data/docs/02_basics/Basics.svelte'

	import InstallCommands from '$lib/data/docs/01_install/InstallCommands.svelte'
	import Install from '$lib/data/docs/01_install/Install.svelte'
	import Import from '$lib/data/docs/02_basics/Import.svelte'
	import Hero from '$lib/data/docs/01_install/Hero.svelte'
	import { page } from '$app/stores'

	const A = $page.url.searchParams.has('a')
	const B = $page.url.searchParams.has('b')
</script>

<Hero />

<div class="br-lg"></div>

{#if A}
	<Install />
{/if}

{#if B || !A}
	<InstallCommands />
{/if}

<div class="br-lg"></div>

<Import />

<div class="br-lg"></div>

<Basics />

<div class="br-xl"></div>
<div class="br-xl"></div>
<div class="br-xl"></div>
