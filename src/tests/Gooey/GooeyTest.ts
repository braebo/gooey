import { Gooey, type GooeyOptions } from '../../Gooey'

export class GooeyTest {
	public page: HTMLDivElement

	constructor() {
		document.body.style.background = 'black'
		localStorage.clear()

		this.page = document.createElement('div')
		this.page.style.cssText = `
	position: relative;
	display: flex;
	flex-direction: column;
`
		document.body.append(this.page)
	}

	public addGooey(options: Partial<GooeyOptions> & {
		height?: number
	} = {}) {
		if (!options.container) {
			const height = options.height ?? 10
			const container = document.createElement('div')
			container.style.cssText = `
		position: relative;
		height: ${height}rem;
		outline: 2px solid #222;
	`
			this.page.append(container)
			options.container = container
		}

		options.position ??= 'center'
		options.storage ??= false

		return new Gooey(options)
	}
}
