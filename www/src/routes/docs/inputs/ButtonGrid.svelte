<!-- based on InputButtonGrid: "../../../../../src/inputs/InputButtonGrid.ts" -->

<script lang="ts">
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="buttongrid">ButtonGrid</H>

<section class="section">
	<!--? Overview -->

	<div class="description">
		ButtonGrid inputs display a 2D grid of clickable buttons. Unlike other inputs, ButtonGrid must be created
		explicitly using <code>addButtonGrid</code> — it cannot be inferred via <code>add()</code> because TypeScript cannot
		distinguish 2D arrays from regular arrays at compile time.
	</div>

	<!--? Basic usage -->

	<div class="example">
		<!-- shiki-start
```ts
gooey.addButtonGrid('grid', [
  [
    { text: 'A', onClick: () => console.log('A') },
    { text: 'B', onClick: () => console.log('B') }
  ],
  [
    { text: 'C', onClick: () => console.log('C') },
    { text: 'D', onClick: () => console.log('D') }
  ]
])
```
shiki-end -->

		<LiveExample
			title="Basic ButtonGrid"
			onMount={g => {
				g.addButtonGrid('grid', [
					[
						{ text: 'A', onClick: () => console.log('A') },
						{ text: 'B', onClick: () => console.log('B') },
					],
					[
						{ text: 'C', onClick: () => console.log('C') },
						{ text: 'D', onClick: () => console.log('D') },
					],
				])
			}}
			position="center"
		/>
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="ButtonGridOptions">ButtonGrid Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'value',
					description: '2D array of button configurations (rows × columns)',
					// TODO Add a `required` prop that conveys itself in the ui in an intuitive, non-intrusive way.
					// required: true,
				},
				{
					name: 'applyActiveClass',
					description: 'apply "active" class to clicked buttons',
					default: 'true',
				},
				{
					name: 'multiple',
					description: 'allow multiple buttons to be active simultaneously',
					default: 'false',
				},
			]}
		/>
	</div>

	<div class="example">
		<!-- shiki-start
c"has-focus" p
```ts
let selected = 'A'
gooey.addButtonGrid('selector', [
  [
    { text: 'A', onClick: () => selected = 'A' },
    { text: 'B', onClick: () => selected = 'B' }
  ]
], {
  multiple: false,  //! c"focus"
  applyActiveClass: true  //! c"focus"
})
```
shiki-end -->

		<LiveExample
			title="ButtonGrid Options"
			onMount={g => {
				let selected = 'A'
				g.addButtonGrid(
					'selector',
					[
						[
							{ text: 'A', onClick: () => (selected = 'A') },
							{ text: 'B', onClick: () => (selected = 'B') },
						],
					],
					{
						multiple: false,
						applyActiveClass: true,
					},
				)
			}}
			position="center"
		/>
	</div>

	<!--? Advanced usage -->

	<div class="br"></div>
	<div class="description">Some more advanced stuff you can do with button grid inputs:</div>

	<div class="example">
		<!-- shiki-start
```ts
// Multi-select grid
const selected = new Set()
gooey.addButtonGrid('multiGrid', [
  [
    { id: '1', text: '1', onClick: () => selected.add('1') },
    { id: '2', text: '2', onClick: () => selected.add('2') }
  ],
  [
    { id: '3', text: '3', onClick: () => selected.add('3') },
    { id: '4', text: '4', onClick: () => selected.add('4') }
  ]
], { multiple: true })

// Grid with tooltips
gooey.addButtonGrid('tooltipGrid', [
  [
    { text: 'ℹ️', onClick: () => {}, tooltip: { text: 'Info' } },
	{ text: '⚙️', onClick: () => {}, tooltip: { text: 'Settings' } },
  ]
])
```
shiki-end -->

		<LiveExample
			title="Advanced ButtonGrid Usage"
			onMount={g => {
				const selected = new Set()
				g.addButtonGrid(
					'multiGrid',
					[
						[
							{ id: '1', text: '1', onClick: () => selected.add('1') },
							{ id: '2', text: '2', onClick: () => selected.add('2') },
						],
						[
							{ id: '3', text: '3', onClick: () => selected.add('3') },
							{ id: '4', text: '4', onClick: () => selected.add('4') },
						],
					],
					{ multiple: true },
				)

				g.addButtonGrid('tooltipGrid', [
					[
						// // TODO Make `tooltip` accept both string or `Partial<TooltipOptions>`, applying as `TooltipOptions.text` if a string is provided.
						// { text: 'ℹ️', onClick: () => {}, tooltip: 'Info' }, // Type 'string' is not assignable to type 'Partial<TooltipOptions>'
						// { text: '⚙️', onClick: () => {}, tooltip: 'Settings' }, // Type 'string' is not assignable to type 'Partial<TooltipOptions>'
						{ text: 'ℹ️', onClick: () => {}, tooltip: { text: 'Info' } },
						{ text: '⚙️', onClick: () => {}, tooltip: { text: 'Settings' } },
					],
				])
			}}
			position="center"
		/>
	</div>

	<div class="description">
		You can create multi-select grids, add tooltips to buttons, or track selected button IDs programmatically.
	</div>
</section>
