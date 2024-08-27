<script lang="ts">
	import { onMount, type Snippet } from 'svelte'

	import { Tooltip } from '../../../../src/index'

	let {
		children,
		target = undefined,
		show = $bindable(false),
		tooltipText = ['more info', 'less info'],
		side = $bindable('right'),
	}: {
		children: Snippet
		target?: HTMLElement
		show?: boolean
		tooltipText: [string, string]
		side?: 'left' | 'right'
	} = $props()

	let el = $state<HTMLElement>()
	let iconEl = $state<HTMLElement>()
	let targetEl = $state(target)
	let tooltip = $state<Tooltip>()

	let text = $state('more info')

	let positionIdle = $state([2.4, 0])
	let positionActive = $state([-10.4, -11.2])

	let top = $derived(show ? positionActive[0] : positionIdle[0])
	let left = $derived(show ? positionActive[1] : positionIdle[1])

	let first = true

	let timer: ReturnType<typeof setTimeout>
	$effect(() => {
		show
		clearTimeout(timer)
		timer = setTimeout(() => {
			text = !show ? tooltipText[0] : tooltipText[1]
		}, 250)
	})

	function reposition() {
		const targetRect = targetEl!.getBoundingClientRect()
		const elRect = el!.getBoundingClientRect()
		const iconRect = iconEl!.getBoundingClientRect()

		let top = 0
		let left = 0

		if (side === 'left') {
			top = targetRect.top - elRect.top
			top -= iconRect.height / 4
			// top -= 2

			left = targetRect.left - elRect.left
			left -= iconEl!.offsetWidth
			// left += targetRect.width - iconEl!.offsetWidth
			left -= 8
		} else {
			top = targetRect.top - elRect.top
			top -= iconRect.height / 4
			top += 2

			left = targetRect.left + targetRect.width - elRect.left
			left += 10
		}

		positionIdle = [top, left]

		if (first) {
			first = false
		} else {
			show = !show
		}

		tooltip && (tooltip.placement = show ? 'left' : side === 'right' ? 'right' : 'left')

		if (tooltip) {
			tooltip.placement = show ? 'left' : side === 'right' ? 'right' : 'left'
		}
	}

	onMount(() => {
		tooltip = new Tooltip(iconEl, {
			text: () => text,
			placement: 'right',
			anchor: iconEl,
			hideOnClick: true,
		})

		if (targetEl) reposition()
	})
</script>

<div class="info row" class:show bind:this={el}>
	<button
		bind:this={iconEl}
		class="i"
		class:show
		onclick={() => reposition()}
		style:top="{top}px"
		style:left="{left}px"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" overflow="visible">
			<g
				class="question-group"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				fill="none"
			>
				<path
					class="circle"
					class:target
					opacity="0"
					stroke-dashoffset="60"
					d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
				>
					<animate fill="freeze" attributeName="opacity" begin="1.2s" dur="0.15s" values="0;1" />
				</path>

				<path
					class="question-mark"
					class:show
					stroke-dasharray="20"
					stroke-dashoffset="20"
					d="M8.99999 10C8.99999 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 10.9814 14.5288 11.8527 13.8003 12.4C13.0718 12.9473 12.5 13 12 14"
				>
					<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" values="20;0" />
				</path>

				<rect class:show class="minus" x="9" y="11" width="6" height="0.5" fill="none" stroke-width="1" />
			</g>

			<circle class:show class="dot" cx="12" cy="17" r="1" fill="currentColor" fill-opacity="0">
				<animate fill="freeze" attributeName="fill-opacity" begin="1s" dur="0.2s" values="0;1" />
			</circle>
		</svg>
	</button>

	<span class="children">
		{@render children?.()}
	</span>
</div>

