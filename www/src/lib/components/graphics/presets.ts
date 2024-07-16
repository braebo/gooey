import type { GooeyPreset } from 'gooey'

const presets: GooeyPreset[] = [
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'gooey-default-preset',
		title: 'default',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [],
			inputs: []
		}
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'U3JDeBFa4VnfnaeXuszvC',
		title: 'wet scarf',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'goo',
					title: 'goo',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'SelectInputOptions',
							title: 'type',
							value: {
								label: 'fractalNoise',
								value: 'fractalNoise'
							},
							disabled: false,
							presetId: 'goo_type__SelectInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'SwitchInputOptions',
							title: 'motion',
							value: true,
							disabled: false,
							presetId: 'goo_motion__SwitchInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'viscosity',
							value: 0.0376,
							disabled: false,
							presetId: 'goo_viscosity__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'density',
							value: 1,
							disabled: false,
							presetId: 'goo_density__NumberInputOptions',
							hidden: false,
							order: 4,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'gooeyness',
							value: 25,
							disabled: false,
							presetId: 'goo_gooeyness__NumberInputOptions',
							hidden: false,
							order: 5,
							resettable: true
						}
					]
				},
				{
					__type: 'FolderPreset',
					id: 'orbs',
					title: 'orbs',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 0.86,
							disabled: false,
							presetId: 'orbs_size__NumberInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.508,
							disabled: false,
							presetId: 'orbs_speed__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'distance',
							value: 1,
							disabled: false,
							presetId: 'orbs_distance__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						}
					]
				}
			],
			inputs: [
				{
					__type: 'NumberInputOptions',
					title: 'speed',
					value: 0.18,
					disabled: false,
					presetId: 'gooey_speed__NumberInputOptions',
					hidden: false,
					order: 1,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'slider',
					value: 0.89,
					disabled: false,
					presetId: 'gooey_slider__NumberInputOptions',
					hidden: false,
					order: 2,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'glow',
					value: 21.2,
					disabled: false,
					presetId: 'gooey_glow__NumberInputOptions',
					hidden: false,
					order: 3,
					resettable: true
				}
			]
		}
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'zCb8rhhzHLqO7LRaII3ih',
		title: 'alien graffiti',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'goo',
					title: 'goo',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'SelectInputOptions',
							title: 'type',
							value: {
								label: 'turbulence',
								value: 'turbulence'
							},
							disabled: false,
							presetId: 'goo_type__SelectInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'SwitchInputOptions',
							title: 'motion',
							value: true,
							disabled: false,
							presetId: 'goo_motion__SwitchInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'viscosity',
							value: 0.0155,
							disabled: false,
							presetId: 'goo_viscosity__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'density',
							value: 1,
							disabled: false,
							presetId: 'goo_density__NumberInputOptions',
							hidden: false,
							order: 4,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'gooeyness',
							value: 100,
							disabled: false,
							presetId: 'goo_gooeyness__NumberInputOptions',
							hidden: false,
							order: 5,
							resettable: true
						}
					]
				},
				{
					__type: 'FolderPreset',
					id: 'orbs',
					title: 'orbs',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 0.86,
							disabled: false,
							presetId: 'orbs_size__NumberInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.508,
							disabled: false,
							presetId: 'orbs_speed__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'distance',
							value: 1,
							disabled: false,
							presetId: 'orbs_distance__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						}
					]
				}
			],
			inputs: [
				{
					__type: 'NumberInputOptions',
					title: 'speed',
					value: 0.1,
					disabled: false,
					presetId: 'gooey_speed__NumberInputOptions',
					hidden: false,
					order: 1,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'slider',
					value: 0.66,
					disabled: false,
					presetId: 'gooey_slider__NumberInputOptions',
					hidden: false,
					order: 2,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'glow',
					value: 21.2,
					disabled: false,
					presetId: 'gooey_glow__NumberInputOptions',
					hidden: false,
					order: 3,
					resettable: true
				}
			]
		}
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: '8r2nG29SgKL9-QdyL3V3j',
		title: 'static',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'goo',
					title: 'goo',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'SelectInputOptions',
							title: 'type',
							value: {
								label: 'fractalNoise',
								value: 'fractalNoise'
							},
							disabled: false,
							presetId: 'goo_type__SelectInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'SwitchInputOptions',
							title: 'motion',
							value: true,
							disabled: false,
							presetId: 'goo_motion__SwitchInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'viscosity',
							value: 0.5,
							disabled: false,
							presetId: 'goo_viscosity__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'density',
							value: 2,
							disabled: false,
							presetId: 'goo_density__NumberInputOptions',
							hidden: false,
							order: 4,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'gooeyness',
							value: 4.6,
							disabled: false,
							presetId: 'goo_gooeyness__NumberInputOptions',
							hidden: false,
							order: 5,
							resettable: true
						}
					]
				},
				{
					__type: 'FolderPreset',
					id: 'orbs',
					title: 'orbs',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 1.08,
							disabled: false,
							presetId: 'orbs_size__NumberInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.508,
							disabled: false,
							presetId: 'orbs_speed__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'distance',
							value: 1,
							disabled: false,
							presetId: 'orbs_distance__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						}
					]
				}
			],
			inputs: [
				{
					__type: 'NumberInputOptions',
					title: 'speed',
					value: 0.91,
					disabled: false,
					presetId: 'gooey_speed__NumberInputOptions',
					hidden: false,
					order: 1,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'slider',
					value: '0.12',
					disabled: false,
					presetId: 'gooey_slider__NumberInputOptions',
					hidden: false,
					order: 2,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'glow',
					value: 21.2,
					disabled: false,
					presetId: 'gooey_glow__NumberInputOptions',
					hidden: false,
					order: 3,
					resettable: true
				}
			]
		}
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'QlDhuBQTGZPtt6rQK82-M',
		title: 'glop',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'goo',
					title: 'goo',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'SelectInputOptions',
							title: 'type',
							value: {
								label: 'turbulence',
								value: 'turbulence'
							},
							disabled: false,
							presetId: 'goo_type__SelectInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'SwitchInputOptions',
							title: 'motion',
							value: true,
							disabled: false,
							presetId: 'goo_motion__SwitchInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'viscosity',
							value: 0.0042,
							disabled: false,
							presetId: 'goo_viscosity__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'density',
							value: 9,
							disabled: false,
							presetId: 'goo_density__NumberInputOptions',
							hidden: false,
							order: 4,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'gooeyness',
							value: 27.4,
							disabled: false,
							presetId: 'goo_gooeyness__NumberInputOptions',
							hidden: false,
							order: 5,
							resettable: true
						}
					]
				},
				{
					__type: 'FolderPreset',
					id: 'orbs',
					title: 'orbs',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 1,
							disabled: false,
							presetId: 'orbs_size__NumberInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 1,
							disabled: false,
							presetId: 'orbs_speed__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'distance',
							value: 1,
							disabled: false,
							presetId: 'orbs_distance__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						}
					]
				}
			],
			inputs: [
				{
					__type: 'NumberInputOptions',
					title: 'speed',
					value: 0.77,
					disabled: false,
					presetId: 'gooey_speed__NumberInputOptions',
					hidden: false,
					order: 1,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'slider',
					value: 0.34,
					disabled: false,
					presetId: 'gooey_slider__NumberInputOptions',
					hidden: false,
					order: 2,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'glow',
					value: 17.4,
					disabled: false,
					presetId: 'gooey_glow__NumberInputOptions',
					hidden: false,
					order: 3,
					resettable: true
				}
			]
		}
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'Fvx4SpI9rMjyUzaYpWmFp',
		title: 'unagi',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'goo',
					title: 'goo',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'SelectInputOptions',
							title: 'type',
							value: {
								label: 'fractalNoise',
								value: 'fractalNoise'
							},
							disabled: false,
							presetId: 'goo_type__SelectInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'SwitchInputOptions',
							title: 'motion',
							value: true,
							disabled: false,
							presetId: 'goo_motion__SwitchInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'viscosity',
							value: 0.0155,
							disabled: false,
							presetId: 'goo_viscosity__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'density',
							value: 1,
							disabled: false,
							presetId: 'goo_density__NumberInputOptions',
							hidden: false,
							order: 4,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'gooeyness',
							value: 100,
							disabled: false,
							presetId: 'goo_gooeyness__NumberInputOptions',
							hidden: false,
							order: 5,
							resettable: true
						}
					]
				},
				{
					__type: 'FolderPreset',
					id: 'orbs',
					title: 'orbs',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 0.86,
							disabled: false,
							presetId: 'orbs_size__NumberInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.508,
							disabled: false,
							presetId: 'orbs_speed__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'distance',
							value: 1,
							disabled: false,
							presetId: 'orbs_distance__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						}
					]
				}
			],
			inputs: [
				{
					__type: 'NumberInputOptions',
					title: 'speed',
					value: 0.7,
					disabled: false,
					presetId: 'gooey_speed__NumberInputOptions',
					hidden: false,
					order: 1,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'slider',
					value: 0.52,
					disabled: false,
					presetId: 'gooey_slider__NumberInputOptions',
					hidden: false,
					order: 2,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'glow',
					value: 21.2,
					disabled: false,
					presetId: 'gooey_glow__NumberInputOptions',
					hidden: false,
					order: 3,
					resettable: true
				}
			]
		}
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'J7gfa1wxlenPAlaxbi6bo',
		title: 'solar winds',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'goo',
					title: 'goo',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'SelectInputOptions',
							title: 'type',
							value: {
								label: 'fractalNoise',
								value: 'fractalNoise'
							},
							disabled: false,
							presetId: 'goo_type__SelectInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'SwitchInputOptions',
							title: 'motion',
							value: true,
							disabled: false,
							presetId: 'goo_motion__SwitchInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'viscosity',
							value: 0.0272,
							disabled: false,
							presetId: 'goo_viscosity__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'density',
							value: 8,
							disabled: false,
							presetId: 'goo_density__NumberInputOptions',
							hidden: false,
							order: 4,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'gooeyness',
							value: 32,
							disabled: false,
							presetId: 'goo_gooeyness__NumberInputOptions',
							hidden: false,
							order: 5,
							resettable: true
						}
					]
				},
				{
					__type: 'FolderPreset',
					id: 'orbs',
					title: 'orbs',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 0.86,
							disabled: false,
							presetId: 'orbs_size__NumberInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.508,
							disabled: false,
							presetId: 'orbs_speed__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'distance',
							value: 1,
							disabled: false,
							presetId: 'orbs_distance__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						}
					]
				}
			],
			inputs: [
				{
					__type: 'NumberInputOptions',
					title: 'speed',
					value: 0.3,
					disabled: false,
					presetId: 'gooey_speed__NumberInputOptions',
					hidden: false,
					order: 1,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'slider',
					value: 0.23,
					disabled: false,
					presetId: 'gooey_slider__NumberInputOptions',
					hidden: false,
					order: 2,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'glow',
					value: 21.2,
					disabled: false,
					presetId: 'gooey_glow__NumberInputOptions',
					hidden: false,
					order: 3,
					resettable: true
				}
			]
		}
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'lhsmhBe0x-waMQGKFnMJf',
		title: 'underwater',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'goo',
					title: 'goo',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'SelectInputOptions',
							title: 'type',
							value: {
								label: 'fractalNoise',
								value: 'fractalNoise'
							},
							disabled: false,
							presetId: 'goo_type__SelectInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'SwitchInputOptions',
							title: 'motion',
							value: true,
							disabled: false,
							presetId: 'goo_motion__SwitchInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'viscosity',
							value: 0.0272,
							disabled: false,
							presetId: 'goo_viscosity__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'density',
							value: 2,
							disabled: false,
							presetId: 'goo_density__NumberInputOptions',
							hidden: false,
							order: 4,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'gooeyness',
							value: 5.3,
							disabled: false,
							presetId: 'goo_gooeyness__NumberInputOptions',
							hidden: false,
							order: 5,
							resettable: true
						}
					]
				},
				{
					__type: 'FolderPreset',
					id: 'orbs',
					title: 'orbs',
					closed: true,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 0.86,
							disabled: false,
							presetId: 'orbs_size__NumberInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.508,
							disabled: false,
							presetId: 'orbs_speed__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'distance',
							value: 1,
							disabled: false,
							presetId: 'orbs_distance__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						}
					]
				}
			],
			inputs: [
				{
					__type: 'NumberInputOptions',
					title: 'speed',
					value: 1,
					disabled: false,
					presetId: 'gooey_speed__NumberInputOptions',
					hidden: false,
					order: 1,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'slider',
					value: 0.77,
					disabled: false,
					presetId: 'gooey_slider__NumberInputOptions',
					hidden: false,
					order: 2,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'glow',
					value: 21.2,
					disabled: false,
					presetId: 'gooey_glow__NumberInputOptions',
					hidden: false,
					order: 3,
					resettable: true
				}
			]
		}
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: '_wVMWhdw3zRL7oDkpNf74',
		title: 'mist',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'goo',
					title: 'goo',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'SelectInputOptions',
							title: 'type',
							value: {
								label: 'turbulence',
								value: 'turbulence'
							},
							disabled: false,
							presetId: 'goo_type__SelectInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'SwitchInputOptions',
							title: 'motion',
							value: true,
							disabled: false,
							presetId: 'goo_motion__SwitchInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'viscosity',
							value: 0.5,
							disabled: false,
							presetId: 'goo_viscosity__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'density',
							value: 20,
							disabled: false,
							presetId: 'goo_density__NumberInputOptions',
							hidden: false,
							order: 4,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'gooeyness',
							value: 38.3,
							disabled: false,
							presetId: 'goo_gooeyness__NumberInputOptions',
							hidden: false,
							order: 5,
							resettable: true
						}
					]
				},
				{
					__type: 'FolderPreset',
					id: 'orbs',
					title: 'orbs',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 0.86,
							disabled: false,
							presetId: 'orbs_size__NumberInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.608,
							disabled: false,
							presetId: 'orbs_speed__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'distance',
							value: 0.303,
							disabled: false,
							presetId: 'orbs_distance__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						}
					]
				}
			],
			inputs: [
				{
					__type: 'NumberInputOptions',
					title: 'speed',
					value: 0.18,
					disabled: false,
					presetId: 'gooey_speed__NumberInputOptions',
					hidden: false,
					order: 1,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'slider',
					value: 0.62,
					disabled: false,
					presetId: 'gooey_slider__NumberInputOptions',
					hidden: false,
					order: 2,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'glow',
					value: 21.2,
					disabled: false,
					presetId: 'gooey_glow__NumberInputOptions',
					hidden: false,
					order: 3,
					resettable: true
				}
			]
		}
	},
	{
		__type: 'GooeyPreset',
		__version: 0,
		id: 'HbtI0SosIN4lFeX0pcXgx',
		title: 'dried paint',
		data: {
			__type: 'FolderPreset',
			id: 'gooey',
			title: 'gooey',
			closed: false,
			hidden: false,
			children: [
				{
					__type: 'FolderPreset',
					id: 'goo',
					title: 'goo',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'SwitchInputOptions',
							title: 'motion',
							value: false,
							disabled: false,
							presetId: 'goo_motion__SwitchInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'viscosity',
							value: 0.0535,
							disabled: false,
							presetId: 'goo_viscosity__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'density',
							value: 20,
							disabled: false,
							presetId: 'goo_density__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'gooeyness',
							value: 38.3,
							disabled: false,
							presetId: 'goo_gooeyness__NumberInputOptions',
							hidden: false,
							order: 4,
							resettable: true
						},
						{
							__type: 'SelectInputOptions',
							title: 'type',
							value: {
								label: 'turbulence',
								value: 'turbulence'
							},
							disabled: false,
							presetId: 'goo_type__SelectInputOptions',
							hidden: false,
							order: 5,
							resettable: true
						}
					]
				},
				{
					__type: 'FolderPreset',
					id: 'orbs',
					title: 'orbs',
					closed: false,
					hidden: false,
					children: [],
					inputs: [
						{
							__type: 'NumberInputOptions',
							title: 'size',
							value: 0.86,
							disabled: false,
							presetId: 'orbs_size__NumberInputOptions',
							hidden: false,
							order: 1,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'speed',
							value: 0.608,
							disabled: false,
							presetId: 'orbs_speed__NumberInputOptions',
							hidden: false,
							order: 2,
							resettable: true
						},
						{
							__type: 'NumberInputOptions',
							title: 'distance',
							value: 0.303,
							disabled: false,
							presetId: 'orbs_distance__NumberInputOptions',
							hidden: false,
							order: 3,
							resettable: true
						}
					]
				}
			],
			inputs: [
				{
					__type: 'NumberInputOptions',
					title: 'speed',
					value: 0.18,
					disabled: false,
					presetId: 'gooey_speed__NumberInputOptions',
					hidden: false,
					order: 1,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'slider',
					value: 0.13,
					disabled: false,
					presetId: 'gooey_slider__NumberInputOptions',
					hidden: false,
					order: 2,
					resettable: true
				},
				{
					__type: 'NumberInputOptions',
					title: 'glow',
					value: 21.2,
					disabled: false,
					presetId: 'gooey_glow__NumberInputOptions',
					hidden: false,
					order: 3,
					resettable: true
				}
			]
		}
	}
]

export default presets
