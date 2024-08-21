<!-- @hmr:reset -->

<script lang="ts">
	import { params } from '$lib/components/orbs/params'
	import { Gooey } from '../../../../../../src/index'
	import Orbs from '$lib/components/orbs/Orbs.svelte'
	import { stringify } from '$lib/utils/stringify'
	import Code from '$lib/components/Code.svelte'
	import { code, showCode } from './stores'
	import { quintOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
	import { onMount } from 'svelte'

	let gooey: Gooey
	let ready = false

	onMount(() => {
		params.update((p) => {
			p.height = Math.round(window.innerHeight / 10)
			p.width = Math.round(window.innerWidth / 7)
			return p
		})
		gooey = new Gooey({
			title: 'addMany',
			position: 'center',
		})

		ready = true

		const test = gooey.bindMany(params.value)

		// Map keys are inferred correctly... sweet!  But the input types aren't T_T
		const b = test.inputs.get('height') // should be InputNumber
		const c = test.inputs.get('drift') // should be InputSwitch

		gooey.on('change', (v) => {
			showCode.set(true)
			code.set(stringify($params, 2))
		})

		return () => {
			gooey?.dispose()
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

	<div class="buttons">
		<button on:click={() => localStorage.clear()}>Clear localStorage</button>
	</div>

	{#if ready}
		<div class="orbs">
			<Orbs {params} />
		</div>
	{/if}
</div>

<style>
	.page {
		width: 100vw;
		height: 100vh;
		max-height: 100vh;
		padding: 1rem;

		background: color-mix(in lch, var(--bg-a), var(--bg-b));

		overflow: hidden;
	}

	.hero-title {
		width: fit-content;
		font-variation-settings: 'wght' 333;
		font-family: 'Fredoka', sans-serif;
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

	@keyframes fade-in {
		to {
			opacity: 1;
		}
	}

	.debug {
		position: absolute;
		top: 12rem;
		left: 1.1rem;

		z-index: 0;
	}

	.buttons {
		position: absolute;
		top: 0.9rem;
		right: 6rem;
		scale: 0.9;
		button {
			border: none;
			padding: 0.25rem 0.5rem;
			border-radius: 4px;
			font-family: var(--font-a);
			background: var(--bg-c);
			color: var(--fg-c);
			cursor: pointer;
			transition: 0.15s;

			&:hover {
				background: var(--bg-d);
				color: var(--fg-a);
			}
		}
	}
</style>
