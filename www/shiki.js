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
import { modifyChildren } from 'unist-util-modify-children'
import { highlight } from './highlight.js'
import { toText } from 'hast-util-to-text'
import { select } from 'hast-util-select'
import { raw } from 'hast-util-raw'

const l = (title = '', ...args) => console.log(`\x1b[1m\x1b[33mShiki.js\x1b[0m\n↳ \x1b[32m${title}\x1b[0m\n`, ...args)

/**
 * Rehype plugin to highlight code blocks using Shiki.
 * @param {Config} config The configuration for the plugin
 */
export default function rehype_shiki({ highlighter }) {
	return tree => {
		modifyChildren((node, index, parent) => {
			// console.log(node, index, parent, highlighter)
			l('node', node)
			l('index', index)
			l('parent', parent)
			l('highlighter', highlighter)

			if (node.type === 'element') {
				if (node.tagName === 'pre') {
					const highlightedNode = highlightCode(node, highlighter)
					if (highlightedNode) {
						parent.children[index] = highlightedNode
					}
				}
			}
			if (node.type === 'raw') {
				const preNode = select('pre', raw(node))
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

/**
 * @param {Element} node The node which has code to highlight
 * @param {import('./highlight.js').Highlighter} highlighter The highlighter instance
 * @returns {Element|undefined} The node with the highlighted code, or undefined if no code element is found
 */
function highlightCode(node, highlighter) {
	var _a, _b, _c, _d
	const codeElement = select('code', node)
	if (!codeElement) return undefined
	// highlighter.loadThemeSync(serendipity)
	let lang
	lang = Array.isArray(
		(_a = codeElement === null || codeElement === void 0 ? void 0 : codeElement.properties) === null ||
			_a === void 0
			? void 0
			: _a.className,
	)
		? ((_d =
				(_c =
					(_b = codeElement === null || codeElement === void 0 ? void 0 : codeElement.properties) === null ||
					_b === void 0
						? void 0
						: _b.className) === null || _c === void 0
					? void 0
					: _c.find(c => (c === null || c === void 0 ? void 0 : c.startsWith('language-')))) === null ||
			_d === void 0
				? void 0
				: _d.split('language-')[1]) || 'plaintext'
		: 'plaintext'
	const code = toText(codeElement, { whitespace: 'pre' })
	// const highlighted = highlighter.codeToHtml(code, { lang: `${lang}` as any, theme: 'serendipity' })
	const highlighted = highlight(code, { lang: `${lang}`, theme: 'serendipity' })
	return raw({ type: 'raw', value: highlighted })
}
