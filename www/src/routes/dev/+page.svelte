<!-- @hmr:reset -->

<script lang="ts">
	import { params } from '$lib/components/orbs/params'
	import Orbs from '$lib/components/orbs/Orbs.svelte'
	import Code from '$lib/components/Code.svelte'
	import { Gui } from 'gooey'

	import { demoGui, code, showCode } from './demoGui'

	import { quintOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
	import { onMount } from 'svelte'

	let gui: Gui
	let ready = false
	let orbs = true

	onMount(() => {
		params.update((p) => {
			p.height = Math.round(window.innerHeight / 10)
			p.width = Math.round(window.innerWidth / 7)
			return p
		})
		gui = demoGui(params.value)
		ready = true

		return () => {
			gui?.dispose()
			globalThis.window?.location.reload()
		}
	})

	function onResize() {
		params.update((p) => {
			p.height = Math.round(window.innerHeight / 10)
			p.width = Math.round(window.innerWidth / 7)
			return p
		})
	}
</script>

<svelte:window on:resize={onResize} />

<div class="page">
	<h1 class="hero-title">gooey</h1>

	<img src="assets/gooey-logo-slider-orbs.svg" alt="gooey" />

	{#if $showCode}
		<div class="debug" transition:fly={{ y: 5, duration: 250, easing: quintOut }}>
			{#key $code}
				<Code
					--max-height="90vh"
					title="active preset"
					lang="ts"
					text={$code}
					on:close={() => showCode.set(false)}
				/>
			{/key}
		</div>
	{/if}

	{#if ready && orbs}
		<div class="orbs">
			<Orbs {params} />
		</div>
	{/if}
</div>

<style>
	.page {
		width: 100vw;
		display: flex;
		flex-direction: column;
		flex-grow: 1;

		background: color-mix(in lch, var(--bg-a), var(--bg-b));

		overflow: hidden;
	}

	.hero-title {
		width: fit-content;
		font-variation-settings: 'wght' 333;
		font-family: 'fredoka', sans-serif;
		font-size: var(--font-xxl);
		line-height: 2rem;
	}

	.orbs {
		position: relative;

		width: 50vmin;
		height: 100%;
		margin: 20vh auto 0 auto;

		z-index: 20;
		pointer-events: none;

		opacity: 0;
		animation: fade-in 2s ease-in 0.25s forwards;
	}

	.debug {
		position: absolute;
		top: 5rem;
		left: 1rem;

		z-index: 0;
	}
</style>
