import { __export } from "../../_virtual/rolldown_runtime.js";

//#region src/shared/color/regex.ts
var regex_exports = /* @__PURE__ */ __export({
	CSS_INTEGER: () => CSS_INTEGER,
	CSS_NUMBER: () => CSS_NUMBER,
	CSS_UNIT: () => CSS_UNIT,
	HEX_INT_DOUBLE: () => HEX_INT_DOUBLE,
	HEX_INT_SINGLE: () => HEX_INT_SINGLE,
	HEX_START: () => HEX_START,
	PERMISSIVE_MATCH_3: () => PERMISSIVE_MATCH_3,
	PERMISSIVE_MATCH_4: () => PERMISSIVE_MATCH_4,
	REGEX_FUNCTIONAL_HSL: () => REGEX_FUNCTIONAL_HSL,
	REGEX_FUNCTIONAL_HSLA: () => REGEX_FUNCTIONAL_HSLA,
	REGEX_FUNCTIONAL_RGB: () => REGEX_FUNCTIONAL_RGB,
	REGEX_FUNCTIONAL_RGBA: () => REGEX_FUNCTIONAL_RGBA,
	REGEX_HEX_3: () => REGEX_HEX_3,
	REGEX_HEX_4: () => REGEX_HEX_4,
	REGEX_HEX_6: () => REGEX_HEX_6,
	REGEX_HEX_8: () => REGEX_HEX_8
});
const CSS_INTEGER = "[-\\+]?\\d+%?";
const CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
const CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:[-\\+]?\\d+%?)";
const PERMISSIVE_MATCH_3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))\\s*\\)?";
const PERMISSIVE_MATCH_4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))\\s*\\)?";
const REGEX_FUNCTIONAL_RGB = /* @__PURE__ */ new RegExp("rgb" + PERMISSIVE_MATCH_3);
const REGEX_FUNCTIONAL_RGBA = /* @__PURE__ */ new RegExp("rgba" + PERMISSIVE_MATCH_4);
const REGEX_FUNCTIONAL_HSL = /* @__PURE__ */ new RegExp("hsl" + PERMISSIVE_MATCH_3);
const REGEX_FUNCTIONAL_HSLA = /* @__PURE__ */ new RegExp("hsla" + PERMISSIVE_MATCH_4);
const HEX_START = "^(?:#?|0x?)";
const HEX_INT_SINGLE = "([0-9a-fA-F]{1})";
const HEX_INT_DOUBLE = "([0-9a-fA-F]{2})";
const REGEX_HEX_3 = /* @__PURE__ */ new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + "$");
const REGEX_HEX_4 = /* @__PURE__ */ new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + "$");
const REGEX_HEX_6 = /* @__PURE__ */ new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + "$");
const REGEX_HEX_8 = /* @__PURE__ */ new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + "$");

//#endregion
export { REGEX_FUNCTIONAL_HSL, REGEX_FUNCTIONAL_HSLA, REGEX_FUNCTIONAL_RGB, REGEX_FUNCTIONAL_RGBA, REGEX_HEX_3, REGEX_HEX_4, REGEX_HEX_6, REGEX_HEX_8, regex_exports };
//# sourceMappingURL=regex.js.map