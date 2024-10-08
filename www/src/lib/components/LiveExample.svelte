<script lang="ts" generics="T extends Record<string, any> = Record<string, any>">
	import { Gooey, type GooeyOptions } from '../../../../src/Gooey'
	import { device } from '$lib/device.svelte'
	import Gooish from './Gooish.svelte'
	import type { Snippet } from 'svelte'

	let {
		children,
		gooey = $bindable<Gooey>(),
		height = '100%',
		heightSm = '8rem',
		onMount = () => {},
		...props
	}: Partial<GooeyOptions> & {
		children?: Snippet
		wrapperStyle?: string
		params?: T
		gooey?: Gooey
		height?: string
		heightSm?: string
		onMount?: (gooey: Gooey) => void
	} = $props()

	let h = $derived(device.mobile ? heightSm : height)

	let show = $state(false)
	let mounted = false

	$effect(() => {
		if (gooey && !mounted) {
			mounted = true
			onMount(gooey)
		}
	})

	$effect(() => {
		device.mobile
		gooey?.refreshPosition()
	})
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

		{@render children?.()}
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

	.live-example {
		/* prettier-ignore */
		box-shadow:
			2px 2px 5px #0004 inset,
			1px 1px 16px #0002 inset,
			1px 4px 8px #0002 inset
		;
	}

	:global(:root[theme='light']) .live-example {
		/* prettier-ignore */
		box-shadow:
			/* 8px 8px 2rem hsla(0, 0%, 0%, 0.05) inset, */
			1px 1px 8px hsla(0, 0%, 0%, 0.025) inset,
			1px 2px 5px hsla(0, 0%, 0%, 0.125) inset,
			1px 5px 10px hsla(0, 0%, 0%, 0.07) inset,
			1px 1px 16px hsla(0, 0%, 0%, 0.05) inset
		;
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
