import { resolveTheme } from "../themer/resolveTheme.js";

//#region src/styles/themes/vanilla.ts
var vanilla_default = resolveTheme({
	title: "vanilla",
	prefix: "gooey",
	vars: {
		color: {
			base: {
				"theme-a": "#49a7ff",
				"dark-a": "#0B0B11",
				"dark-b": "#1b1d29",
				"dark-c": "#46465e",
				"dark-d": "#55566a",
				"dark-e": "#787b89",
				"light-a": "#ffffff",
				"light-b": "#c9ccd7",
				"light-c": "#a9adba",
				"light-d": "#777D8F",
				"light-e": "#5F6377"
			},
			dark: {},
			light: {}
		},
		core: { light: { "controller-dim_background": "color-mix(in sRGB, var(--gooey-bg-a) 75%, transparent)" } }
	}
});

//#endregion
export { vanilla_default as default };
//# sourceMappingURL=vanilla.js.map