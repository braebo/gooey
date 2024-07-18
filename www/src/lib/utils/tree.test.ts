import { describe, it, expect } from 'vitest'
import { Tree } from './tree'

describe('Tree', () => {
	it('should create a tree with correct structure', () => {
		const paths = [
			'/',
			'/home',
			'/home/user',
			'/home/user/documents',
			'/home/user/downloads',
			'/etc',
			'/etc/config',
		]

		const tree = new Tree(paths)

		expect(tree.root.name).toBe('home')
		expect(tree.root.path).toBe('/')
		expect(tree.root.children).toHaveLength(2)

		const homeNode = tree.getNode('/home')
		expect(homeNode?.name).toBe('home')
		expect(homeNode?.children).toHaveLength(1)

		const userNode = tree.getNode('/home/user')
		expect(userNode?.name).toBe('user')
		expect(userNode?.children).toHaveLength(2)

		const documentsNode = tree.getNode('/home/user/documents')
		expect(documentsNode?.name).toBe('documents')
		expect(documentsNode?.children).toHaveLength(0)

		const etcNode = tree.getNode('/etc')
		expect(etcNode?.name).toBe('etc')
		expect(etcNode?.children).toHaveLength(1)
	})

	it('should handle non-existent paths', () => {
		const paths = ['/home', '/home/user']
		const tree = new Tree(paths)

		const nonExistentNode = tree.getNode('/home/admin')
		expect(nonExistentNode).toBeUndefined()
	})

	it('should handle empty path list', () => {
		const tree = new Tree([])
		expect(tree.root.children).toHaveLength(0)
	})

	it('should handle duplicate paths', () => {
		const paths = ['/home', '/home', '/home/user', '/home/user']
		const tree = new Tree(paths)

		const homeNode = tree.getNode('/home')
		expect(homeNode?.children).toHaveLength(1)

		const userNode = tree.getNode('/home/user')
		expect(userNode?.children).toHaveLength(0)
	})

	it('should correctly handle paths with multiple levels', () => {
		const paths = ['/a/b/c/d', '/a/b/e', '/a/f']
		const tree = new Tree(paths)

		const aNode = tree.getNode('/a')
		expect(aNode?.children).toHaveLength(2)

		const bNode = tree.getNode('/a/b')
		expect(bNode?.children).toHaveLength(2)

		const cNode = tree.getNode('/a/b/c')
		expect(cNode?.children).toHaveLength(1)

		const dNode = tree.getNode('/a/b/c/d')
		expect(dNode?.children).toHaveLength(0)
	})
})
