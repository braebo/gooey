<script lang="ts">
	import type { Theme } from '$lib/themer/themer.types'

	import { themer } from '$lib/themer/themer.svelte'
	import { fly } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import Goo from './graphics/Goo.svelte'

	const l = (...args: any[]) => console.log('\x1b[31m[ThemeSelector]\x1b[39m', ...args)

	// let hovering = $state(false)
	let expanded = $state(false)
	let updating = $state(false)
	let themeSelectorEl = $state<HTMLDivElement>()
	let tempActiveTheme = $state(themer.activeTheme)

	let activeTheme = $derived(themer.activeTheme)
	let availableThemes = $derived(Object.entries(themer.themes) as [keyof typeof themer.themes, Theme][])

	function selectTheme(themeName: keyof typeof themer.themes) {
		if (themeName === tempActiveTheme.title) {
			l(`selectTheme() -> aborting: themeName "${themeName}" === activeTheme.title "${activeTheme.title}"`)

			if (!expanded) {
				expanded = true
			} else {
				cancelPreview()
			}

			return
		}

		l('selectTheme()', themeName)

		themer.activeTheme = tempActiveTheme = themer.themes[themeName]
		expanded = false
	}

	type ThemeEl = HTMLButtonElement & { dataset: { theme: keyof typeof themer.themes } }

	function handlePreview(e: PointerEvent) {
		// hovering = true

		if (!expanded) return

		const themeName = (e.currentTarget as ThemeEl).dataset.theme as keyof typeof themer.themes
		themer.activeTheme = themer.themes[themeName]
	}

	function cancelPreview(e?: PointerEvent | FocusEvent) {
		// hovering = false

		if (!expanded || updating) return

		if (e) {
			e.stopPropagation()
		} else {
			l('cancel()')
		}

		const deleteme = e ? e.type + 'event' : 'unknown event'
		if (tempActiveTheme.title !== activeTheme.title) {
			l('cancel() -> ' + deleteme)
			themer.activeTheme = tempActiveTheme
		} else {
			l('skipping cancel() -> ' + deleteme)
		}
	}

	function clickOutside(e: PointerEvent | FocusEvent) {
		if (!expanded || !themeSelectorEl) return

		if (e.composedPath().includes(themeSelectorEl)) return

		l('clickOutside()', e.target)

		if (tempActiveTheme.title !== activeTheme.title) {
			themer.activeTheme = tempActiveTheme
		}

		expanded = false
	}

	const preview = (node: HTMLDivElement) => {
		node.addEventListener('pointerenter', handlePreview)
		node.addEventListener('pointerleave', cancelPreview)
		globalThis.window?.addEventListener('click', clickOutside)

		return {
			destroy() {
				l('destroy()', node.dataset['theme'])

				node.removeEventListener('pointerenter', handlePreview)
				node.removeEventListener('pointerleave', cancelPreview)
				globalThis.window?.removeEventListener('click', clickOutside)

				// todo - is this right?
				if (tempActiveTheme.title !== activeTheme.title) {
					themer.activeTheme = tempActiveTheme
				}
			},
		}
	}
</script>

<div class="theme-selector" class:expanded bind:this={themeSelectorEl} onblur={cancelPreview}>
	<div class="theme-list">
		{#each availableThemes as [themeName, theme], i}
			<!-- <button
				use:preview
				class="theme-option"
				data-theme={themeName}
				class:active={themeName === activeTheme.title}
				class:hidden={!expanded && !(themeName === activeTheme.title)}
				onclick={() => selectTheme(themeName)}
				out:fly|global={{ y: -5, duration: 150, easing: quintOut }}
				style="
                        background-color: {theme.vars.color['--theme-a']};
                        animation-delay: {i * 0.05}s;
                    "
				style:order={themeName === tempActiveTheme.title ? -1 : i}
				title={themeName}
				aria-label="select-theme"
			></button> -->

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_interactive_supports_focus -->
			<div
				use:preview
				role="button"
				class="theme-option"
				data-theme={themeName}
				class:active={themeName === activeTheme.title}
				class:hidden={!expanded && !(themeName === activeTheme.title)}
				onclick={() => selectTheme(themeName)}
				out:fly|global={{ y: -5, duration: 150, easing: quintOut }}
				style="animation-delay: {i * 0.05}s;"
				style:order={themeName === tempActiveTheme.title ? -1 : i}
				title={themeName}
				aria-label="select-theme"
			>
				<!-- style:rotate="{i % 2 === 0 ? 180 : 0}deg" -->
				<!-- <Goo {theme} expand={expanded && themeName === tempActiveTheme.title} /> -->
				<Goo {theme} expand={expanded} />
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.theme-selector {
		position: relative;
		width: 1.5rem;
		height: 1.5rem;

		transform: translateX(0.5rem);
		transition: transform 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
		z-index: 1;

		&:hover,
		&:focus-visible,
		&.expanded {
			transform: translateX(0);
		}
	}

	@keyframes fly-out-lg {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(-100%);
			opacity: 0;
		}
	}

	.theme-list {
		position: absolute;
		left: 0;
		top: 0;

		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		padding: 1rem;
		transform: translate(-1.25rem, -1rem);
	}

	.theme-option {
		width: 1.5rem;
		height: 1.5rem;

		opacity: 0;
		border-radius: 50%;
		border: none;

		transition: scale 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		animation: fly-in 0.15s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;

		transform-origin: center;
		transform: translateY(-0.5rem);
		scale: 1;
		z-index: 1;

		cursor: pointer;

		&:hover {
			transform: translateY(-0.5rem);
			scale: 1.1;
		}

		&:focus {
			outline: none;
		}

		&:focus-visible {
			outline: 1px solid var(--focus-outline-color);
		}
	}

	.hidden {
		animation: fly-out-sm 0.15s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
		pointer-events: none;
	}

	.active {
		order: -1;
		opacity: 1;
		transform: translateY(0);
	}

	@keyframes fly-in {
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes fly-out-sm {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(-0.5rem);
			opacity: 0;
		}
	}

	.expanded .active {
		transform: scale(1.1);
	}
</style>
