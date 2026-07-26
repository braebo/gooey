<script lang="ts">
	import type { Gooey } from 'gooey'

	import LiveExample from '$lib/components/LiveExample.svelte'
	import Hero from '$lib/data/docs/01_install/Hero.svelte'
	// import { themer } from '$lib/themer/themer.svelte'
	import Info from '$lib/components/Info.svelte'


	let infoEl = $state<HTMLElement>()

	const example = (g: Gooey) => {
		const themes = g.themer.themes.value
		const theme = g.addSelect('theme', { options: themes, value: themes[0] })
		// const theme = g.addSelect('theme', g.themer.theme.value, { options: g.themer.themes.value })
		// const theme = g.addSelect('theme', g.themer.theme.value, { options: g.themer.themes.value })
		// const theme = g.addSelect('theme', { options: g.themer.themes.value, initialValue: g.themer.theme.value })
		theme.on('change', v => {
			console.log('v', v)
			g.themer.theme.set(v)
		})
	}

	console.log('example.toString()', example.toString())
</script>

<Hero />

<div class="br-lg"></div>

<section>
	<div class="card">
		<p>Installation and basic usage.</p>
		<a href="/docs/getting-started"><button class="btn">Getting Started</button></a>
	</div>

	<div class="card">
		<p>Explore the various input types.</p>
		<a href="/docs/inputs"><button class="btn">Inputs</button></a>
	</div>
</section>

<div class="br-lg"></div>

<div class="example">
	<!-- shiki-start
```ts
{example.toString()}
```
shiki-end -->

	<LiveExample
		title="add"
		onMount={example}
		position="center"
	/>
</div>

<div class="info-wrapper">
	<div class="description em">
		<span bind:this={infoEl}>
			See <a href="#add">add</a>
		</span>
	</div>

	{#if infoEl}
		<Info target={infoEl} side="left" tooltipText={['wat?', 'k thx']} --max-width="33rem">
			<div class="description">
				The options available in the third argument will change depending on the type of input. For example:
			</div>

			<div class="example">
				<!-- shiki-start
```ts
gooey.add('count', 1, {
min: -1,
max: 10,
step: 0.1
})
```
shiki-end -->
			</div>

			<div class="description">
				Here, <span class="gooey">gooey</span> infers the options as <code>NumberInputOptions</code>
				because the initial value of <code>1</code> is a <strong>number</strong>, which is why it accepts
				<mono>min</mono>, <mono>max</mono>, and <mono>step</mono> options.
			</div>

			<div class="description em plain">
				This should get you some nice, dynamic intellisense, but you can always fall back to the more specific
				adders if need be, like <code>addNumber</code> , <code>addColor</code> , etc.
			</div>
		</Info>
	{/if}
</div>

<style lang="scss">
	section {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;

		width: fit-content;
		min-width: 16rem;
		padding: 1rem;

		background: rgba(from var(--bg-a) r g b / 0.25);
		border-radius: var(--radius-md);
		outline: 1px solid var(--bg-b);

		p {
			padding: 0;
			margin: 0;

			font-size: var(--font-sm);
		}
	}
</style>
