import { resolveTheme } from '../themer/resolveTheme.js';

var theme_default = resolveTheme({
    title: 'default',
    prefix: 'gooey',
    vars: {
        color: {
            base: {
                'theme-a': '#00bcd4',
                // 'theme-b': '#f8d2c9',
                // 'theme-c': '#ba788a',
                'dark-a': '#0B0B11',
                'dark-b': '#1b1d29',
                'dark-c': '#46465e',
                'dark-d': '#55566a',
                'dark-e': '#787b89',
                'light-a': '#ffffff',
                'light-b': '#c9ccd7',
                'light-c': '#a9adba',
                'light-d': '#777D8F',
                'light-e': '#5F6377',
            },
            dark: {},
            light: {},
        },
        core: {
            light: {
                // 'controller-dim_background': 'rgba(var(--gooey-bg-a-rgb), 0.75)',
                'controller-dim_background': 'color-mix(in sRGB, var(--gooey-bg-a) 75%, transparent)',
            },
        },
    },
});

export { theme_default as default };
//# sourceMappingURL=default.js.map
