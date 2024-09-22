<script lang="ts">
	import Gooish from '$lib/components/Gooish.svelte'
	import { page } from '$app/stores'

	import { Gooey } from '../../../../../../src/Gooey'
	import { themer } from '$lib/themer/themer.svelte'
	import { onMount } from 'svelte'

	const storage = $page.url.searchParams.has('storage')
	// @ts-ignore
	const seed = +$page.url.searchParams.get('seed') || Math.random()
	// @ts-ignore
	let inputs = $state(+$page.url.searchParams.get('count') || -1)
	// @ts-ignore
	let gooeys = $state(+$page.url.searchParams.get('gooeys') || 1)

	function getParams() {
		const params = {} as any

		if (seed > 0.2) {
			params.foo = 1
		}
		if (seed > 0.4) {
			params.bar = 2
		}

		if (seed > 0.6) {
			params.baz = 3
		}

		if (seed > 0.8) {
			params.qux = 4
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

		// Sync gooey
		gooey.themer.mode.set(themer.mode)
		const unsubscribe = gooey.themer.mode.subscribe(v => {
			themer.preference = v ?? 'system'
		})
		$effect(() => {
			gooey?.themer.mode.set(themer.mode)
		})

		gooey.add('count', inputs, { min: 0, max: 1, step: 0.1, disabled: true }).on('change', v => (inputs = v))
		gooey.add('seed', seed, { disabled: true })

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
			unsubscribe()
			gooey?.dispose()
		}
	})
</script>

<section class="section">
	{#if gooey}
		{#key inputs}
			{#each Array.from({ length: gooeys }) as _}
				{@const params = getParams()}
				{@const width = 250 + Math.random() * 150}
				{@const offset = {
					x: (Math.random() * width) / 2,
					y: (Math.random() * width) / 2,
				}}
				<div class="container">
					<Gooish
						{params}
						storage={gooey?.opts.storage ?? false}
						title={`${Math.round(offset.x)} ${Math.round(offset.y)}`}
						{width}
						{offset}
						position="center"
						refreshPosition
					/>
				</div>
			{/each}
		{/key}
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
