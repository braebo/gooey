<script lang="ts">
	import { PLACEMENTS } from '../../../../../../src/shared/place'
	import GooeyThemeSync from '$lib/components/GooeyThemeSync.svelte'
	import { Gooey } from '../../../../../../src/Gooey'
	import { themer } from '$lib/themer/themer.svelte'
	import Gooish from '$lib/components/Gooish.svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	let storage = $state($page.url.searchParams.has('storage'))
	// @ts-ignore
	let count = $state(+$page.url.searchParams.get('count') || -1)
	// @ts-ignore
	let seed = $state(+$page.url.searchParams.get('seed') || Math.random())

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
			a: 1,
			b: 1,
			c: 1,
			d: 1,
		}

		return params
	}

	let gooey = $state<Gooey | undefined>(undefined)

	onMount(() => {
		gooey = new Gooey({
			id: 'disabled-test',
			container: document.body,
			position: 'top-center',
			themeMode: themer.mode,
			theme: 'flat',
			title: '',
			storage,
		})

		const f = gooey.addFolder('search params', { closed: true })

		f.add('count', count, { min: 0, max: 20, step: 0.1 }).on('change', v => (count = v))
		f.add('seed', seed, { min: 0, max: 1, step: 0.1 })
		f.add('apply', applyQueryParams)

		const lsFolder = gooey.addFolder('local storage', { closed: true })

		lsFolder.add('enabled', storage)
		lsFolder.add('', [
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

		return () => {
			gooey?.dispose()
		}
	})

	function applyQueryParams() {
		goto(`?count=${count}&seed=${seed}&storage=${storage}`, { replaceState: true })
	}
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
		<GooeyThemeSync {gooey} />
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
