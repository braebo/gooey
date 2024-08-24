<script lang="ts">
	import type { Branch } from '$lib/utils/tree'

	import Burger from '$lib/components/Nav/Mobile/Burger.svelte'
	import Mobile from '$lib/components/Nav/Mobile/Mobile.svelte'
	import { clickOutside } from '$lib/utils/clickOutside'
	import { device } from '$lib/device.svelte'

	let showMenu = $state(false)

	let { links }: { links: Branch[] } = $props()
</script>

{#if device.mobile}
	<div class="burger" use:clickOutside={{ whitelist: ['wrapper'] }} onoutclick={() => (showMenu = false)}>
		<Burger bind:showMenu />
	</div>

	<Mobile bind:showMenu {links} />
{/if}

<style>
	.burger {
		view-transition-name: burger;
		z-index: 101;
	}
</style>
