<script lang="ts">
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Info from '$lib/components/Info.svelte'
	import H from '$lib/components/H.svelte'

	const bindManyData = $state({
		wght: 100,
		wdth: 75,
	})

	let addEl = $state<HTMLElement>()
	let eventsEl = $state<HTMLElement>()
	let bindManyEl = $state<HTMLElement>()
	let proTipEl = $state<HTMLElement>()
</script>

<H l="2" id="basics">Basics</H>

<section class="section">
	<!--? `add` -->

	<div class="description">
		Use <code>add</code> to create a new <a href="/inputs">input</a>
	</div>

	<div class="example">
		<!-- shiki-start
```ts
gooey.add('hello', 'world')

gooey.add('count', 1, { min: -1 })
```
shiki-end -->

		<LiveExample
			title="add"
			onMount={g => {
				g.add('hello', 'world')
				g.add('count', 1, { min: -1 })
			}}
			position="center"
		/>
	</div>

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={addEl}>
				See <a href="#add">add</a>
			</span>
		</div>

		{#if addEl}
			<Info target={addEl} side="left" tooltipText={['tldr', 'k thx']} --max-width="33rem">
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
					This should get you some nice, dynamic intellisense, but you can always fall back to the more
					specific adders if need be, like <code>addNumber</code> , <code>addColor</code> , etc.
				</div>
			</Info>
		{/if}
	</div>

	<!--? addMany - `addMany` method -->

	<div class="br"></div>
	<div class="description">
		Use <code>addMany</code> to create multiple inputs at once
	</div>

	<div class="example">
		<!-- shiki-start
```ts
gooey.addMany({
  stuff: true,
  more_stuff: {
    like_colors: '#4aa7ff' as const,
    or_buttons: () => alert('thanks!')
  }
})
```
shiki-end -->
		<LiveExample
			title="addMany"
			heightSm="16rem"
			position="top-center"
			onMount={g => {
				g.addMany({
					stuff: true,
					more_stuff: {
						like_colors: '#4aa7ff' as const,
						or_buttons: () => alert('thanks!'),
					},
				})
			}}
		/>
	</div>

	<!--? events - `on` method -->

	<div class="br"></div>
	<div class="description">
		Do stuff <code>onChange</code>
	</div>

	<div class="example">
		<!-- shiki-start
```ts
gooey.add('title', 'change me', {
  onChange: (v) => gooey.title = v
})
```
shiki-end -->
		<LiveExample
			title="on"
			position="center"
			onMount={g => {
				g.add('title', 'change me').on('change', v => {
					if (g) g.title = v
				})
			}}
		/>
	</div>

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={eventsEl}>
				More <a href="#events">event</a> options
			</span>
		</div>

		{#if eventsEl}
			<Info target={eventsEl} side="left" --max-width="48rem">
				<!--? `onChange` option -->

				<div class="example inline">
					<div class="description">
						The <code>on</code> method can also be used after creation
					</div>

					<!-- shiki-start
```ts
const title = gooey.add('title', 'change me')

title.on('change', (v) => gooey.title = v)
```
shiki-end -->
				</div>

				<!--? Chaining `on` method -->

				<div class="example inline">
					<div class="description">Or you can chain stuff</div>
					<!-- shiki-start
```ts
gooey
  .add('title', 'change me')
  .on('change', (v) => gooey.title = v)
```
shiki-end -->
				</div>
			</Info>
		{/if}
	</div>

	<!--? bind - `bind` method -->

	<div class="br"></div>
	<div class="description">
		Alternatively, <code>bind</code> to any object to keep its values in sync automatically
		<em>(as opposed to using <code>add</code> with events)</em>
	</div>

	<div class="example">
		<!-- shiki-start
```ts
const data = {
  size: 12,
  color: '#4aa7ff' as const
}

gooey.bind(data, 'size')
gooey.bind(data, 'color')
```
shiki-end -->
		<LiveExample
			title="bind"
			onMount={g => {
				const data = {
					size: 12,
					color: '#4aa7ff' as const,
				}

				g.bind(data, 'size')
				g.bind(data, 'color')
			}}
			position="top-center"
		/>
	</div>

	<!--? bindMany - `bindMany` method -->

	<div class="br"></div>
	<div class="description">
		Bind to an entire object with <code>bindMany</code>
	</div>

	<div class="example">
		<!-- shiki-start
```ts
const data = {
  wght: 100,
  wdth: 75,
}

gooey.bindMany(data)
```
shiki-end -->
		<LiveExample
			title="bindMany"
			heightSm="12rem"
			position="top-center"
			onMount={g => {
				g.bindMany(bindManyData, { wght: { min: 100, max: 900 }, wdth: { min: 75, max: 125 } })
			}}
		>
			<div
				class="variable-font-display"
				style="font-variation-settings: 'wght' {bindManyData.wght}, 'wdth' {bindManyData.wdth}"
			>
				variable fonts are neat
			</div>
		</LiveExample>
	</div>

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={bindManyEl}>
				Passing options to <a href="#bindmany">bindMany</a>
			</span>
		</div>

		{#if bindManyEl}
			<Info target={bindManyEl} side="left" tooltipText={['', '']}>
				<div class="description">
					You can also pass options to <code>bindMany</code>
				</div>

				<div class="example">
					<!-- shiki-start
```ts
gooey.bindMany(data, {
  wght: { min: 100, max: 900 },
  wdth: { min: 100, max: 130 }
})
```
shiki-end -->
				</div>

				<div class="description em plain">
					The types here will be inferred for all that intellisense goodness
				</div>
			</Info>
		{/if}
	</div>

	<!--? folders - Folders -->

	<div class="br"></div>
	<div class="description">
		Create <a href="#folders">folders</a> with <code>addFolder</code>
	</div>

	<div class="example">
		<!-- shiki-start
```ts
const outer = gooey.addFolder('outer')

const inner = outer.addFolder('inner')

inner.add('say sike', () => outer.close(), {
  text: 'sike',
})
```
shiki-end -->
		<LiveExample
			title="folders"
			onMount={g => {
				const outer = g.addFolder('outer')

				const inner = outer.addFolder('inner')
				inner.add('say sike', () => outer.close(), {
					text: 'sike',
				})
			}}
			position="center"
		/>
	</div>

	<!--? folders1 - Folders Info 1 -->

	<div class="info-wrapper">
		<div class="description em">
			<span bind:this={proTipEl}>
				<span style="color:var(--bg-e)">Pro tip &nbsp;·&nbsp; </span>
				<span style="color:var(--fg-c)">click folder headers to open / close them</span>
			</span>
		</div>

		{#if proTipEl}
			<Info target={proTipEl} side="left" tooltipText={['more tips', 'less tips']}>
				<div class="description">
					The <code>closed</code> state can be persisted in <code>localStorage</code>
				</div>

				<div class="example">
					<!-- shiki-start
```ts
// Persist all states
const gooey = new Gooey({ storage: true })

// Only `closed` state
const gooey = new Gooey({
  storage: {
    closed: true
  },
```
shiki-end -->
				</div>
			</Info>
		{/if}
	</div>
</section>

<style>
	.variable-font-display {
		position: absolute;
		inset: 0;

		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: var(--padding-lg);

		padding: var(--padding);

		font-size: var(--font-xl);
	}
</style>
