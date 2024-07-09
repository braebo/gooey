import type { StructuredVars } from '../shared/css-custom-properties'
import type { VariableDefinition } from '../styles/themer/types'
import type { InputOptions } from '../inputs/Input'
import type { Folder } from '../Folder'

import { CSS_VAR_INNER, restructureVars } from '../shared/css-custom-properties'
import { isColor } from '../shared/color/color'
import { entries } from '../shared/object'
import { isType } from '../shared/isType'
import { Logger } from '../shared/logger'
import { Gooey } from '../Gooey'

export class ThemeEditor {
	gooey: Gooey
	private _log: Logger

	get folder() {
		return this.gooey.folder
	}

	constructor(public targetGooey: Gooey) {
		this._log = new Logger(`ThemeEditor ${targetGooey.folder.title}`, {
			fg: 'DarkCyan',
			deferred: false,
		})
		const opts = targetGooey.opts
		if (isType(opts.storage, 'GooeyStorageOptions')) {
			opts.storage.key += '::theme-editor'
		}
		// console.log(opts)
		// const storageOpts = isType(opts?.storage, 'GooeyStorageOptions') ? opts.storage : undefined
		// const key = storageOpts ? storageOpts.key + '::theme-editor' : ''

		this.gooey = new Gooey({
			title: 'Theme Editor',
			container: targetGooey.container,
			_themer: targetGooey.themer,
			_windowManager: targetGooey.windowManager, // Recycling!
		})

		// const dragOpts = isType(this.targetGooey.windowManager?.opts.draggable, 'object')
		// 	? this.targetGooey.windowManager.opts.draggable
		// 	: DRAGGABLE_DEFAULTS

		// const resizeOpts = isType(this.targetGooey.windowManager?.opts.resizable, 'object')
		// 	? this.targetGooey.windowManager.opts.resizable
		// 	: RESIZABLE_DEFAULTS

		// this.targetGooey.windowManager?.add(this.gooey.wrapper, {
		// 	id: this.gooey.id,
		// 	...this.targetGooey.windowManager.opts,
		// 	draggable: {
		// 		...dragOpts,
		// 		handle: this.gooey.elements.header,
		// 	},
		// 	resizable: {
		// 		...resizeOpts,
		// 	},
		// })

		// console.log(targetGooey.container)
		// console.log(this.gooey.container)

		if (!this.targetGooey.themer) {
			throw new Error('Themer not found.')
		}

		this.targetGooey.themer.addTarget(this.gooey.wrapper)

		this.folder.evm.add(
			this.targetGooey.themer.theme.subscribe(t => {
				this.gooey.folder.title = `${opts?.title} · ${t.title}`
			}),
		)

		this.targetGooey.themer!.applyTheme()

		setTimeout(() => {
			this.generate()

			// console.log(this.targetGooey.folder.id, this.gooey.folder.id)
			// console.log(this.targetGooey.windowManager?.windows.map(w => w.id))
			// console.log(
			// 	this.targetGooey.windowManager?.windows.find(w => w.id === this.targetGooey.folder.id),
			// )
			// console.log(this.gooey.windowManager?.windows.find(w => w.id === this.gooey.folder.id))
		}, 0)
	}

	dispose() {
		this.gooey.dispose()
	}

	get vars() {
		return this.targetGooey.themer!.theme.value.vars
	}

	generate = () => {
		const MAX_DEPTH = 0
		let currentFolder: Folder = this.gooey.folder

		const add = (
			folder: Folder,
			title: string,
			value: string,
			onChange: InputOptions['onChange'],
		) => {
			this._log.fn('add').debug({ title, value, onChange, this: this })

			if (value.match(/^\d+(\.\d+)?$/g)) {
				try {
					const v = parseFloat(value)
					if (!isNaN(v)) {
						const av = Math.abs(v)
						folder
							.addNumber({
								title,
								value: v,
								min: Math.min(0, av),
								max: Math.max(0, av < 1 ? 1 : av * 3),
								step: av < 1 ? 0.01 : av < 10 ? 0.1 : 1,
							})
							.on('change', v => onChange!(v))
						return
					}
				} catch (e) {}
			}

			folder.add({ title, value, onChange })
		}

		const traverse = (
			obj: VariableDefinition[keyof VariableDefinition] | StructuredVars,
			parent: Folder,
			_depth = 0,
		) => {
			_depth++
			for (const [k, v] of entries(obj)) {
				const onChange = (v: any) => {
					if (isColor(v)) {
						v = v.hex8String
					}
					this._log.fn('onChange').debug({
						k,
						v,
						value: `--${this.targetGooey.themer!.theme.value.prefix}-${k}`,
						this: this,
					})
					this.targetGooey.wrapper.style.setProperty(
						`--${this.targetGooey.themer!.theme.value.prefix}-${k}`,
						v,
					)
				}

				if (typeof v === 'string') {
					const vars = [...v.matchAll(CSS_VAR_INNER)].map(m => m[1])

					if (vars.length) {
						add(
							parent,
							k.split('_').at(-1) || k,
							v.replace(CSS_VAR_INNER, (str, match) => {
								return (
									this.targetGooey.wrapper.style.getPropertyValue(match).trim() ||
									str
								)
							}),
							onChange,
						)
					} else {
						add(parent, k.split('_').at(-1) || k, v, onChange)
					}
				} else {
					if (currentFolder.title !== k) {
						currentFolder = parent.addFolder(k, {
							closed: _depth > MAX_DEPTH,
						})
					}

					traverse(v, currentFolder, _depth)
				}
			}

			return _depth
		}

		let depth = 1

		const allVars = this.vars

		for (const [title, def] of entries(allVars)) {
			currentFolder = this.gooey.folder.addFolder(title, { closed: depth > MAX_DEPTH })

			if (title === 'core' && 'core' in allVars) {
				for (const [mode, vars] of entries(allVars['core'])) {
					currentFolder.addFolder(mode, { closed: depth > MAX_DEPTH })
					traverse(restructureVars(vars), currentFolder, depth)
				}
			} else {
				for (const [mode, vars] of entries(def)) {
					traverse(vars, currentFolder.addFolder(mode, { closed: depth > MAX_DEPTH }))
				}
			}
		}

		for (const folder of this.gooey.folder.allChildren) {
			// Delete all the empty folders.
			if (!folder.inputs.size && !folder.children.length) {
				folder.dispose()
				continue
			}
		}
	}
}
