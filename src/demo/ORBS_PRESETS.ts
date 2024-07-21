// todo - migrate these to the new format

import type { GooeyPreset } from '../Gooey'

export const ORBS_PRESETS = [
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'gooey-default-preset',
		title: 'default',
		data: {
			__type: 'FolderPreset',
			id: 'Orbs',
			title: 'Orbs',
			// closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'base',
					title: 'base',
					// closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'count',
							value: 50,
							disabled: false,
							presetId: 'base_count__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'width',
							value: 213,
							disabled: false,
							presetId: 'base_width__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'height',
							value: 120,
							disabled: false,
							presetId: 'base_height__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
				{
					__type: 'FolderPreset',
					id: 'motion',
					title: 'motion',
					// closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.02,
							disabled: false,
							presetId: 'motion_speed__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'force x',
							value: 1,
							disabled: false,
							presetId: 'motion_force x__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'force y',
							value: 1,
							disabled: false,
							presetId: 'motion_force y__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'temporal drift',
							value: 0,
							disabled: false,
							presetId: 'motion_temporal drift__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'SwitchInputOptions',
							title: 'modulate',
							value: true,
							disabled: false,
							presetId: 'motion_modulate__SwitchInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
				{
					__type: 'FolderPreset',
					id: 'appearance',
					title: 'appearance',
					// closed: false,
					hidden: false,
					children: [
						{
							__type: 'FolderPreset',
							id: 'glow',
							title: 'glow',
							// closed: false,
							hidden: false,
							children: [],
							inputs: [
								{
									__type: 'NumberInputOptions',
									title: 'glowR',
									value: 10,
									disabled: false,
									presetId: 'glow_glowR__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
								{
									__type: 'NumberInputOptions',
									title: 'glowG',
									value: 10,
									disabled: false,
									presetId: 'glow_glowG__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
								{
									__type: 'NumberInputOptions',
									title: 'glowB',
									value: 50,
									disabled: false,
									presetId: 'glow_glowB__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
							],
						},
					],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 5,
							disabled: false,
							presetId: 'appearance_size__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'floop',
							value: 0.01,
							disabled: false,
							presetId: 'appearance_floop__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'brightness',
							value: 0.4,
							disabled: false,
							presetId: 'appearance_brightness__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'ColorInputOptions',
							title: 'color',
							value: '#0acafaff',
							disabled: false,
							presetId: 'appearance_color__ColorInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'ColorInputOptions',
							title: 'accent',
							value: '#003263ff',
							disabled: false,
							presetId: 'appearance_accent__ColorInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
			],
			inputs: [],
		},
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'nbaoNULZ3bblukz15sxzH',
		title: 'spicy cheese floops',
		data: {
			__type: 'FolderPreset',
			id: 'Orbs',
			title: 'Orbs',
			// closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'base',
					title: 'base',
					// closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'count',
							value: 102,
							disabled: false,
							presetId: 'base_count__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'width',
							value: 213,
							disabled: false,
							presetId: 'base_width__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'height',
							value: 120,
							disabled: false,
							presetId: 'base_height__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
				{
					__type: 'FolderPreset',
					id: 'motion',
					title: 'motion',
					// closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.02,
							disabled: false,
							presetId: 'motion_speed__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'force x',
							value: 1,
							disabled: false,
							presetId: 'motion_force x__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'force y',
							value: 1,
							disabled: false,
							presetId: 'motion_force y__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'temporal drift',
							value: 0,
							disabled: false,
							presetId: 'motion_temporal drift__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'SwitchInputOptions',
							title: 'modulate',
							value: true,
							disabled: false,
							presetId: 'motion_modulate__SwitchInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
				{
					__type: 'FolderPreset',
					id: 'appearance',
					title: 'appearance',
					// closed: false,
					hidden: false,
					children: [
						{
							__type: 'FolderPreset',
							id: 'glow',
							title: 'glow',
							// closed: false,
							hidden: false,
							children: [],
							inputs: [
								{
									__type: 'NumberInputOptions',
									title: 'glowR',
									value: 6.03,
									disabled: false,
									presetId: 'glow_glowR__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
								{
									__type: 'NumberInputOptions',
									title: 'glowG',
									value: 0,
									disabled: false,
									presetId: 'glow_glowG__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
								{
									__type: 'NumberInputOptions',
									title: 'glowB',
									value: 20,
									disabled: false,
									presetId: 'glow_glowB__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
							],
						},
					],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 5,
							disabled: false,
							presetId: 'appearance_size__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'floop',
							value: 0.28,
							disabled: false,
							presetId: 'appearance_floop__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'brightness',
							value: 0.58,
							disabled: false,
							presetId: 'appearance_brightness__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'ColorInputOptions',
							title: 'color',
							value: '#fa460aff',
							disabled: false,
							presetId: 'appearance_color__ColorInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'ColorInputOptions',
							title: 'accent',
							value: '#630002ff',
							disabled: false,
							presetId: 'appearance_accent__ColorInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
			],
			inputs: [],
		},
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'V1oU2TcKW1Ps4rFY5ZpZE',
		title: 'raver',
		data: {
			__type: 'FolderPreset',
			id: 'Orbs',
			title: 'Orbs',
			// closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'base',
					title: 'base',
					// closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'count',
							value: 113,
							disabled: false,
							presetId: 'base_count__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'width',
							value: 213,
							disabled: false,
							presetId: 'base_width__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'height',
							value: 120,
							disabled: false,
							presetId: 'base_height__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
				{
					__type: 'FolderPreset',
					id: 'motion',
					title: 'motion',
					// closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.0784,
							disabled: false,
							presetId: 'motion_speed__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'force x',
							value: 0.547,
							disabled: false,
							presetId: 'motion_force x__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'force y',
							value: 1,
							disabled: false,
							presetId: 'motion_force y__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'temporal drift',
							value: 0.691,
							disabled: false,
							presetId: 'motion_temporal drift__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'SwitchInputOptions',
							title: 'modulate',
							value: true,
							disabled: false,
							presetId: 'motion_modulate__SwitchInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
				{
					__type: 'FolderPreset',
					id: 'appearance',
					title: 'appearance',
					// closed: false,
					hidden: false,
					children: [
						{
							__type: 'FolderPreset',
							id: 'glow',
							title: 'glow',
							// closed: false,
							hidden: false,
							children: [],
							inputs: [
								{
									__type: 'NumberInputOptions',
									title: 'glowR',
									value: 9.94,
									disabled: false,
									presetId: 'glow_glowR__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
								{
									__type: 'NumberInputOptions',
									title: 'glowG',
									value: 13.53,
									disabled: false,
									presetId: 'glow_glowG__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
								{
									__type: 'NumberInputOptions',
									title: 'glowB',
									value: 20,
									disabled: false,
									presetId: 'glow_glowB__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
							],
						},
					],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 1,
							disabled: false,
							presetId: 'appearance_size__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'floop',
							value: 0.001,
							disabled: false,
							presetId: 'appearance_floop__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'brightness',
							value: 0.64,
							disabled: false,
							presetId: 'appearance_brightness__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'ColorInputOptions',
							title: 'color',
							value: '#0a16faff',
							disabled: false,
							presetId: 'appearance_color__ColorInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'ColorInputOptions',
							title: 'accent',
							value: '#00ff51ff',
							disabled: false,
							presetId: 'appearance_accent__ColorInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
			],
			inputs: [],
		},
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'Htcxi_Wk0wyRtiQh5SDo3',
		title: 'space banana',
		data: {
			__type: 'FolderPreset',
			id: 'Orbs',
			title: 'Orbs',
			// closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'base',
					title: 'base',
					// closed: true,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'count',
							value: 50,
							disabled: false,
							presetId: 'base_count__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'width',
							value: 213,
							disabled: false,
							presetId: 'base_width__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'height',
							value: 120,
							disabled: false,
							presetId: 'base_height__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
				{
					__type: 'FolderPreset',
					id: 'motion',
					title: 'motion',
					// closed: true,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.02,
							disabled: false,
							presetId: 'motion_speed__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'force x',
							value: 1,
							disabled: false,
							presetId: 'motion_force x__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'force y',
							value: 1,
							disabled: false,
							presetId: 'motion_force y__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'temporal drift',
							value: 0,
							disabled: false,
							presetId: 'motion_temporal drift__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'SwitchInputOptions',
							title: 'modulate',
							value: true,
							disabled: false,
							presetId: 'motion_modulate__SwitchInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
				{
					__type: 'FolderPreset',
					id: 'appearance',
					title: 'appearance',
					// closed: false,
					hidden: false,
					children: [
						{
							__type: 'FolderPreset',
							id: 'glow',
							title: 'glow',
							// closed: true,
							hidden: false,
							children: [],
							inputs: [
								{
									__type: 'NumberInputOptions',
									title: 'glowR',
									value: 10,
									disabled: false,
									presetId: 'glow_glowR__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
								{
									__type: 'NumberInputOptions',
									title: 'glowG',
									value: 10,
									disabled: false,
									presetId: 'glow_glowG__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
								{
									__type: 'NumberInputOptions',
									title: 'glowB',
									value: 50,
									disabled: false,
									presetId: 'glow_glowB__NumberInputOptions',
									hidden: false,
									order: 0,
									resettable: true,
								},
							],
						},
					],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 24,
							disabled: false,
							presetId: 'appearance_size__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'floop',
							value: 0.019,
							disabled: false,
							presetId: 'appearance_floop__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'NumberInputOptions',
							title: 'brightness',
							value: 0.4,
							disabled: false,
							presetId: 'appearance_brightness__NumberInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'ColorInputOptions',
							title: 'color',
							value: '#cefa0aff',
							disabled: false,
							presetId: 'appearance_color__ColorInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
						{
							__type: 'ColorInputOptions',
							title: 'accent',
							value: '#007fffff',
							disabled: false,
							presetId: 'appearance_accent__ColorInputOptions',
							hidden: false,
							order: 0,
							resettable: true,
						},
					],
				},
			],
			inputs: [],
		},
	} as const satisfies GooeyPreset,
] as const satisfies GooeyPreset[]
