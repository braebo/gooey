/*
 * // todo - There's still an off-by-one error in the undo manager.
 * repro:
 * - change 2 different inputs
 * - undo once
 * - change 1 input
 * Things will be out of sync.
 * Also, when undoing all the way, the pointer is -1, but the stack still has 1 commit.
 */
class UndoManager {
    pointer = -1;
    maxHistory = 50;
    stack = [];
    /**
     * Ignores's all commits while `true`.
     */
    lockedExternally = false;
    /**
     * Ignores's all commits while `true`.
     */
    _lockedInternally = false;
    constructor() { }
    commit(commit, _debounce = 100) {
        if (this._lockedInternally || this.lockedExternally) {
            this._lockedInternally = false;
            return;
        }
        const diff = this.pointer + 1 - this.stack.length;
        if (diff < 0) {
            this.stack = this.stack.slice(0, diff);
        }
        this.pointer++;
        this.stack.push(commit);
        if (this.stack.length > this.maxHistory) {
            this.stack.shift();
            this.pointer--;
        }
    }
    undo = () => {
        if (this.pointer === -1) {
            return;
        }
        this._lockedInternally = true;
        const commit = this.stack[this.pointer];
        if (commit.setter) {
            commit.setter(commit.from);
        }
        else {
            commit.target.set(commit.from);
        }
        this.pointer--;
    };
    redo = () => {
        if (this.pointer + 1 > this.stack.length - 1) {
            return;
        }
        this._lockedInternally = true;
        const commit = this.stack[this.pointer + 1];
        if (commit.setter) {
            commit.setter(commit.to);
        }
        else {
            commit.target.set(commit.to);
        }
        this.pointer++;
    };
    clear() {
        this.stack = [];
        this.pointer = -1;
    }
}

export { UndoManager };
//# sourceMappingURL=UndoManager.js.map
