import type { GooeyPreset } from '../../../../../src/index'
import type { Params } from '$lib/components/orbs/params'

import { ORBS_PRESETS } from '$lib/components/orbs/ORBS_PRESETS'
import { Gooey, state } from '../../../../../src/index'
import { DEV } from 'esm-env'

import { stringify } from '$lib/utils/stringify'
import { debrief } from '$lib/utils/debrief'

export const showCode = state(false)
export const code = state('')

export function demoGooey(params: Params) {
	const gooey = new Gooey({
		title: 'Orbs',
		position: 'top-center',
		margin: {
			y: 150,
			x: 10,
		},
		storage: {
			key: 'gooey',
			position: true,
			closed: true,
			size: true,
		},
		presets: ORBS_PRESETS,
	})

	gooey.folder.on('toggle', (v) => {
		console.log(v)
	})

	const f1 = gooey.addFolder('base', { closed: true })

	f1.bind(params, 'orbs', {
		min: 1,
		max: 150,
		step: 1,
	})

	f1.bind(params, 'width', {
		min: 10,
		max: window.innerWidth / 4,
		step: 1,
	})

	f1.bind(params, 'height', {
		min: 10,
		max: window.innerHeight / 8,
		step: 1,
	})

	const motionFolder = gooey.addFolder('motion', { closed: true })

	motionFolder.bind(params, 'speed', {
		min: 0.0001,
		max: 1,
		step: 0.0001,
	})

	motionFolder.bind(params, 'a1', {
		title: 'force x',
		min: 0,
		max: 3,
		step: 0.001,
	})

	motionFolder.bind(params, 'a2', {
		title: 'force y',
		min: 1,
		max: 3,
		step: 0.001,
	})

	motionFolder.bind(params, 'drift', {
		title: 'temporal drift',
		min: -1,
		max: 1,
		step: 0.001,
	})

	motionFolder.bind(params, 'modulate')

	const appearanceFolder = gooey.addFolder('appearance', { closed: true })

	appearanceFolder.bind(params, 'size', {
		min: 1,
		max: 30,
		step: 1,
	})

	appearanceFolder.bind(params, 'floop', {
		min: 0.001,
		max: 0.5,
		step: 0.001,
	})

	appearanceFolder.bind(params, 'brightness', {
		min: 0,
		max: 1,
		step: 0.01,
	})

	appearanceFolder.bind(params, 'color', {
		mode: 'hex8',
	})

	appearanceFolder.bind(params, 'accent', {
		mode: 'hsla',
	})

	const glowFolder = appearanceFolder.addFolder('glow', { closed: true })

	glowFolder.bind(params, 'glowR', {
		min: 0,
		max: 20,
		step: 0.01,
	})

	glowFolder.bind(params, 'glowG', {
		min: 0,
		max: 20,
		step: 0.01,
	})

	glowFolder.bind(params, 'glowB', {
		min: 0,
		max: 20,
		step: 0.01,
	})

	function showActivePreset(v: GooeyPreset) {
		code.set(
			stringify(
				{
					presets: gooey.presetManager.presets.value.length,
					activePreset: {
						...v,
						data: debrief(v.data, { siblings: 7, depth: 4 }),
					},
				},
				2,
			).replaceAll('"', ''),
		)
	}

	gooey.folder.evm.add(
		showCode.subscribe((v) => {
			if (v) showActivePreset(gooey.presetManager.activePreset.value)
		}),
	)

	gooey.folder.evm.add(
		gooey.presetManager.activePreset.subscribe((v) => {
			if (showCode.value) showActivePreset(v)
		}),
	)

	if (DEV) {
		const devFolder = gooey.addFolder('dev', {
			closed: true,
			saveable: false,
		})

		devFolder.addButtonGrid(
			'dev',
			[
				[
					{
						text: 'log(this)',
						onClick: () => {
							console.log(gooey)
						},
					},
					{
						text: 'show preset',
						onClick: () => {
							showCode.set(!showCode.value)
						},
					},
					{
						text: '🚫 storage',
						onClick: () => {
							localStorage.clear()
						},
						style: {
							textWrap: 'nowrap',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
							filter: 'saturate(0)',
							alignItems: 'center',
						},
					},
				],
			],
			{
				saveable: false,
				resettable: false,
			},
		)
	}

	return gooey
}
