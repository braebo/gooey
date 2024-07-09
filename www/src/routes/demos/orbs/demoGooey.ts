import type { Params } from '$lib/components/orbs/params'
import type { GooeyPreset } from 'gooey'

import { ORBS_PRESETS } from '$lib/components/orbs/ORBS_PRESETS'
import { DEV } from 'esm-env'
import { Gooey } from 'gooey'

import { stringify } from '$lib/utils/stringify'
import { debrief } from '$lib/utils/debrief'
import { state } from 'gooey'

export const showCode = state(false)
export const code = state('')

export function demoGooey(params: Params) {
	const gooey = new Gooey({
		title: 'Orbs',
		position: 'center',
		storage: {
			key: 'gooey',
			position: true,
			closed: true,
			size: true
		},
		presets: ORBS_PRESETS
	})

	gooey.folder.on('toggle', (v) => {
		console.log(v)
	})

	const f1 = gooey.addFolder('base')

	f1.add('count', {
		binding: {
			target: params,
			key: 'orbs'
		},
		min: 1,
		max: 150,
		step: 1
	})

	// f1.bind({
	// 	title: 'width',
	// 	binding: {
	// 		target: params,
	// 		key: 'width',
	// 	},
	// 	min: 10,
	// 	max: window.innerWidth / 4,
	// 	step: 1,
	// })

	const widthInput = f1.bind(params, 'width', {
		//=>
		min: 10,
		max: window.innerWidth / 4,
		step: 1
	})
	widthInput // InputNumber

	f1.addNumber({
		title: 'height',
		binding: {
			target: params,
			key: 'height'
		},
		min: 10,
		max: window.innerHeight / 8,
		step: 1
	})

	const motionFolder = gooey.addFolder('motion')

	motionFolder.addNumber({
		title: 'speed',
		binding: {
			target: params,
			key: 'speed'
		},
		min: 0.0001,
		max: 1,
		step: 0.0001
	})

	motionFolder.addNumber({
		title: 'force x',
		binding: {
			target: params,
			key: 'a1'
		},
		min: 0,
		max: 3,
		step: 0.001
	})

	motionFolder.addNumber({
		title: 'force y',
		binding: {
			target: params,
			key: 'a2'
		},
		min: 1,
		max: 3,
		step: 0.001
	})

	motionFolder.addNumber({
		title: 'temporal drift',
		binding: {
			target: params,
			key: 'drift'
		},
		min: -1,
		max: 1,
		step: 0.001
	})

	motionFolder.addSwitch({
		title: 'modulate',
		binding: {
			target: params,
			key: 'modulate'
		}
	})

	const appearanceFolder = gooey.addFolder('appearance')

	appearanceFolder.addNumber({
		title: 'size',
		binding: {
			target: params,
			key: 'size'
		},
		min: 1,
		max: 30,
		step: 1
	})

	appearanceFolder.addNumber({
		title: 'floop',
		binding: {
			target: params,
			key: 'floop'
		},
		min: 0.001,
		max: 0.5,
		step: 0.001
	})

	appearanceFolder.addNumber({
		title: 'brightness',
		binding: {
			target: params,
			key: 'brightness'
		},
		min: 0,
		max: 1,
		step: 0.01
	})

	appearanceFolder.addColor({
		title: 'color',
		mode: 'hex8',
		binding: {
			target: params,
			key: 'color'
		}
	})

	appearanceFolder.addColor({
		title: 'accent',
		mode: 'hsla',
		binding: {
			target: params,
			key: 'accent'
		}
	})

	const glowFolder = appearanceFolder.addFolder('glow')

	glowFolder.addNumber({
		title: 'glowR',
		binding: {
			target: params,
			key: 'glowR'
		},
		min: 0,
		max: 20,
		step: 0.01
	})

	glowFolder.addNumber({
		title: 'glowG',
		binding: {
			target: params,
			key: 'glowG'
		},
		min: 0,
		max: 20,
		step: 0.01
	})

	glowFolder.addNumber({
		title: 'glowB',
		binding: {
			target: params,
			key: 'glowB'
		},
		min: 0,
		max: 20,
		step: 0.01
	})

	function showActivePreset(v: GooeyPreset) {
		code.set(
			stringify(
				{
					presets: gooey.presetManager.presets.value.length,
					activePreset: {
						...v,
						data: debrief(v.data, { siblings: 7, depth: 4 })
					}
				},
				2
			).replaceAll('"', '')
		)
	}

	gooey.folder.evm.add(
		showCode.subscribe((v) => {
			if (v) showActivePreset(gooey.presetManager.activePreset.value)
		})
	)

	gooey.folder.evm.add(
		gooey.presetManager.activePreset.subscribe((v) => {
			if (showCode.value) showActivePreset(v)
		})
	)

	if (DEV) {
		const devFolder = gooey.addFolder('dev', {
			closed: true,
			saveable: false
		})

		// setTimeout(() => {
		// 	gooey.settingsFolder.open()
		// })
		devFolder.addButtonGrid({
			title: 'dev',
			saveable: false,
			resettable: false,
			value: [
				[
					{
						text: 'log(this)',
						onClick: () => {
							console.log(gooey)
						}
					},
					{
						text: 'show preset',
						onClick: () => {
							showCode.set(!showCode.value)
						}
					},
					{
						text: '🚫 storage',
						onClick: () => {
							localStorage.clear()
						},
						style: {
							textWrap: 'nowrap',
							overflow: 'hidden',
							// this css makes the overflowing text have an elipsis...
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
							filter: 'saturate(0)',
							alignItems: 'center'
						}
					}
				]
			]
		})
	}

	// console.log(gooey._log.log('asd'))

	return gooey
}
