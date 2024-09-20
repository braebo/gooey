import { Gooey, type InputButtonGrid } from '../../../../../../src/index'
import { BinauralBeats, WAVE_PRESETS } from './BinauralBeats'

export class BinauralBeatsGooey extends Gooey {
	constructor(public beats: BinauralBeats) {
		super({ title: 'Binaural Beats', position: 'top-center', margin: { x: 0, y: 64 }, storage: false })

		this.folder.addButtonGrid(
			'Presets',
			[
				Object.keys(WAVE_PRESETS).map(kind => {
					return {
						text: kind,
						onClick: () => {
							let wave = this.beats.waves.get(kind)

							if (!wave) {
								wave = this.beats.addWave(kind as keyof typeof WAVE_PRESETS)
							} else {
								this.beats.removeWave(kind as keyof typeof WAVE_PRESETS)
							}
						},
					}
				}),
			],
			{ multiple: true },
		)

		this.folder.addNumber('Volume', this.beats.volume).on('change', v => {
			this.beats.volume = v
		})

		setTimeout(() => {
			const playbackInput = this.folder.addButtonGrid('Playback', [
				[
					{
						text: 'Start',
						onClick: () => {
							for (const waves of this.beats.waves.values()) {
								if (waves.playing) return
								waves.start()
								waves.gooey?.folder.refresh()
								this.folder.allInputs.forEach(c => c.refresh())
							}
						},
						active: () => {
							return [...this.beats.waves.values()].some(w => w.playing && !w.stopping)
						},
					},
					{
						text: 'Stop',
						onClick: ({ button }) => {
							for (const waves of this.beats.waves.values()) {
								if (!waves.playing) return
								waves.stop()
								waves.gooey?.folder.refresh()

								const startBtn = (
									waves.gooey?.folder.allInputs.get('Playback') as InputButtonGrid
								)?.buttons.get('Stop')!

								startBtn?.element.setAttribute('disabled', '')
								const { color } = startBtn.element.style
								startBtn.element.style.color = 'tomato'
								setTimeout(() => {
									startBtn?.element.removeAttribute('disabled')
									startBtn.element.style.color = color
								}, 0.25 * 1000)
							}
						},
						active: () => {
							return [...this.beats.waves.values()].some(w => w.stopping)
						},
					},
				],
			])
		}, 0)
	}
}
