/**
 * The text a folder or input shows for its `title`.  A key-shaped title (letters, digits, `-` and
 * `_` only, as `bindMany` makes from an object's keys) reads with spaces: `font_size` shows as
 * `font size`.  Any other title is shown as written, so a `-` or `_` that is part of the text, as in
 * `x-offset (px)` or `¯\_(ツ)_/¯`, stays.
 */
export function titleText(title: string): string {
	return /^[\p{L}\p{N}_-]+$/u.test(title) ? title.replaceAll(/-|_/g, ' ') : title
}
