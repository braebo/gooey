<!-- based on InputSwitch: "../../../../../src/inputs/InputSwitch.ts" -->

<script lang="ts">
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="switch">Switch</H>

<section class="section">
	<!--? Overview -->

	<div class="description">Switch inputs provide a toggle for boolean values with customizable labels.</div>

	<!--? Basic usage -->

	<div class="example">
		<!-- shiki-start
```ts
// explicit
gooey.addSwitch('enabled', true)

// implicit
gooey.add('active', false)

// binding
const data = { visible: true }
gooey.bind(data, 'visible')
```
shiki-end -->

		<LiveExample
			title="Basic Switch Inputs"
			onMount={g => {
				g.add('active', false)
				g.addSwitch('enabled', true)

				const data = { visible: true }
				g.bind(data, 'visible')
			}}
			position="center"
		/>
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="SwitchOptions">Switch Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'labels',
					description: 'customize text for true/false states and their actions',
					default: '{ true: { state: "on", verb: "Enable" }, false: { state: "off", verb: "Disable" } }',
				},
			]}
		/>
	</div>

	<div class="example">
		<!-- shiki-start
c"has-focus" p
```ts
gooey.add('darkMode', false, {
  labels: {  //! c"focus"
    true: { state: 'dark', verb: 'Enable dark mode' },  //! c"focus"
    false: { state: 'light', verb: 'Enable light mode' }  //! c"focus"
  }  //! c"focus"
})
```
shiki-end -->

		<LiveExample
			title="Switch with Custom Labels"
			onMount={g => {
				g.add('darkMode', false, {
					labels: {
						true: { state: 'dark', verb: 'Enable dark mode' },
						false: { state: 'light', verb: 'Enable light mode' },
					},
				})
			}}
			position="center"
		/>
	</div>

	<!--? Advanced usage -->

	<div class="br"></div>
	<div class="description">Some more advanced stuff you can do with switch inputs:</div>

	<div class="example">
		<!-- shiki-start
```ts
// Binding to an object property
const data = { enabled: true }
gooey.bind(data, 'enabled')

// Using onChange callback
gooey.add('toggle', false, {
  onChange: (v) => console.log('Toggled:', v)
})

// Dynamic disabled state
gooey.add('dynamicSwitch', true, {
  disabled: () => someCondition
})
```
shiki-end -->

		<LiveExample
			title="Advanced Switch Usage"
			onMount={g => {
				const data = { enabled: true }
				g.bind(data, 'enabled')
				g.add('toggle', false, {
					onChange: v => console.log('Toggled:', v),
				})
				let someCondition = false
				g.add('dynamicSwitch', true, {
					disabled: () => someCondition,
				})
				g.add('Toggle disabled', () => (someCondition = !someCondition))
			}}
			position="center"
		/>
	</div>

	<div class="description">
		You can bind to object properties, use callbacks, or pass a function to `disabled` for dynamic, programmatic
		toggling, for example.
	</div>
</section>
