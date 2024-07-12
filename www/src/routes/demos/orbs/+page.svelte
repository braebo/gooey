<!-- @hmr:reset -->

<script lang="ts">
	import { params } from '$lib/components/orbs/params'
	import Orbs from '$lib/components/orbs/Orbs.svelte'
	import Code from '$lib/components/Code.svelte'
	import { Gooey } from 'gooey'

	import { demoGooey, code, showCode } from './demoGooey'

	import { quintOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
	import { onMount } from 'svelte'

	let gooey: Gooey
	let ready = false
	let orbs = true

	onMount(() => {
		params.update((p) => {
			p.height = Math.round(window.innerHeight / 10)
			p.width = Math.round(window.innerWidth / 7)
			return p
		})
		gooey = demoGooey(params.value)
		ready = true

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
		display: flex;
		flex-direction: column;
		flex-grow: 1;

		background: color-mix(in lch, var(--bg-a), var(--bg-b));
		opacity: 0;

		animation: slide-in 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.25s forwards;

		/* overflow: hidden; */

		&:before {
			content: '';
			position: absolute;
			width: 120%;
			translate: -10% -43%;
			rotate: -1.6deg;
			height: 3rem;
			background: red;
			background: var(--bg-a);
		}
	}

	@keyframes slide-in {
		from {
			clip-path: inset(0 100% 0 0);
			opacity: 0;
		}
		to {
			clip-path: inset(-100%);
			opacity: 2;
		}
	}

	.orbs {
		position: relative;

		display: flex;
		flex-grow: 1;

		/* margin: 20vh auto 0 auto; */
		width: 100%;
		width: min(50rem, 50vmin);
		height: 100%;
		margin: auto auto 0 auto;
		/* margin-top: auto; */

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
		top: 5rem;
		left: 1rem;

		z-index: 0;
	}
</style>
