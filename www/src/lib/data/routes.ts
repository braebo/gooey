interface Branch {
	name: string
	path: string
	children?: Branch[]
}

export const routes = {
	name: 'home',
	path: '/',
	children: [
		{
			name: 'docs',
			path: '/docs',
			children: [
				{
					name: 'install',
					path: '/docs#install',
				},
				{
					name: 'api',
					path: '/docs/_api',
				},
			],
		},
		{
			name: 'demos',
			path: '/demos',
			children: [
				{
					name: 'binaural',
					path: '/demos/binaural',
				},
				{
					name: 'goo',
					path: '/demos/goo',
				},
				{
					name: 'orbs',
					path: '/demos/orbs',
				},
				{
					name: 'test',
					path: '/demos/_test',
					children: [
						{
							name: 'add many',
							path: '/demos/_test/addMany',
						},
						{
							name: 'input button grid',
							path: '/demos/_test/inputbuttongrid',
						},
						{
							name: 'preset manager',
							path: '/demos/_test/presetmanager',
						},
					],
				},
			],
		},
	],
}
