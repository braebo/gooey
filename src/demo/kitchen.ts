import { Gooey, type GooeyOptions } from '..'

export const kitchen = (opts?: Partial<GooeyOptions>) => {
	const g = new Gooey(opts)

	g.add('text', 'foo')
	g.add('number', 5)
	g.add('boolean', true)
	g.add('select', ['foo', 'bar', 'baz'])
	g.add('color', '#000000')
	g.add('button', () => alert('thanks'))
	// g.add('empty') // todo

	const f = g.addFolder('Folder')

	f.add('button grid', [
		[
			{ text: 'foo', onClick: () => alert('foo') },
			{ text: 'bar', onClick: () => alert('bar') },
		],
		[
			{ text: 'baz', onClick: () => alert('baz') },
			{ text: 'qux', onClick: () => alert('qux') },
		],
	])

	return g
}
