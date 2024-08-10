import type { Waves } from './Waves'

import { WAVE_PRESETS } from '../beats/BinauralBeats'
import { Gooey } from '../../../../../../src/index'
import type { GooeyOptionsInternal } from '../../../../../../src/Gooey'

const dims = {
	mx: 10,
	my: 150 + 64,
	w: 400,
	h: 250,
}

export class WavesGooey extends Gooey {
	constructor(
		public waves: Waves,
		public kind: keyof typeof WAVE_PRESETS,
	) {
		const positions = {
			alpha: {
				x: window.innerWidth / 2 - dims.w - dims.mx,
				y: dims.my,
			},
			beta: {
				x: window.innerWidth / 2 + dims.mx,
				y: dims.my,
			},
			theta: {
				x: window.innerWidth / 2 - dims.w - dims.mx,
				y: dims.my + dims.h + 32,
			},
			delta: {
				x: window.innerWidth / 2 + dims.mx,
				y: dims.my + dims.h + 32,
			},
		}

		super({
			title: kind,
			closed: false,
			// todo - not this
			_windowManager: waves.beats.gooey!.windowManager,
			position: positions[kind],
			storage: false,
		} as GooeyOptionsInternal)

		const btnGrid = this.addButtonGrid('Playback', [
			[
				{
					text: 'Start',
					onClick: () => {
						if (waves.playing) return
						waves.start()
						this.folder.allInputs.forEach((c) => c.refresh())
					},
					active() {
						return waves.playing && !waves.stopping
					},
				},
				{
					text: 'Stop',
					onClick: ({ button }) => {
						if (!waves.playing) return
						waves.stop()
						const startBtn = btnGrid.buttons.get('Start')
						startBtn?.element.setAttribute('disabled', '')
						const { color } = button.element.style
						button.element.style.color = 'tomato'
						setTimeout(() => {
							startBtn?.element.removeAttribute('disabled')
							button.element.style.color = color
						}, 0.25 * 1000)
					},
					active() {
						return waves.stopping
					},
				},
			],
		])

		const folderL = this.addFolder('Left', { closed: true })

		// todo - handle state so we can do:
		// gooey.add({
		// 	title: 'Right Frequency',
		// 	value: params.freqL,
		// })

		folderL
			.addNumber('Gain', waves.volL, {
				min: 0,
				max: 1,
				step: 0.01,
			})
			.on('change', (v) => {
				waves.volL = v
			})

		folderL
			.addNumber('Frequency', waves.freqL, {
				min: 20,
				max: 440,
				step: 1,
			})
			.on('change', (v) => {
				this.waves.freqL = v
			})

		const folderR = this.addFolder('Right', { closed: true })

		folderR
			.addNumber('Gain', waves.volR, {
				min: 0,
				max: 1,
				step: 0.01,
			})
			.on('change', (v) => {
				this.waves.volR = v
			})

		folderR
			.addNumber('Frequency', waves.freqR, {
				min: 20,
				max: 440,
				step: 1,
			})
			.on('change', (v) => {
				this.waves.freqR = v
			})
	}
}