<style lang="css">
	.info {
		--primary: transparent;
		--outline: transparent;

		--in-out-smooth: cubic-bezier(0.54, 0.08, 0.15, 0.88);
		--out-dramatic: cubic-bezier(0.07, 0.54, 0.07, 0.95);

		/* position: relative; */
		position: absolute;

		display: flex;
		justify-content: space-between;
		flex-wrap: nowrap;
		align-items: center;

		width: fit-content;
		padding: 0 var(--padding-lg);
		margin-bottom: 1rem;

		background: var(--primary);
		border-radius: var(--radius);
		outline: 1px solid transparent;

		transition: 0.15s;
		z-index: 5;
		pointer-events: none;

		transform: translateY(1rem);
	}

	.info {
		svg {
			transition: 0.4s;
			scale: 0.8;

			path,
			rect,
			circle {
				transform-origin: center;
			}
		}

		&.show,
		&:hover {
			--outline: color-mix(in hsl, var(--primary), var(--light-e));
		}
		&.show {
			--off-theme: color-mix(in hsl, var(--theme-a) 2%, color-mix(in hsl, var(--bg-a), var(--bg-b)) 80%);
			backdrop-filter: blur(6px);
			--primary: var(--off-theme);
			outline-color: var(--outline);

			pointer-events: all;

			svg {
				scale: 1;
			}
		}

		button.i {
			all: unset;
			position: absolute;
			top: 0.15rem;
			left: 0rem;

			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--bg-d);

			aspect-ratio: 1/1;

			width: 2rem;

			outline-offset: -3px;
			border-radius: 1rem;

			cursor: pointer;
			pointer-events: all;

			transition-property: background, color, outline-offset, top, left;
			transition-timing-function: var(--in-out-smooth);
			/* transition-delay: 0s, 0s, 0.1s, 0.1s, 0.1s, 0.1s; */
			transition-duration: 0.2s, 0.3s, 0.05s, 0.4s, 0.4s;
		}

		button.i {
			&:hover {
				transition-delay: 0.1s, 0s, 0s, 0s, 0s, 0s;
				transition-duration: 0.15s, 0.1s, 0.05s, 0.3s, 0.3s;
				background: var(--primary);
				color: var(--fg-b);
				outline-offset: 0px;
			}
			&.show {
				transition-delay: 0s;
				top: -10.4px;
				left: -11.2px;

				background: var(--primary);
				transition-timing-function: var(--out-dramatic);
			}

			.question-mark {
				transition: 0.2s;
				stroke-width: 1.5px;
			}

			.dot {
				transform: translate(0, 0) scale(1);

				transition-delay: 0.075s;
				transition-duration: 0.15s;
				transform-origin: center;
			}

			.minus {
				transition-delay: 0.075s;
				transition-duration: 0.15s;
				transform-origin: center;
				transform: scale(0) translate(0, 0);
			}

			.circle {
				scale: 1.1;
				stroke-dasharray: 14;
				stroke-dashoffset: 49;
				transform-origin: center;
				color: var(--bg-b);
				stroke-width: 1px;
				transition: 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			}
			&:hover {
				.circle {
					scale: 1.25;
					stroke-dasharray: 62 0.75;
					stroke-dashoffset: 51.5;
					color: var(--bg-d);
					transition-delay: 0.3s;
					transition-duration: 1s;
				}
			}

			&.show {
				.question-mark {
					transform: scale(0) translate(0, 0);
				}
				.dot {
					transform: scale(0) translate(0, 0);
				}
				.minus {
					transform: scale(1) translate(0, 0);
				}
				.circle {
					scale: 1.3;
					stroke-width: 0.85px;
					stroke: var(--outline);

					stroke-dasharray: 62 21;
					stroke-dashoffset: 51.5;

					color: var(--bg-d);

					transition-delay: 0s;
					transition-duration: 0.33s;

					&.target {
						stroke-dashoffset: 38;
						stroke-dasharray: 48.5 21;
					}
				}
			}
		}

		.children {
			width: 100%;
			opacity: 0;
			transform: translateY(0.2rem);
			transition: 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		}

		.children {
			/* font-size: var(--font-xs); */
			pointer-events: none;
		}

		&.show .children {
			/* animation: fadeIn 0.15s forwards; */
			opacity: 1;
			transform: translateY(0);
			pointer-events: all;
		}
	}

	@media screen and (width < 1000px) {
		.info {
			max-width: calc(100% - 2rem);
			padding: 0;
			margin: 0;
			padding: 0.5rem;
		}
	}
</style>
