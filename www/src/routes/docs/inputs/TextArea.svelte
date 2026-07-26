<!-- based on InputTextArea: "../../../../../src/inputs/InputTextArea.ts" -->

<script lang="ts">
	import LiveExample from '$lib/components/LiveExample.svelte'
	import Props from '$lib/components/Props.svelte'
	import H from '$lib/components/H.svelte'
</script>

<H l="2" id="textarea">TextArea</H>

<section class="section">
	<!--? Overview -->

	<div class="description">TextArea inputs provide a multi-line text input field with configurable character limits.</div>

	<!--? Basic usage -->

	<div class="example">
		<!-- shiki-start
```ts
// explicit
gooey.addTextArea('description', 'Enter text here...')

// implicit
gooey.add('notes', 'Some notes')

// binding
const data = { content: 'Hello\nWorld' }
gooey.bind(data, 'content')
```
shiki-end -->

		<LiveExample
			title="Basic TextArea Inputs"
			onMount={g => {
				g.add('notes', 'Some notes')
				g.addTextArea('description', 'Enter text here...')

				const data = { content: 'Hello\nWorld' }
				g.bind(data, 'content')
			}}
			position="center"
		/>
	</div>

	<!--? Options -->

	<div class="br"></div>
	<H l="3" id="TextAreaOptions">TextArea Options</H>

	<div class="description">
		<Props
			props={[
				{
					name: 'maxLength',
					description: 'maximum number of characters that can be entered',
					default: '50',
				},
			]}
		/>
	</div>

	<div class="example">
		<!-- shiki-start
c"has-focus" p
```ts
gooey.add('bio', 'Tell us about yourself...', {
  maxLength: 200,  //! c"focus"
})
```
shiki-end -->

		<LiveExample
			title="TextArea Options"
			onMount={g => {
				g.add('bio', 'Tell us about yourself...', { maxLength: 200 })
			}}
			position="center"
		/>
	</div>

	<!--? Advanced usage -->

	<div class="br"></div>
	<div class="description">Some more advanced stuff you can do with textarea inputs:</div>

	<div class="example">
		<!-- shiki-start
```ts
// Binding to an object property
const data = { message: 'Multi-line\ntext here' }
gooey.bind(data, 'message', { maxLength: 100 })

// Using onChange callback
gooey.add('comment', 'Type here...', {
  onChange: (v) => console.log('Text changed:', v)
})

// Dynamic disabled state
gooey.add('dynamicTextArea', 'editable', {
  disabled: () => someCondition
})
```
shiki-end -->

		<LiveExample
			title="Advanced TextArea Usage"
			onMount={g => {
				const data = { message: 'Multi-line\ntext here' }
				g.bind(data, 'message', { maxLength: 100 })
				g.add('comment', 'Type here...', {
					onChange: v => console.log('Text changed:', v),
				})
				let someCondition = false
				g.add('dynamicTextArea', 'editable', {
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
