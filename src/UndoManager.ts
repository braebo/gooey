import type { Input, ValidInputValue } from './inputs/Input'

/**
 * A recorded "action" callback that can be re-played forwards or backwards.
 */
export type Commit<V extends ValidInputValue = ValidInputValue> = {
	from: V
	to: V
	target: Input<V>
	setter?: (v: V) => void
}

export class UndoManager {
	pointer = -1
	maxHistory = 50
	stack: Commit[] = []

	/**
	 * Ignores all commits while `true`.
	 */
	lockedExternally = false

	/**
	 * `true` while an undo or redo replays a commit, so the replay isn't recorded as a change.
	 */
	private _replaying = false

	constructor() {}

	commit<V>(commit: Commit<V>, _debounce = 100) {
		if (this._replaying || this.lockedExternally) {
			return
		}

		const diff = this.pointer + 1 - this.stack.length

		if (diff < 0) {
			this.stack = this.stack.slice(0, diff)
		}

		this.pointer++
		this.stack.push(commit)

		if (this.stack.length > this.maxHistory) {
			this.stack.shift()
			this.pointer--
		}
	}

	undo = () => {
		if (this.pointer === -1) {
			return
		}

		const commit = this.stack[this.pointer]
		this._replay(commit, commit.from)
		this.pointer--
	}

	redo = () => {
		if (this.pointer + 1 > this.stack.length - 1) {
			return
		}

		const commit = this.stack[this.pointer + 1]
		this._replay(commit, commit.to)
		this.pointer++
	}

	/**
	 * Writes a commit's value back.  The lock spans the write alone, so a replay that commits
	 * nothing (a color's setter writes its state directly) can't leave it set for the next real
	 * change to be swallowed by.
	 */
	private _replay(commit: Commit, value: ValidInputValue) {
		this._replaying = true
		try {
			if (commit.setter) {
				commit.setter(value)
			} else {
				commit.target.set(value)
			}
		} finally {
			this._replaying = false
		}
	}

	clear() {
		this.stack = []
		this.pointer = -1
	}
}
