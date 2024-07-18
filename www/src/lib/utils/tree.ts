export interface Branch {
	name: string
	path: string
	children?: Branch[]
}

export class Tree {
	root: Branch = {
		name: 'home',
		path: '/',
		children: [],
	}

	constructor(paths: string[]) {
		const routes = paths.toSorted()
		for (const route of routes) {
			if (route === '/') continue

			const parts = route.split('/').filter(Boolean)
			let currentNode = this.root

			for (let i = 0; i < parts.length; i++) {
				const path = '/' + parts.slice(0, i + 1).join('/')
				let child = currentNode.children?.find((node) => node.path === path)

				if (!child) {
					child = {
						name: parts[i],
						path: path,
						children: [],
					}
					currentNode.children = currentNode.children || []
					currentNode.children.push(child)
				}

				currentNode = child
			}
		}
	}

	getNode(path: string): Branch | undefined {
		let curr = this.root

		const parts = path.split('/').filter(Boolean)
		for (const part of parts) {
			const child = curr.children?.find((node) => node.name === part)
			if (!child) return undefined
			curr = child
		}
		return curr
	}
}
