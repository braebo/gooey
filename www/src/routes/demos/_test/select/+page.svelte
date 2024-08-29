<script lang="ts">
	import Gooish from '$lib/components/Gooish.svelte'

	import { Gooey } from '../../../../../../src/Gooey'
	import { onMount } from 'svelte'

	let goo1 = $state<Gooey>()
	let goo2 = $state<Gooey>()
	let container = $state<HTMLElement>()

	function addList(g: Gooey, length = 5) {
		// prettier-ignore
		return g.addSelect('list', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].slice(0, length), {
			onChange: (v) => console.log(v),
		})
	}

	$effect(() => {
		if (goo2) {
			const list = addList(goo2, 20)
			setTimeout(list.select.open, 200)
		}
	})

	onMount(() => {
		goo1 = new Gooey({ title: 'document element', position: 'top-center' })
		const list1 = addList(goo1, 10)
		setTimeout(list1.select.open, 200)

		return () => {
			goo1?.dispose()
			goo2?.dispose()
		}
	})
</script>

<section class="section">
	<div class="container" bind:this={container}>
		<!-- {#if goo2} -->
		<Gooish bind:gooey={goo2} {container} title="container div" position="center" />
		<!-- {/if} -->
	</div>
</section>

<style>
	.section {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		min-width: calc(100vw - 8rem);

		margin-top: 10rem;
	}

	.container {
		position: relative;
		height: 24rem;
		width: 34rem;

		background-size: 1rem 1rem;
		background-image: linear-gradient(to right, var(--bg-b) 1px, transparent 1px),
			linear-gradient(to bottom, var(--bg-b) 1px, transparent 1px);
		background-color: color-mix(in sRGB, var(--bg-a), var(--bg-b) 40%);
		border-radius: var(--radius-lg);

		overflow: hidden;
	}
</style>
