<script lang="ts" generics="T extends Record<string, any> = Record<string, any>">
	import { Gooey, type GooeyOptions } from '../../../../src/Gooey'
	import { device } from '$lib/device.svelte'
	import Gooish from './Gooish.svelte'

	let {
		gooey = $bindable<Gooey>(),
		height = '100%',
		heightSm = '8rem',
		...props
	}: Partial<GooeyOptions> & {
		wrapperStyle?: string
		params?: T
		gooey?: Gooey
		height?: string
		heightSm?: string
	} = $props()

	let h = $derived(device.mobile ? heightSm : height)

	let show = $state(false)
</script>

<div
	role="button"
	class="live-example"
	class:show
	onclick={() => (show = true)}
	onkeypress={() => (show = true)}
	tabindex="0"
	style:height={h}
>
	{#if show}
		<Gooish bind:gooey {...props} />
	{:else}
		<button class="btn"> Run </button>
	{/if}
</div>

<style>
	.live-example {
		position: relative;

		display: flex;
		align-items: center;
		justify-content: center;

		width: 100%;
		height: 100%;

		border-top: 1px solid var(--bg-b);
		border-bottom: 1px solid var(--bg-b);
		background: color-mix(in lch, var(--bg-a), var(--bg-b));

		/* prettier-ignore */
		box-shadow:
			2px 2px 5px #0004 inset,
			1px 1px 16px #0002 inset,
			1px 4px 8px #0002 inset
		;

		transition: 0.15s;
		cursor: pointer;

		&:hover:not(.show) {
			background: color-mix(in lch, var(--bg-a), var(--bg-b) 20%);

			.btn {
				color: var(--fg-a);
			}
		}

		&.show {
			cursor: default;
		}
	}

	@media (max-width: 1000px) {
		.live-example {
			height: auto;
		}
	}

	.btn {
		position: absolute;
		inset: 0;
		margin: auto;

		width: 4rem;
		height: fit-content;
		padding: 0.4rem 0;

		background: var(--bg-a);
		color: var(--fg-d);
		border: 1px solid var(--bg-b);
		border-radius: var(--radius);

		font-size: var(--font-xs);
		font-family: var(--font-b);
		font-variation-settings:
			'wght' 400,
			'wdth' 106;
		letter-spacing: 0.1rem;
	}
</style>
