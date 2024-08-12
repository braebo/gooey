import { describe, it, expect } from 'vitest'
import { Gooey } from './Gooey'

document.body.style.background = 'black'
localStorage.clear()

const gooey = new Gooey({ title: 'Folder.examples.test' })

describe('tsdoc examples', () => {
	describe('addMany example', () => {
		const params = {
			myNumber: 5,
			myFolder: {
				myOptions: 'foo',
			},
		}

		it('should initialize successfully', () => {
			const wtf = gooey.addMany(params, {
				myFolder: {
					folderOptions: { closed: true }, // optional folder controls
				},
			})
			console.log('wtf', wtf)
			console.log('gooey', gooey)
		})

		it('should find inputs by key', () => {
			const numberInput = gooey.inputs.get('myNumber')
			expect(numberInput).toBeDefined()
		})

		it('should find nested inputs by key', () => {
			const optionsInput = gooey.allInputs.get('myOptions')
			expect(optionsInput).toBeDefined()
		})

		it('should find folders by key', () => {
			const folder = gooey.folder.children.find(f => f.title === 'myFolder')
			expect(folder).toBeDefined()
		})
	})
})
