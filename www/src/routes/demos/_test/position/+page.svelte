<script lang="ts">
	import { PLACEMENTS } from '../../../../../../src/shared/place'
	import Gooish from '$lib/components/Gooish.svelte'
	import { page } from '$app/stores'

	import { Gooey } from '../../../../../../src/Gooey'
	import { onMount } from 'svelte'

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

		params.nested = {
			a: 'fake_GooeyStorageOptions',
			b: 'fake_default::local-storage',
			c: true,
			d: true,
		}

		return params
	}

	let gooey: Gooey | undefined

	onMount(() => {
		gooey = new Gooey({
			container: document.body,
			theme: 'flat',
			position: 'top-center',
			title: 'local storage',
		})
		gooey.add('enabled', false)
		gooey.add('', [
			[
				{
					text: 'clear',
					onClick: () => localStorage.clear(),
				},
			],
			[
				{
					text: 'log',
					onClick: () => console.log(localStorage),
				},
			],
		])
		return gooey.dispose
	})
</script>

<section class="section">
	{#if gooey}
		{#each PLACEMENTS.slice(0, count) as position}
			{@const params = getParams()}

			<div class="container">
				<Gooish
					{params}
					{position}
					storage={gooey?.opts.storage ?? false}
					title={position}
					width={params.width}
					refreshPosition
				/>
			</div>
		{/each}
	{/if}
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
