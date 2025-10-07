import { DEV } from 'esm-env'

type MetaNode<T extends Element = HTMLElement> = T & {
	__svelte_meta: {
		loc: { line: number; column: number; file: string }
	}
}

/**
 * Adds the metadata required for svelte-inspector to link to the source file of an element.
 *
 * @example
 *   useInspector(myElement, import.meta.url, 10, 2)
 */
export function useInspector(
	/**
	 * The HTML element to decorate with inspector metadata.
	 */
	node: HTMLElement,
	/**
	 * The relative path from `src/` of the file where this element is defined. If this function
	 * is called in said file, passing `import.meta.url` is ideal.
	 */
	fileUrl: string,
	/**
	 * @default 0
	 */
	line?: number,
	/**
	 * @default 0
	 */
	column?: number,
) {
	if (DEV) {
		;(node as MetaNode).__svelte_meta = {
			loc: {
				file: new URL(fileUrl).pathname.slice(1),
				line: line ?? 0,
				column: column ?? 0,
			},
		}
	}
}
