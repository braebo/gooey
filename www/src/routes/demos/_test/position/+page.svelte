<script lang="ts">
	import { PLACEMENTS } from '../../../../../../src/shared/place'
	import Gooish from '$lib/components/Gooish.svelte'
	import { page } from '$app/stores'

	// @ts-ignore
	const count = +$page.url.searchParams.get('count') || -1
	// @ts-ignore
	const seed = +$page.url.searchParams.get('seed') || Math.random()

	function getParams() {
		const params = {} as any

		if (seed < 0.2) {
			params.foo = 'bar'
		}
		if (seed < 0.4) {
			params.baz = 1
		}

		if (seed < 0.6) {
			params.qux = true
		}

		if (seed < 0.8) {
			params.quux = 'corge'
		}

		params.width = 250 + Math.random() * 150

		return params
	}
</script>

<section class="section">
	{#each PLACEMENTS.slice(0, count) as position}
		{@const params = getParams()}

		<div class="container">
			<Gooish {params} {position} storage={true} title={position} width={params.width} />
		</div>
	{/each}
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
