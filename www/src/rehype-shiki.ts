/**
 * Copyright 2022 Pranav Karawale
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Element, Parent } from 'hast'
import type { Highlighter } from 'shiki'

import { serendipity } from '$lib/utils/highlight.serendipity'

import { modifyChildren } from 'unist-util-modify-children'
import { toText } from 'hast-util-to-text'
import { select } from 'hast-util-select'
import { raw } from 'hast-util-raw'

interface Config {
	highlighter: Highlighter
}

/**
 * @param {Element} node The node which has code to highlight
 * @param {Highlighter} highlighter The Shiki highlighter instance
 * @returns {Element} The node with the highlighted code
 */
function highlightCode(node: Element, highlighter: Highlighter): Element | undefined {
	const codeElement = select('code', node)
	if (!codeElement) return undefined

	highlighter.loadThemeSync(serendipity)

	let lang: string | null | undefined
	lang = Array.isArray(codeElement?.properties?.className)
		? (codeElement?.properties?.className as string[])
				?.find(c => c?.startsWith('language-'))
				?.split('language-')[1] || 'plaintext'
		: 'plaintext'

	const code = toText(codeElement, { whitespace: 'pre' })
	const highlighted = highlighter.codeToHtml(code, { lang: `${lang}` as any, theme: 'serendipity' })

	return raw({ type: 'raw', value: highlighted }) as Element
}

/**
 * Rehype plugin to highlight code blocks using Shiki.
 * @param {Config} config The configuration for the plugin
 */
export default function rehype_shiki({ highlighter }: Config) {
	return (tree: Parent) => {
		modifyChildren((node, index, parent) => {
			if (node.type === 'element') {
				if ((node as Element).tagName === 'pre') {
					const highlightedNode = highlightCode(node as Element, highlighter)
					if (highlightedNode) {
						parent.children[index] = highlightedNode
					}
				}
			}

			if (node.type === 'raw') {
				const preNode = select('pre', raw(node as { type: 'raw'; value: string }))
				if (preNode) {
					const highlightedNode = highlightCode(preNode, highlighter)
					if (highlightedNode) {
						parent.children[index] = highlightedNode
					}
				}
			}
			return index + 1
		})(tree)
	}
}
