<script lang="ts">
	import type { Gooey } from '../../../../../src/index'
	import type { LabsPanel } from './labsGooey'

	import GooeyThemeSync from '$lib/components/GooeyThemeSync.svelte'
	import { createLabsGooey } from './labsGooey'
	import { Scene } from './scene'
	import { onMount } from 'svelte'

	let canvas = $state<HTMLCanvasElement>()
	let gooey = $state<Gooey>()
	let panel: LabsPanel | undefined

	onMount(() => {
		if (!canvas) return

		const scene = new Scene(canvas)
		panel = createLabsGooey(scene)
		gooey = panel.gooey

		return () => {
			panel?.dispose()
			scene.dispose()
		}
	})
</script>

<svelte:head>
	<title>gooey · labs</title>
</svelte:head>

{#if gooey}
	<GooeyThemeSync {gooey} />
{/if}

<div class="labs-page">
	<canvas bind:this={canvas} class="field"></canvas>

	<div class="intro">
		<h1>labs</h1>
		<p class="lede">Three recent additions, wired into one panel.</p>

		<dl>
			<dt><code>folder.addElement()</code></dt>
			<dd>
				Arbitrary DOM in a folder row. The <em>content</em> grid swaps a live sparkline for a CSS metaball for a
				swatch strip — the lifecycle card underneath keeps score, and mounts and cleanups stay paired.
			</dd>

			<dt><code>storageId</code></dt>
			<dd>
				Drag the panel, resize it, reload the page. The <em>persistence</em> folder shows the exact localStorage
				keys behind that — stable now, where they used to carry a fresh id per page load.
			</dd>

			<dt><code>registerWebMCP()</code></dt>
			<dd>
				Every control above is published as a tool an in-browser agent can call. The
				<em>webmcp</em> folder reports whether this browser has
				<code>document.modelContext</code>; without it, registration is a no-op and the handle comes back
				disabled.
			</dd>
		</dl>
	</div>
</div>

<style lang="scss">
	.labs-page {
		position: relative;
		display: flex;
		flex-grow: 1;
		width: 100%;
		overflow: hidden;
	}

	.field {
		position: absolute;
		inset: 0;

		width: 100%;
		height: 100%;

		pointer-events: none;
		opacity: 0;
		animation: fade-in 1.5s ease-out 0.15s forwards;
	}

	@keyframes fade-in {
		to {
			opacity: 1;
		}
	}

	.intro {
		position: relative;
		z-index: 1;

		max-width: 34rem;
		margin: auto auto auto 4rem;
		padding: 1.75rem 2rem;

		border-radius: 1rem;
		/* The blob field runs behind the copy — give it something to read against. */
		background: color-mix(in srgb, var(--bg-a) 62%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	h1 {
		margin: 0;
		font-size: 3rem;
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 0 0 1.5rem;
		color: var(--fg-c);
	}

	dl {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 0;
	}

	dt {
		font-weight: 600;
	}

	dd {
		margin: 0.15rem 0 0;
		color: var(--fg-c);
		font-size: 0.9rem;
		line-height: 1.5;
		text-wrap: pretty;
	}

	em {
		color: var(--fg-a);
		font-style: normal;
		font-weight: 500;
	}

	code {
		padding: 0.1rem 0.3rem;
		border-radius: var(--radius-sm, 4px);
		background: color-mix(in srgb, var(--bg-c) 60%, transparent);
		font-size: 0.85em;
	}

	@media (max-width: 900px) {
		.intro {
			margin: auto 1.5rem;
			padding-top: 5rem;
		}
	}
</style>
