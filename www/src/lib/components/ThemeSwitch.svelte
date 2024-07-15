<script lang="ts">
	import { themer } from '$lib/themer.svelte'
	import { onDestroy } from 'svelte'

	let checked = $derived(themer.theme === 'light')

	const toggle = () => {
		themer.theme = checked ? 'dark' : 'light'
	}
</script>

<button class="switch" title="toggle theme" onclick={toggle}>
	<input type="checkbox" {checked} />
	<div class="track round">
		<span class="thumb-content on" aria-hidden="true"></span>
		<span class="thumb-content off" aria-hidden="true"></span>
		<!-- {#key checked} -->
		<div class="track-content light" aria-hidden="true">light</div>
		<div class="track-content dark" aria-hidden="true">dark</div>
		<!-- {/key} -->
	</div>
</button>

<style lang="scss">
	.switch {
		all: unset;
		position: relative;
		--duration: 0.25s;

		--width: 4.5rem;
		--padding: 0.25rem;
		--accent: #2196f3;

		--thumb-size: 1.1rem;

		--thumb: var(--bg-a);

		--outline: var(--bg-b);
		--outline-focus: var(--bg-c);

		/* Internal */

		--height: calc(var(--thumb-size) * 1 + var(--padding) * 2);
		--transition: all var(--duration) cubic-bezier(0.05, 1, 0.56, 0.91);
		--transform: calc(var(--width) - var(--thumb-size) - var(--padding) * 2);
	}

	:global(:root[theme='dark'] .switch) {
		.track {
			box-shadow:
				-1px 1.5px 0.3rem rgba(0, 0, 0, 0.25) inset,
				0px 0.5px 0.1rem rgba(0, 0, 0, 0.25) inset;
		}
	}

	/* Switch Container */

	.switch {
		position: relative;
		display: inline-block;

		width: var(--width);
		height: var(--height);
		max-width: 100%;
		max-height: 100%;

		cursor: pointer;
	}

	/* Track */

	.track {
		position: absolute;
		inset: 0;

		background-color: var(--bg-a);
		outline-color: var(--outline, var(--bg-b));

		max-width: 100%;
		max-height: 100%;

		outline-width: 1.5px;
		outline-style: solid;
		border-radius: 0.5rem;
		box-shadow:
			-1px 1px 0.33rem rgba(0, 0, 0, 0.33) inset,
			0px 1px 0.1rem rgba(0, 0, 0, 0.33) inset;

		cursor: pointer;
		transition:
			var(--transition),
			outline 0.15s;

		overflow: hidden;
	}

	// :global(:root[theme='light'] .track) {
	// 	background-color: var(--bg-d);
	// }

	input:focus + .track {
		&:not(:active) {
			outline-color: var(--outline-focus);
			outline-width: 2px;
		}
	}

	/* Track Thumb */

	$thumb: '.track:before';
	#{$thumb} {
		background-color: var(--bg-c);

		content: '';
		position: absolute;
		left: var(--padding);
		bottom: var(--padding);

		width: var(--thumb-size);
		height: calc(var(--thumb-size) * 1);
		max-width: 100%;
		max-height: 100%;

		box-shadow:
			0.3px 1px 0 color-mix(in lch, var(--bg-d), transparent 50%),
			-0.3px 0.3px 0.1px color-mix(in lch, var(--fg-d), transparent 75%) inset,
			-1px 1px 1px color-mix(in lch, var(--fg-d), transparent 90%) inset,
			0px -1px 0.1px rgba(1, 1, 1, 0.1) inset;

		border-radius: 0.25rem;

		transition: var(--transition);
	}

	/* Track Content */
	

	.track-content {
		position: absolute;
		top: 0;
		bottom: 0;

		display: flex;
		align-items: center;

		height: 100%;
		max-width: 100%;
		max-height: 100%;

		color: var(--fg-d);

		user-select: none;
		pointer-events: none;
		transition: var(--transition);

		font-family: var(--font-a);
		font-variation-settings:
			'wght' 400,
			'wdth' 95;
		letter-spacing: 0.1rem;

		&.dark {
			right: var(--padding);
		}
	}

	/* Checked */

	$amount: 1rem;
	$padding: 0.5rem;

	@mixin out {
		transition-duration: calc(var(--duration) * 1.5);
		transition-delay: 0.1s;
		transition-timing-function: cubic-bezier(0.08, 0.96, 0.16, 0.97);
	}

	@mixin in {
		transition-duration: var(--duration);
		transition-delay: 0s;
		transition-timing-function: cubic-bezier(0.05, 1, 0.56, 0.91);
	}

	input:checked + #{$thumb} {
		transform: translateX(var(--transform));
	}

	button:has(input:checked) .track-content {
		&.light {
			transform: translateX($padding);
			opacity: 1;
			@include out;
		}

		&.dark {
			transform: translateX(calc($amount * 2));
			opacity: 0;
			@include in;
		}
	}

	/* Unchecked */

	button:has(input:not(:checked)) .track-content {
		&.light {
			opacity: 0;
			transform: translateX(calc($amount * -2));
			@include in;
		}

		&.dark {
			transform: translateX(0);
			opacity: 1;
			@include out;
		}
	}

	/* Hide default HTML checkbox. */

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}
</style>
