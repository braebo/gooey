import { tldr } from '../../../../src/shared/tldr'

export function trimmer(input: string): string {
	if (typeof input !== 'string') return input

	const lines = input.split('\n')

	// Find the minimum indentation
	const minIndent = lines
		.filter(line => line.trim().length > 0) // Ignore empty lines
		.reduce((min, line) => {
			const match = line.match(/^\s*/)
			const indent = match ? match[0].length : 0 // Handle potential null
			return Math.min(min, indent)
		}, 100)

	const trimmedLines = lines.map(line => {
		if (line.trim().length === 0) return line // Preserve empty lines
		return line.slice(minIndent)
	})

	console.log(tldr({ lines, minIndent, trimmedLines }))

	return trimmedLines.join('\n')
}
