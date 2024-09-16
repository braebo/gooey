import type { SubSection } from '..'

function sections(): SubSection[] {
	const content = [] as SubSection[]

	content.push({
		title: 'create',
		content: [
			{
				description: 'Create a <span class="gooey">gooey</span> with some <a href="#inputs">inputs </a>',
			},
			{
				fn: () => {},
				code: `
import { Gooey } from 'gooey'

const gooey = new Gooey()
`.trim(),
			},
			{
				description: '<code>add</code> some <a href="#inputs">inputs</a>',
			},
			{
				fn: g => {
					g.add('hello', 'world')
					g.add('count', 1)
				},
				code: `
gooey.add('hello', 'world')
gooey.add('count', 1)
`.trim(),
			},
		],
	})

	return content
}

export default sections()
