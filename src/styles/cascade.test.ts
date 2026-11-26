import { afterEach, describe, expect, test } from 'vitest'
import { GooeyTest } from '../tests/Gooey/GooeyTest'

const G = new GooeyTest()

const button = () => {
	const gooey = G.addGooey()
	const el = gooey.addButton('go', () => {}).button.element
	return getComputedStyle(el)
}

const page_style = (css: string) => {
	const style = document.createElement('style')
	style.textContent = css
	document.head.append(style)
	return style
}

describe('stylesheet cascade', () => {
	let style: HTMLStyleElement | undefined
	afterEach(() => style?.remove())

	test('the reset is the only layered rule, and it comes first', () => {
		button()
		const sheet = document.adoptedStyleSheets.find(s =>
			Array.from(s.cssRules).some(
				r => r instanceof CSSLayerBlockRule && r.name === 'gooey-reset',
			),
		)!
		const layers = Array.from(sheet.cssRules).filter(r => r instanceof CSSLayerBlockRule)
		expect(layers.map(r => (r as CSSLayerBlockRule).name)).toEqual(['gooey-reset'])
		expect(sheet.cssRules[0]).toBe(layers[0])
	})

	test("an unlayered page's element rule doesn't beat gooey's class rule", () => {
		style = page_style('button { cursor: crosshair }')
		expect(button().cursor).toBe('pointer')
	})

	test('a layered page that orders gooey-reset first reaches what gooey leaves alone', () => {
		style = page_style(
			'@layer gooey-reset, globals; @layer globals { button { cursor: crosshair; text-transform: uppercase } }',
		)
		const css = button()
		expect(css.textTransform).toBe('uppercase')
		expect(css.cursor).toBe('pointer')
	})
})
