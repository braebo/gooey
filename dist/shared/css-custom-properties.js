import { entries } from "./object.js";

//#region src/shared/css-custom-properties.ts
/**
* Converts a {@link StructuredVars} object into a flat object keyed by each variable's name
* without its `--<prefix>-` (which the {@link Themer} adds when it applies them).
* @example
* ```ts
* const vars = { root: { header: { width: '1rem' } }, opacity: '0.5' }
*
* destructureVars(vars, 'gooey') // { 'root-header_width': '1rem', opacity: '0.5' }
* ```
*/
function destructureVars(vars, _prefix) {
	const flatVars = {};
	function destructure(o, prefix = "") {
		for (const [k, v] of entries(o)) if (typeof v === "object") destructure(v, `${prefix ? prefix + "-" : ""}${k}`);
		else flatVars[`${prefix ? prefix + "_" : ""}${k}`] = v;
	}
	destructure(vars);
	return flatVars;
}
/**
* Regex to extract the inner variable name from a CSS variable.
* @example
* | `rgba(var(--my-color), 0.5)`.match(CSS_VAR_INNER)[0]
* > '--my-color'
*/
const CSS_VAR_INNER = /\bvar\((--[a-zA-Z0-9_-]+)\)/g;

//#endregion
export { CSS_VAR_INNER, destructureVars };
//# sourceMappingURL=css-custom-properties.js.map