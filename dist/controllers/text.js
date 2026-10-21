import { create } from "../shared/create.js";

//#region src/controllers/text.ts
const textController = (input, _opts, parent) => {
	return create("input", {
		type: "textarea",
		classes: ["gooey-controller", "gooey-controller-text"],
		value: input.state.value,
		parent,
		attributes: { spellcheck: "false" }
	});
};

//#endregion
export { textController };
//# sourceMappingURL=text.js.map