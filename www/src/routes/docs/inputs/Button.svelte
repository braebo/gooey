<!-- based on InputButton: "../../../../../src/inputs/InputButton.ts" -->

<script lang="ts">
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="button">Button</H>

<section class="section">
	<!--? Overview -->

	<div class="description">Button inputs execute functions when clicked.</div>

	<!--? Basic usage -->

	<div class="example">
		<!-- shiki-start
```ts
// explicit with text
gooey.addButton('Click me', () => console.log('clicked'))

// implicit with function
gooey.add('action', () => alert('Action!'))

// with custom text
gooey.add('Custom', {
  text: 'Do something',
  onClick: () => console.log('done')
})
```
shiki-end -->

		<LiveExample
			title="Basic Button Inputs"
			onMount={g => {
				g.add('action', () => alert('Action!'))
				g.addButton('Click me', () => console.log('clicked'))
				g.add('Custom', {
					text: 'Do something',
					onClick: () => console.log('done'),
				})
			}}
			position="center"
		/>
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="ButtonOptions">Button Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'text',
					description: 'button label text (can be a string or function)',
					default: '"click me"',
				},
				{
					name: 'onClick',
					description: 'function to execute when clicked',
					required: true,
				},
			]}
		/>
	</div>

	<div class="example">
		<!-- shiki-start
c"has-focus" p
```ts
let count = 0
gooey.add('counter', {
  text: () => `Clicked ${count} times`,  //! c"focus"
  onClick: () => count++  //! c"focus"
})
```
shiki-end -->

		<LiveExample
			title="Button with Dynamic Text"
			onMount={g => {
				let count = 0
				g.add('counter', {
					text: () => `Clicked ${count} times`,
					onClick: () => count++,
				})
			}}
			position="center"
		/>
	</div>

	<!--? Advanced usage -->

	<div class="br"></div>
	<div class="description">Some more advanced stuff you can do with button inputs:</div>

	<div class="example">
		<!-- shiki-start
```ts
// Programmatically trigger click
const button = gooey.add('trigger', () => console.log('triggered'))
button.click()

// Access button context
gooey.add('context', function() {
  console.log('Button instance:', this)
})

// Dynamic disabled state
gooey.add('dynamicButton', () => alert('Enabled!'), {
  disabled: () => someCondition
})
```
shiki-end -->

		<LiveExample
			title="Advanced Button Usage"
			onMount={g => {
				const button = g.add('trigger', () => console.log('triggered'))
				setTimeout(() => button.click(), 100)
				
				g.add('context', function () {
					console.log('Button instance:', this)
				})
				
				let someCondition = false
				g.add('dynamicButton', () => alert('Enabled!'), {
					disabled: () => someCondition,
				})
				g.add('Toggle disabled', () => (someCondition = !someCondition))
			}}
			position="center"
		/>
	</div>

	<div class="description">
		You can programmatically trigger clicks, access the button context, or pass a function to `disabled` for
		dynamic, programmatic toggling, for example.
	</div>
</section>
