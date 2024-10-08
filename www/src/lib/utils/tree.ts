export interface Branch {
	name: string
	path: string
	index?: number | string
	fragment?: string
	children?: Branch[]
}

export class Tree {
	root: Branch = {
		name: 'home',
		path: '/',
		children: [],
	}

	constructor(paths: string[]) {
		if (!paths || !paths.length) return

		const routes = paths.toSorted()

		for (const route of routes) {
			if (route === '/') continue

			const [pathPart, fragment] = route.split('#')
			const parts = pathPart.split('/').filter(Boolean)
			let currentNode = this.root

			for (let i = 0; i < parts.length; i++) {
				const path = '/' + parts.slice(0, i + 1).join('/')
				let child = currentNode.children?.find(node => node.path === path)

				if (!child) {
					child = {
						name: parts[i],
						path: path,
						children: [],
					}
					currentNode.children ??= []
					currentNode.children.push(child)
				}

				currentNode = child
			}

			if (fragment) {
				let fragmentNode = currentNode.children?.find(node => node.fragment === fragment)
				if (!fragmentNode) {
					let [index, name] = fragment.split('_') as Partial<[string | number, string]>

					fragmentNode = {
						name: name ?? fragment,
						index: Number(index) || index,
						path: `${currentNode.path}#${name ?? fragment}`,
						fragment,
					}

					currentNode.children ??= []
					currentNode.children.push(fragmentNode)
				}
			}
		}
	}

	getNode(path: string): Branch | undefined {
		let curr = this.root

		const parts = path.split('/').filter(Boolean)
		for (const part of parts) {
			const child = curr.children?.find(node => node.name === part)
			if (!child) return undefined
			curr = child
		}
		return curr
	}
}
