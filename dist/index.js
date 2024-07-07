var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/shared/deepMergeOpts.ts
function deepMergeOpts(objects, options) {
  const [target, ...sources] = objects;
  const { concatArrays = true } = options ?? {};
  return sources.reduce((acc, curr) => {
    if (!curr) return acc;
    const keys2 = Object.keys(curr);
    for (let i = 0; i < keys2.length; i++) {
      const k = keys2[i];
      const v = acc[k];
      const newV = curr[k];
      if (Array.isArray(v) && Array.isArray(newV)) {
        if (concatArrays) {
          acc[k] = [
            .../* @__PURE__ */ new Set([
              ...v,
              ...newV
            ])
          ];
        } else {
          acc[k] = newV;
        }
      } else if (v && typeof v === "object") {
        if (newV !== true) {
          if (newV && typeof newV === "object") {
            if (typeof globalThis.window !== "undefined" && newV instanceof Element) {
              acc[k] = newV;
            } else {
              acc[k] = deepMergeOpts([
                {
                  ...v
                },
                newV
              ], options);
            }
          } else if (newV || newV === false) {
            acc[k] = newV;
          }
        }
      } else if (newV !== void 0) {
        acc[k] = newV;
      }
    }
    return acc;
  }, {
    ...target
  });
}
__name(deepMergeOpts, "deepMergeOpts");

// src/styles/themer/resolveTheme.ts
function resolveTheme(def, vars = {}) {
  const color2 = def.resolved ? {} : {
    base: def.vars.color.base,
    dark: {
      "bg-a": def.vars.color.dark?.["bg-a"] || def.vars.color.base["dark-a"],
      "bg-b": def.vars.color.dark?.["bg-b"] || def.vars.color.base["dark-b"],
      "bg-c": def.vars.color.dark?.["bg-c"] || def.vars.color.base["dark-c"],
      "bg-d": def.vars.color.dark?.["bg-d"] || def.vars.color.base["dark-d"],
      "bg-e": def.vars.color.dark?.["bg-e"] || def.vars.color.base["dark-e"],
      "fg-a": def.vars.color.dark?.["fg-a"] || def.vars.color.base["light-a"],
      "fg-b": def.vars.color.dark?.["fg-b"] || def.vars.color.base["light-b"],
      "fg-c": def.vars.color.dark?.["fg-c"] || def.vars.color.base["light-c"],
      "fg-d": def.vars.color.dark?.["fg-d"] || def.vars.color.base["light-d"],
      "fg-e": def.vars.color.dark?.["fg-e"] || def.vars.color.base["light-e"],
      ...def.vars.color.dark
    },
    light: {
      "bg-a": def.vars.color.light?.["bg-a"] || def.vars.color.base["light-a"],
      "bg-b": def.vars.color.light?.["bg-b"] || def.vars.color.base["light-b"],
      "bg-c": def.vars.color.light?.["bg-c"] || def.vars.color.base["light-c"],
      "bg-d": def.vars.color.light?.["bg-d"] || def.vars.color.base["light-d"],
      "bg-e": def.vars.color.light?.["bg-e"] || def.vars.color.base["light-e"],
      "fg-a": def.vars.color.light?.["fg-a"] || def.vars.color.base["dark-a"],
      "fg-b": def.vars.color.light?.["fg-b"] || def.vars.color.base["dark-b"],
      "fg-c": def.vars.color.light?.["fg-c"] || def.vars.color.base["dark-c"],
      "fg-d": def.vars.color.light?.["fg-d"] || def.vars.color.base["dark-d"],
      "fg-e": def.vars.color.light?.["fg-e"] || def.vars.color.base["dark-e"],
      ...def.vars.color.light
    }
  };
  const theme = {
    title: def.title,
    prefix: def.prefix || "fractils",
    vars: deepMergeOpts([
      {
        color: color2
      },
      vars,
      def.vars
    ]),
    resolved: true
  };
  return theme;
}
__name(resolveTheme, "resolveTheme");

// src/styles/themes/default.ts
var default_default = resolveTheme({
  title: "default",
  prefix: "fracgui",
  vars: {
    color: {
      base: {
        "theme-a": "#00bcd4",
        // 'theme-b': '#f8d2c9',
        // 'theme-c': '#ba788a',
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
    core: {
      light: {
        // 'controller-dim_background': 'rgba(var(--fracgui-bg-a-rgb), 0.75)',
        "controller-dim_background": "color-mix(in sRGB, var(--fracgui-bg-a) 75%, transparent)"
      }
    }
  }
});

// src/styles/themes/scout.ts
var scout_default = resolveTheme({
  title: "scout",
  prefix: "fracgui",
  vars: {
    color: {
      base: {
        "theme-a": "#ff4221",
        "theme-b": "#ff9215",
        "theme-c": "#ff8bd3",
        "dark-a": "#15161d",
        "dark-b": "#282a36",
        "dark-c": "#272d30",
        "dark-d": "#3a3a44",
        "dark-e": "#4d4d58",
        "light-a": "#dfe1e9",
        "light-b": "#c3c4c7",
        "light-c": "#777d8f",
        "light-d": "#5f6377",
        "light-e": "#363945"
      },
      dark: {},
      light: {}
    },
    utility: {
      dark: {
        filter: "contrast(1.05) brightness(1.05)"
      }
    },
    core: {
      dark: {
        // 'input-container_background': 'color-mix(in sRGB, var(--fracgui-bg-a) 50%, transparent)',
        "folder-header_background": "color-mix(in sRGB, var(--fracgui-bg-a) 100%, transparent)"
      },
      light: {
        "controller-dim_background": "#96a09c"
      }
    }
  }
});

// src/styles/themes/flat.ts
var flat_default = resolveTheme({
  title: "flat",
  prefix: "fracgui",
  vars: {
    color: {
      base: {
        "theme-a": "#00bcd4",
        "theme-b": "#f8d2c9",
        "theme-c": "#ba788a",
        "dark-a": "#0B0B11",
        "dark-b": "#15161D",
        "dark-c": "#1F202D",
        "dark-d": "#353746",
        "dark-e": "#474A5B",
        "light-a": "#ffffff",
        "light-b": "#dfe1e9",
        "light-c": "#BABECA",
        "light-d": "#777D8F",
        "light-e": "#5F6377"
      },
      dark: {},
      light: {}
    },
    core: {
      dark: {
        "input-number-range_outline": `1px solid color-mix(in sRGB, var(--fracgui-bg-c) 33%, transparent)`
      }
    }
  }
});

// src/shared/collisions.ts
var collisionClampX = /* @__PURE__ */ __name((deltaX, nodeRect, obstacles) => {
  const { top, bottom, left, right } = nodeRect;
  if (deltaX > 0) {
    for (let i = 0; i < obstacles.length; i++) {
      const o2 = obstacles[i].getBoundingClientRect();
      if (top > o2.bottom || bottom < o2.top || right > o2.left) continue;
      deltaX = Math.min(deltaX, o2.left - right);
    }
  } else {
    for (let i = 0; i < obstacles.length; i++) {
      const o2 = obstacles[i].getBoundingClientRect();
      if (top > o2.bottom || bottom < o2.top || left < o2.right) continue;
      deltaX = Math.max(deltaX, o2.right - left);
    }
  }
  return deltaX;
}, "collisionClampX");
var collisionClampY = /* @__PURE__ */ __name((deltaY, nodeRect, obstacles) => {
  const { top, bottom, left, right } = nodeRect;
  if (deltaY > 0) {
    for (let i = 0; i < obstacles.length; i++) {
      const o2 = obstacles[i].getBoundingClientRect();
      if (left > o2.right || right < o2.left || bottom > o2.top) continue;
      deltaY = Math.min(deltaY, o2.top - bottom);
    }
  } else {
    for (let i = 0; i < obstacles.length; i++) {
      const o2 = obstacles[i].getBoundingClientRect();
      if (left > o2.right || right < o2.left || top < o2.bottom) continue;
      deltaY = Math.max(deltaY, o2.bottom - top);
    }
  }
  return deltaY;
}, "collisionClampY");

// src/shared/nanoid.ts
function nanoid(length = 21) {
  return crypto.getRandomValues(new Uint8Array(length)).reduce((t, e) => t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? "-" : "_", "");
}
__name(nanoid, "nanoid");

// src/shared/css-colors.ts
var randomCSSColorName = /* @__PURE__ */ __name(() => CSS_COLOR_NAMES[Math.floor(Math.random() * CSS_COLOR_NAMES.length)], "randomCSSColorName");
var CSS_COLORS = Object.freeze({
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
});
var CSS_COLOR_NAMES = Object.keys(CSS_COLORS);

// src/shared/l.ts
var CONSOLE_COLOR_CODES = {
  reset: "\x1B[0m",
  // Foreground colors
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  gray: "\x1B[90m",
  // Background colors
  bgBlack: "\x1B[40m",
  bgRed: "\x1B[41m",
  bgGreen: "\x1B[42m",
  bgYellow: "\x1B[43m",
  bgBlue: "\x1B[44m",
  bgMagenta: "\x1B[45m",
  bgCyan: "\x1B[46m",
  bgWhite: "\x1B[47m",
  // Styles
  bold: "\x1B[1m",
  dim: "\x1B[2m",
  italic: "\x1B[3m",
  underline: "\x1B[4m"
};
var hexToRgb = /* @__PURE__ */ __name((hex2) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex2);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}, "hexToRgb");
var hex = /* @__PURE__ */ __name((hexColor) => (str) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return str;
  return `\x1B[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${str}\x1B[0m`;
}, "hex");
var color = /* @__PURE__ */ __name((colorName) => (str) => `${CONSOLE_COLOR_CODES[colorName]}${str}${CONSOLE_COLOR_CODES.reset}`, "color");
var r = color("red");
var g = color("green");
var y = color("yellow");
var b = color("blue");
var m = color("magenta");
var c = color("cyan");
var gr = color("gray");
var dim = color("dim");
var o = hex("#ff7f50");

// src/shared/stringify.ts
var stringify = /* @__PURE__ */ __name((input, indentation = 0) => {
  const stack = [];
  return JSON.stringify(input, serialize(stack), indentation);
}, "stringify");
function serialize(stack) {
  const keys2 = [];
  return function(key, value) {
    if (typeof value === "undefined") return;
    if (typeof value === "function") return "[Function]";
    let thisPos = stack.indexOf(this);
    if (thisPos !== -1) {
      stack.length = thisPos + 1;
      keys2.length = thisPos;
      keys2[thisPos] = key;
    } else {
      stack.push(this);
      keys2.push(key);
    }
    let valuePos = stack.indexOf(value);
    if (valuePos !== -1) {
      return "[Circular ~" + keys2.slice(0, valuePos).join(".") + "]";
    }
    if (value instanceof Set) {
      return Array.from(value);
    }
    if (value instanceof Map) {
      return Object.fromEntries(Array.from(value.entries()).map(([k, v]) => {
        const newStack = [
          ...stack
        ];
        return [
          k,
          JSON.parse(JSON.stringify(v, serialize(newStack)))
        ];
      }));
    }
    if (value instanceof Element) {
      return `${value.tagName}.${Array.from(value.classList).filter((s) => !s.startsWith("s-")).join(".")}#${value.id}`;
    }
    if (stack.length > 0) {
      stack.push(value);
    }
    return value;
  };
}
__name(serialize, "serialize");

// ../../node_modules/.pnpm/esm-env@1.0.0/node_modules/esm-env/prod-ssr.js
var BROWSER = false;
var DEV = false;

// src/shared/defer.ts
var defer = typeof globalThis.requestIdleCallback !== "undefined" ? globalThis.requestIdleCallback : typeof globalThis.requestAnimationFrame !== "undefined" ? globalThis.requestAnimationFrame : (fn) => setTimeout(fn, 0);
var cancelDefer = typeof globalThis?.cancelIdleCallback !== "undefined" ? globalThis.cancelIdleCallback : typeof globalThis.cancelAnimationFrame !== "undefined" ? globalThis.cancelAnimationFrame : globalThis.clearTimeout;

// src/shared/tldr.ts
function tldr(object, { maxDepth = 2, maxLength = 30, maxSiblings = 4, preserveRootSiblings = false, preserveFunctions = false, preserveNumbers = false } = {}) {
  return parse(object);
  function parse(obj, depth = 0) {
    const seen = /* @__PURE__ */ new WeakSet();
    if (obj === null) {
      return obj;
    }
    if (typeof obj === "object") {
      if (seen.has(obj)) return "[Circular]";
      seen.add(obj);
    }
    switch (typeof obj) {
      case "boolean":
      case "symbol":
      case "undefined": {
        return obj;
      }
      case "function": {
        return preserveFunctions ? obj : `[Function: ${obj.name}]`;
      }
      case "string": {
        if (obj.length < maxLength + 3) return obj;
        return obj.slice(0, maxLength) + "..";
      }
      case "number": {
        const s = !preserveNumbers ? obj.toFixed(maxLength) : obj.toString();
        if (s.length > maxLength + 3) {
          return +s.slice(0, maxLength) + "..";
        }
        return +s;
      }
      case "bigint": {
        return +obj.toString().slice(0, maxLength);
      }
      case "object": {
        const depthReached = depth > maxDepth;
        if (Array.isArray(obj)) {
          if (depthReached) return `[ ..${obj.length} ]`;
          if (obj.length <= maxSiblings || depth === 0) return obj.map((s) => parse(s, depth + 1));
          return [
            ...obj.slice(0, maxSiblings).map((s) => parse(s, depth)),
            `..${obj.length - maxSiblings} more`
          ];
        }
        const keyCount = Object.keys(obj).length;
        if (depthReached) {
          return `{..${keyCount} ${keyCount === 1 ? "entry" : "entries"}}`;
        }
        if (keyCount <= maxSiblings || preserveRootSiblings && depth === 0) {
          return Object.fromEntries(Object.entries(obj).map(([k, v]) => [
            k,
            parse(v, depth + 1)
          ]));
        }
        return Object.fromEntries(Object.entries(obj).slice(0, maxSiblings).concat([
          [
            "..",
            `${keyCount - maxSiblings} more`
          ]
        ]).map(([k, v]) => [
          k,
          parse(v, depth + 1)
        ]));
      }
    }
    return obj;
  }
  __name(parse, "parse");
}
__name(tldr, "tldr");

// src/shared/logger.ts
var ENABLED = DEV && // @ts-ignore
import.meta?.env?.VITE_FRACTILS_LOG_LEVEL !== "off" && // @ts-ignore
!(import.meta?.env?.VITEST && !import.meta?.env?.VITE_FRACTILS_LOG_VITEST);
var Logger = class _Logger {
  static {
    __name(this, "Logger");
  }
  static _BYPASS_STYLES = false;
  static _BYPASS_DEFER = true;
  title = "";
  options;
  // color: ChalkInstance
  color;
  #logger;
  constructor(titleOrOptions, options) {
    if (typeof titleOrOptions === "string") {
      this.title = titleOrOptions;
      this.options = options ?? {};
    } else {
      this.options = titleOrOptions;
      this.title = titleOrOptions.title ?? "";
    }
    const colorname = options?.fg?.toLowerCase() ?? randomCSSColorName();
    const fg = colorname in CSS_COLORS ? CSS_COLORS[colorname] : colorname;
    this.color = fg;
    this.#logger = _Logger.createLogger(this.title, this.options);
    return this;
  }
  get deferred() {
    return !_Logger._BYPASS_DEFER && this.options?.deferred;
  }
  /**
  * Logs any args as well as any logs in the current buffer.
  * @param args
  */
  log = /* @__PURE__ */ __name((...args) => {
    this.#logger(...args);
  }, "log");
  /**
  * Logs any args as well as any logs in the current buffer.
  * @param args
  */
  dump = /* @__PURE__ */ __name((...args) => {
    if (this.buffer.length) {
      if (args[0].match(/ⓘ|⚠|⛔|💀/)) {
        this.buffer.unshift(args.shift());
      }
      this.consolidateBuffer();
      this.#logger(...this.buffer, ...args);
    } else {
      this.#logger(...args);
    }
    this.buffer = [];
  }, "dump");
  debug(...args) {
    if (import.meta?.env?.VITE_FRACTILS_LOG_LEVEL === "debug") this.dump("\u{1F41E}", ...args);
    return this;
  }
  i = hex("#426685")("\u24D8");
  info(...args) {
    this.dump(this.i, ...args);
    return this;
  }
  warn(...args) {
    this.dump(y("\u26A0"), ...args);
    return this;
  }
  error(...args) {
    this.dump(r("\u26D4"), ...args);
    return this;
  }
  fatal(...args) {
    this.dump(r("\u{1F480}"), ...args);
    return this;
  }
  group(label) {
    const title = this.title + (label ? `:${label}` : "");
    if (this.deferred) {
      defer(() => console.group(title));
    } else {
      console.group(title);
    }
    return this;
  }
  groupCollapsed(label) {
    const title = this.title + (label ? `:${label}` : "");
    if (this.deferred) {
      defer(() => console.groupCollapsed(title));
    } else {
      console.groupCollapsed(title);
    }
    return this;
  }
  groupEnd() {
    if (this.deferred) {
      defer(() => console.groupEnd());
    } else {
      console.groupEnd();
    }
    return this;
  }
  buffer = [];
  /**
  * Replaces any sequentially repeating strings in the buffer with a single instance and a count.
  */
  consolidateBuffer() {
    const buff = /* @__PURE__ */ new Map();
    for (const item of this.buffer) {
      buff.set(item, (buff.get(item) ?? 0) + 1);
    }
    this.buffer = Array.from(buff).map(([item, count]) => count > 1 ? `${item}x${dim(`${count}`)}` : item);
  }
  /**
  * Used to display the name of a method being called and the arguments it's being called with.
  * @param str The name of the method being called.
  * @param args The arguments being passed to the method.
  * @returns The logger instance.
  *
  * @example
  * ```typescript
  * const log = new Logger('Foo')
  * const bar = (a: number) => log.fn('bar', a)
  * bar(1) // logs:
  * ⓘ Foo bar(1)
  * ```
  */
  fn(str, ...args) {
    this.buffer.push(gr(str) + dim("(") + args.map((a) => gr(typeof a === "object" ? stringify(a) : a)).join(", ") + dim(")"));
    return this;
  }
  static createLogger(title, options) {
    options ??= {};
    const browser = options.browser ?? true;
    const server = options.server ?? false;
    if (BROWSER && !browser) return () => void 0;
    if (!BROWSER && !server) return () => void 0;
    const fg = options.fg || randomCSSColorName();
    const bg = options.bg || "transparent";
    const css = options.css ?? "";
    options.styled ??= true;
    const styled2 = options.styled && !_Logger._BYPASS_STYLES;
    options.deferred ??= true;
    const deferred = options.deferred && !_Logger._BYPASS_DEFER && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!ENABLED) return () => void 0;
    let callsite = void 0;
    let messageConfigBase = "%c%s%c";
    const [t, ...rest] = title.split(" ");
    let restParts = [];
    if (rest.length) {
      for (const part of rest) {
        restParts.push(`color:#666;background:${bg};padding:0.1rem;filter:saturate(0.25);${css}`, ` ${part}`);
      }
      const i = restParts.indexOf(restParts.at(-1) ?? "");
      if (i >= 0) {
        restParts[i] = `${restParts[i]}
`;
      }
      messageConfigBase = "%c%s".repeat(rest.length) + `${messageConfigBase}`;
      title = t;
    } else {
      title = `${title}
`;
    }
    const log = !styled2 ? (...args) => {
      console.log(`| ${callsite} |
| ${title} |`, ...args);
    } : (...args) => {
      let messageConfig = messageConfigBase;
      args.forEach((argument) => {
        const type = typeof argument;
        switch (type) {
          case "bigint":
          case "number":
            messageConfig += "%d ";
            break;
          case "string":
            messageConfig += "%s ";
            break;
          case "object":
          case "boolean":
          case "undefined":
          default:
            messageConfig += "%o ";
        }
      });
      console.log(messageConfig + "%c%s", `color:${fg};background:${bg};padding:0.1rem;${css}`, `${title}`, ...restParts, `color:initial;background:${bg};padding:0.1rem;${css}`, ...args.map((a) => (
        // Testing console goes nuts with large objects, so we tldr them.
        // @ts-ignore
        import.meta?.env?.VITEST ? tldr(a, {
          maxDepth: 1,
          maxSiblings: 1
        }) : a
      )), `color:#666;background:${bg};padding:0.1rem;${css};font-size:0.66rem;`, options?.callsite ? `${callsite}` : "");
    };
    if (!deferred) return log;
    return (...args) => defer(() => log(...args));
  }
};

// src/shared/select.ts
function select(input, node) {
  if (typeof window === "undefined") return [];
  if (input === void 0) return [];
  const elements = Array.isArray(input) ? input : [
    input
  ];
  node ??= document.documentElement;
  return elements.flatMap((el) => {
    if (!el) return [];
    if (el instanceof HTMLElement) return [
      el
    ];
    if (el instanceof Document) {
      return [
        document.documentElement
      ];
    }
    if (typeof el === "string") {
      if (el === "document" || el === "window") return [
        document.documentElement
      ];
      if (el.startsWith("#")) {
        const foundEl = document.getElementById(JSON.stringify(el).slice(1));
        if (foundEl) {
          return [
            foundEl
          ];
        } else {
          if (DEV) {
            console.warn(`No element found width id: `, el);
            console.warn(`Make sure the selector is a child of the target node.`);
            console.warn({
              input,
              node,
              elements
            });
          }
          return [];
        }
      }
    }
    const foundEls = node.querySelectorAll(el);
    if (foundEls.length === 0) {
      if (DEV) {
        console.warn(`No elements found for selector:`, el);
        console.warn(`Make sure the selector is a child of the target node.`);
        console.warn({
          input,
          node,
          elements
        });
      }
      return [];
    }
    return Array.from(foundEls);
  });
}
__name(select, "select");

// src/shared/store.ts
function safe_not_equal(a, b2) {
  return a != a ? b2 == b2 : a !== b2 || a !== null && typeof a === "object" || typeof a === "function";
}
__name(safe_not_equal, "safe_not_equal");
var noop = /* @__PURE__ */ __name(() => {
}, "noop");
function subscribe_to_store(store, run, invalidate) {
  if (store == null) {
    run(void 0);
    if (invalidate) invalidate(void 0);
    return noop;
  }
  const unsub = store.subscribe(run, invalidate);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
__name(subscribe_to_store, "subscribe_to_store");
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop = null;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  __name(set, "set");
  function update(fn) {
    set(fn(
      /** @type {T} */
      value
    ));
  }
  __name(update, "update");
  function subscribe(run, invalidate = noop) {
    const subscriber = [
      run,
      invalidate
    ];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update) || noop;
    }
    run(
      /** @type {T} */
      value
    );
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  __name(subscribe, "subscribe");
  return {
    set,
    update,
    subscribe
  };
}
__name(writable, "writable");
function get(store) {
  let value;
  subscribe_to_store(store, (_) => value = _)();
  return value;
}
__name(get, "get");

// src/shared/localStorageStore.ts
var localStorageStore = /* @__PURE__ */ __name((key, initial, options) => {
  let currentValue = initial;
  const verbose = options?.verbose ?? DEV;
  const { set: setStore, ...readableStore } = writable(initial, () => {
    if (options?.browserOverride || BROWSER) {
      getAndSetFromLocalStorage();
      const updateFromStorageEvents = /* @__PURE__ */ __name((event) => {
        if (event.key === key) getAndSetFromLocalStorage();
      }, "updateFromStorageEvents");
      window.addEventListener("storage", updateFromStorageEvents);
      return () => window.removeEventListener("storage", updateFromStorageEvents);
    } else return () => {
    };
  });
  let serialize2 = JSON.stringify;
  let deserialize = JSON.parse;
  const type = initial instanceof Map ? "Map" : initial instanceof Set ? "Set" : "";
  const isMapOrSet = [
    "Map",
    "Set"
  ].includes(type);
  if (isMapOrSet) {
    serialize2 = /* @__PURE__ */ __name((value) => JSON.stringify(Array.from(value.entries())), "serialize");
    deserialize = /* @__PURE__ */ __name((value) => {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        if (initial instanceof Map) return new Map(parsed);
        if (initial instanceof Set) return new Set(parsed);
        return parsed;
      }
      if (verbose) console.error(`Failed to deserialize ${type} from localStorageStore:`, {
        parsed,
        value,
        initial,
        key,
        options
      });
      return value;
    }, "deserialize");
  }
  const set = /* @__PURE__ */ __name((value) => {
    currentValue = value;
    if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
      value = deserialize(value);
    }
    setStore(value);
    setItem(value);
    options?.onChange?.(value);
  }, "set");
  let setItem = /* @__PURE__ */ __name((value) => {
    try {
      value = serialize2(value);
      localStorage.setItem(key, value);
    } catch (error) {
      if (verbose) console.error(`Failed to set localStorageStore value:`, {
        error,
        key,
        value
      });
    }
  }, "setItem");
  if (options?.defer) {
    let setDeferId;
    const _ = setItem;
    setItem = /* @__PURE__ */ __name((value) => {
      cancelDefer(setDeferId);
      setDeferId = defer(() => {
        _(value);
      });
    }, "setItem");
  }
  if (options?.debounce) {
    let timeout = setTimeout ?? (() => void 0);
    let timeoutId;
    const _ = setItem;
    setItem = /* @__PURE__ */ __name((value) => {
      clearTimeout(timeoutId);
      timeoutId = timeout(() => {
        _(value);
      }, options.debounce);
    }, "setItem");
  }
  const getAndSetFromLocalStorage = /* @__PURE__ */ __name(() => {
    let localValue = null;
    localValue = localStorage.getItem(key) ?? null;
    if (localValue === null) {
      set(initial);
    } else {
      try {
        const parsed = deserialize(localValue);
        setStore(parsed);
        currentValue = parsed;
      } catch (e) {
        if (verbose) {
          console.error(`Failed to parse localStorageStore value:`, {
            key,
            localValue
          });
          console.error(e);
        }
      }
    }
  }, "getAndSetFromLocalStorage");
  const update = /* @__PURE__ */ __name((fn) => {
    set(fn(currentValue));
  }, "update");
  return {
    ...readableStore,
    set,
    update
  };
}, "localStorageStore");

// src/shared/state.ts
function state(defaultValue, options) {
  const store = options?.key ? localStorageStore(options.key, defaultValue, {
    debounce: options?.debounce,
    onChange: options?.onChange
  }) : writable(defaultValue);
  function enhanceStore(enhancer) {
    if (enhancer) enhancer(store);
  }
  __name(enhanceStore, "enhanceStore");
  if (Array.isArray(defaultValue)) {
    enhanceStore((store2) => {
      store2.push = (item) => {
        store2.update((arr) => [
          ...arr,
          item
        ]);
      };
    });
  } else if (defaultValue instanceof Map) {
    enhanceStore((store2) => {
      store2.setKey = (key, value) => {
        store2.update((map) => {
          map.set(key, value);
          return map;
        });
      };
      store2.deleteKey = (key) => {
        store2.update((map) => {
          const newMap = new Map(map);
          newMap.delete(key);
          return newMap;
        });
      };
    });
  }
  enhanceStore((store2) => {
    if (defaultValue instanceof Set) {
      store2.add = (item) => {
        store2.update((set) => new Set(set).add(item));
      };
      store2.delete = (item) => {
        store2.update((set) => {
          const newSet = new Set(set);
          newSet.delete(item);
          return newSet;
        });
      };
    }
  });
  return {
    ...store,
    isState: true,
    get value() {
      return get(store);
    },
    set value(v) {
      if (v === void 0) throw new Error("Cannot set state to undefined");
      store.set(v);
    },
    refresh() {
      store.set(get(store));
    }
  };
}
__name(state, "state");
function isState(v1) {
  return v1.isState === true;
}
__name(isState, "isState");
function fromState(state2) {
  return isState(state2) ? state2.value : state2;
}
__name(fromState, "fromState");

// src/shared/clamp.ts
var clamp = /* @__PURE__ */ __name((value, min, max) => {
  return Math.max(Math.min(value, max), min);
}, "clamp");

// src/shared/resizable.ts
var RESIZABLE_DEFAULTS = {
  __type: "ResizableOptions",
  sides: [
    "right",
    "bottom"
  ],
  corners: [
    "bottom-right"
  ],
  grabberSize: 6,
  onResize: /* @__PURE__ */ __name(() => {
  }, "onResize"),
  localStorageKey: void 0,
  visible: false,
  color: "var(--fg-d, #1d1d1d)",
  opacity: 0.75,
  borderRadius: "50%",
  obstacles: void 0,
  cursors: true,
  classes: {
    default: "resize-grabber",
    active: "resize-grabbing"
  },
  bounds: "document",
  disabled: false
};
var Resizable = class {
  static {
    __name(this, "Resizable");
  }
  node;
  static type = "Resizable";
  static initialized = false;
  id;
  opts;
  disabled;
  bounds;
  obstacleEls;
  size;
  #activeGrabber;
  #listeners;
  #cleanupGrabListener;
  #cornerGrabberSize;
  #log;
  constructor(node, options) {
    this.node = node;
    this.id = nanoid(8);
    this.#activeGrabber = null;
    this.#listeners = [];
    this.#cleanupGrabListener = null;
    this.clickOffset = {
      x: 0,
      y: 0
    };
    this.onGrab = (e) => {
      if (this.disabled) return;
      this.node.setPointerCapture(e.pointerId);
      this.#activeGrabber = e.currentTarget;
      this.#activeGrabber.classList.add(this.opts.classes.active);
      document.body.classList.add(this.opts.classes.active);
      this.obstacleEls = select(this.opts.obstacles);
      const side = this.#activeGrabber.dataset["side"];
      if (side.match(/top/)) this.clickOffset.y = e.clientY - this.rect.top;
      if (side.match(/bottom/)) this.clickOffset.y = e.clientY - this.rect.bottom;
      if (side.match(/left/)) this.clickOffset.x = e.clientX - this.rect.left;
      if (side.match(/right/)) this.clickOffset.x = e.clientX - this.rect.right;
      e.preventDefault();
      e.stopPropagation();
      this.#cleanupGrabListener?.();
      document.addEventListener("pointermove", this.onMove);
      this.#cleanupGrabListener = () => document.removeEventListener("pointermove", this.onMove);
      this.#computedStyleValues();
      document.addEventListener("pointerup", this.onUp, {
        once: true
      });
    };
    this.#minWidth = 0;
    this.#maxWidth = 0;
    this.#minHeight = 0;
    this.#maxHeight = 0;
    this.#boundsRect = {
      left: -Infinity,
      top: -Infinity,
      right: Infinity,
      bottom: Infinity
    };
    this.#computedStyleValues = () => {
      const { minWidth, maxWidth, paddingLeft, paddingRight, borderLeftWidth, borderRightWidth, minHeight, maxHeight, paddingTop, paddingBottom, borderTopWidth, borderBottomWidth } = window.getComputedStyle(this.node);
      const borderBoxX = parseFloat(paddingLeft) + parseFloat(paddingRight) + parseFloat(borderLeftWidth) + parseFloat(borderRightWidth);
      const borderBoxY = parseFloat(paddingTop) + parseFloat(paddingBottom) + parseFloat(borderTopWidth) + parseFloat(borderBottomWidth);
      this.#minWidth = Math.max((parseFloat(minWidth) || 0) + borderBoxX, 25);
      this.#maxWidth = Math.min(parseFloat(maxWidth) || Infinity);
      this.#minHeight = Math.max((parseFloat(minHeight) || 0) + borderBoxY, 25);
      this.#maxHeight = Math.min(parseFloat(maxHeight) || Infinity);
      this.#boundsRect = this.bounds.getBoundingClientRect();
    };
    this.resizeX = (x, borderleft) => {
      let deltaX;
      if (borderleft) {
        deltaX = x - this.rect.left;
        if (deltaX === 0) return this;
        deltaX = collisionClampX(deltaX, this.rect, this.obstacleEls);
        if (this.#boundsRect) deltaX = Math.max(deltaX, this.#boundsRect.left - this.rect.left);
        const newWidth = clamp(this.rect.width - deltaX, this.#minWidth, this.#maxWidth);
        if (newWidth === this.#minWidth) deltaX = this.rect.width - newWidth;
        this.translateX += deltaX;
        this.node.style.setProperty("translate", `${this.translateX}px ${this.translateY}px`);
        this.node.style.width = `${newWidth}px`;
      } else {
        deltaX = x - this.rect.right;
        if (deltaX === 0) return this;
        deltaX = collisionClampX(deltaX, this.rect, this.obstacleEls);
        if (this.#boundsRect) deltaX = Math.min(deltaX, this.#boundsRect.right - this.rect.right);
        const newWidth = clamp(this.rect.width + deltaX, this.#minWidth, this.#maxWidth);
        this.node.style.width = `${newWidth}px`;
      }
      return this;
    };
    this.resizeY = (y2, bordertop) => {
      let deltaY;
      if (bordertop) {
        deltaY = y2 - this.rect.top;
        if (deltaY != 0) {
          deltaY = collisionClampY(deltaY, this.rect, this.obstacleEls);
          if (this.#boundsRect) deltaY = Math.max(deltaY, this.#boundsRect.top - this.rect.top);
          const newHeight = clamp(this.rect.height - deltaY, this.#minHeight, this.#maxHeight);
          if (newHeight === this.#minHeight) deltaY = this.rect.height - newHeight;
          this.translateY += deltaY;
          this.node.style.setProperty("translate", `${this.translateX}px ${this.translateY}px`);
          this.node.style.height = `${newHeight}px`;
        }
      } else {
        deltaY = y2 - this.rect.bottom;
        if (deltaY !== 0) {
          deltaY = collisionClampY(deltaY, this.rect, this.obstacleEls);
          if (this.#boundsRect) deltaY = Math.min(deltaY, this.#boundsRect.bottom - this.rect.bottom);
          const newHeight = clamp(this.rect.height + deltaY, this.#minHeight, this.#maxHeight);
          this.node.style.height = `${newHeight}px`;
        }
      }
      return this;
    };
    this.onMove = (e) => {
      if (!this.#activeGrabber) {
        console.error("No active grabber");
        return;
      }
      const x = e.clientX - this.clickOffset.x;
      const y2 = e.clientY - this.clickOffset.y;
      const { side } = this.#activeGrabber.dataset;
      this.#log.fn("onMove").debug(side);
      switch (side) {
        case "top-left":
          this.resizeY(y2, true).resizeX(x, true);
          break;
        case "top-right":
          this.resizeY(y2, true).resizeX(x);
          break;
        case "bottom-right":
          this.resizeY(y2).resizeX(x);
          break;
        case "bottom-left":
          this.resizeY(y2).resizeX(x, true);
          break;
        case "top":
          this.resizeY(y2, true);
          break;
        case "right":
          this.resizeX(x);
          break;
        case "bottom":
          this.resizeY(y2);
          break;
        case "left":
          this.resizeX(x, true);
          break;
      }
      this.node.dispatchEvent(new CustomEvent("resize"));
      this.size.set({
        width: this.node.offsetWidth,
        height: this.node.offsetHeight
      });
      this.opts.onResize({
        width: this.node.offsetWidth,
        height: this.node.offsetHeight
      });
    };
    this.onUp = () => {
      this.#cleanupGrabListener?.();
      document.body.classList.remove(this.opts.classes.active);
      this.#activeGrabber?.classList.remove(this.opts.classes.active);
      this.node.dispatchEvent(new CustomEvent("release"));
    };
    this.opts = deepMergeOpts([
      RESIZABLE_DEFAULTS,
      options
    ], {
      concatArrays: false
    });
    this.disabled = this.opts.disabled;
    this.#log = new Logger("resizable", {
      fg: "GreenYellow",
      deferred: false
    });
    this.#log.fn("constructor").info({
      opts: this.opts,
      this: this
    });
    this.node.classList.add("fractils-resizable");
    this.#cornerGrabberSize = this.opts.grabberSize * 3;
    this.bounds = select(this.opts.bounds)[0] ?? globalThis.document?.documentElement;
    this.obstacleEls = select(this.opts.obstacles);
    this.generateStyles();
    const { offsetWidth: width, offsetHeight: height } = node;
    this.size = state({
      width,
      height
    }, {
      key: this.opts.localStorageKey
    });
    if (this.opts.localStorageKey) {
      const { width: width2, height: height2 } = this.size.value;
      if (width2 === 0 || height2 === 0) {
        this.size.set({
          width: this.node.offsetWidth,
          height: this.node.offsetHeight
        });
      } else {
        if (this.opts.corners.length || this.opts.sides.some((s) => s.match(/left|right/))) {
          node.style.width = width2 + "px";
        }
        if (this.opts.corners.length || this.opts.sides.some((s) => s.match(/top|bottom/))) {
          node.style.height = height2 + "px";
        }
      }
      node.dispatchEvent(new CustomEvent("resize"));
    }
    this.createGrabbers();
    if (+this.node.style.minWidth > this.boundsRect.width) {
      console.error("Min width is greater than bounds width.");
      return;
    }
    this.size.set({
      width: this.node.offsetWidth,
      height: this.node.offsetHeight
    });
  }
  get boundsRect() {
    return this.bounds.getBoundingClientRect();
  }
  //? Create resize grabbers.
  createGrabbers() {
    for (const [side, type] of [
      ...this.opts.sides.map((s) => [
        s,
        "side"
      ]),
      ...this.opts.corners.map((c2) => [
        c2,
        "corner"
      ])
    ]) {
      const grabber = document.createElement("div");
      grabber.classList.add(`${this.opts.classes.default}-${this.id}`);
      grabber.classList.add(`${this.opts.classes.default}-${type}-${this.id}`);
      grabber.classList.add(`${this.opts.classes.default}-${side}-${this.id}`);
      grabber.dataset["side"] = side;
      grabber.addEventListener("pointerdown", this.onGrab);
      this.#listeners.push(() => grabber.removeEventListener("pointerdown", this.onGrab));
      this.node.appendChild(grabber);
    }
  }
  clickOffset;
  onGrab;
  get translateX() {
    return +this.node.dataset["translateX"] || 0;
  }
  set translateX(v) {
    this.node.dataset["translateX"] = String(v);
  }
  get translateY() {
    return +this.node.dataset["translateY"] || 0;
  }
  set translateY(v) {
    this.node.dataset["translateY"] = String(v);
  }
  get rect() {
    return this.node.getBoundingClientRect();
  }
  #minWidth;
  #maxWidth;
  #minHeight;
  #maxHeight;
  #boundsRect;
  #computedStyleValues;
  resizeX;
  resizeY;
  onMove;
  onUp;
  /**
  * Creates the global stylesheet (but only once).
  */
  generateStyles() {
    this.#log.fn("generateStyles").debug("Generating global styles for", this);
    let css = (
      /*css*/
      `
			.resize-grabber-${this.id} {
				position: absolute;
				display: flex;

				opacity: ${this.opts.visible ? this.opts.opacity : 0};
				border-radius: ${this.opts.borderRadius};
				border-radius: inherit;

				transition: opacity 0.1s;
			}

			.fractils-resizable:not(.fractils-grabbing) .resize-grabber-${this.id}:hover {
				opacity: ${this.opts.opacity / 2};
			}

			.resize-grabber-${this.id}:active {
				opacity: ${this.opts.opacity * 0.75};
			}
		`
    );
    if (this.opts.cursors) {
      css += /*css*/
      `
				.resize-grabbing-${this.id} *, .resize-grabber-${this.id}:active {
					cursor: grabbing !important;
				}
			`;
    }
    const cursor = /* @__PURE__ */ __name((v) => !this.opts.cursors ? "" : `
				cursor: ${v};`, "cursor");
    const offset = this.opts.grabberSize / 2;
    const gradient = `transparent 20%, ${this.opts.color} 33%, ${this.opts.color} 66%, transparent 75%, transparent 100%`;
    const lengthPrcnt = 98;
    if (this.opts.sides.includes("top")) css += /*css*/
    `
			.${this.opts.classes.default}-top-${this.id} {
				${cursor("ns-resize")}
				top: ${-offset}px;
				left: ${50 - lengthPrcnt * 0.5}%;

				width: ${lengthPrcnt}%;
				height: ${this.opts.grabberSize}px;

				background: linear-gradient(to bottom, ${gradient});
			}
		`;
    if (this.opts.sides.includes("right")) css += /*css*/
    `
			.${this.opts.classes.default}-right-${this.id} {
				${cursor("ew-resize")}
				right: ${-offset}px;
				top: ${50 - lengthPrcnt * 0.5}%;

				width: ${this.opts.grabberSize}px;
				height: ${lengthPrcnt}%;

				background: linear-gradient(to left, ${gradient});
			}
		`;
    if (this.opts.sides.includes("bottom")) css += /*css*/
    `
			.${this.opts.classes.default}-bottom-${this.id} {
				${cursor("ns-resize")}
				bottom: ${-offset}px;
				left: ${50 - lengthPrcnt * 0.5}%;

				width: ${lengthPrcnt}%;
				height: ${this.opts.grabberSize}px;

				background: linear-gradient(to top, ${gradient});
			}
		`;
    if (this.opts.sides.includes("left")) css += /*css*/
    `
				.${this.opts.classes.default}-left-${this.id} {
					${cursor("ew-resize")}
					left: ${-offset}px;
					top: ${50 - lengthPrcnt * 0.5}%;

					width: ${this.opts.grabberSize}px;
					height: ${lengthPrcnt}%;

					background: linear-gradient(to right, ${gradient});
				}
			`;
    css += `.fractils-grabbing .resize-grabber { cursor: default }`;
    const cSize = this.#cornerGrabberSize;
    const opposites = {
      "top-left": "100% 100%",
      "top-right": "0% 100%",
      "bottom-left": "100% 0%",
      "bottom-right": "0% 0%"
    };
    const corner = /* @__PURE__ */ __name((corner2, cursorValue) => {
      if (!this.opts.corners.includes(corner2)) return;
      const classname = `${this.opts.classes.default}-${corner2}-${this.id}`;
      const sides = corner2.replace(this.opts.classes.default, "").split("-");
      css += `
				.${classname} {${cursor(cursorValue)}
					${sides[0]}: 0px;
					${sides[1]}: 0px;
					width: ${cSize}px;
					height: ${cSize}px;
				}
				.${classname}::after {
					content: '';
					width: 100%;
					height: 100%;
					background: radial-gradient(farthest-corner at ${opposites[corner2]}, transparent 70%, ${this.opts.color} 86%);
					border-radius: 15%;
				}
			`;
    }, "corner");
    corner("top-left", "nwse-resize");
    corner("top-right", "nesw-resize");
    corner("bottom-left", "nesw-resize");
    corner("bottom-right", "nwse-resize");
    const styleEl = document.createElement("style");
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
  }
  dispose() {
    for (const cleanup of this.#listeners) {
      cleanup();
    }
    this.#cleanupGrabListener?.();
  }
};

// src/shared/is.ts
function isDefined(value) {
  return value !== void 0;
}
__name(isDefined, "isDefined");
function isString(value) {
  return typeof value === "string";
}
__name(isString, "isString");
function isHTMLElement(value) {
  return value instanceof HTMLElement;
}
__name(isHTMLElement, "isHTMLElement");

// src/shared/EventManager.ts
var EventManager = class {
  static {
    __name(this, "EventManager");
  }
  _unlisteners = /* @__PURE__ */ new Map();
  /**
  * The event handlers for each registered custom event type, and their respective callbacks.
  */
  _handlers = /* @__PURE__ */ new Map();
  _listenerGroups = /* @__PURE__ */ new Map();
  _log = new Logger("EventManager", {
    fg: "beige"
  });
  constructor(events) {
    if (events) {
      this.registerEvents([
        ...events
      ]);
    }
  }
  /**
  * Register new event type(s) for use via {@link on}.
  */
  registerEvents(events) {
    for (const event of events) {
      this._handlers.set(event, /* @__PURE__ */ new Map());
    }
  }
  /**
  * Register a new event listener.
  * @param event - The name of the event to listen for.
  * @param callback - The callback function to execute when the event is fired.
  * @returns The ID of the listener (for use via {@link unlisten} to remove the listener).
  */
  on(event, callback) {
    this._log.fn("on").debug(this);
    if (!this._handlers.has(event)) {
      this._log.warn(`Event "${String(event)}" is not registered.`, this);
      return "";
    }
    this._log.debug("new listener:", {
      event,
      callback
    });
    const id = nanoid();
    const listeners = this._handlers.get(event);
    listeners.set(id, callback);
    return id;
  }
  /**
  * Emit an event to all registered listeners.
  * @param event - The name of the event to emit.
  * @param args - The arguments to pass to the event listeners.
  */
  emit(event, ...args) {
    this._log.fn("emit").debug({
      event
    });
    const callbacks = this._handlers.get(event);
    if (callbacks) {
      for (const cb of callbacks.values()) {
        cb(...args);
      }
    }
  }
  /**
  * Add an event listener to an HTMLElement that will be removed when {@link dispose} is called.
  * @param element - The element to add the listener to.
  * @param event - The event to listen for.
  * @param callback - The callback function to execute when the event is fired.
  * @param options - Optional event listener options.
  * @param groupId - Optional group ID to add the listener to (for batch removal).
  */
  listen = /* @__PURE__ */ __name((element, event, callback, options, groupId) => {
    const id = nanoid();
    element.removeEventListener(event, callback, options);
    element.addEventListener(event, callback, options);
    this._unlisteners.set(id, () => {
      element.removeEventListener(event, callback, options);
    });
    if (groupId) this.group(groupId, id);
    return id;
  }, "listen");
  /**
  * Add a listener to the event manager without attaching it to an element.
  * @param cb - The callback function to execute when the event is fired.
  * @param groupId - Optional group ID to add the listener to (for batch
  * removal via {@link clearGroup}).
  * @returns The ID generated for the listener (for removal via {@link unlisten}).
  */
  add = /* @__PURE__ */ __name((cb, groupId) => {
    const id = nanoid();
    this._unlisteners.set(id, cb);
    if (groupId) this.group(groupId, id);
    return id;
  }, "add");
  /**
  * Add a listener to a group by id, enabling batch removal via {@link clearGroup}.
  * @param groupId - The ID of the group to add the listener ID to.
  * @param listenerId - The ID of the listener to add to the group.
  */
  group(groupId, listenerId) {
    if (!this._listenerGroups.has(groupId)) {
      this._listenerGroups.set(groupId, /* @__PURE__ */ new Set());
    }
    this._listenerGroups.get(groupId).add(listenerId);
    return this;
  }
  /**
  * Call the listener callback with the specified ID, then remove it.
  * @param id - The ID of the listener to remove.
  * @returns `true` if the listener was removed, `false` if it was not found.
  */
  unlisten(id) {
    this._unlisteners.get(id)?.();
    return this._unlisteners.delete(id);
  }
  /**
  * Calls all cleanup callbacks and clears the event manager.
  */
  clear() {
    for (const cb of this._unlisteners.values()) cb();
    this._unlisteners.clear();
    this._listenerGroups.clear();
    this.clearHandlers();
    return this;
  }
  /**
  * Remove all registered event handlers.
  */
  clearHandlers() {
    for (const listeners of this._handlers.values()) listeners.clear();
    this._handlers.clear();
    return this;
  }
  /**
  * Remove all listeners in a group by ID.
  * @param groupId - The ID of the group to clear.
  */
  clearGroup(groupId) {
    const group = this._listenerGroups.get(groupId);
    if (group) {
      for (const id of group) {
        const cb = this._unlisteners.get(id);
        if (cb) cb();
        this._unlisteners.delete(id);
      }
      this._listenerGroups.delete(groupId);
    }
    return this;
  }
  /**
  * Removes all registered listeners.
  */
  dispose() {
    this.clear();
    this.clearHandlers();
  }
};

// src/shared/getStyle.ts
var getStyleMap = /* @__PURE__ */ __name((element) => {
  if (typeof element !== "object") {
    throw new Error("element must be an object");
  }
  if ("computedStyleMap" in element) {
    return element.computedStyleMap();
  } else {
    const styles = getComputedStyle(element);
    const styleMap = /* @__PURE__ */ new Map();
    for (let i = 0; i < styles.length; i++) {
      const property = styles[i];
      const value = styles.getPropertyValue(property);
      if (value) {
        styleMap.set(property, value);
      }
    }
    return styleMap;
  }
}, "getStyleMap");
var getStyle = /* @__PURE__ */ __name((element, property) => {
  return getStyleMap(element).get(property);
}, "getStyle");

// src/shared/persist.ts
function persist(key, initialValue = void 0, quiet = !DEV) {
  const bail = /* @__PURE__ */ __name(() => {
    if (typeof localStorage === "undefined") {
      if (!quiet) console.warn(`localStorage is not available for key "${key}"`);
      return true;
    } else return false;
  }, "bail");
  return {
    get() {
      if (bail()) return initialValue;
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    },
    set(newValue) {
      if (bail()) return;
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    get value() {
      return this.get();
    },
    set value(v) {
      this.set(v);
    }
  };
}
__name(persist, "persist");

// src/shared/place.ts
function place(node, placement = "top-right", options) {
  const { bounds, margin } = Object.assign({
    bounds: void 0,
    margin: 10
  }, options);
  const rect = typeof node === "string" ? select(node)[0]?.getBoundingClientRect() : node instanceof Element ? node.getBoundingClientRect() : node;
  if (!rect) throw new Error("Invalid node: " + node);
  const b2 = bounds === "window" && typeof window !== "undefined" ? {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight
  } : typeof bounds === "string" ? select(bounds)[0]?.getBoundingClientRect() : bounds ?? {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  };
  if (!b2) throw new Error("Invalid bounds: " + bounds);
  const m2 = typeof margin === "number" ? {
    x: margin,
    y: margin
  } : margin;
  if (!("x" in m2) || !("y" in m2)) {
    throw new Error("Invalid margin: " + JSON.stringify(m2));
  }
  switch (placement) {
    case "center":
    case "center-center":
      return {
        x: b2.width / 2 - rect.width / 2,
        y: b2.height / 2 - rect.height / 2
      };
    case "top-left":
    case "left-top":
      return {
        x: m2.x,
        y: m2.y
      };
    case "top-center":
    case "center-top":
      return {
        x: b2.width / 2 - rect.width / 2,
        y: m2.y
      };
    case "top-right":
    case "right-top":
      return {
        x: b2.width - rect.width - m2.x,
        y: m2.y
      };
    case "bottom-left":
    case "left-bottom":
      return {
        x: m2.x,
        y: b2.height - rect.height - m2.y
      };
    case "bottom-center":
    case "center-bottom":
      return {
        x: b2.width / 2 - rect.width / 2,
        y: b2.height - rect.height - m2.y
      };
    case "bottom-right":
    case "right-bottom":
      return {
        x: b2.width - rect.width - m2.x,
        y: b2.height - rect.height - m2.y
      };
    case "left-center":
    case "center-left":
      return {
        x: m2.x,
        y: b2.height / 2 - rect.height / 2
      };
    case "right-center":
    case "center-right":
      return {
        x: b2.width - rect.width - m2.x,
        y: b2.height / 2 - rect.height / 2
      };
    default:
      throw new Error("Invalid placement: " + placement);
  }
}
__name(place, "place");

// src/shared/draggable.ts
var DEFAULT_CLASSES = {
  default: "fractils-draggable",
  dragging: "fractils-dragging",
  dragged: "fractils-dragged",
  cancel: "fractils-cancel"
};
var DRAGGABLE_DEFAULTS = {
  __type: "DraggableOptions",
  bounds: "body",
  axis: "both",
  userSelectNone: true,
  ignoreMultitouch: false,
  disabled: false,
  position: {
    x: 0,
    y: 0
  },
  placementOptions: {
    margin: 0
  },
  cancel: void 0,
  handle: void 0,
  obstacles: void 0,
  classes: DEFAULT_CLASSES,
  onDragStart: /* @__PURE__ */ __name(() => {
  }, "onDragStart"),
  onDrag: /* @__PURE__ */ __name(() => {
  }, "onDrag"),
  onDragEnd: /* @__PURE__ */ __name(() => {
  }, "onDragEnd"),
  onCollision: /* @__PURE__ */ __name(() => {
  }, "onCollision"),
  transform: void 0,
  localStorageKey: void 0
};
var Draggable = class {
  static {
    __name(this, "Draggable");
  }
  node;
  static initialized = false;
  opts;
  /**
  * Whether the draggable element is currently being dragged.
  */
  #active;
  /**
  * Disables user interaction with the draggable element.
  */
  disabled;
  /**
  * Used in  {@link update} to account for the difference between
  * the node's position and the user's exact click position on the node.
  */
  clickOffset;
  /**
  * The distance between the pointer's position and the node's position.
  */
  clientToNodeOffset;
  /**
  * An internal representation of the {@link node|node's} bounding rectangle.
  * Used for collision detection and animations.
  */
  rect;
  /**
  * The original value of `user-select` on the body element
  * used to restore the original value after dragging when
  * {@link DraggableOptions.userSelectNone|userSelectNone} is `true`.
  */
  #bodyOriginalUserSelectVal;
  boundsEl;
  handleEls;
  cancelEls;
  obstacleEls;
  /**
  * A rectangle representing the draggable element's boundary, if any.
  */
  bounds;
  #leftBound;
  #topBound;
  #rightBound;
  #bottomBound;
  _storage;
  _position;
  /**
  * Programmatically sets the position of the draggable element.
  */
  get position() {
    return this._position;
  }
  set position(v) {
    this._position = v;
    this.moveTo(v);
    this.updateLocalStorage();
  }
  /**
  * Updates the {@link bounds} property to account for any changes in the
  * DOM or this instance's {@link DraggableOptions.bounds|bounds} option.
  */
  #recomputeBounds;
  /**
  * @todo I think we can just remove this and let the user add their
  * own event listeners if they want to target a specific element.
  */
  eventTarget;
  /**
  * An observable store that updates the draggable element's position.
  */
  positionStore;
  /**
  * Cleanup functions (removeEventLister / unsubscribe) to call in {@link dispose}.
  */
  #listeners;
  #evm;
  /**
  * A callback to release the pointer capture using the
  * {@link PointerEvent.pointerId | pointerId} and reset the cursor.
  */
  #releaseCapture;
  /**
  * Internal logger for infoging. Automatically bypassed in non-dev environments.
  */
  #log;
  constructor(node, options) {
    this.node = node;
    this.#active = false;
    this.disabled = false;
    this.clickOffset = {
      x: 0,
      y: 0
    };
    this.clientToNodeOffset = {
      x: 0,
      y: 0
    };
    this.rect = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    this.#bodyOriginalUserSelectVal = "";
    this.bounds = {
      left: -Infinity,
      top: -Infinity,
      right: Infinity,
      bottom: Infinity
    };
    this.#leftBound = -Infinity;
    this.#topBound = -Infinity;
    this.#rightBound = Infinity;
    this.#bottomBound = Infinity;
    this._position = {
      x: 0,
      y: 0
    };
    this.#listeners = /* @__PURE__ */ new Set();
    this.#evm = new EventManager();
    this.#releaseCapture = () => {
    };
    this.dragStart = (e) => {
      if (this.disabled) return;
      if (e.button === 2) return;
      if (this.opts.ignoreMultitouch && !e.isPrimary) return;
      if (e.composedPath().some((n) => n.classList?.contains(this.opts.classes.cancel))) {
        return;
      }
      this.obstacleEls = select(this.opts.obstacles);
      if (DEV) {
        for (const el of this.obstacleEls) {
          el.dataset["outline"] = el.style.outline;
          el.style.outline = "2px dotted #f007";
        }
      }
      if (isString(this.opts.handle) && isString(this.opts.cancel) && this.opts.handle === this.opts.cancel) {
        throw new Error("`handle` selector can't be same as `cancel` selector");
      }
      if (this.#cancelElementContains(this.handleEls)) {
        throw new Error("Element being dragged can't be a child of the element on which `cancel` is applied");
      }
      const eventTarget = e.composedPath()[0];
      if (!this.handleEls.some((e2) => e2.contains(eventTarget) || e2.shadowRoot?.contains(eventTarget))) return;
      if (this.#cancelElementContains([
        eventTarget
      ])) {
        return;
      }
      this.#log.fn("dragStart").debug("Dragging initiated.");
      e.stopPropagation();
      this.eventTarget = this.handleEls.length === 1 ? this.node : this.handleEls.find((el) => el.contains(eventTarget));
      this.#active = true;
      if (this.canMoveX) this.clickOffset.x = e.clientX - this.x;
      if (this.canMoveY) this.clickOffset.y = e.clientY - this.y;
      const { top, right, bottom, left } = this.node.getBoundingClientRect();
      this.rect = {
        top,
        right,
        bottom,
        left
      };
      if (this.bounds) this.clientToNodeOffset = {
        x: e.clientX - left,
        y: e.clientY - top
      };
      this.positionStore.set({
        x: this.x,
        y: this.y
      });
      this.#recomputeBounds();
      this.#updateBounds();
      this.node.dispatchEvent(new CustomEvent("grab"));
      const { cursor } = getComputedStyle(this.node);
      this.node.setPointerCapture(e.pointerId);
      this.node.style.cursor = "grabbing";
      this.#releaseCapture = () => {
        this.node.style.cursor = cursor;
      };
      this.#fireSvelteDragStartEvent();
      this.#fireUpdateEvent();
    };
    this.drag = (e) => {
      if (!this.#active) return;
      e.preventDefault();
      e.stopPropagation();
      this.node.classList.add(this.opts.classes.dragging);
      this.node.classList.add(this.opts.classes.dragged);
      const x = e.clientX - this.clickOffset.x;
      const y2 = e.clientY - this.clickOffset.y;
      const target = {
        x,
        y: y2
      };
      this.moveTo(target);
      this.#fireSvelteDragEvent();
    };
    this.dragEnd = () => {
      if (!this.#active) return;
      if (DEV) {
        for (const el of this.obstacleEls) {
          el.style.outline = el.dataset["outline"] ?? "none";
        }
      }
      this.node.classList.remove(this.opts.classes.dragging);
      if (this.opts.userSelectNone) {
        document.body.style.userSelect = this.#bodyOriginalUserSelectVal;
      }
      this.clickOffset = {
        x: 0,
        y: 0
      };
      this.clientToNodeOffset = {
        x: 0,
        y: 0
      };
      this._position = {
        x: this.x,
        y: this.y
      };
      this.#active = false;
      this.#releaseCapture();
      this.node.dispatchEvent(new CustomEvent("release"));
      setTimeout(() => this.node.classList.remove(this.opts.classes.dragged), 0);
      this.#fireSvelteDragEndEvent();
      this.updateLocalStorage();
    };
    this.resize = () => {
      this.#recomputeBounds();
      this.#updateBounds();
      this.moveTo(this.position);
    };
    this.#updateBounds = () => {
      const styleLeft = parseFloat(this.node.style.left) || 0;
      this.#leftBound = -styleLeft;
      this.#rightBound = this.bounds.right - this.bounds.left - (this.rect.right - this.rect.left) - styleLeft;
      const styleTop = parseFloat(this.node.style.top) || 0;
      this.#topBound = -styleTop;
      this.#bottomBound = this.bounds.bottom - this.bounds.top - styleTop - (this.rect.bottom - this.rect.top);
      if (this.boundsEl) {
        const styleMap = getStyleMap(this.boundsEl);
        this.#leftBound -= parseFloat(styleMap.get("padding-left"));
        this.#rightBound -= parseFloat(styleMap.get("padding-right"));
        this.#topBound -= parseFloat(styleMap.get("padding-top"));
        this.#bottomBound -= parseFloat(styleMap.get("padding-bottom"));
      }
    };
    this.updateLocalStorage = () => {
      if (!this.opts.localStorageKey) return;
      this.#log.fn("updateLocalStorage").debug("Updating position in localStorage:", `{ x: ${this._position.x}, y: ${this._position.y} }`, this);
      if (this._storage) {
        this._storage.set(this._position);
      }
    };
    this.clearLocalStorage = () => {
      if (this._storage && this.opts.localStorageKey) {
        localStorage.removeItem(this.opts.localStorageKey);
      }
    };
    this.#cancelElementContains = (dragElements) => {
      return this.cancelEls.some((cancelEl) => dragElements.some((el) => cancelEl.contains(el)));
    };
    this.#callEvent = (eventName, fn) => {
      const data = this.eventData;
      this.node.dispatchEvent(new CustomEvent(eventName, {
        detail: data
      }));
      fn?.(data);
    };
    this.#fireSvelteDragStartEvent = () => {
      this.#callEvent("dragstart", this.opts.onDragStart);
    };
    this.#fireSvelteDragEndEvent = () => {
      this.#callEvent("dragend", this.opts.onDragEnd);
    };
    this.#fireSvelteDragEvent = () => {
      this.#callEvent("drag", this.opts.onDrag);
    };
    this.#fireUpdateEvent = () => {
      this.node.dispatchEvent(new CustomEvent("update", {
        detail: this
      }));
    };
    this.opts = Object.assign({}, DRAGGABLE_DEFAULTS, options);
    this.#log = new Logger("draggable " + Array.from(this.node.classList).join("."), {
      fg: "SkyBlue"
    });
    this.#recomputeBounds = this.#resolveBounds(this.opts.bounds);
    this.opts.position = this.resolvePosition(this.opts.position);
    this.#log.fn("constructor").debug({
      opts: this.opts,
      this: this
    });
    this.positionStore = writable(this.opts.position);
    this.node.classList.add(this.opts.classes.default);
    const startPosition = this.opts.position;
    if (options?.localStorageKey) {
      this._storage = persist(options.localStorageKey, startPosition);
      const storagePostion = this._storage.get();
      if (storagePostion) {
        startPosition.x = storagePostion.x;
        startPosition.y = storagePostion.y;
      }
    }
    this.x = startPosition.x;
    this.y = startPosition.y;
    this.node.style.setProperty("touch-action", "none");
    this.handleEls = this.opts.handle ? select(this.opts.handle, this.node) : [
      this.node
    ];
    this.cancelEls = select(this.opts.cancel, this.node);
    this.obstacleEls = select(this.opts.obstacles);
    this.#evm.listen(this.node, "pointerdown", this.dragStart);
    this.#evm.listen(window, "pointerup", this.dragEnd);
    this.#evm.listen(window, "pointermove", this.drag);
    this.#evm.listen(window, "resize", this.resize);
    this.#evm.add(this.positionStore.subscribe(({ x, y: y2 }) => {
      this.node.style.setProperty("translate", `${x}px ${y2}px 1px`);
    }));
    if (startPosition !== DRAGGABLE_DEFAULTS.position) {
      const { top, right, bottom, left } = this.node.getBoundingClientRect();
      this.rect = {
        top,
        right,
        bottom,
        left
      };
      this.#recomputeBounds();
      this.#updateBounds();
      this.moveTo(startPosition);
      this._position = {
        x: this.x,
        y: this.y
      };
    }
  }
  /**
  * The x position of the draggable element's transform offset.
  */
  get x() {
    return +this.node.dataset["translateX"] || 0;
  }
  set x(v) {
    this.node.dataset["translateX"] = String(v);
  }
  /**
  * The y position of the draggable element's transform offset.
  */
  get y() {
    return +this.node.dataset["translateY"] || 0;
  }
  set y(v) {
    this.node.dataset["translateY"] = String(v);
  }
  /**
  * Whether the draggable element can move in the x direction,
  * based on the {@link DraggableOptions.axis|axis} option.
  */
  get canMoveX() {
    return /(both|x)/.test(this.opts.axis);
  }
  /**
  * Whether the draggable element can move in the x direction,
  * based on the {@link DraggableOptions.axis|axis} option.
  */
  get canMoveY() {
    return /(both|y)/.test(this.opts.axis);
  }
  get eventData() {
    return {
      x: this.x,
      y: this.y,
      rootNode: this.node,
      eventTarget: this.eventTarget
    };
  }
  get isControlled() {
    return !!this.opts.position;
  }
  dragStart;
  drag;
  dragEnd;
  resize;
  #updateBounds;
  /**
  * Moves the {@link node|draggable element} to the specified position, adjusted
  * for collisions with {@link obstacleEls obstacles} or {@link boundsRect bounds}.
  */
  moveTo(target) {
    this.#log.fn("moveTo").debug("Moving to:", target, this);
    if (this.canMoveX) {
      if (this.bounds) target.x = clamp(target.x, this.#leftBound, this.#rightBound);
      const deltaX = target.x - this.x;
      if (deltaX !== 0) {
        const x = collisionClampX(deltaX, this.rect, this.obstacleEls);
        this.rect.left += x;
        this.rect.right += x;
        this.x += x;
      }
    }
    if (this.canMoveY) {
      if (this.bounds) target.y = clamp(target.y, this.#topBound, this.#bottomBound);
      const deltaY = target.y - this.y;
      if (deltaY !== 0) {
        const y2 = collisionClampY(deltaY, this.rect, this.obstacleEls);
        this.rect.top += y2;
        this.rect.bottom += y2;
        this.y += y2;
      }
    }
    if (!this.opts.transform) {
      this.positionStore.set({
        x: this.x,
        y: this.y
      });
    } else {
      const customTransformResult = this.opts.transform?.({
        x: this.x,
        y: this.y,
        rootNode: this.node,
        eventTarget: this.eventTarget
      });
      if (customTransformResult && "x" in customTransformResult && "y" in customTransformResult) {
        const { x, y: y2 } = customTransformResult;
        this.positionStore.set({
          x,
          y: y2
        });
      }
    }
    this.#fireUpdateEvent();
  }
  update(v = this.position) {
    this.#log.fn("update").debug("Updating position:", v, this);
    this.moveTo(v);
  }
  updateLocalStorage;
  clearLocalStorage;
  /**
  * Resolves the {@link DraggableOptions.bounds|bounds} and returns a
  * function that updates the {@link bounds} property when called.
  */
  #resolveBounds(opts) {
    if (!opts) return () => void 0;
    if (opts && typeof opts === "object" && ("left" in opts || "right" in opts || "top" in opts || "bottom" in opts)) {
      return () => {
        this.bounds = {
          left: -Infinity,
          right: Infinity,
          top: -Infinity,
          bottom: Infinity,
          ...this.opts.bounds
        };
      };
    }
    const node = isHTMLElement(opts) ? opts : opts === "body" ? document.body : opts === "parent" ? this.node.offsetParent : isString(opts) ? select(opts)[0] : !isDefined(opts) ? document.documentElement : void 0;
    if (!node) throw new Error("Invalid bounds option provided: " + opts);
    this.boundsEl = node;
    const boundsResizeObserver = new ResizeObserver(() => {
      this.resize();
      this.#fireUpdateEvent();
    });
    boundsResizeObserver.observe(node);
    this.#listeners.add(() => boundsResizeObserver.disconnect());
    this.#fireUpdateEvent();
    return () => this.bounds = node.getBoundingClientRect();
  }
  /**
  * Resolves a {@link DraggableOptions.position} option into an `{x,y}` vector
  * depending on its type:
  * - `undefined` -> {@link DRAGGABLE_DEFAULTS.position}
  * - {@link Placement} -> {@link place}
  * - `{x,y}` -> itself *(merged with {@link DRAGGABLE_DEFAULTS.position}*
  * if it's a partial.)
  */
  resolvePosition(pos) {
    const defaultPos = DRAGGABLE_DEFAULTS.position;
    if (!pos) {
      return defaultPos;
    }
    if (typeof pos === "string") {
      return place(this.node, pos, {
        bounds: this.boundsEl?.getBoundingClientRect(),
        ...this.opts.placementOptions
      });
    }
    if (typeof pos === "object" && ("x" in pos || "y" in pos)) {
      return {
        ...defaultPos,
        ...pos
      };
    }
    throw new Error("Invalid position: " + JSON.stringify(pos), {
      cause: {
        defaultPos,
        pos
      }
    });
  }
  #cancelElementContains;
  #callEvent;
  #fireSvelteDragStartEvent;
  #fireSvelteDragEndEvent;
  #fireSvelteDragEvent;
  #fireUpdateEvent;
  dispose() {
    this.#evm.dispose();
  }
};

// src/shared/resolveOpts.ts
function resolveOpts(maybeT, tDefaults) {
  if (typeof maybeT === "undefined") {
    return tDefaults;
  }
  if (maybeT === true) {
    return tDefaults;
  }
  if (maybeT === false) {
    return false;
  }
  if (typeof maybeT === "object") {
    return deepMergeOpts([
      tDefaults,
      maybeT
    ], {
      concatArrays: false
    });
  }
  return maybeT;
}
__name(resolveOpts, "resolveOpts");

// src/shared/WindowManager.ts
function isObject(thing) {
  return typeof thing === "object" && thing !== null;
}
__name(isObject, "isObject");
var WINDOWMANGER_STORAGE_DEFAULTS = {
  __type: "WindowManagerStorageOptions",
  key: "window-manager",
  size: true,
  position: true,
  debounce: 50
};
var WINDOWMANAGER_DEFAULTS = {
  __type: "WindowManagerOptions",
  resizable: RESIZABLE_DEFAULTS,
  draggable: DRAGGABLE_DEFAULTS,
  zFloor: 10,
  preserveZ: false,
  bounds: void 0,
  obstacles: void 0,
  localStorage: void 0
};
var WindowManager = class {
  static {
    __name(this, "WindowManager");
  }
  /**
  * A map of all windows managed by the instance.  The key is the window's id specified in the
  * options for each window.
  */
  windows = /* @__PURE__ */ new Map();
  /**
  * The initial {@link WindowManagerOptions} provided.
  */
  opts;
  _log = new Logger("WindowManager", {
    fg: "lightseagreen"
  });
  _evm = new EventManager();
  constructor(options) {
    options ??= WINDOWMANAGER_DEFAULTS;
    options.__type = "WindowManagerOptions";
    this.opts = Object.freeze(this._resolveOptions(options));
    this._log.fn("constructor").info({
      opts: this.opts,
      options,
      this: this
    });
  }
  add = /* @__PURE__ */ __name((node, options) => {
    const instance = new WindowInstance(this, node, options);
    this.windows.set(instance.id, instance);
    const listenerId = this._evm.listen(node, "grab", this.select);
    return {
      destroy: /* @__PURE__ */ __name(() => {
        instance.dispose();
        this.windows.delete(instance.id);
        this._evm.unlisten(listenerId);
      }, "destroy")
    };
  }, "add");
  update() {
    this.windows.forEach(({ resizableInstance, draggableInstance }) => {
      if (draggableInstance) draggableInstance.update();
      if (resizableInstance) resizableInstance.size = resizableInstance.size;
    });
  }
  applyZ() {
    let i = 0;
    for (const instance of this.windows.values()) {
      instance.node.style.setProperty("z-index", String(this.opts.zFloor + i++));
    }
    return this;
  }
  select = /* @__PURE__ */ __name((e) => {
    const target_node = e.currentTarget;
    const instance = this.windows.get(target_node.id);
    if (!instance) {
      throw new Error("Unable to resolve instance from selected node: " + target_node.id);
    }
    if (this.windows.size > 1) {
      const initialZ = target_node.style.getPropertyValue("z-index");
      target_node.style.setProperty("z-index", String(this.opts.zFloor + this.windows.size));
      if (target_node.dataset["keepZ"] === "true" || this.opts.preserveZ) {
        addEventListener("pointerup", () => target_node.style.setProperty("z-index", initialZ), {
          once: true
        });
      } else {
        this.windows.delete(instance.id);
        this.windows.set(instance.id, instance);
        this.applyZ();
      }
    }
    return this;
  }, "select");
  _resolveOptions(options, defaults = WINDOWMANAGER_DEFAULTS) {
    const opts = {};
    opts.zFloor = options?.zFloor ?? defaults.zFloor;
    opts.preserveZ = options?.preserveZ ?? defaults.preserveZ;
    opts.draggable = resolveOpts(options?.draggable, defaults.draggable);
    opts.resizable = resolveOpts(options?.resizable, defaults.resizable);
    opts.obstacles = options?.obstacles ?? defaults.obstacles;
    opts.bounds = options?.bounds ?? (isObject(options?.draggable) ? options.draggable.bounds : defaults.bounds);
    if (typeof options?.obstacles === "undefined") {
      if (opts.obstacles) {
        if (isObject(opts.draggable)) {
          opts.draggable.obstacles = opts.obstacles;
        }
        if (isObject(opts.resizable)) {
          opts.resizable.obstacles = opts.obstacles;
        }
      }
    } else {
      if (isObject(opts.draggable)) {
        if (typeof opts.draggable.obstacles === "undefined") {
          opts.draggable.obstacles = options.obstacles;
        }
      }
    }
    if (opts.bounds) {
      if (opts.draggable) {
        if (isObject(options?.draggable) && options?.draggable.bounds) {
          opts.draggable.bounds = options.draggable.bounds;
        }
        opts.draggable.bounds = opts.bounds;
      }
      if (opts.resizable) {
        opts.resizable.bounds = opts.bounds;
      }
    }
    if (typeof options?.localStorage !== "undefined") {
      if (options.localStorage === true) {
        opts.localStorage = WINDOWMANGER_STORAGE_DEFAULTS;
      } else if (typeof options.localStorage === "object") {
        opts.localStorage = Object.assign({}, WINDOWMANGER_STORAGE_DEFAULTS, options.localStorage);
        if (isObject(opts.draggable)) {
          if (opts.localStorage.position === false) {
            opts.draggable.localStorageKey = void 0;
          } else {
            opts.draggable.localStorageKey = opts.localStorage.key;
          }
        }
        if (isObject(opts.resizable)) {
          opts.resizable.localStorageKey = opts.localStorage.key;
        }
      }
    }
    return opts;
  }
  /**
  * Dispose of the instance and all windows.
  */
  dispose() {
    this._log.fn("dispose").info(this);
    this._evm?.dispose();
    for (const instance of this.windows.values()) {
      instance?.dispose();
    }
    this.windows.clear();
  }
};
var WindowInstance = class {
  static {
    __name(this, "WindowInstance");
  }
  manager;
  node;
  draggableInstance;
  resizableInstance;
  id;
  position;
  size;
  constructor(manager, node, options) {
    this.manager = manager;
    this.node = node;
    this.position = state({
      x: 0,
      y: 0
    });
    this.size = state({
      width: 0,
      height: 0
    });
    this.id = node.id || options?.id || `wm-instance-${nanoid(8)}`;
    node.id ||= this.id;
    const opts = manager._resolveOptions(options, manager.opts);
    const dragOpts = opts.draggable;
    const resizeOpts = opts.resizable;
    if (options?.localStorage === false) {
      if (dragOpts) dragOpts.localStorageKey = void 0;
      if (resizeOpts) resizeOpts.localStorageKey = void 0;
    } else {
      if (typeof dragOpts === "object" && dragOpts.localStorageKey !== void 0) {
        const dragKeyParts = [];
        if (typeof dragOpts.localStorageKey === "undefined") {
          if (typeof manager.opts.localStorage === "object") {
            dragKeyParts.push(manager.opts.localStorage.key);
          } else {
            dragKeyParts.push(WINDOWMANGER_STORAGE_DEFAULTS.key);
          }
        } else if (dragOpts.localStorageKey) {
          dragKeyParts.push(dragOpts.localStorageKey);
        }
        dragKeyParts.push("wm", `${this.manager.windows.size}`, "position");
        dragOpts.localStorageKey = dragKeyParts.join("::");
      }
      if (typeof resizeOpts === "object" && resizeOpts.localStorageKey !== void 0) {
        const resizeKeyParts = [];
        if (typeof resizeOpts.localStorageKey === "undefined") {
          if (typeof manager.opts.localStorage === "object") {
            resizeKeyParts.push(manager.opts.localStorage.key);
          } else {
            resizeKeyParts.push(WINDOWMANGER_STORAGE_DEFAULTS.key);
          }
        } else if (resizeOpts.localStorageKey) {
          resizeKeyParts.push(resizeOpts.localStorageKey);
        }
        resizeKeyParts.push("wm", `${this.manager.windows.size}`, "size");
        resizeOpts.localStorageKey = resizeKeyParts.join("::");
      }
    }
    this.draggableInstance = new Draggable(node, dragOpts || {
      disabled: true
    });
    this.resizableInstance = new Resizable(node, resizeOpts || {
      disabled: true
    });
    if (opts?.preserveZ) {
      node.dataset["keepZ"] = "true";
    }
  }
  dispose() {
    this.resizableInstance?.dispose();
    this.draggableInstance?.dispose();
  }
};

// src/shared/object.ts
function entries(object) {
  if (typeof object !== "object" || object === null) {
    console.error("Error: Invalid object", object);
    throw new Error("`entries()` util called with invalid object: " + object);
  }
  return Object.entries(object);
}
__name(entries, "entries");
function keys(object) {
  if (typeof object !== "object" && object === null) {
    console.error("Error: Invalid object", object);
    throw new Error("`keys()` util called with invalid object.");
  }
  return Object.keys(object);
}
__name(keys, "keys");
function values(object) {
  if (typeof object !== "object" && object === null) {
    console.error("Error: Invalid object", object);
    throw new Error("`values()` util called with invalid object.");
  }
  return Object.values(object);
}
__name(values, "values");

// src/shared/toFn.ts
function toFn(v) {
  if (typeof v === "function") {
    return v;
  }
  return () => v;
}
__name(toFn, "toFn");

// src/shared/Tooltip.ts
function _ts_decorate(decorators, target, key, desc) {
  var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r2 = (c2 < 3 ? d(r2) : c2 > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c2 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
__name(_ts_decorate, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
var TOOLTIP_DEFAULTS = {
  __type: "TooltipOptions",
  text: "",
  placement: "top",
  anchor: "node",
  delay: 250,
  delayOut: 0,
  offsetX: "0%",
  offsetY: "0%",
  animation: {
    duration: 300,
    durationOut: 150,
    easing: "cubic-bezier(0.23, 1, 0.320, 1)"
  },
  style: void 0,
  hideOnClick: false
};
var Tooltip = class {
  static {
    __name(this, "Tooltip");
  }
  node;
  __type;
  /**
  * The tooltip element itself.
  */
  element;
  /**
  * The parent element of the tooltip.
  */
  parent;
  /**
  * Whether the tooltip is currently showing.
  */
  showing;
  opts;
  _text;
  _evm;
  _animPositions;
  _delayInTimer;
  _delayOutTimer;
  /**
  * removeEventListener callbacks for listeners with particularly short lifecycles.
  */
  // private _tempListeners = new Set<() => void>()
  constructor(node, options) {
    this.node = node;
    this.__type = "Tooltip";
    this.showing = false;
    this._evm = new EventManager();
    this.show = () => {
      if (this.showing) return;
      if (!this.text) return;
      clearTimeout(this._delayInTimer);
      clearTimeout(this._delayOutTimer);
      this._delayInTimer = setTimeout(async () => {
        if (this.element) this.parent?.appendChild(this.element);
        this.showing = true;
        this.element?.animate([
          {
            opacity: "0",
            transform: this._animPositions.from
          },
          {
            opacity: "1",
            transform: this._animPositions.to
          }
        ], {
          duration: this.opts.animation.duration,
          easing: this.opts.animation.easing,
          fill: "forwards"
        });
        this._updatePosition();
        this._maybeWatchAnchor();
      }, this.opts.delay);
    };
    this.hide = () => {
      clearTimeout(this._delayInTimer);
      clearTimeout(this._delayOutTimer);
      this._delayOutTimer = setTimeout(async () => {
        if (this.showing) {
          this.showing = false;
          if (this._watcherId) {
            this._evm.unlisten(this._watcherId);
          }
          await this.element?.animate([
            {
              opacity: "1",
              transform: this._animPositions.to
            },
            {
              opacity: "0",
              transform: this._animPositions.from
            }
          ], {
            duration: this.opts.animation.durationOut,
            easing: this.opts.animation.easing,
            fill: "forwards"
          }).finished;
          this.unmount();
        }
      }, this.opts.delayOut);
    };
    this._mounted = false;
    this._updatePosition = (e) => {
      if (!this.element) return;
      const tooltipRect = this.element.getBoundingClientRect();
      if (this.element.innerHTML !== this.text) {
        this.element.innerHTML = String(this.text);
      }
      if (e?.type === "pointermove") {
        this._mouse = {
          x: e.clientX,
          y: e.clientY
        };
      }
      const anchor = this._getAnchorRects();
      if (!anchor) return;
      let left = 0;
      let top = 0;
      const baseOffset = 4;
      this.element.classList.add("fractils-tooltip-" + this.placement);
      switch (this.placement) {
        case "top":
          left = anchor.x.left + window.scrollX + anchor.x.width / 2 - tooltipRect.width / 2;
          top = anchor.y.top + window.scrollY - tooltipRect.height - baseOffset;
          break;
        case "bottom":
          left = anchor.x.left + window.scrollX + anchor.x.width / 2 - tooltipRect.width / 2;
          top = anchor.y.top + window.scrollY + anchor.y.height + baseOffset;
          break;
        case "left":
          left = anchor.x.left + window.scrollX - tooltipRect.width - baseOffset;
          top = anchor.y.top + window.scrollY + anchor.y.height / 2 - tooltipRect.height / 2;
          break;
        case "right":
          left = anchor.x.left + window.scrollX + anchor.x.width + baseOffset;
          top = anchor.y.top + window.scrollY + anchor.y.height / 2 - tooltipRect.height / 2;
          break;
      }
      const parentRect = this.parent?.getBoundingClientRect();
      if (!parentRect) return;
      this.element.style.left = `calc(${left - parentRect.left}px + ${this.opts.offsetX})`;
      this.element.style.top = `calc(${top - parentRect.top}px + ${this.opts.offsetY})`;
    };
    this._mouse = {
      x: 0,
      y: 0
    };
    this._watchingAnchor = false;
    this._watchingFinished = false;
    this._watchTimeout = void 0;
    const opts = deepMergeOpts([
      TOOLTIP_DEFAULTS,
      options
    ]);
    this.opts = opts;
    this.placement = opts.placement;
    this._text = toFn(opts.text);
    this.parent = options?.parent ?? document.getElementById("svelte") ?? document.body;
    this.element = create("div", {
      classes: [
        "fractils-tooltip"
      ],
      innerHTML: String(this._text()),
      style: options?.style
    });
    if (opts.style) {
      for (const [key, value] of entries(opts.style)) {
        if (key && value) {
          this.element?.style.setProperty(key, value);
        }
      }
    }
    this._evm.listen(node, "pointerenter", this.show);
    this._evm.listen(node, "pointerleave", this.hide);
    this._evm.listen(node, "pointermove", this._updatePosition);
    this._evm.listen(node, "click", () => {
      if (opts.hideOnClick) this.hide();
      else this.refresh();
    });
  }
  refresh() {
    if (!this.element) return;
    this.element.innerHTML = String(this.text);
    setTimeout(() => this._updatePosition(), 0);
    this._maybeWatchAnchor();
    clearTimeout(this._delayInTimer);
    clearTimeout(this._delayOutTimer);
  }
  /**
  * The text to display in the tooltip.  Assigning a new value will update the tooltip text.
  */
  get text() {
    return this._text();
  }
  set text(text) {
    this._text = toFn(text);
    if (!this.element) return;
    this.element.innerHTML = String(this._text());
  }
  get placement() {
    return this.opts.placement;
  }
  set placement(v) {
    this.opts.placement = v;
    switch (v) {
      case "top":
        this._animPositions = {
          from: "translateY(4px)",
          to: "translateY(0)"
        };
        break;
      case "bottom":
        this._animPositions = {
          from: "translateY(-4px)",
          to: "translateY(0)"
        };
        break;
      case "left":
        this._animPositions = {
          from: "translateX(4px)",
          to: "translateX(0)"
        };
        break;
      case "right":
        this._animPositions = {
          from: "translateX(-4px)",
          to: "translateX(0)"
        };
    }
  }
  get offsetX() {
    return this.opts.offsetX;
  }
  set offsetX(v) {
    this.opts.offsetX = v;
    this._updatePosition();
  }
  get offsetY() {
    return this.opts.offsetY;
  }
  set offsetY(v) {
    this.opts.offsetY = v;
    this._updatePosition();
  }
  show;
  hide;
  /**
  * Whether the tooltip is currently mounted to the DOM.
  * @internal
  */
  _mounted;
  mount() {
    if (this._mounted) return;
    this._mounted = true;
    if (this.element) this.parent?.appendChild(this.element);
  }
  unmount() {
    if (!this._mounted) return;
    this._mounted = false;
    if (this.element) this.parent?.removeChild(this.element);
  }
  _updatePosition;
  // todo - mobile touch events support?
  _mouse;
  _getAnchorRects() {
    const getRect = /* @__PURE__ */ __name((anchor) => {
      if (!anchor) return this.node?.getBoundingClientRect();
      switch (typeof anchor) {
        case "string": {
          switch (anchor) {
            case "node": {
              return this.node?.getBoundingClientRect();
            }
            case "mouse": {
              return {
                left: this._mouse.x + window.scrollX,
                top: this._mouse.y + window.scrollY,
                width: 0,
                height: 0
              };
            }
            default: {
              const el = document.querySelector(anchor);
              if (el) {
                return el.getBoundingClientRect();
              } else {
                if (DEV) console.warn("Tooltip anchor not found:", anchor);
                return this.node?.getBoundingClientRect();
              }
            }
          }
        }
        case "object": {
          if (anchor && "x" in anchor && "y" in anchor) {
            return "separate";
          } else if (anchor instanceof HTMLElement) {
            return anchor.getBoundingClientRect();
          } else {
            if (DEV) console.warn("Invalid tooltip anchor:", anchor);
            return this.node?.getBoundingClientRect();
          }
        }
        default: {
          if (DEV) console.warn("Invalid tooltip anchor:", anchor);
          return this.node?.getBoundingClientRect();
        }
      }
    }, "getRect");
    const rect = getRect(this.opts.anchor);
    if (rect === "separate") {
      const x = getRect(this.opts.anchor.x);
      const y2 = getRect(this.opts.anchor.y);
      if (!x || !y2) return void 0;
      return {
        x,
        y: y2
      };
    }
    if (!rect) return void 0;
    return {
      x: rect,
      y: rect
    };
  }
  _watcherId;
  /**
  * Determines if the tooltip should watch any anchors for movement.
  */
  _maybeWatchAnchor() {
    const maybeWatch = /* @__PURE__ */ __name((el) => {
      if (!el) return;
      const anchor = el instanceof HTMLElement ? el : this.node?.querySelector(el) ?? document.querySelector(el);
      const watchAnchor = /* @__PURE__ */ __name(() => {
        if (anchor) {
          this._watch(anchor);
        }
      }, "watchAnchor");
      if (anchor) {
        if (this._watcherId) {
          this._evm.unlisten(this._watcherId);
        }
        this._watcherId = this._evm.listen(anchor, "transitionrun", watchAnchor, {}, "anchor");
      }
    }, "maybeWatch");
    const getAnchor = /* @__PURE__ */ __name((anchor) => {
      if (anchor instanceof HTMLElement) {
        return anchor;
      } else if (typeof anchor === "string") {
        return anchor === "node" ? this.node : anchor === "mouse" ? null : anchor;
      }
      return null;
    }, "getAnchor");
    if (this.opts.anchor && typeof this.opts.anchor === "object" && "x" in this.opts.anchor && "y" in this.opts.anchor) {
      const anchorX = getAnchor(this.opts.anchor.x);
      const anchorY = getAnchor(this.opts.anchor.y);
      if (anchorX === anchorY) {
        maybeWatch(anchorX);
      } else {
        maybeWatch(anchorX);
        maybeWatch(anchorY);
      }
    } else {
      maybeWatch(getAnchor(this.opts.anchor));
    }
  }
  _watchingAnchor;
  _watchingFinished;
  _watchTimeout;
  /**
  * Keeps the tooltip position in sync with the anchor when an anchor's
  * transform is in transition while the tooltip is showing.
  * @todo - watch animation events too?
  */
  _watch(el) {
    if (this._watchingAnchor) {
      return;
    }
    this._watchingFinished = false;
    this._watchingAnchor = true;
    const complete = /* @__PURE__ */ __name(() => {
      this._watchingFinished = true;
      this._watchingAnchor = false;
      this.element?.style.setProperty("transition-duration", "0.1s");
      if (timeout) el.removeEventListener("transitionend", timeout);
    }, "complete");
    const timeout = /* @__PURE__ */ __name(() => {
      if (this._watchingFinished) return;
      complete();
    }, "timeout");
    if (!this.showing) {
      complete();
      return;
    }
    clearTimeout(this._watchTimeout);
    this._watchTimeout = setTimeout(() => {
      if (!this._watchingFinished) {
        complete();
      }
    }, 500);
    el.removeEventListener("transitionend", timeout);
    el.addEventListener("transitionend", timeout);
    if (!this._watchingFinished) {
      this.node?.style.setProperty("transition-duration", "0s");
      tickLoop(() => {
        if (!this._watchingFinished) {
          this._updatePosition();
          return false;
        } else {
          return true;
        }
      });
    }
  }
  dispose() {
    if (this._watchTimeout) {
      clearTimeout(this._watchTimeout);
    }
    this._evm.dispose();
    this.element?.remove();
  }
  static style = (
    /*css*/
    `
		.fractils-tooltip {
			position: absolute;

			min-width: 3rem;
			max-width: auto;
			min-height: auto;
			max-height: auto;
			padding: 4px 8px;

			opacity: 0;
			color: var(--fg-a, #fff);
			background-color: var(--bg-a, #000);
			border-radius: var(--radius-sm, 4px);
			box-shadow: var(--shadow, 0rem 0.0313rem 0.0469rem hsl(var(--shadow-color) / 0.02),
				0rem 0.125rem 0.0938rem hsl(var(--shadow-color) / 0.02),
				0rem 0.1563rem 0.125rem hsl(var(--shadow-color) / 0.025),
				0rem 0.1875rem 0.1875rem hsl(var(--shadow-color) / 0.05),
				0rem 0.3125rem 0.3125rem hsl(var(--shadow-color) / 0.05),
				0rem 0.4375rem 0.625rem hsl(var(--shadow-color) / 0.075));

			text-align: center;
			font-size: var(--font-size-sm, 12px);

			z-index: 1000;
			pointer-events: none;
			transition: opacity 0.1s;
		}

		.fractils-tooltip .fractils-hotkey {
			filter: contrast(1.1);
			background: var(--fractils-hotkey_background, #1118);
			background: var(--fractils-hotkey_background, color-mix(in sRGB, var(--bg-c) 66%, transparent));
			color: var(--fractils-hotkey_color, var(--fg-a, #fff));
			padding: 0px 3px;
			border-radius: 2px;
			box-shadow: 0 0 2px rgba(0, 0, 0, 0.33);
		}

		:root[theme='dark'] .fractils-tooltip .fractils-hotkey {
			background: var(--fractils-hotkey_background, color-mix(in sRGB, var(--bg-d) 100%, transparent));
		}
	`
  );
};
Tooltip = _ts_decorate([
  styled,
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    Object,
    typeof Partial === "undefined" ? Object : Partial
  ])
], Tooltip);
var tooltip = /* @__PURE__ */ __name((node, options) => {
  const tt = new Tooltip(node, options);
  return {
    update(opts) {
      Object.assign(tt.opts, opts);
      tt.refresh();
    },
    destroy() {
      tt.dispose();
    }
  };
}, "tooltip");
function tickLoop(cb) {
  requestAnimationFrame(() => {
    if (!cb()) tickLoop(cb);
  });
}
__name(tickLoop, "tickLoop");

// src/shared/create.ts
function create(tagname, options) {
  const el = globalThis?.document?.createElement(tagname);
  if (options) {
    if (options.classes) el.classList.add(...options.classes);
    if (options.id) el.id = options.id;
    if (options.innerHTML) el.innerHTML = options.innerHTML;
    if (options.textContent) el.textContent = options.textContent;
    if (options.innerText) el.innerText = options.innerText;
    if (options.cssText) el.style.cssText = options.cssText;
    if (options.dataset) Object.assign(el.dataset, options.dataset);
    if (options.value && el instanceof HTMLInputElement) el.value = options.value;
    if (options.type) el.setAttribute("type", options.type);
    if (options.min) el.setAttribute("min", String(options.min));
    if (options.max) el.setAttribute("max", String(options.max));
    if (options.step) el.setAttribute("step", String(options.step));
    if (options.attributes) {
      for (const [key, value] of entries(options.attributes)) {
        el.setAttribute(key, value);
      }
    }
    if (options.style) {
      for (const [key, value] of entries(options.style)) {
        el.style[key] = String(value);
      }
    }
    if (options.variables) {
      for (const [key, value] of entries(options.variables)) {
        el.style.setProperty(key, String(value));
      }
    }
    if (options.parent) options.parent.appendChild(el);
    if (options.tooltip) {
      el.tooltip = {};
      if (options.tooltipInstance) {
        el.tooltip = options.tooltipInstance;
      } else {
        el.tooltip = new Tooltip(el, options.tooltip);
      }
    }
    if (options.children) {
      for (const child of options.children ?? []) {
        if (el === null) throw new Error("This should never happen");
        if (child) {
          el.appendChild(child);
        }
      }
    }
    if (options.onclick) {
      el.addEventListener("click", options.onclick);
    }
  }
  if (DEV) {
    const stack = new Error().stack;
    maybeAddOpenInEditorEventListener(stack, el);
  }
  return el;
}
__name(create, "create");
function maybeAddOpenInEditorEventListener(stack, el) {
  const file = parseFileFromStack(stack);
  if (file) {
    el.addEventListener("contextmenu", (e) => {
      if (e.metaKey && e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        console.log(e.target);
        openFileInEditor(file);
      }
    }, {
      capture: false
    });
  }
}
__name(maybeAddOpenInEditorEventListener, "maybeAddOpenInEditorEventListener");
function openFileInEditor(file) {
  const url = "/__open-in-editor?file=" + file;
  fetch(url).then((response) => {
    console.log(response.status, url);
  }).catch((error) => {
    console.error("Failed to open file in editor:", error);
  });
}
__name(openFileInEditor, "openFileInEditor");
function parseFileFromStack(stack) {
  const stackLine = stack?.split("\n")[2].trim();
  const url_regex = /http:\/\/[^ )]+/;
  const timestamp_regex = /\?t=\d+/;
  const url = stackLine?.match(url_regex)?.[0]?.replace(timestamp_regex, "");
  if (url) {
    try {
      const path = new URL(url).pathname.slice(1);
      return path;
    } catch (e) {
      console.error("Failed to parse file from stack:", e);
    }
  }
  return null;
}
__name(parseFileFromStack, "parseFileFromStack");

// src/shared/decorators/styled.ts
function styled(constructor) {
  return class extends constructor {
    static initialized = false;
    static stylesheet;
    constructor(...args) {
      super(...args);
      if (typeof globalThis.document !== "undefined") {
        const dis = this.constructor;
        if (!dis.style || dis.initialized) {
          return;
        }
        dis.initialized = true;
        dis.stylesheet ??= create("style", {
          parent: document.head,
          innerHTML: dis.style
        });
      } else {
        throw new Error("@styled components can only be used in the browser");
      }
    }
  };
}
__name(styled, "styled");

// src/svg/RenameSVG.ts
function _ts_decorate2(decorators, target, key, desc) {
  var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r2 = (c2 < 3 ? d(r2) : c2 > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c2 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
__name(_ts_decorate2, "_ts_decorate");
function _ts_metadata2(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata2, "_ts_metadata");
var RenameSVG = class {
  static {
    __name(this, "RenameSVG");
  }
  class = "fracgui-icon-rename";
  element;
  classes = [
    this.class,
    "fracgui-icon"
  ];
  constructor() {
    this.element = create("div", {
      classes: this.classes,
      innerHTML: (
        /*html*/
        `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" >
                    <path class="cursor top" fill="none" stroke="currentColor" d="M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1" vector-effect="non-scaling-stroke"></path>
                    <path class="cursor bottom"fill="none" stroke="currentColor" d="M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5" vector-effect="non-scaling-stroke"></path>
                    <rect class="box full" fill="currentColor" stroke="none" x="1" y="8" width="18" height="8" rx="2" vector-effect="non-scaling-stroke"></rect>
                    <path class="cursor middle"fill="none" stroke="currentColor" d="M9 7v10" vector-effect="non-scaling-stroke"></path>
                </svg>
            `.replaceAll(/\t|\n/g, "")
      )
    });
  }
  static style = (
    /*css*/
    `
        .fracgui-icon-rename {
            width: 1.5rem;
            height: 1.5rem;

            margin-right: 0.5rem;
            padding: 0.125rem;

            color: var(--fracgui-controller-dim_color);
            opacity: 0.5;

            transition: opacity 0.15s;

            z-index: 1;
            cursor: pointer;

            pointer-events: all;
        }

        .fracgui-icon-rename:hover {
            opacity: 1;
        }

        .fracgui-icon-rename svg {
            width: 100%;
            height: 100%;

            pointer-events: none;
        }

        .fracgui-icon-rename path {
            color: var(--fracgui-controller-dim_color);
            /* stroke: var(--fracgui-controller-dim_color); */
        }
        .fracgui-icon-rename .cursor {
            transform: translate(2px, 0) scale(1, 0.9);

            transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transition-delay: 0s;
            transition-property: opacity, transform;
            transform-origin: center;
        }
        .fracgui-icon-rename:hover .cursor, .fracgui-icon-rename.active .cursor {
            transform: translate(0, 0);
            transform: translate(0, 0) scale(1, 0.9);
        }
        .fracgui-icon-rename.active .cursor {
            color: var(--fracgui-theme-a);
            animation: blink 1.5s infinite;
            animation-delay: 0.5s;
        }

        @keyframes blink {
            0%, 45%, 80% {
                opacity: 1;
            }
            50%, 75% {
                opacity: 0;
            }
        }

        .fracgui-icon-rename .box {
            color: var(--fracgui-folder-dim_color);

            opacity: 0;
            transform: scale(0);

            transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transition-property: opacity, transform;
            transform-origin: center;
        }
        .fracgui-icon-rename:hover .box, .fracgui-icon-rename.active .box {
            opacity: 0.25;
            transform: scale(1.1);
            color: var(--fracgui-controller_color);
        }
        .fracgui-icon-rename:hover .box {
            transform: scale(1);
        }
        
        .fracgui-icon-rename.disabled {
            opacity: 0;
            pointer-events: none;
            cursor: default;
        }
    `
  );
};
RenameSVG = _ts_decorate2([
  styled,
  _ts_metadata2("design:type", Function),
  _ts_metadata2("design:paramtypes", [])
], RenameSVG);

// src/shared/isType.ts
function isType(value, type) {
  if (typeof value !== "object" || value === null || [
    "object",
    "function"
  ].includes(type)) {
    return typeof value === type;
  }
  return "__type" in value && value["__type"] === type;
}
__name(isType, "isType");

// src/svg/SaveSVG.ts
function _ts_decorate3(decorators, target, key, desc) {
  var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r2 = (c2 < 3 ? d(r2) : c2 > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c2 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
__name(_ts_decorate3, "_ts_decorate");
function _ts_metadata3(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata3, "_ts_metadata");
var SaveSVG = class {
  static {
    __name(this, "SaveSVG");
  }
  element;
  constructor() {
    this.element = create("div", {
      classes: [
        "fracgui-icon-save",
        "fracgui-icon"
      ],
      innerHTML: (
        /*html*/
        `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <g class="Frame">
                        <path class="back-group" fill="currentColor" fill-rule="evenodd" d="M6.127 21A3.496 3.496 0 0 0 9 22.5h10a3.5 3.5 0 0 0 3.5-3.5V9c0-1.19-.593-2.24-1.5-2.873V7.5c.314.418.5.937.5 1.5v10a2.5 2.5 0 0 1-2.5 2.5H9a2.489 2.489 0 0 1-1.5-.5H6.127Z" class="Subtract" clip-rule="evenodd"/>
                        <rect width="16" height="16" x="3" y="3" fill="currentColor" stroke-width="1.5" class="front" rx="2"/>
                        <g class="plus">
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M11 8v7" class="vertical"/>
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M14.5 11.5h-7" class="horizontal"/>
                        </g>
                    </g>
                </svg>
            `.replaceAll(/\t|\n/g, "")
      )
    });
  }
  static style = (
    /*css*/
    `
        .fracgui-icon-save {
            width: 1.5rem;
            height: 1.5rem;

            color: var(--fracgui-controller-dim_color);
            margin-right: 0.25rem;
            opacity: 0.5;

            transition: opacity 0.15s;

            z-index: 1;
            cursor: pointer;
        }

        .fracgui-icon-save:hover {
            opacity: 1;
        }

        .fracgui-icon-save .back-group {
            transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transition-property: opacity, transform;
            transition-delay: 0s;
            
            opacity: 0;
            transform: translate(-0.25rem, -0.25rem);
        }
        .fracgui-icon-save:hover .back-group {
            opacity: 1;
            transition-delay: 0.25s;
            transform: translate(0, 0);
        }

        .fracgui-icon-save .plus {
            transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transition-property: color, transform;
            transform-origin: center;

            transform: scale(1.5);
        }
        .fracgui-icon-save:hover .plus {
            transform: scale(1);
            color: var(--fracgui-bg-a);
        }

        .fracgui-icon-save .front {
            transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transition-property: transform, opacity;

            transform: scale(1.25);
            opacity: 0;
        }
        .fracgui-icon-save:hover .front {
            transform: scale(1);
            opacity: 1;
        }

        .fracgui-icon-save svg {
            width: 100%;
            height: 100%;
        }
    `
  );
};
SaveSVG = _ts_decorate3([
  styled,
  _ts_metadata3("design:type", Function),
  _ts_metadata3("design:paramtypes", [])
], SaveSVG);

// src/PresetManager.ts
var PresetManager = class {
  static {
    __name(this, "PresetManager");
  }
  gui;
  parentFolder;
  __type;
  __version;
  defaultPreset;
  activePreset;
  presets;
  folder;
  _defaultPresetId;
  _defaultPresetTitle;
  _presetSnapshot;
  _presetsInput;
  _manageInput;
  _renamePresetButton;
  _initialized;
  _log;
  constructor(gui, parentFolder, options) {
    this.gui = gui;
    this.parentFolder = parentFolder;
    this.__type = Object.freeze("PresetManager");
    this.__version = Object.freeze("1.0.0");
    this._defaultPresetId = "fracgui-default-preset";
    this._defaultPresetTitle = "default";
    this._initialized = false;
    this._toggleRename = () => {
      if (this._presetsInput.select.elements.selected.getAttribute("contenteditable")) {
        this._handleRename();
      } else {
        this._enableRename();
      }
    };
    this._blurLatch = false;
    this._enableRename = (cursorToEnd = true) => {
      this._log.fn("_enableRename").debug({
        this: this
      });
      const el = this._presetsInput.select.elements.selected;
      if (el.classList.contains("disabled")) {
        this._log.warn("Cannot rename default preset.");
        return;
      }
      if (this._blurLatch) {
        this._blurLatch = false;
        clearTimeout(this._blurLatchTimer);
        return;
      }
      this._renamePresetButton.element.classList.add("active");
      this._presetsInput.select.disableClicks = true;
      el.setAttribute("contenteditable", "true");
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      if (cursorToEnd) {
        range.collapse(false);
      }
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      this.folder.evm.listen(el, "blur", this._handleRename, {}, "preset-manager-rename");
      this.folder.evm.listen(window, "keydown", this._handleKeydown, {}, "preset-manager-rename");
    };
    this._handleRename = (e) => {
      this._log.fn("_disableRename").debug({
        e,
        this: this
      });
      this._presetsInput.select.disableClicks = false;
      this._presetsInput.select.elements.selected.removeAttribute("contenteditable");
      this._renamePresetButton.element.classList.remove("active");
      this.folder.evm.clearGroup("preset-manager-rename");
      if (e?.type === "blur") {
        this._blurLatch = true;
        clearTimeout(this._blurLatchTimer);
        setTimeout(() => {
          this._blurLatch = false;
        }, 300);
        const text = e.target?.textContent ?? "";
        if (text !== this.activePreset.value.title) {
          this._renamePreset(text);
        }
      }
    };
    this._handleKeydown = (e) => {
      this._log.fn("_handleKeydown").debug({
        key: e.key,
        e,
        this: this
      });
      if (e.key === "Enter") {
        e.preventDefault();
        this._handleRename();
      }
      if (e.key === "Escape") {
        this._handleRename();
      }
    };
    this._log = new Logger(`PresetManager ${gui.folder.title}`, {
      fg: "slateblue"
    });
    this._log.fn("constructor").debug({
      options,
      this: this
    });
    this.opts = options;
    this.opts.localStorageKey ??= "fracgui::presets";
    this.activePreset = state(this.opts.defaultPreset ?? {}, {
      key: this.opts.localStorageKey + "::active"
    });
    this.presets = state(this.opts.presets ?? [], {
      key: this.opts.localStorageKey
    });
    if (this.opts.autoInit !== false) {
      this.init();
    }
    if (Object.keys(this.activePreset.value).length && this.activePreset.value.id !== this._defaultPresetId) {
      Promise.resolve().then(() => {
        console.log("loading active preset", this.activePreset.value);
        this.gui.load(this.activePreset.value);
        this.gui._undoManager.clear();
      });
    }
  }
  opts;
  get defaultPresetIsActive() {
    return this.activePreset.value.id === this._defaultPresetId;
  }
  async init() {
    if (this.opts.disabled) {
      this._log.debug("Aborting initialization: disabled by options.");
      return;
    }
    this._initialized = true;
    this.folder = await this.addGui(this.parentFolder, this.opts.defaultPreset);
    return this;
  }
  /**
  * Set the active preset.
  */
  set(value) {
    this._log.fn("set").debug({
      value,
      this: this
    });
    this.activePreset.set(value);
  }
  _renamePreset(title) {
    this._log.fn("_renamePreset").debug({
      this: this,
      title
    });
    if (!this._isInitialized()) throw new Error("PresetManager not initialized.");
    const active = this.activePreset.value;
    this.presets.update((presets) => {
      if (!active) throw new Error("No preset found.");
      if (active.id === this._defaultPresetId) {
        throw new Error("Cannot rename default preset.");
      }
      active.title = title;
      this.activePreset.set(active);
      return presets.map((p) => p.id === active.id ? active : p);
    });
    this._refresh();
  }
  _resolveUnusedTitle(title) {
    this._log.fn("resolveUnusedTitle").debug({
      this: this,
      title
    });
    if (!this._isInitialized()) throw new Error("PresetManager not initialized.");
    const presets = this.presets.value;
    let i = 0;
    let newTitle = title;
    while (presets.some((p) => p.title === newTitle)) {
      i++;
      newTitle = title + ` (${i})`;
    }
    return newTitle;
  }
  _resolveDefaultPreset(defaultPreset) {
    if (!this._isInitialized()) throw new Error("PresetManager not initialized.");
    defaultPreset ??= this.presets.value.find((p) => p.id === this._defaultPresetId);
    if (!defaultPreset) {
      defaultPreset = this.gui.save(this._defaultPresetTitle, this._defaultPresetId);
      this.presets.push(defaultPreset);
    }
    return defaultPreset;
  }
  async addGui(parentFolder, defaultPreset) {
    this._log.fn("add").debug({
      this: this,
      parentFolder,
      defaultPreset
    });
    if (!this._isInitialized()) throw new Error("PresetManager not initialized.");
    await new Promise((r2) => setTimeout(r2, 0));
    const presetsFolder = parentFolder.addFolder("presets", {
      closed: false,
      hidden: false,
      children: []
    });
    presetsFolder.on("mount", () => {
      presetsFolder.graphics?.connector?.svg.style.setProperty("filter", "saturate(0.1)");
      presetsFolder.graphics?.icon.style.setProperty("filter", "saturate(0)");
    });
    this.defaultPreset = defaultPreset ?? this._resolveDefaultPreset();
    if (!Object.keys(this.activePreset.value).length) {
      this.activePreset.set(this.defaultPreset);
    }
    if (!this.activePreset.value) {
      throw new Error("No active preset.");
    }
    if (!this.activePreset.value.id) {
      throw new Error("No active preset id.");
    }
    const download = /* @__PURE__ */ __name((preset) => {
      const title = Array.isArray(preset) ? this.gui.folder.title + " presets" : preset.title;
      const blob = new Blob([
        JSON.stringify(preset, null, 2)
      ], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }, "download");
    const upload = /* @__PURE__ */ __name(() => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e2) => {
          const text = e2.target?.result;
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            for (const preset of data) {
              if (isType(preset, "GuiPreset")) {
                this.put(preset);
              } else {
                console.warn("Invalid preset:", preset);
              }
            }
          } else {
            if (isType(data, "GuiPreset")) {
              this.put(data);
            } else {
              console.warn("Invalid preset:", data);
            }
          }
          this._refresh();
        };
        reader.readAsText(file);
      };
      input.click();
    }, "upload");
    const createIcon = /* @__PURE__ */ __name((name, contents) => (
      /*html*/
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="fracgui-icon fracgui-icon-${name}">${contents}</svg>`
    ), "createIcon");
    this._manageInput = presetsFolder.addButtonGrid({
      value: [
        [
          {
            text: "update",
            id: "update",
            onClick: /* @__PURE__ */ __name(() => {
              const { id, title } = this.activePreset.value;
              const current = this.gui.save(title, id);
              this.put(current);
            }, "onClick"),
            disabled: /* @__PURE__ */ __name(() => this.defaultPresetIsActive, "disabled")
          },
          {
            text: "delete",
            onClick: /* @__PURE__ */ __name(() => {
              let index = void 0;
              this.presets.update((presets) => {
                index = presets.findIndex((p) => p.id === this.activePreset.value.id);
                presets.splice(index, 1);
                return presets;
              });
              this.activePreset.set(this.presets.value[index ?? 0] ?? this.defaultPreset);
              this._refresh();
            }, "onClick"),
            disabled: /* @__PURE__ */ __name(() => this.defaultPresetIsActive, "disabled")
          },
          {
            text: createIcon(
              "copy",
              /*html*/
              `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>`
            ),
            id: "copy",
            tooltip: {
              text: "Copy",
              delay: 0,
              placement: "bottom",
              hideOnClick: true
            },
            style: {
              maxWidth: "1.5rem",
              padding: "0.3rem"
            },
            onClick: /* @__PURE__ */ __name(() => {
              navigator.clipboard?.writeText(JSON.stringify(this.activePreset.value, null, 2));
            }, "onClick"),
            disabled: /* @__PURE__ */ __name(() => this.defaultPresetIsActive, "disabled")
          },
          {
            text: createIcon(
              "paste",
              /*html*/
              `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>`
            ),
            id: "paste",
            tooltip: {
              text: "Paste",
              delay: 0,
              placement: "bottom",
              hideOnClick: true
            },
            style: {
              maxWidth: "1.5rem",
              padding: "0.3rem"
            },
            onClick: /* @__PURE__ */ __name(async ({ button }) => {
              button.disabled = true;
              try {
                const text = await navigator.clipboard.readText();
                console.log(text);
                if (text) {
                  const preset = JSON.parse(text);
                  if (typeof preset === "object" && preset.__type === "GuiPreset") {
                    this.put(preset);
                  }
                }
              } catch (e) {
                console.error(e);
              }
              button.disabled = false;
            }, "onClick"),
            disabled: /* @__PURE__ */ __name(() => this.defaultPresetIsActive, "disabled")
          },
          {
            text: createIcon(
              "download",
              /*html*/
              `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`
            ),
            id: "download",
            tooltip: {
              text: "Download",
              delay: 0,
              placement: "bottom",
              hideOnClick: true
            },
            style: {
              maxWidth: "1.5rem",
              padding: "0.3rem"
            },
            onClick: /* @__PURE__ */ __name(() => {
              download(this.activePreset.value);
            }, "onClick"),
            disabled: /* @__PURE__ */ __name(() => this.defaultPresetIsActive, "disabled")
          },
          {
            text: createIcon(
              "download-all",
              /*html*/
              `<path stroke-linecap="round" stroke-linejoin="round" d="M21 14v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 11v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 17v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path stroke-linecap="round" stroke-linejoin="round" d="m7 8 5 5 5-5" /><path  stroke-linecap="round" stroke-linejoin="round" d="M12 13V1" />`
            ),
            id: "download-all",
            tooltip: {
              text: "Download All",
              delay: 0,
              placement: "bottom",
              hideOnClick: true
            },
            style: {
              maxWidth: "1.5rem",
              padding: "0.3rem"
            },
            onClick: /* @__PURE__ */ __name(() => {
              download(this.presets.value);
            }, "onClick"),
            disabled: /* @__PURE__ */ __name(() => this.presets.value.length <= 1, "disabled")
          },
          {
            id: "upload",
            text: createIcon(
              "upload",
              /*html*/
              `<path stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path stroke-linecap="round" stroke-linejoin="round" d="m17 8-5-5-5 5" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v12" />`
            ),
            tooltip: {
              text: "Upload",
              delay: 0,
              placement: "bottom",
              hideOnClick: true
            },
            style: {
              maxWidth: "1.5rem",
              padding: "0.3rem"
            },
            onClick: /* @__PURE__ */ __name(() => {
              upload();
            }, "onClick")
          }
        ]
      ],
      order: 1,
      resettable: false,
      disabled: /* @__PURE__ */ __name(() => this.defaultPresetIsActive && this.presets.value.length === 1, "disabled")
    });
    this._presetsInput = presetsFolder.addSelect({
      __type: "SelectInputOptions",
      // title: 'active',
      options: this.presets.value,
      labelKey: "title",
      order: -1,
      value: this.activePreset.value,
      resettable: false,
      disabled: /* @__PURE__ */ __name(() => this.defaultPresetIsActive && this.presets.value.length === 1, "disabled")
    });
    this._presetsInput.on("change", ({ value }) => {
      this._log.fn("_presetsInput.on(change)").debug({
        value,
        this: this
      });
      this.gui.load(value);
      this.activePreset.set(value);
      this._refreshInputs();
    });
    this._presetsInput.on("open", () => {
      this._log.fn("_presetsInput.on(open)").debug();
      this._presetSnapshot = this.gui.save("__snapshot__");
    });
    this._presetsInput.on("cancel", () => {
      this._log.fn("_presetsInput.on(cancel)").debug();
      if (this._presetSnapshot) {
        this.gui.load(this._presetSnapshot);
        this._refreshInputs();
      }
    });
    const newPresetButton = new SaveSVG();
    newPresetButton.element.tooltip = new Tooltip(newPresetButton.element, {
      text: "Save",
      delay: 0,
      placement: "bottom",
      // offsetY: '0.1rem',
      hideOnClick: true
    });
    this._presetsInput.listen(newPresetButton.element, "click", () => {
      this._log.fn("newPresetButton.on(click)").debug();
      this.put();
    });
    this._renamePresetButton = new RenameSVG();
    this._renamePresetButton.element.tooltip = new Tooltip(this._renamePresetButton.element, {
      delay: 0,
      placement: "bottom",
      // offsetY: '0.1rem',
      hideOnClick: true,
      text: /* @__PURE__ */ __name(() => {
        if (this._renamePresetButton.element.classList.contains("active")) {
          return ``;
        } else {
          return this.defaultPresetIsActive ? `Can't rename default preset` : `Rename`;
        }
      }, "text")
    });
    this._presetsInput.listen(this._renamePresetButton.element, "click", this._toggleRename);
    this._presetsInput.elements.content.prepend(this._renamePresetButton.element);
    this._presetsInput.elements.content.prepend(newPresetButton.element);
    this._refreshInputs();
    return presetsFolder;
  }
  /**
  * Updates a preset if it exists, adds it as a new preset if not, or creates a new one from the
  * current state and adds it if none is provided.
  */
  put(preset) {
    this._log.fn("saveNewPreset");
    if (!this._isInitialized()) {
      throw new Error("PresetManager not initialized.");
    }
    if (!this._presetsInput) {
      throw new Error("No select input.");
    }
    preset ??= this.gui.save(this._resolveUnusedTitle("preset"), nanoid());
    const existing = this.presets.value.find((p) => p.id === preset.id);
    if (!existing) {
      this._log.debug("pushing preset:", {
        preset,
        existing
      });
      this.presets.push(preset);
    } else {
      this._log.debug("preset exists. replacing with:", {
        preset,
        existing
      });
      this.presets.update((presets) => {
        const index = presets.findIndex((p) => p.id === preset.id);
        presets[index] = preset;
        return presets;
      });
    }
    this.set(preset);
    this._refresh();
    this._enableRename();
  }
  /**
  * Delete a preset.
  */
  delete(preset) {
    this._log.fn("deletePreset").debug({
      this: this,
      preset
    });
    if (!this._isInitialized()) {
      throw new Error("PresetManager not initialized.");
    }
    const id = typeof preset === "string" ? preset : preset.id;
    this.presets.update((presets) => {
      const index = presets.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error(r("Error deleting preset:") + " Preset not found.");
      }
      presets.splice(index, 1);
      return presets;
    });
    this.activePreset.set(this.presets.value[0] ?? this.defaultPreset);
  }
  _isInitialized() {
    return this._initialized;
  }
  _toggleRename;
  /**
  * When the rename button is active, clicking it to disable triggers a blur event which
  * disables it immediately before the click event is triggered, re-enabling it.
  *
  * The latch and timer prevent that from happening.
  */
  _blurLatch;
  _blurLatchTimer;
  /**
  * Disables the dropdown, making the select's text editable.
  */
  _enableRename;
  _handleRename;
  _handleKeydown;
  _refreshInputs() {
    const disableRename = this.defaultPresetIsActive;
    this._renamePresetButton.element.classList.toggle("disabled", disableRename);
    this._renamePresetButton.element.toggleAttribute("disabled", disableRename);
    this._manageInput.refresh();
    this._log.fn("_refreshInputs").debug({
      disableRename,
      this: this
    });
  }
  /**
  * Refresh the presets input.
  */
  _refresh() {
    this._log.fn("_refresh").debug("Refreshing options and setting input.", {
      this: this
    });
    this._presetsInput.options = this.presets.value.map((o2) => ({
      label: o2.title,
      value: o2
    }));
    const activePreset = this.activePreset.value;
    this._presetsInput.set({
      label: activePreset.title,
      value: activePreset
    });
    this._refreshInputs();
  }
  dispose() {
    this._initialized = false;
    this._presetsInput.dispose();
    this._renamePresetButton.element.tooltip.dispose();
    this._renamePresetButton.element.remove;
  }
};

// src/styles/themer/defaultTheme.ts
var defaultTheme_default = resolveTheme({
  title: "default",
  prefix: "themer",
  vars: {
    color: {
      base: {
        "theme-a": "#00bcd4",
        // 'theme-b': '#f8d2c9',
        // 'theme-c': '#ba788a',
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
    }
  }
});

// src/shared/partition.ts
function partition(array, predicate) {
  const left = [];
  const right = [];
  for (const element of array) {
    if (predicate(element)) {
      left.push(element);
    } else {
      right.push(element);
    }
  }
  return [
    left,
    right
  ];
}
__name(partition, "partition");

// src/shared/hexToRgb.ts
function hexToRgb2(hex2) {
  const bigint = parseInt(hex2.replace("#", ""), 16);
  const r2 = bigint >> 16 & 255;
  const g2 = bigint >> 8 & 255;
  const b2 = bigint & 255;
  return [
    r2,
    g2,
    b2
  ].join(", ");
}
__name(hexToRgb2, "hexToRgb");

// src/styles/themer/Themer.ts
var THEMER_DEFAULTS = {
  autoInit: true,
  persistent: true,
  theme: defaultTheme_default,
  themes: [],
  mode: "system",
  localStorageKey: "fractils::themer",
  vars: {}
};
var Themer = class {
  static {
    __name(this, "Themer");
  }
  /**
  * The element to theme.
  */
  node;
  /**
  * The currently active theme.  When `theme.set` is called, the new theme
  * passed in is automatically applied.
  */
  theme;
  /**
  * All themes available to the themer.
  */
  themes;
  /**
  * The title of the currently active {@link theme}.
  *
  * When {@link ThemerOptions.persistent} is `true`, this value is
  * saved to localStorage and used to restore the theme on page load.
  */
  activeThemeTitle;
  /**
  * The current mode ('light', 'dark', or 'system').
  *
  * When this state value is re-assigned with `mode.set`, the current theme
  * is automatically updated.
  *
  * When {@link ThemerOptions.persistent} is `true`, this value is saved
  * to localStorage and used to restore the mode on page load.
  */
  mode;
  /**
  * If provided, theme css vars will be added to the wrapper.
  */
  wrapper;
  _initialized = false;
  _persistent;
  _key;
  _unsubs = [];
  _targets = /* @__PURE__ */ new Set();
  _log;
  constructor(node = "document", options) {
    const opts = deepMergeOpts([
      THEMER_DEFAULTS,
      options
    ]);
    this._key = String(opts.localStorageKey);
    if (opts.wrapper) {
      this.wrapper = opts.wrapper;
    }
    this.node = node === "document" ? document.documentElement : typeof node === "string" ? select(node)[0] ?? document.documentElement : node;
    this._log = new Logger(`themer ${this.node.classList[0]}`, {
      fg: "DarkCyan"
    });
    this._log.fn(g("constructor")).info({
      node,
      opts,
      this: this
    });
    this.theme = state(resolveTheme(opts.theme, opts.vars));
    this.themes = state(opts.themes.map((t) => {
      return resolveTheme(t, opts.vars);
    }));
    this.activeThemeTitle = state(opts.theme.title, {
      key: this._key + "::activeTheme"
    });
    const storedTitle = this.activeThemeTitle.value;
    if (opts.theme.title !== storedTitle) {
      const theme = this.themes.value.find((t) => t.title === storedTitle);
      if (theme) this.theme.set(theme);
    }
    this.mode = state(opts.mode, {
      key: this._key + "::mode"
    });
    this._persistent = opts.persistent ?? true;
    this.#addSub(this.theme, (v) => {
      this._log.fn(o("theme.subscribe")).debug({
        v,
        this: this
      });
      if (this._initialized) {
        this.activeThemeTitle.set(v.title);
        this.applyTheme();
      }
    });
    this.#addSub(this.mode, (v) => {
      this._log.fn(o("mode.subscribe")).debug("v", v, {
        this: this
      });
      if (typeof v === "undefined") throw new Error("Mode is undefined.");
      if (this._initialized) this.applyTheme();
    });
    this._targets.add(this.wrapper ?? this.node.parentElement ?? this.node);
    if (opts.autoInit) {
      this.init();
    }
  }
  #addSub(state2, cb) {
    this._unsubs.push(state2.subscribe((v) => cb(v)));
  }
  init() {
    const themes = this.themes.value;
    const theme = this.theme.value;
    this._log.fn(c("init")).debug({
      theme: this.theme,
      this: this
    });
    if (typeof document === "undefined") return;
    if (this._initialized) return this;
    this._initialized = true;
    if (!themes.find((t) => t.title === theme.title)) {
      this.create(theme, {
        overwrite: true,
        save: false
      });
    }
    this.load()?.applyTheme();
    return this;
  }
  /**
  * The active theme's variables based on the current mode.
  */
  get modeColors() {
    return this.theme.value.vars.color[this.activeMode];
  }
  get baseColors() {
    return this.theme.value.vars.color.base;
  }
  get allColors() {
    return {
      ...this.baseColors,
      ...this.modeColors
    };
  }
  /**
  * The current mode, taking into account the system preferences.
  */
  get activeMode() {
    const _mode = this.mode.value;
    const mode = typeof _mode === "object" && "value" in _mode ? _mode.value : _mode;
    if (mode === "system") {
      return this.#systemPref;
    }
    return mode;
  }
  get #systemPref() {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "dark";
  }
  /**
  * Adds a new theme to the Themer and optionally saves it to localStorage.
  */
  create = /* @__PURE__ */ __name((newTheme, options) => {
    this._log.fn(c("addTheme")).debug({
      newTheme,
      options,
      this: this
    });
    const theme = structuredClone(newTheme);
    const overwrite = options?.overwrite ?? false;
    const save = options?.save ?? true;
    const [dupes, existing] = partition(this.themes.value, (t) => t.title === theme.title);
    const alreadyExists = dupes.length > 0;
    if (!overwrite && alreadyExists) {
      existing.push(structuredClone(dupes[0]));
      let i = 0;
      while (true) {
        const newTitle = `${theme.title} (${i++})`;
        if (!existing.some((t) => t.title === newTitle)) {
          theme.title = newTitle;
          break;
        }
        if (i > 100) {
          this._log.fn(c("addTheme")).debug(r("Runaway loop detected.") + " Aborting.", {
            this: this
          });
          break;
        }
      }
    }
    if (save) this.save();
    return this;
  }, "create");
  delete(themeOrTitle) {
    this._log.fn(c("deleteTheme")).debug({
      themeOrTitle,
      this: this
    });
    const themeTitle = typeof themeOrTitle === "string" ? themeOrTitle : themeOrTitle.title;
    const themes = this.themes.value;
    const theme = themes.find((t) => t.title === themeTitle);
    if (!theme) {
      this._log.error("`themeTitle` not found in `themes` array.", {
        themeTitle,
        this: this
      });
      throw new Error(`Theme not found.`);
    }
    const nextIndex = themes.indexOf(theme) - 1;
    const isActive = this.theme.value.title === themeTitle;
    this.themes.set(this.themes.value.filter((t) => t.title !== themeTitle));
    if (isActive) {
      this.theme.set(themes[nextIndex] ?? themes.at(-1));
    }
    this.save();
    return this;
  }
  /**
  * Resolves a {@link Theme} by title.
  */
  getTheme(themeTitle) {
    return this.themes.value.find((t) => t.title === themeTitle);
  }
  /**
  * Applies the current theme to the document.
  */
  applyTheme = /* @__PURE__ */ __name((targets) => {
    this._log.fn(c("applyTheme")).debug({
      theme: this.theme.value.title,
      targets: this._targets,
      this: this
    });
    if (!("document" in globalThis)) return;
    const theme = this.theme.value;
    if (!theme) {
      this._log.error("theme not found").debug({
        theme,
        this: this
      });
      throw new Error(`Theme not found.`);
    }
    this.#applyStyleProps(theme, targets);
    this.node.setAttribute("theme", theme.title);
    this.node.setAttribute("mode", this.activeMode);
    this.wrapper?.setAttribute("theme", theme.title);
    this.wrapper?.setAttribute("mode", this.activeMode);
    return this;
  }, "applyTheme");
  /**
  * Updates Themer state from JSON.
  */
  fromJSON(json) {
    const isNewTheme = this.theme.value.title !== json.activeTheme;
    let theme = json.themes.find((t) => t.title === json.activeTheme);
    theme ??= this.themes.value.find((t) => t.title === json.activeTheme);
    if (!theme) {
      this._log.error("`activeTheme` not found in `themes` array.", {
        activeTheme: json.activeTheme,
        json,
        this: this
      });
      throw new Error(`Theme not found.`);
    }
    this.themes.set(json.themes);
    this.mode.set(json.mode);
    if (isNewTheme) {
      this.applyTheme();
    }
  }
  /**
  * Serializes the current Themer state to JSON.
  */
  toJSON() {
    return {
      themes: this.themes.value,
      activeTheme: this.theme.value.title,
      mode: this.mode.value
    };
  }
  /**
  * Loads Themer state from localStorage.
  * @returns The JSON that was loaded (if found).
  */
  load = /* @__PURE__ */ __name(() => {
    this._log.fn(c("load")).debug({
      this: this
    });
    if (this._persistent && "localStorage" in globalThis) {
      const json = localStorage.getItem(this._key + "::themer");
      if (json) {
        this.fromJSON(JSON.parse(json));
      }
    }
    return this;
  }, "load");
  /**
  * Saves the current Themer state to localStorage.
  * @returns The JSON that was saved.
  */
  save() {
    this._log.fn(c("save")).debug({
      this: this
    });
    if (!("localStorage" in globalThis)) return;
    if (!this._persistent) return;
    const json = this.toJSON();
    const exists = `${this._key}themer` in localStorage;
    try {
      const identical = exists && JSON.parse(JSON.stringify(json)) === JSON.parse(localStorage.getItem(`${this._key}themer`) || "");
      if (!identical) {
        localStorage.setItem(`${this._key}themer`, JSON.stringify(json));
      }
    } catch (error) {
      console.error(r("Error") + ": Failed to save to localStorage.", {
        error,
        this: this
      });
      throw new Error(`Failed to save to localStorage.`);
    }
    return json;
  }
  /**
  * Removes the current Themer state from localStorage.
  */
  clear() {
    this._log.fn(c("clear")).debug({
      this: this
    });
    if (!("localStorage" in globalThis)) return;
    localStorage.removeItem(`${this._key}themer`);
    this.themes.set([
      defaultTheme_default
    ]);
    this.theme.set(defaultTheme_default);
    this.mode.set("system");
  }
  addTarget(target) {
    this._targets.add(target);
    this.applyTheme([
      target
    ]);
  }
  /**
  * Generates CSS custom properties from a theme config.
  * @param config - The theme config to generate CSS from.
  * @returns A string of CSS custom properties.
  * @internal
  */
  #applyStyleProps = /* @__PURE__ */ __name((themeConfig, targets = this._targets) => {
    const config = themeConfig;
    this._log.fn(c("applyStyleProps")).debug({
      config,
      this: this
    });
    const themeColors = config.vars.color[this.activeMode];
    if (!themeColors) {
      this._log.error("`theme` not found in `config`.", {
        theme: themeColors,
        config,
        "this.activeMode": this.activeMode,
        this: this
      });
      throw new Error(`Theme not found.`);
    }
    const allVars = /* @__PURE__ */ new Map();
    for (const target of targets) {
      for (const [key, value] of entries(config.vars)) {
        if (key === "color") {
          for (const [k, v] of [
            ...entries(value.base),
            ...entries(value[this.activeMode])
          ]) {
            target.style.setProperty(`--${config.prefix}-${k}`, v);
            target.style.setProperty(`--${config.prefix}-${k}-rgb`, hexToRgb2(v));
          }
        } else {
          const x = config.vars[key];
          for (const [mode, vars] of entries(x)) {
            if (mode === "base") {
              for (const [k, v] of entries(vars)) {
                allVars.set(k, v);
              }
            } else if (mode === this.activeMode) {
              for (const [k, v] of entries(vars)) {
                allVars.set(k, v);
              }
            }
          }
        }
      }
      for (const [k, v] of allVars) {
        target.style.setProperty(`--${config.prefix}-${k}`, v);
      }
    }
  }, "#applyStyleProps");
  dispose() {
    for (const unsub of this._unsubs) {
      unsub();
    }
  }
};

// src/svg/settings-icon.ts
var settings_icon_default = `<svg class="settings-icon fracgui-cancel" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26">
  <path class="gear" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4.7c.2-.2.5-.3.7-.3l2.7.2h.4l.3-.1.2-.4 1.1-2.3.6-.5a13 13 0 0 1 6 0l.6.5 1.1 2.3.2.4.3.1h.4l2.7-.2c.2 0 .5.1.7.3 1.4 1.4 2.4 3 3 5 0 .2 0 .5-.2.7l-1.4 2-.3.5v.2l.3.4 1.4 2.1c.2.2.2.5.2.8-.6 1.8-1.6 3.5-3 4.9a1 1 0 0 1-.7.3l-2.7-.2h-.4l-.3.1-.2.4-1.1 2.3a1 1 0 0 1-.6.5 13 13 0 0 1-6 0 1 1 0 0 1-.6-.5l-1.1-2.3-.2-.4-.3-.1h-.4l-2.7.2a1 1 0 0 1-.7-.3c-1.4-1.4-2.4-3-3-5 0-.2 0-.5.2-.7l1.4-2L3 13l-.3-.4-1.4-2.1a.9.9 0 0 1-.2-.8c.6-1.8 1.6-3.5 3-4.9Z" />
  <circle fill="currentColor" class="dot-right" cx="22" cy="13" r="3" />
  <circle class="dot-left" fill="currentColor" cx="4" cy="13" r="3" />
  <circle class="dot-center" fill="currentColor" cx="13" cy="13" r="3" />
</svg>`;

// src/shared/css-custom-properties.ts
function destructureVars(vars, _prefix) {
  const flatVars = {};
  function destructure(o2, prefix = "") {
    for (const [k, v] of entries(o2)) {
      if (typeof v === "object") {
        destructure(v, `${prefix ? prefix + "-" : ""}${k}`);
      } else {
        flatVars[`${prefix ? prefix + "_" : ""}${k}`] = v;
      }
    }
  }
  __name(destructure, "destructure");
  destructure(vars);
  return flatVars;
}
__name(destructureVars, "destructureVars");

// src/styles/GUI_VARS.ts
var VAR_PREFIX = "fracgui";
var GUI_VARS_UTILITY = {
  base: {
    "font-family": "'fredoka', sans-serif",
    "font-size": "clamp(0.75rem, 3vw, 1rem)",
    "shadow-lightness": "0%",
    "shadow-opacity": "0.2",
    "shadow-color": `hsla(250, 10%, var(--${VAR_PREFIX}-shadow-lightness), var(--${VAR_PREFIX}-shadow-opacity))`,
    "radius-xs": "0.125rem",
    "radius-sm": "0.1875rem",
    radius: "0.3125rem",
    "radius-md": "0.4375rem",
    filter: "none",
    opacity: "0.95",
    "transition-duration": "75ms",
    "backdrop-filter": "blur(10px)"
  },
  dark: {},
  light: {
    "shadow-lightness": "50%",
    "shadow-opacity": "0.1"
  }
};
var GUI_VARS_STRUCTURED = {
  base: {
    root: {
      width: "30rem",
      "min-width": "25rem",
      "max-width": "35rem",
      "max-height": "90vh",
      opacity: "0.5",
      "backdrop-filter": "blur(0.5rem)",
      header: {
        height: "1.75rem"
      }
    },
    header: {
      height: "1.75rem"
    },
    folder: {
      background: `color-mix(in sRGB, color-mix(in sRGB, var(--${VAR_PREFIX}-bg-a) 50%, var(--${VAR_PREFIX}-bg-b)) calc(var(--${VAR_PREFIX}-opacity) * 100%), transparent)`,
      header: {
        "padding-left": "0.25rem",
        color: `var(--${VAR_PREFIX}-fg-c)`,
        dim: {
          color: `var(--${VAR_PREFIX}-fg-d)`
        },
        background: `var(--${VAR_PREFIX}-bg-a)`,
        outline: "none",
        "box-shadow": "none",
        "font-size": `var(--${VAR_PREFIX}-font-size)`,
        "font-weight": "350",
        "letter-spacing": "0.75px"
      },
      content: {
        "padding-left": "0.33rem",
        "font-weight": "350",
        "letter-spacing": "0.5px"
      }
    },
    toolbar: {
      icon: {
        color: `var(--${VAR_PREFIX}-bg-d)`,
        dim: {
          color: `var(--${VAR_PREFIX}-bg-c)`
        }
      }
    },
    controller: {
      "font-family": "'inconsolata', 'Comic Mono', 'Fira Code', monospace",
      "font-size": "clamp(0.75rem, 3vw, 0.9rem)",
      "border-radius": `var(--${VAR_PREFIX}-radius-sm)`,
      "box-shadow": `-1px 1px 2px hsla(250, 10%, var(--${VAR_PREFIX}-shadow-lightness), calc(0.7 * var(--${VAR_PREFIX}-shadow-opacity))), -1px 2px 5px hsla(250, 10%, var(--${VAR_PREFIX}-shadow-lightness), var(--${VAR_PREFIX}-shadow-opacity))`,
      background: `var(--${VAR_PREFIX}-bg-c)`,
      outline: `1px solid color-mix(in sRGB, var(--${VAR_PREFIX}-bg-d) 40%, transparent)`,
      color: `var(--${VAR_PREFIX}-fg-b)`,
      dim: {
        color: `var(--${VAR_PREFIX}-fg-c)`,
        background: `color-mix(in sRGB, color-mix(in sRGB, var(--${VAR_PREFIX}-bg-c) 75%, var(--${VAR_PREFIX}-bg-b)) calc(var(--${VAR_PREFIX}-opacity) * 100%), transparent)`
      }
    },
    input: {
      height: "2rem",
      "section-1": {
        width: "clamp(6rem, 30%, 12rem)"
      },
      "section-2": {
        width: "4rem"
      },
      "section-3": {
        width: "100%"
      },
      "font-size": `'clamp(0.75rem, 3vw, 0.9rem)'`,
      container: {
        color: `var(--${VAR_PREFIX}-fg-d)`,
        outline: `1px solid color-mix(in sRGB, var(--${VAR_PREFIX}-bg-a) 20%, transparent)`,
        "box-shadow": `-0.15px 0.1px 1px hsla(220, 10%, 2%, calc(0.8 * var(--${VAR_PREFIX}-shadow-opacity))) inset, -2px 2px 15px hsla(220, 10%, 2%, calc(0.075 * var(--${VAR_PREFIX}-shadow-opacity))) inset, -3.0px 3px 25px hsla(220, 10%, 2%, calc(0.05 * var(--${VAR_PREFIX}-shadow-opacity))) inset, -10.0px 10px 50px hsla(220, 10%, 2%, calc(0.025 * var(--${VAR_PREFIX}-shadow-opacity))) inset`,
        background: `color-mix(in sRGB, var(--${VAR_PREFIX}-bg-a) calc(var(--${VAR_PREFIX}-opacity) * 100%), transparent)`
      },
      number: {
        range: {
          color: `var(--${VAR_PREFIX}-bg-c)`,
          background: `var(--${VAR_PREFIX}-bg-a)`,
          outline: `1px solid color-mix(in sRGB, var(--${VAR_PREFIX}-bg-c) 0%, transparent)`,
          "box-shadow": `-2px 2px 2.5px hsla(230, 20%, 0%, 0.2), 2px 2px 5px hsla(230, 20%, 0%, 0.2), 2px 3px 10px hsla(230, 20%, 0%, 0.2), 2px 4px 4px hsla(230, 25%, 0%, 0.2)`
        }
      }
    }
  },
  dark: {},
  light: {
    controller: {
      outline: `1px solid color-mix(in sRGB, var(--${VAR_PREFIX}-bg-d) 10%, transparent)`,
      background: `color-mix(in sRGB, var(--${VAR_PREFIX}-bg-a) calc(var(--${VAR_PREFIX}-opacity) * 100%), transparent)`,
      color: `var(--${VAR_PREFIX}-fg-a)`,
      dim: {
        background: `color-mix(in sRGB, var(--${VAR_PREFIX}-bg-a) calc(var(--${VAR_PREFIX}-opacity) * 100%), transparent)`,
        color: `var(--${VAR_PREFIX}-fg-c)`
      }
    },
    input: {
      number: {
        range: {
          background: `var(--${VAR_PREFIX}-bg-b)`,
          color: `var(--${VAR_PREFIX}-bg-d)`,
          "box-shadow": `-2px 2px 2px hsla(230, 20%, 30%, 0.1), 2px 2px 3px hsla(230, 20%, 30%, 0.1), 2px 2px 7px hsla(230, 20%, 30%, 0.1)`
        }
      }
    }
  }
};
var GUI_VARS = {
  color: default_default.vars.color,
  utility: GUI_VARS_UTILITY,
  core: {
    base: destructureVars(GUI_VARS_STRUCTURED.base, VAR_PREFIX),
    dark: destructureVars(GUI_VARS_STRUCTURED.dark, VAR_PREFIX),
    light: destructureVars(GUI_VARS_STRUCTURED.light, VAR_PREFIX)
  }
};

// src/UndoManager.ts
var UndoManager = class {
  static {
    __name(this, "UndoManager");
  }
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
  constructor() {
  }
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
  undo = /* @__PURE__ */ __name(() => {
    if (this.pointer === -1) {
      return;
    }
    this._lockedInternally = true;
    const commit = this.stack[this.pointer];
    if (commit.setter) {
      commit.setter(commit.from);
    } else {
      commit.target.set(commit.from);
    }
    this.pointer--;
  }, "undo");
  redo = /* @__PURE__ */ __name(() => {
    if (this.pointer + 1 > this.stack.length - 1) {
      return;
    }
    this._lockedInternally = true;
    const commit = this.stack[this.pointer + 1];
    if (commit.setter) {
      commit.setter(commit.to);
    } else {
      commit.target.set(commit.to);
    }
    this.pointer++;
  }, "redo");
  clear() {
    this.stack = [];
    this.pointer = -1;
  }
};

// src/controllers/ButtonController.ts
var BUTTON_INPUT_DEFAULTS = {
  __type: "ButtonControllerOptions",
  text: /* @__PURE__ */ __name(() => "click me", "text"),
  onClick: /* @__PURE__ */ __name(() => void 0, "onClick"),
  id: void 0,
  disabled: false,
  style: void 0,
  tooltip: void 0,
  active: false,
  element: void 0,
  parent: void 0
};
var ButtonController = class _ButtonController {
  static {
    __name(this, "ButtonController");
  }
  __type = "ButtonController";
  static is(v) {
    return v?.__type === "ButtonController" && v instanceof _ButtonController;
  }
  _text;
  _active = /* @__PURE__ */ __name(() => false, "_active");
  _disabled = /* @__PURE__ */ __name(() => false, "_disabled");
  element;
  _evm = new EventManager([
    "change",
    "refresh",
    "click"
  ]);
  on = this._evm.on.bind(this._evm);
  _log = new Logger("ButtonController", {
    fg: "coral"
  });
  parent;
  constructor(options) {
    const opts = Object.assign({}, BUTTON_INPUT_DEFAULTS, options);
    this._log.fn("constructor").debug({
      opts,
      this: this
    });
    this.element = opts.element ? opts.element : create("button", {
      id: opts.id ?? nanoid(8),
      classes: [
        "fracgui-controller",
        "fracgui-controller-button"
      ],
      parent: opts.parent
    });
    this.text = opts.text;
    this.active = opts.active;
    if (typeof opts.disabled !== "undefined") this.disabled = opts.disabled;
    this._evm.listen(this.element, "click", this.click);
    if (opts.onClick) {
      this._evm.on("click", opts.onClick);
    }
  }
  get text() {
    return this._text();
  }
  set text(value) {
    this._text = toFn(value);
    this.element.innerHTML = this._text();
  }
  get active() {
    return this._active();
  }
  set active(value) {
    if (typeof value === "undefined") return;
    this._active = toFn(value);
    this.element.classList.toggle("active", this._active());
  }
  /**
  * Set this to `true` to disable the button.  If a function is assigned, it will be called
  * whenever the button is refreshed.
  */
  get disabled() {
    return this._disabled();
  }
  set disabled(value) {
    if (typeof value === "undefined") return;
    this._disabled = toFn(value);
    this._disabled() ? this.disable() : this.enable();
  }
  /**
  * Update the button with new options.
  */
  set(options) {
    Object.assign(this, options);
    this._evm.emit("change", this);
    this.refresh();
  }
  click = /* @__PURE__ */ __name((e) => {
    this._log.fn("click").debug({
      this: this
    });
    this._evm.emit("click", {
      e,
      button: this
    });
    this.refresh();
  }, "click");
  enable = /* @__PURE__ */ __name(() => {
    if (this.disabled) return this.disabled = false;
    this.element.classList.remove("disabled");
    this.element.removeAttribute("disabled");
    return this;
  }, "enable");
  disable = /* @__PURE__ */ __name(() => {
    if (!this.disabled) return this.disabled = true;
    this.element.classList.add("disabled");
    this.element.setAttribute("disabled", "true");
    return this;
  }, "disable");
  refresh = /* @__PURE__ */ __name(() => {
    this.element.toggleAttribute("disabled", this.disabled);
    this.element.classList.toggle("disabled", this.disabled);
    this.element.innerHTML = this.text;
    this.element.classList.toggle("active", this.active);
    this._evm.emit("refresh");
    return this;
  }, "refresh");
  dispose() {
    this.element.remove();
    this._evm.dispose();
  }
};

// src/inputs/Input.ts
var INPUT_TYPE_MAP = Object.freeze({
  InputText: "TextInputOptions",
  InputTextArea: "TextAreaInputOptions",
  InputNumber: "NumberInputOptions",
  InputColor: "ColorInputOptions",
  InputSelect: "SelectInputOptions",
  InputButton: "ButtonInputOptions",
  InputButtonGrid: "ButtonGridInputOptions",
  InputSwitch: "SwitchInputOptions"
});
var INPUT_TYPES = Object.freeze(keys(INPUT_TYPE_MAP));
var INPUT_OPTION_TYPES = Object.freeze(values(INPUT_TYPE_MAP));
var Input = class {
  static {
    __name(this, "Input");
  }
  folder;
  opts;
  /**
  * Unique identifier for the input. Also used for saving and loading presets.
  * @default `<folder_title>:<input_type>:<input_title>`
  */
  id;
  /**
  * Whether the input was initialized with a bind target/key.
  * @default false
  */
  bound;
  /**
  * All HTMLElement's created by this input.
  */
  elements;
  /**
  * Whether the controllers should bubble their events up to the input and it's listeners.
  * If false, the next update will be silent, after which the flag will be reset to true.
  */
  bubble;
  _title;
  _index;
  // #firstUpdate = true
  _disabled;
  _hidden;
  /**
  * Prevents the input from registering commits to undo history until
  * {@link unlock} is called.
  */
  _undoLock;
  /**
  * The commit object used to store the initial value of the input when
  * {@link lock} is called.
  */
  lockCommit;
  /**
  * The input's {@link EventManager}.
  */
  _dirty;
  _evm;
  listen;
  on;
  __log;
  constructor(options, folder) {
    this.folder = folder;
    this.bound = false;
    this.elements = {
      controllers: {}
    };
    this.bubble = false;
    this._title = "";
    this._undoLock = false;
    this.lockCommit = {};
    this._evm = new EventManager([
      "change",
      "refresh"
    ]);
    this.listen = this._evm.listen.bind(this._evm);
    this.on = this._evm.on.bind(this._evm);
    this.lock = (from = this.state.value) => {
      this._undoLock = true;
      this.lockCommit.from = from;
      this.__log.fn(o("lock")).debug("lockCommit:", this.lockCommit);
    };
    this.unlock = (commit) => {
      this.__log.fn(o("unlock")).debug("commit", {
        commit,
        lockCommit: this.lockCommit
      });
      commit ??= {};
      commit.target ??= this;
      commit.to ??= this.state.value;
      commit.from ??= this.lockCommit.from;
      this._undoLock = false;
      this.commit(commit);
    };
    this.opts = options;
    this.opts.saveable ??= true;
    this.opts.resettable ??= true;
    this.id = this.opts.presetId ?? `${folder.presetId}_${this.opts.title}__${this.opts.__type}`;
    this.__log = new Logger(`SuperInput${this.opts.__type.replaceAll(/Options|Input/g, "")} ${this.opts.title}`, {
      fg: "skyblue"
    });
    this.__log.fn("super constructor").debug({
      options,
      this: this
    });
    this._title = this.opts.title ?? "";
    this._disabled = toFn(this.opts.disabled ?? false);
    this._hidden = toFn(this.opts.hidden ?? false);
    this._index = this.opts.order ?? this.folder.inputs.size;
    this._index += 1;
    this._dirty = () => this.value !== this.initialValue;
    this.elements.container = create("div", {
      classes: [
        "fracgui-input-container"
      ],
      parent: this.folder.elements.content
    });
    if (!this.title) {
      this.element.style.setProperty("--fracgui-input-section-1_width", "0px");
    }
    this.elements.drawerToggle = create("div", {
      classes: [
        "fracgui-input-drawer-toggle"
      ],
      parent: this.elements.container
    });
    this.elements.title = create("div", {
      classes: [
        "fracgui-input-title"
      ],
      parent: this.elements.container,
      textContent: this.title
    });
    this.elements.content = create("div", {
      classes: [
        "fracgui-input-content"
      ],
      parent: this.elements.container
    });
    this.elements.resetBtn = create("div", {
      classes: [
        "fracgui-input-reset-btn"
      ],
      // parent: this.elements.content,
      parent: this.elements.title,
      tooltip: {
        text: "Reset",
        placement: "left",
        delay: 0
      },
      onclick: /* @__PURE__ */ __name(() => {
        this.__log.fn("reset").debug("resetting to initial value", this.initialValue);
        this.set(this.initialValue);
      }, "onclick")
    });
    this.elements.drawer = create("div", {
      classes: [
        "fracgui-input-drawer"
      ],
      parent: this.elements.content
    });
    this._evm.listen(this.elements.drawerToggle, "click", () => {
      console.warn("todo");
    });
    if ("onChange" in options) {
      this._evm.on("change", options.onChange);
    }
    Promise.resolve().then(() => {
      this.index = this.index;
    });
  }
  get value() {
    return this.state.value;
  }
  /**
  * The title displayed on this Input's label.
  */
  get title() {
    return this._title;
  }
  set title(v) {
    this._title = v;
    this.elements.title.textContent = v;
  }
  /**
  * The main Element.  Usually a container div for the rest of the Input's
  * {@link Input.elements|`elements`}.
  */
  get element() {
    return this.elements.container;
  }
  get index() {
    return this._index;
  }
  set index(v) {
    this._index = v;
    this.elements.container.style.order = v.toString();
  }
  get undoManager() {
    return this.folder.gui?._undoManager;
  }
  /**
  * Whether the input is disabled.  A function can be used to dynamically determine the
  * disabled state.
  */
  get disabled() {
    return this._disabled();
  }
  set disabled(v) {
    this._disabled = toFn(v);
    this._disabled() ? this.disable() : this.enable();
  }
  /**
  * Completely hides the Input from view when set to `true`.
  */
  get hidden() {
    return this.elements.container.classList.contains("hidden");
  }
  set hidden(v) {
    this._hidden = toFn(v);
    this.elements.container.classList.toggle("hidden", this._hidden());
  }
  /**
  * Wether the current state value differs from the initial state value.
  * @internal
  */
  get dirty() {
    return this._dirty();
  }
  resolveState(opts) {
    if (opts.binding) {
      const s = state(opts.binding.target[opts.binding.key]);
      this._evm.add(s.subscribe((v) => {
        opts.binding.target[opts.binding.key] = v;
      }));
      return s;
    } else {
      return state(opts.value);
    }
  }
  resolveInitialValue(opts) {
    const value = opts.binding ? opts.binding.target[opts.binding.key] : opts.value;
    return isState(value) ? value.value : value;
  }
  /**
  * Called from subclasses at the end of their `set` method to emit the `change` event.
  */
  _emit(event, v = this.state.value) {
    if (this.opts.resettable) {
      this.elements.resetBtn.classList.toggle("dirty", this._dirty());
    }
    this._evm.emit(event, v);
    if (event === "change") {
      this.folder.evm.emit("change", this);
    }
    return this;
  }
  /**
  * Prevents the input from registering undo history, storing the initial
  * for the eventual commit in {@link unlock}.
  */
  lock;
  /**
  * Unlocks commits and saves the current commit stored in lock.
  */
  unlock;
  /**
  * Commits a change to the input's value to the undo manager.
  */
  commit(commit) {
    commit.from ??= this.state.value;
    commit.target ??= this;
    if (this._undoLock) {
      this.__log.fn("commit").debug("prevented commit while locked");
      return;
    }
    this.__log.fn("commit").debug("commited", commit);
    this.undoManager?.commit(commit);
  }
  /**
  * Enables the input and any associated controllers.
  */
  enable() {
    this._disabled = toFn(false);
    return this;
  }
  /**
  * Disables the input and any associated controllers. A disabled input's state can't be
  * changed or interacted with.
  */
  disable() {
    this._disabled = toFn(true);
    return this;
  }
  /**
  * Refreshes the value of any controllers to match the current input state.
  */
  refresh(v = this.state.value) {
    if (!this.opts.resettable) return;
    if (this.opts.binding) {
      this.state.set(this.opts.binding.target[this.opts.binding.key]);
    }
    this.elements.resetBtn.classList.toggle("dirty", this._dirty());
    this._evm.emit("refresh", v);
    return this;
  }
  save(overrides = {}) {
    if (this.opts.saveable !== true) {
      throw new Error("Attempted to save unsaveable Input: " + this.title);
    }
    const preset = {
      __type: INPUT_TYPE_MAP[this.__type],
      title: this.title,
      value: this.state.value,
      disabled: this.disabled,
      presetId: this.id,
      hidden: this.hidden,
      order: this.index,
      resettable: this.opts.resettable ?? true
    };
    this.__log.fn("save").debug(preset);
    return Object.assign(preset, overrides);
  }
  load(json) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    this.id = data.presetId;
    this.disabled = data.disabled;
    this.hidden = data.hidden;
    this.initialValue = data.value;
    this.set(data.value);
  }
  dispose() {
    this.__log.fn("dispose").debug(this);
    this._evm.dispose();
    const rm = /* @__PURE__ */ __name((elOrObj) => {
      if (elOrObj instanceof HTMLElement || elOrObj instanceof SVGElement) {
        elOrObj.remove();
      } else if (typeof elOrObj === "object") {
        for (const k in elOrObj) {
          rm(elOrObj[k]);
        }
      }
    }, "rm");
    rm(this.elements);
  }
};

// src/inputs/InputButtonGrid.ts
var BUTTONGRID_INPUT_DEFAULTS = {
  __type: "ButtonGridInputOptions",
  value: [
    [
      {
        text: "",
        onClick: /* @__PURE__ */ __name(() => {
        }, "onClick")
      }
    ]
  ],
  style: {
    gap: "0.5em"
  },
  activeOnClick: false,
  resettable: false
};
var InputButtonGrid = class extends Input {
  static {
    __name(this, "InputButtonGrid");
  }
  __type = "InputButtonGrid";
  initialValue = {};
  state = state({});
  buttons = /* @__PURE__ */ new Map();
  buttonGrid;
  _log;
  constructor(options, folder) {
    const opts = Object.assign({}, BUTTONGRID_INPUT_DEFAULTS, options);
    super(opts, folder);
    this._evm.registerEvents([
      "click"
    ]);
    this.initialValue = opts.value;
    this._log = new Logger(`InputButtonGrid ${opts.title}`, {
      fg: "cyan"
    });
    this._log.fn("constructor").debug({
      opts,
      this: this
    });
    const container = create("div", {
      classes: [
        "fracgui-input",
        "fracgui-input-buttongrid-container"
      ],
      parent: this.elements.content
    });
    this.elements.controllers = {
      container,
      buttonGrid: []
    };
    this.buttonGrid = this.toGrid(this.initialValue);
    this.refresh();
  }
  onClick(callback) {
    this._evm.on("click", () => callback(this.state.value));
  }
  /**
  * Converts a {@link ButtonGridArrays} into a a grid of {@link HTMLButtonElement}
  * elements, and
  *
  * - appends them to the {@link InputButtonGrid.elements.controllers.container}
  */
  toGrid(grid) {
    const instanceGrid = [];
    const rows = grid.length;
    const cols = Math.max(...grid.map((row) => row.length));
    for (const { element } of this.buttons.values()) {
      element.remove();
    }
    this.buttons.clear();
    for (let i = 0; i < rows; i++) {
      const row = create("div", {
        classes: [
          "fracgui-controller-buttongrid-row"
        ],
        parent: this.elements.controllers.container,
        style: {
          gap: "0.5em"
        }
      });
      instanceGrid[i] = [];
      for (let j = 0; j < cols; j++) {
        const opts = grid[i]?.[j];
        if (opts) {
          const button = this.addButton(opts, opts.id ?? nanoid(8), i, j);
          row.appendChild(button.element);
          instanceGrid[i][j] = button;
        }
      }
    }
    this.elements.container.style.setProperty(
      "height",
      // getComputedStyle(this.elements.controllers.container).height,
      getStyle(this.elements.controllers.container, "height")
    );
    return instanceGrid;
  }
  addButton(opts, id, i, j) {
    const text = toFn(opts.text);
    const tooltip2 = opts.tooltip ? Object.assign({
      placement: "top",
      delay: 1e3
    }, opts.tooltip) : void 0;
    opts.element = create("button", {
      id,
      classes: [
        "fracgui-controller",
        "fracgui-controller-button",
        "fracgui-controller-buttongrid-button"
      ],
      innerHTML: text(),
      dataset: {
        id,
        row: String(i),
        col: String(j)
      },
      style: {
        ...opts.style,
        width: "100%"
      },
      tooltip: tooltip2
    });
    const btn = new ButtonController(opts);
    if (typeof opts.active !== "function") {
      if (this.opts.activeOnClick) {
        btn.active = () => {
          return this.state.value === btn;
        };
      }
    }
    btn.on("click", ({ button }) => {
      this.set(button);
    });
    this.buttons.set(id, btn);
    return btn;
  }
  set(button) {
    this.state.set(button);
    this._emit("click", button);
    this.refresh();
  }
  refresh() {
    this._log.fn("refresh").debug({
      this: this
    });
    for (const btn of this.buttons.values()) {
      btn.refresh();
    }
    super.refresh();
    return this;
  }
  enable() {
    for (const btn of this.buttons.values()) {
      btn.enable();
    }
    super.enable();
    return this;
  }
  disable() {
    for (const btn of this.buttons.values()) {
      btn.disable();
    }
    super.disable();
    return this;
  }
  dispose() {
    for (const btn of this.buttons.values()) {
      btn.dispose();
    }
    this.buttons.clear();
    super.dispose();
  }
};

// src/inputs/InputSwitch.ts
var SWITCH_INPUT_DEFAULTS = {
  __type: "SwitchInputOptions",
  value: true,
  labels: {
    true: {
      state: "on",
      verb: "Enable"
    },
    false: {
      state: "off",
      verb: "Disable"
    }
  }
};
var InputSwitch = class extends Input {
  static {
    __name(this, "InputSwitch");
  }
  __type = "InputSwitch";
  state;
  initialValue;
  #log;
  constructor(options, folder) {
    const opts = Object.assign({}, SWITCH_INPUT_DEFAULTS, options);
    super(opts, folder);
    this.#log = new Logger(`InputSwitch ${opts.title}`, {
      fg: "cyan"
    });
    this.#log.fn("constructor").debug({
      opts,
      this: this
    });
    if (opts.binding) {
      this.initialValue = opts.binding.target[opts.binding.key];
      this.state = state(!!this.initialValue);
      this._evm.add(this.state.subscribe((v) => {
        opts.binding.target[opts.binding.key] = v;
      }));
    } else {
      this.initialValue = opts.value;
      this.state = state(!!opts.value);
    }
    const container = create("div", {
      classes: [
        "fracgui-input-switch-container"
      ],
      parent: this.elements.content
    });
    const input = create("button", {
      classes: [
        "fracgui-controller",
        "fracgui-controller-switch"
      ],
      parent: container,
      tooltip: {
        text: /* @__PURE__ */ __name(() => {
          return (this.state.value ? opts.labels?.false.verb : opts.labels?.true.verb) || "";
        }, "text"),
        anchor: ".fracgui-controller-switch-thumb",
        delay: 750
      }
    });
    const thumb = create("div", {
      classes: [
        "fracgui-controller-switch-thumb"
      ],
      parent: input
    });
    const stateText = create("div", {
      classes: [
        "fracgui-controller-switch-state-text"
      ],
      parent: container,
      innerText: this.state.value ? opts.labels?.true.state : opts.labels?.false.state,
      style: {
        opacity: "0.75"
      }
    });
    this.elements.controllers = {
      container,
      input,
      thumb,
      stateText
    };
    this._evm.listen(this.elements.controllers.input, "click", () => this.set());
    this._evm.add(this.state.subscribe(this.refresh.bind(this)));
  }
  set(v = !this.state.value) {
    this.#log.fn("set").debug({
      v,
      this: this
    });
    if (typeof v === "boolean") {
      this.undoManager?.commit({
        // @ts-expect-error - ¯\_(ツ)_/¯
        target: this,
        from: this.state.value,
        to: v
      });
      this.state.set(v);
    } else {
      throw new Error(`InputBoolean.set() received an invalid value: ${JSON.stringify(v)} (${typeof v})`);
    }
    this._emit("change", v);
    return this;
  }
  refresh(v = this.state.value) {
    this.#log.fn("refresh").debug({
      v,
      this: this
    });
    if (this.disabled) return this;
    this.elements.controllers.input.classList.toggle("active", v);
    this.elements.controllers.input?.tooltip?.refresh();
    this.elements.controllers.stateText.innerText = (this.state.value ? this.opts.labels?.true.state : this.opts.labels?.false.state) ?? "";
    this._emit("refresh", v);
    return this;
  }
  enable() {
    this.elements.controllers.input.disabled = false;
    super.enable();
    return this;
  }
  disable() {
    this.elements.controllers.input.disabled = true;
    super.disable();
    return this;
  }
  dispose() {
    super.dispose();
  }
};

// src/inputs/InputButton.ts
var BUTTON_INPUT_DEFAULTS2 = {
  __type: "ButtonInputOptions",
  text: /* @__PURE__ */ __name(() => "click me", "text")
};
var InputButton = class extends Input {
  static {
    __name(this, "InputButton");
  }
  __type = "InputButton";
  initialValue = {};
  state = state({});
  onClick = /* @__PURE__ */ __name(() => {
  }, "onClick");
  button;
  _log;
  constructor(options, folder) {
    const opts = Object.assign({}, BUTTON_INPUT_DEFAULTS2, options, {
      __type: "ButtonInputOptions"
    });
    super(opts, folder);
    this._evm.registerEvents([
      "change",
      "refresh",
      "click"
    ]);
    this._log = new Logger(`InputButton ${opts.title}`, {
      fg: "cyan"
    });
    this._log.fn("constructor").debug({
      opts,
      this: this
    });
    if (opts.value) this.onClick = opts.value;
    else if (opts.onClick) this.onClick = opts.onClick;
    else {
      if (DEV) {
        console.error(`${this.title} created with no onClick function. Use the 'value' or 'onClick' property to assign one.`);
      }
    }
    const container = create("div", {
      classes: [
        "fracgui-input-button-container"
      ],
      parent: this.elements.content
    });
    this.button = new ButtonController({
      text: opts.text,
      onClick: opts.onClick,
      parent: container
    });
    this.elements.controllers = {
      container,
      button: this.button.element
    };
    this._evm.listen(this.elements.controllers.button, "click", this.click.bind(this));
    this._evm.add(this.state.subscribe(this.refresh.bind(this)));
  }
  get text() {
    return this.button.text;
  }
  set text(v) {
    this.button.text = v;
  }
  /**
  * Manually calls the {@link onClick} function.
  */
  click() {
    this.button.click({
      ...new MouseEvent("click"),
      target: this.button.element
    });
  }
  enable() {
    this.button.enable();
    super.enable();
    return this;
  }
  disable() {
    this.button.disable();
    super.disable();
    return this;
  }
  /**
  * Overwrites the
  */
  set = /* @__PURE__ */ __name((v) => {
    if (ButtonController.is(v)) {
      v;
      this.state.set(v);
    }
  }, "set");
  /**
  * Refreshes the button text.
  */
  refresh() {
    this.button.refresh();
    super.refresh();
    return this;
  }
  dispose() {
    this.button.dispose();
    super.dispose();
  }
};

// src/shared/decorators/disableable-class-decorator.ts
function disableable(constructor) {
  let disabled = /* @__PURE__ */ __name(() => false, "disabled");
  return class extends constructor {
    get disabled() {
      return disabled();
    }
    set disabled(value) {
      disabled = toFn(value);
      disabled() ? this.disable() : this.enable();
    }
  };
}
__name(disableable, "disableable");

// src/shared/scrollParent.ts
var isScrollable = /* @__PURE__ */ __name((node) => {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return false;
  }
  const style = getComputedStyle(node);
  return [
    "overflow",
    "overflow-x",
    "overflow-y"
  ].some((propertyName) => {
    const value = style.getPropertyValue(propertyName);
    return value === "auto" || value === "scroll";
  });
}, "isScrollable");
var getScrollParent = /* @__PURE__ */ __name((node) => {
  let currentParent = node.parentElement;
  while (currentParent) {
    if (isScrollable(currentParent)) {
      return currentParent;
    }
    currentParent = currentParent.parentElement;
  }
  return document.scrollingElement || document.documentElement;
}, "getScrollParent");

// src/controllers/Select.ts
function _ts_decorate4(decorators, target, key, desc) {
  var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r2 = (c2 < 3 ? d(r2) : c2 > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c2 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
__name(_ts_decorate4, "_ts_decorate");
function _ts_metadata4(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata4, "_ts_metadata");
var Select = class {
  static {
    __name(this, "Select");
  }
  __type = "Select";
  element;
  _opts;
  elements;
  /**
  * All options in the select controller.
  */
  options;
  /**
  * A map of all options by their (internally generated) id.
  */
  optionMap = /* @__PURE__ */ new Map();
  /**
  * Whether the dropdown is currently visible.
  */
  expanded = false;
  /**
  * The initial selected option.
  */
  initialValue;
  /**
  * The initial options array.
  */
  initialOptions;
  /**
  * When true, clicking clicks will be ignored.
  */
  disableClicks = false;
  /**
  * Used to prevent infinite loops when updating internally.
  */
  bubble = true;
  /**
  * The currently selected option.
  */
  _selected;
  /**
  * The currently selected option preserved when hot-swapping on:hover.
  */
  _currentSelection;
  /**
  * The parent element that the selected element is scrolling in.
  */
  _scrollParent;
  _evm = new EventManager([
    "change",
    "refresh",
    "cancel",
    "open",
    "close"
  ]);
  /**
  * Used to subscribe to {@link SelectInputEvents}.
  */
  on = this._evm.on.bind(this._evm);
  _log;
  constructor(options) {
    const opts = {
      ...options,
      selected: toLabeledOption(options.selected ? options.selected : options.options[0]),
      options: options.options.map((o2) => toLabeledOption(o2)),
      selectOnHover: options.selectOnHover ?? true
    };
    this._opts = opts;
    if (options?.title) {
      this._log = new Logger(`Select ${options.title}`, {
        fg: "burlywood"
      });
    } else {
      this._log = new Logger("Select", {
        fg: "blueviolet"
      });
    }
    this._selected = this._currentSelection = this.initialValue = this._opts.selected;
    this.options = this.initialOptions = this._opts.options;
    const container = create("div", {
      classes: [
        "fracgui-controller-select-container"
      ],
      parent: options.container
    });
    this.element = container;
    const selected = create("div", {
      classes: [
        "fracgui-controller-select-selected"
      ],
      parent: container,
      textContent: String(this.getLabel(this.selected))
    });
    this._evm.listen(selected, "click", () => {
      if (this.disableClicks) {
        return;
      }
      this.toggle();
    });
    const dropdown = create("div", {
      classes: [
        "fracgui-controller-select-dropdown"
      ]
    });
    this.elements = {
      container,
      selected,
      dropdown,
      options: []
    };
    for (const option of this.options) {
      this.add(option);
    }
    this.disabled = this._opts.disabled;
    this._log.fn("constructor").debug({
      opts: this._opts,
      this: this
    });
  }
  /**
  * The currently selected option. Assigning a new value will update the UI.
  */
  get selected() {
    return this._selected;
  }
  set selected(v) {
    this._log.fn("set selected").debug(v);
    const newValue = isState(v) ? toLabeledOption(v.value) : toLabeledOption(v);
    this._selected = newValue;
    this.elements.selected.innerHTML = newValue.label;
    if (!this.bubble) {
      this.bubble = true;
      return;
    }
    this._evm.emit("change", this.selected);
  }
  getLabel(v) {
    if (isState(v)) {
      return v.value.label;
    } else {
      return v.label;
    }
  }
  /**
  * Adds an option to the select controller.
  * @param option The option to add.
  * @returns The id of the added option.
  */
  add(option) {
    const opt = toLabeledOption(option);
    const el = create("div", {
      classes: [
        "fracgui-controller-select-option"
      ],
      parent: this.elements.dropdown,
      innerText: opt.label
    });
    const id = this._evm.listen(el, "click", this.select);
    el.dataset["optionId"] = id;
    this.optionMap.set(id, {
      option: opt,
      element: el
    });
    this.elements.options.push(el);
    this._log.fn("add").debug({
      option,
      added: this.optionMap.get(id),
      id,
      this: this
    });
    return this;
  }
  /**
  * Removes an option from the select controller by id.
  */
  remove(id, autoSelectFallback = false) {
    const found = this.optionMap.get(id);
    if (!found) {
      console.error({
        this: this
      });
      throw new Error("No option found in map for id: " + id);
    }
    const btn = found;
    this._log.fn("remove").debug({
      btn,
      id,
      this: this
    });
    if (autoSelectFallback && JSON.stringify(this.selected.value) === JSON.stringify(btn.option.value)) {
      const nextIndex = this.options.indexOf(btn.option) + 1;
      const fallback = this.options[nextIndex % this.options.length];
      this._log.fn("remove").debug("Auto-selecting fallback btn", {
        fallback,
        btn,
        id,
        this: this
      });
      this.select(fallback, false);
    }
    this.elements.options = this.elements.options.filter((el) => el !== btn.element);
    btn.element.remove();
    this.options = this.options.filter((o2) => o2.label !== btn.option.label);
    this.optionMap.delete(id);
  }
  /**
  * Removes all options and their elements.
  */
  clear() {
    this._log.fn("clear").debug({
      this: this
    });
    for (const id of this.optionMap.keys()) {
      this.remove(id, false);
    }
    this.options = [];
    this.optionMap.clear();
  }
  select = /* @__PURE__ */ __name((v, bubble = true) => {
    if (this.disabled) {
      return this;
    }
    this._log.fn("select").debug("v", v, {
      this: this
    });
    if (v instanceof Event) {
      const target = v.target;
      const id = target.dataset["optionId"];
      if (typeof id !== "string") {
        console.error({
          target
        });
        throw new Error("No option id found on select click");
      }
      const option = this.optionMap.get(id);
      if (!option) {
        console.error({
          target
        });
        throw new Error("No option found in map");
      }
      for (const [, { element }] of this.optionMap) {
        element.classList.toggle("selected", element === option.element);
      }
      this.close();
      this.selected = option.option;
    } else {
      const newValue = toLabeledOption(v);
      if (isState(newValue)) {
        this.selected = newValue.value;
      } else if (isLabeledOption(newValue)) {
        this.bubble = bubble;
        this.selected = newValue;
      } else {
        throw new Error("Invalid value: " + newValue);
      }
    }
    return this;
  }, "select");
  /**
  * Updates the UI to reflect the current state of the source.
  */
  refresh = /* @__PURE__ */ __name(() => {
    this._log.fn("refresh").debug({
      this: this
    });
    this.elements.selected.innerHTML = this.selected.label;
    return this;
  }, "refresh");
  /**
  * Toggles the dropdown's visibility.
  */
  toggle = /* @__PURE__ */ __name(() => {
    this._log.fn("toggle").debug({
      this: this
    });
    if (this.expanded) {
      this._evm.emit("cancel");
      this.close();
    } else {
      this.open();
    }
  }, "toggle");
  // private _groupId = nanoid()
  /**
  * Shows the dropdown.
  */
  open = /* @__PURE__ */ __name(() => {
    this.expanded = true;
    this._opts.input.folder.gui.wrapper.appendChild(this.elements.dropdown);
    this.elements.dropdown.classList.add("expanded");
    this.elements.selected.classList.add("active");
    this.updatePosition();
    this._scrollParent ??= getScrollParent(this.elements.selected);
    this._scrollParent?.addEventListener("scroll", this.updatePosition);
    this._evm.listen(window, "keydown", this._closeOnEscape, {}, "dropdown");
    this._evm.listen(window, "click", this._clickOutside, {}, "dropdown");
    if (this._opts.selectOnHover) {
      this._currentSelection = this.selected;
      for (const [, { option, element }] of this.optionMap) {
        element.classList.toggle("selected", option.label === this.selected.label);
        const select2 = /* @__PURE__ */ __name(() => {
          this._log.fn("on(mouseenter)").debug("currentSelection", {
            option,
            element,
            this: this
          });
          this.select(option);
        }, "select");
        this._evm.listen(element, "mouseenter", select2, {}, "dropdown");
      }
    }
    this._evm.emit("open");
    setTimeout(() => {
      this.elements.dropdown.style.pointerEvents = "all";
    }, 200);
  }, "open");
  /**
  * Positions the dropdown to the selected element.
  */
  updatePosition = /* @__PURE__ */ __name(() => {
    if (!this.expanded) return;
    this.elements.dropdown.style.setProperty("width", "unset");
    this.elements.dropdown.style.setProperty("top", "unset");
    const { dropdown, selected } = this.elements;
    const guiScrollTop = this._opts.input.folder.root.elements.content.scrollTop;
    const { top, left } = selected.getBoundingClientRect();
    this.elements.dropdown.style.setProperty("width", `${Math.max(selected.offsetWidth, dropdown.offsetWidth)}px`);
    this.elements.dropdown.style.setProperty("top", `${top + selected.offsetHeight - guiScrollTop}px`);
    this.elements.dropdown.style.setProperty("left", `${left + selected.offsetWidth / 2 - dropdown.offsetWidth / 2}px`);
  }, "updatePosition");
  /**
  * Hides the dropdown.
  */
  close = /* @__PURE__ */ __name(() => {
    this.expanded = false;
    this.elements.dropdown.classList.remove("expanded");
    this.elements.selected.classList.remove("active");
    this.elements.dropdown.style.pointerEvents = "none";
    this._evm.clearGroup("dropdown");
    this._evm.emit("close");
    setTimeout(() => {
      this.elements.dropdown.remove();
    }, 200);
  }, "close");
  /**
  * Closes the dropdown if the escape key was pressed.  If {@link selectOnHover}
  * is enabled, the current selection will be re-selected to restore the original
  * value.
  */
  _closeOnEscape = /* @__PURE__ */ __name((e) => {
    if (e.key === "Escape") {
      this._cancel();
    }
  }, "_closeOnEscape");
  _clickOutside = /* @__PURE__ */ __name((e) => {
    const path = e.composedPath();
    if (!path.includes(this.elements.selected) && !path.includes(this.elements.dropdown)) {
      this._cancel();
    }
  }, "_clickOutside");
  _cancel() {
    this.close();
    if (this._opts.selectOnHover) {
      this.select(this._currentSelection);
    }
    this._evm.emit("cancel");
  }
  enable() {
    this.elements.selected.classList.remove("disabled");
    this.elements.selected.removeAttribute("disabled");
    return this;
  }
  disable() {
    this.elements.selected.classList.add("disabled");
    this.elements.selected.setAttribute("disabled", "true");
    return this;
  }
  dispose() {
    for (const el of values(this.elements)) {
      if (Array.isArray(el)) {
        el.forEach((e) => e.remove());
      } else el.remove();
    }
    this._scrollParent?.removeEventListener("scroll", this.updatePosition);
    removeEventListener("click", this._clickOutside);
    this._evm.dispose();
  }
};
Select = _ts_decorate4([
  disableable,
  _ts_metadata4("design:type", Function),
  _ts_metadata4("design:paramtypes", [
    typeof SelectInputOptions === "undefined" ? Object : SelectInputOptions
  ])
], Select);
function isLabeledOption(v) {
  return typeof v === "object" && Object.keys(v).length === 2 && "label" in v && "value" in v;
}
__name(isLabeledOption, "isLabeledOption");
function toLabeledOption(v) {
  if (isLabeledOption(v)) return v;
  if ([
    "string",
    "number"
  ].includes(typeof v)) {
    return {
      label: String(v),
      value: v
    };
  }
  if (isState(v)) {
    if (isLabeledOption(v.value)) return v.value;
    return {
      label: String(v.value),
      value: v
    };
  }
  if (v && typeof v === "object") {
    return {
      label: JSON.stringify(v),
      value: v
    };
  }
  console.error("Invalid option:", v, ". Please provide a named option ({ label: string, value: T })and place your value in the `value` property.");
  throw new Error("Missing label:" + JSON.stringify(v), {
    cause: {
      v
    }
  });
}
__name(toLabeledOption, "toLabeledOption");
function fromLabeledOption(v) {
  function rtrn(v2) {
    return v2;
  }
  __name(rtrn, "rtrn");
  if (isLabeledOption(v)) return rtrn(v.value);
  if (isState(v)) {
    const t = v.value;
    if (isLabeledOption(t)) {
      return rtrn(t.value);
    } else {
      return rtrn(t);
    }
  }
  return v;
}
__name(fromLabeledOption, "fromLabeledOption");

// src/inputs/InputSelect.ts
function _ts_decorate5(decorators, target, key, desc) {
  var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r2 = (c2 < 3 ? d(r2) : c2 > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c2 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
__name(_ts_decorate5, "_ts_decorate");
function _ts_metadata5(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata5, "_ts_metadata");
var SELECT_INPUT_DEFAULTS = {
  __type: "SelectInputOptions",
  options: []
};
var InputSelect = class extends Input {
  static {
    __name(this, "InputSelect");
  }
  __type = "InputSelect";
  initialValue;
  state;
  #options;
  set options(v) {
    this._log.fn("set options").debug(v);
    this.#options = toFn(v);
    this.select.clear();
    for (const option of this.#options()) {
      this.select.add(option);
    }
  }
  get options() {
    return this.resolveOptions(this.#options);
  }
  /**
  * The select controller instance.
  */
  select;
  /**
  * A latch for event propagation. Toggled off everytime an event aborted.
  */
  #stopPropagation = true;
  /**
  * The currently selected option as a labeled option.
  */
  labeledSelection;
  _log;
  constructor(options, folder) {
    const opts = Object.assign({}, SELECT_INPUT_DEFAULTS, options, {
      __type: "SelectInputOptions"
    });
    super(opts, folder);
    this._evm.registerEvents([
      "preview",
      "open",
      "close",
      "cancel"
    ]);
    this._log = new Logger(`InputSelect ${opts.title}`, {
      fg: "slategrey"
    });
    this._log.fn("constructor").debug({
      opts,
      this: this
    });
    opts.value ??= opts.binding?.initial ?? fromState(this.targetValue);
    this.initialValue = this.resolveInitialValue(opts);
    this.labeledSelection = {
      value: fromLabeledOption(this.initialValue),
      label: this.resolveInitialLabel(this.initialValue, opts)
    };
    this.#options = this.opts.options;
    this.state = state(this.initialValue);
    const container = create("div", {
      classes: [
        "fracgui-input-select-container"
      ],
      parent: this.elements.content
    });
    this.select = new Select({
      // @ts-expect-error
      input: this,
      container,
      options: this.options,
      selected: this.labeledSelection,
      title: this.title
    });
    this.elements.controllers = {
      container,
      select: this.select.elements
    };
    this.disabled = opts.disabled ?? false;
    this._evm.add(this.state.subscribe((v) => {
      if (!this.select.bubble) return;
      if (this.targetObject) {
        if (isState(this.targetValue)) {
          this._log.fn("updating binding").debug({
            from: this.targetValue.value,
            to: v.value
          });
          this.targetValue.set(v.value);
        } else {
          this.targetValue = v.value;
        }
      }
      if (this.#stopPropagation) {
        this.#stopPropagation = false;
        this._log.fn("state.subscribe").debug("Stopped propagation.  Subscribers will not be notified.");
        return;
      }
      this.set(v);
    }));
    if (options.onChange) {
      this._evm.on("change", (v) => {
        this._log.fn("calling options onChange").debug(v);
        options.onChange?.(toLabeledOption(v));
      });
    }
    this.select.on("change", (v) => {
      this._log.fn("select.onChange").debug(v);
      if (this.#stopPropagation) return;
      this.#stopPropagation = true;
      this.set(v);
    });
    this.listen(this.select.element, "preview", () => {
      this._emit("preview");
    });
    this.listen(this.select.element, "open", () => {
      this._emit("open");
    });
    this.listen(this.select.element, "close", () => {
      this._emit("close");
    });
    this.listen(this.select.element, "cancel", () => {
      this._emit("cancel");
    });
    this._dirty = () => this.value.label !== this.initialValue.label;
    this._log.fn("constructor").debug({
      this: this
    });
  }
  resolveOptions(providedOptions) {
    function isLabeledOptionsArray(v) {
      return isLabeledOption(v[0]);
    }
    __name(isLabeledOptionsArray, "isLabeledOptionsArray");
    let selectOptions = toFn(providedOptions)();
    if (!isLabeledOptionsArray(selectOptions)) {
      if (!this.opts.labelKey) {
        throw new Error("Recieved unlabeled options with no `labelKey` specified.  Please label your options or provide the `labelKey` to use as a label.");
      }
      return selectOptions.map((o2) => ({
        label: o2[this.opts.labelKey],
        value: o2
      }));
    }
    return selectOptions;
  }
  resolveInitialValue(opts) {
    const value = opts.binding ? opts.binding.target[opts.binding.key] : opts.value;
    const v = fromState(value);
    if (!isLabeledOption(v)) {
      if (!opts.labelKey) {
        throw new Error("Cannot resolve initial value.  Please provide a `labelKey` or use labeled options.");
      }
      return {
        label: v[opts.labelKey],
        value: v
      };
    }
    return v;
  }
  resolveInitialLabel(initialValue, opts) {
    const v = isState(initialValue) ? initialValue.value : initialValue;
    if (isLabeledOption(v)) {
      return v.label;
    }
    if (opts.labelKey) {
      return initialValue[opts.labelKey];
    }
    return stringify(v);
  }
  get targetObject() {
    return this.opts.binding?.target;
  }
  get targetKey() {
    return this.opts.binding?.key;
  }
  get targetValue() {
    return this.targetObject?.[this.targetKey];
  }
  set targetValue(v) {
    if (isLabeledOption(v)) v = fromLabeledOption(v);
    this._log.fn("set targetValue").debug(v);
    if (typeof v === "undefined") {
      console.error("Cannot set target value to undefined");
      console.error("this", this);
      throw new Error("Cannot set target value to undefined");
    }
    const to = this.targetObject;
    const tk = this.targetKey;
    if (to && tk) {
      if (isState(to[tk])) {
        to[tk].set(v);
      } else {
        to[tk] = v;
      }
    }
  }
  /**
  * Selects the given {@link LabeledOption} and updates the ui.
  */
  set(value) {
    this._log.fn("set").debug(value);
    this.#stopPropagation = true;
    this.select.select(value, false);
    this.state.set(value);
    this._emit("change", value);
    return this;
  }
  enable() {
    this._log.fn("enable").debug();
    this.select.enable();
    super.enable();
    return this;
  }
  disable() {
    this._log.fn("disable").debug();
    this.select.disable();
    super.disable();
    return this;
  }
  refresh = /* @__PURE__ */ __name(() => {
    const v = this.state.value;
    this._log.fn("refresh").debug({
      v,
      this: this
    });
    if (!this.labeledSelection) {
      throw new Error("Failed to find labeled selection.");
    }
    const newOptions = this.options.filter((o2) => !this.select.options.some((oo) => oo.label === o2.label));
    console.log(newOptions);
    for (const option of newOptions) {
      this.select.add(option);
    }
    this.select.select(this.labeledSelection, false);
    super.refresh();
    return this;
  }, "refresh");
  dispose() {
    super.dispose();
  }
};
InputSelect = _ts_decorate5([
  disableable,
  _ts_metadata5("design:type", Function),
  _ts_metadata5("design:paramtypes", [
    typeof Partial === "undefined" ? Object : Partial,
    typeof Folder === "undefined" ? Object : Folder
  ])
], InputSelect);

// src/svg/chevronSvg.ts
var svgChevron = /* @__PURE__ */ __name(() => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "-2 -2 28 28");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "m18 15-6-6-6 6");
  svg.appendChild(path);
  return svg;
}, "svgChevron");

// src/controllers/NumberButtonsController.ts
var NumberButtonsController = class {
  static {
    __name(this, "NumberButtonsController");
  }
  input;
  opts;
  parent;
  elements;
  constructor(input, opts, parent) {
    this.input = input;
    this.opts = opts;
    this.parent = parent;
    this.elements = {};
    this.elements.container = create("div", {
      classes: [
        "fracgui-input-number-buttons-container"
      ],
      parent
    });
    this.elements.increment = create("div", {
      classes: [
        "fracgui-controller",
        "fracgui-input-number-button",
        "fracgui-input-number-buttons-increment"
      ],
      parent: this.elements.container
    });
    this.elements.increment.appendChild(svgChevron());
    input.listen(this.elements.increment, "pointerdown", this.rampChangeUp.bind(this));
    this.elements.decrement = create("div", {
      classes: [
        "fracgui-controller",
        "fracgui-input-number-button",
        "fracgui-input-number-buttons-decrement"
      ],
      parent: this.elements.container
    });
    const upsideDownChevron = svgChevron();
    upsideDownChevron.setAttribute("style", "transform: rotate(180deg)");
    this.elements.decrement.appendChild(upsideDownChevron);
    input.listen(this.elements.decrement, "pointerdown", this.rampChangeDown.bind(this));
  }
  rampChange(direction = 1) {
    const step = "step" in this.opts ? this.opts.step : 1;
    let delay = 300;
    let stop = false;
    let delta = 0;
    let timeout;
    const change = /* @__PURE__ */ __name(() => {
      clearTimeout(timeout);
      if (stop) return;
      delta += delay;
      if (delta > 1e3) {
        delay /= 2;
        delta = 0;
      }
      this.input.set(this.input.state.value + step * direction);
      timeout = setTimeout(change, delay);
    }, "change");
    const stopChanging = /* @__PURE__ */ __name(() => {
      stop = true;
      window.removeEventListener("pointerup", stopChanging);
      window.removeEventListener("pointercancel", stopChanging);
    }, "stopChanging");
    window.addEventListener("pointercancel", stopChanging, {
      once: true
    });
    window.addEventListener("pointerup", stopChanging, {
      once: true
    });
    change();
  }
  rampChangeUp() {
    this.rampChange(1);
  }
  rampChangeDown() {
    this.rampChange(-1);
  }
};

// src/shared/ua.ts
function getUserAgent(request) {
  if (typeof globalThis.navigator === "undefined" && !request) {
    console.error("Error getting user-agent: Request object is required on the server, but was not provided.");
  }
  return request?.headers.get("user-agent") || globalThis.navigator?.userAgent;
}
__name(getUserAgent, "getUserAgent");
function isPlatform(platform, request) {
  const ua = getUserAgent(request);
  return !!ua?.match(platform);
}
__name(isPlatform, "isPlatform");
function isMac(request) {
  return isPlatform(/mac/i, request) && !isMobile(request);
}
__name(isMac, "isMac");
function isApple(request) {
  return isMac(request) || isIOS(request) || isIPad(request) || isIPadOS(request) || isIPad(request);
}
__name(isApple, "isApple");
function isMobile(request) {
  return isAndroid(request) || isIOS(request) || isIPad(request);
}
__name(isMobile, "isMobile");
function isIOS(request) {
  return isPlatform(/iphone/i, request);
}
__name(isIOS, "isIOS");
function isIPadOS(request) {
  return isIPad(request);
}
__name(isIPadOS, "isIPadOS");
function isIPad(request) {
  return isPlatform(/ipad/i, request);
}
__name(isIPad, "isIPad");
function isAndroid(request) {
  return isPlatform(/android/i, request);
}
__name(isAndroid, "isAndroid");

// src/shared/keys.ts
function modKey(event) {
  return isMac() ? event.metaKey : event.ctrlKey;
}
__name(modKey, "modKey");
function modIcon() {
  return isApple() ? MODIFIER_KEY_DATA.metaKey.mac.icon : MODIFIER_KEY_DATA.ctrlKey.windows.icon;
}
__name(modIcon, "modIcon");
var MODIFIER_KEY_DATA = {
  metaKey: {
    mac: {
      icon: "\u2318",
      name: "command",
      key: "meta"
    },
    windows: {
      icon: "\u229E Win",
      name: "windows",
      key: "win"
    },
    linux: {
      icon: "Super",
      name: "super",
      key: "meta"
    }
  },
  altKey: {
    mac: {
      icon: "\u2325",
      name: "option",
      key: "alt"
    },
    windows: {
      icon: "Alt",
      name: "alt",
      key: "alt"
    },
    linux: {
      icon: "Alt",
      name: "alt",
      key: "alt"
    }
  },
  shiftKey: {
    mac: {
      icon: "\u21E7",
      name: "shift",
      key: "shift"
    },
    windows: {
      icon: "Shift",
      name: "shift",
      key: "shift"
    },
    linux: {
      icon: "Shift",
      name: "shift",
      key: "shift"
    }
  },
  ctrlKey: {
    mac: {
      icon: "\u2303",
      name: "control",
      key: "ctrl"
    },
    windows: {
      icon: "Ctrl",
      name: "control",
      key: "ctrl"
    },
    linux: {
      icon: "Ctrl",
      name: "control",
      key: "ctrl"
    }
  }
};

// src/controllers/NumberController.ts
var NumberController = class {
  static {
    __name(this, "NumberController");
  }
  input;
  opts;
  parent;
  element;
  dragEnabled;
  dragging;
  hovering;
  delta;
  _log;
  constructor(input, opts, parent) {
    this.input = input;
    this.opts = opts;
    this.parent = parent;
    this.dragEnabled = false;
    this.dragging = false;
    this.hovering = false;
    this.delta = 0;
    this.hoverStart = (e) => {
      this._log.fn("hoverStart").debug(e);
      this.hovering = true;
      this.element.classList.add("hovering");
      this.maybeEnableDrag(e);
      this.element.removeEventListener("pointerleave", this.hoverEnd);
      this.element.addEventListener("pointerleave", this.hoverEnd);
      document.removeEventListener("keydown", this.maybeEnableDrag);
      document.addEventListener("keydown", this.maybeEnableDrag);
    };
    this.hoverEnd = (e) => {
      this._log.fn("hoverEnd").debug(e);
      this.hovering = false;
      this.element.classList.remove("hovering");
      this.cancelDrag(e);
      this.element.removeEventListener("pointerleave", this.hoverEnd);
      document.removeEventListener("keydown", this.maybeEnableDrag);
    };
    this.dragKeyHeld = (e) => {
      return modKey(e);
    };
    this.cancelDrag = (e) => {
      this._log.fn("cancelDrag").debug(e);
      this.dragEnabled = e.type === "keyup" ? this.dragKeyHeld(e) : false;
      document.removeEventListener("keyup", this.cancelDrag);
      this.element.removeEventListener("pointerleave", this.cancelDrag);
      this.element.removeEventListener("pointerdown", this.maybeDragStart);
      if (!this.dragEnabled) {
        this.element.style.cursor = this.element.dataset["cursor"] ?? "text";
        if (this.dragging) {
          this.dragEnd();
        }
      }
    };
    this.maybeEnableDrag = (e) => {
      this._log.fn("maybeEnableDrag").debug(e);
      if (this.dragKeyHeld(e)) {
        this.dragEnabled = true;
        document.removeEventListener("keyup", this.cancelDrag);
        document.addEventListener("keyup", this.cancelDrag);
        this.element.removeEventListener("pointerleave", this.cancelDrag);
        this.element.addEventListener("pointerleave", this.cancelDrag);
        this.element.removeEventListener("pointerdown", this.maybeDragStart);
        this.element.addEventListener("pointerdown", this.maybeDragStart);
        this.element.dataset["cursor"] = getStyle(this.element, "cursor");
        this.element.style.cursor = "ns-resize";
      }
    };
    this.maybeDragStart = () => {
      if (this.hovering && this.dragEnabled) {
        this.dragStart();
      }
    };
    this.dragStart = async () => {
      this._log.fn("dragStart").debug();
      this.dragging = true;
      this.element.dispatchEvent(new Event("dragStart"));
      this.element.tooltip.hide();
      this.element.removeEventListener("pointermove", this.drag);
      this.element.addEventListener("pointermove", this.drag);
      document.removeEventListener("pointerup", this.dragEnd);
      document.addEventListener("pointerup", this.dragEnd);
      this.element.classList.add("dragging");
      await this.element.requestPointerLock();
      this.element.blur();
    };
    this.dragEnd = () => {
      this._log.fn("dragEnd").debug();
      this.dragging = false;
      this.element.classList.remove("dragging");
      this.element.removeEventListener("pointermove", this.drag);
      document.removeEventListener("pointerup", this.dragEnd);
      document.exitPointerLock();
      this.element.dispatchEvent(new Event("dragEnd"));
    };
    this.drag = (e) => {
      if (!this.dragging) return;
      const multiplier = e.shiftKey ? 4 : e.altKey ? 0.1 : 1;
      const direction = Math.sign(e.movementY);
      this.delta += Math.abs(e.movementY);
      if (this.delta > +this.element.step) {
        const amount = +this.element.step * multiplier * -direction;
        this.element.value = String(this.element.valueAsNumber + amount);
        direction === -1 ? this.element.stepUp(+this.element.step * multiplier) : this.element.stepDown(+this.element.step * multiplier);
        this.delta = 0;
        this.element.dispatchEvent(new Event("input"));
      }
    };
    this._log = new Logger(`NumberController ${this.input.title}`, {
      fg: "darkgoldenrod"
    });
    this.element = create("input", {
      type: "number",
      classes: [
        "fracgui-controller",
        "fracgui-controller-number"
      ],
      value: String(input.state.value),
      parent,
      tooltip: {
        text: (
          /*html*/
          `Hold <span class="fractils-hotkey">${modIcon()}</span> to drag`
        ),
        placement: "top",
        delay: 1500,
        parent,
        styles: {
          background: "var(--fracgui-bg-a)",
          color: "var(--fracgui-fg-a)",
          "--fractils-hotkey_background": "var(--fracgui-bg-b)",
          "--fractils-hotkey_color": "var(--fracgui-fg-a)"
        }
      }
    });
    if ("step" in opts) {
      this.element.step = String(opts.step);
    }
    input.listen(this.element, "pointerenter", this.hoverStart);
  }
  hoverStart;
  hoverEnd;
  dragKeyHeld;
  cancelDrag;
  maybeEnableDrag;
  maybeDragStart;
  dragStart;
  dragEnd;
  drag;
  dispose() {
    this.element.removeEventListener("pointerenter", this.hoverStart);
    this.element.removeEventListener("pointerleave", this.hoverEnd);
    this.element.removeEventListener("pointermove", this.drag);
    document.removeEventListener("keydown", this.maybeEnableDrag);
    document.removeEventListener("keyup", this.cancelDrag);
    this.element.removeEventListener("pointerleave", this.cancelDrag);
    this.element.removeEventListener("pointerdown", this.maybeDragStart);
    document.removeEventListener("pointerup", this.dragEnd);
    this.element.tooltip.dispose();
    this.element.remove();
  }
};

// src/controllers/number.ts
var rangeController = /* @__PURE__ */ __name((input, opts, parent) => {
  const range = create("input", {
    type: "range",
    classes: [
      "fracgui-controller",
      "fracgui-input-number-range"
    ],
    value: String(input.state.value),
    parent
  });
  if ("min" in opts) range.min = String(opts.min);
  if ("max" in opts) range.max = String(opts.max);
  if ("step" in opts) range.step = String(opts.step);
  input.listen(range, "input", input.set.bind(input));
  return range;
}, "rangeController");

// src/inputs/InputNumber.ts
var NUMBER_INPUT_DEFAULTS = {
  __type: "NumberInputOptions"
};
var InputNumber = class extends Input {
  static {
    __name(this, "InputNumber");
  }
  __type = "InputNumber";
  _log;
  initialValue;
  state;
  dragEnabled = false;
  numberController;
  numberButtonsController;
  constructor(options, folder) {
    const opts = Object.assign({}, NUMBER_INPUT_DEFAULTS, options, {
      __type: "NumberInputOptions"
    });
    let v = opts.binding?.initial ?? opts.value ?? 1;
    opts.value ??= v;
    opts.min ??= v <= 0 ? v * 2 : 0;
    opts.max ??= v <= 0 ? v * -2 : v * 2;
    const step = v / 100;
    opts.step ??= step <= 0.1 ? 1e-3 : 0.1;
    super(opts, folder);
    this._log = new Logger(`InputNumber ${opts.title}`, {
      fg: "cyan"
    });
    this._log.fn("constructor").debug({
      opts,
      this: this
    });
    this.initialValue = this.resolveInitialValue(opts);
    this.state = this.resolveState(opts);
    const container = create("div", {
      classes: [
        "fracgui-input-number-container"
      ],
      parent: this.elements.content
    });
    this.numberController = new NumberController(this, opts, container);
    this.numberButtonsController = new NumberButtonsController(this, opts, container);
    this.elements.controllers = {
      container,
      input: this.numberController.element,
      buttons: this.numberButtonsController.elements,
      range: rangeController(this, opts, container)
    };
    this._evm.add(this.state.subscribe(this.refresh));
    this._evm.listen(this.elements.controllers.range, "pointerdown", this.lock);
    this._evm.listen(this.elements.controllers.range, "pointerup", () => this.unlock());
    this._evm.listen(this.elements.controllers.input, "input", this.set);
    this._evm.listen(this.elements.controllers.input, "dragStart", this.lock);
    this._evm.listen(this.elements.controllers.input, "dragEnd", () => this.unlock());
  }
  set = /* @__PURE__ */ __name((v) => {
    this._log.fn("set").debug(v);
    if (typeof v === "undefined") return;
    let newValue = v;
    if (v instanceof Event && v?.target && "valueAsNumber" in v.target) {
      newValue = v.target.valueAsNumber;
    }
    this.commit({
      to: newValue
    });
    this.state.set(newValue);
    this._emit("change", newValue);
    return this;
  }, "set");
  enable() {
    this._log.fn("enable").debug();
    this.elements.controllers.input.disabled = false;
    super.enable();
    return this;
  }
  disable() {
    this._log.fn("disable").debug();
    this.elements.controllers.input.disabled = true;
    super.disable();
    return this;
  }
  refresh = /* @__PURE__ */ __name(() => {
    const v = this.state.value;
    this._log.fn("refresh").debug(v);
    this.elements.controllers.range.value = String(v);
    this.elements.controllers.input.value = String(v);
    super.refresh(v);
    return this;
  }, "refresh");
  dispose() {
    this._log.fn("dispose").debug();
    super.dispose();
  }
};

// src/shared/color/regex.ts
var CSS_INTEGER = "[-\\+]?\\d+%?";
var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
var PERMISSIVE_MATCH_3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var PERMISSIVE_MATCH_4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var REGEX_FUNCTIONAL_RGB = new RegExp("rgb" + PERMISSIVE_MATCH_3);
var REGEX_FUNCTIONAL_RGBA = new RegExp("rgba" + PERMISSIVE_MATCH_4);
var REGEX_FUNCTIONAL_HSL = new RegExp("hsl" + PERMISSIVE_MATCH_3);
var REGEX_FUNCTIONAL_HSLA = new RegExp("hsla" + PERMISSIVE_MATCH_4);
var HEX_START = "^(?:#?|0x?)";
var HEX_INT_SINGLE = "([0-9a-fA-F]{1})";
var HEX_INT_DOUBLE = "([0-9a-fA-F]{2})";
var REGEX_HEX_3 = new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + "$");
var REGEX_HEX_4 = new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + "$");
var REGEX_HEX_6 = new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + "$");
var REGEX_HEX_8 = new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + "$");

// src/shared/color/conversions/kelvinToRgb.ts
function kelvinToRgb(kelvin) {
  const temp = kelvin / 100;
  let r2;
  let g2;
  let b2;
  if (temp < 66) {
    r2 = 255;
    g2 = -155.25485562709179 - 0.44596950469579133 * (g2 = temp - 2) + 104.49216199393888 * Math.log(g2);
    b2 = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b2 = temp - 10) + 115.67994401066147 * Math.log(b2);
  } else {
    r2 = 351.97690566805693 + 0.114206453784165 * (r2 = temp - 55) - 40.25366309332127 * Math.log(r2);
    g2 = 325.4494125711974 + 0.07943456536662342 * (g2 = temp - 50) - 28.0852963507957 * Math.log(g2);
    b2 = 255;
  }
  return {
    r: clamp(Math.floor(r2), 0, 255),
    g: clamp(Math.floor(g2), 0, 255),
    b: clamp(Math.floor(b2), 0, 255)
  };
}
__name(kelvinToRgb, "kelvinToRgb");

// src/shared/color/conversions/rgbToKelvin.ts
var KELVIN_MIN = 2e3;
var KELVIN_MAX = 4e4;
function rgbToKelvin(rgb) {
  const { r: r2, b: b2 } = rgb;
  const eps = 0.4;
  let minTemp = KELVIN_MIN;
  let maxTemp = KELVIN_MAX;
  let temp;
  while (maxTemp - minTemp > eps) {
    temp = (maxTemp + minTemp) * 0.5;
    const rgb2 = kelvinToRgb(temp);
    if (rgb2.b / rgb2.r >= b2 / r2) {
      maxTemp = temp;
    } else {
      minTemp = temp;
    }
  }
  return temp;
}
__name(rgbToKelvin, "rgbToKelvin");

// src/shared/color/conversions/rgbToHsv.ts
function rgbToHsv(rgb) {
  const r2 = rgb.r / 255;
  const g2 = rgb.g / 255;
  const b2 = rgb.b / 255;
  const max = Math.max(r2, g2, b2);
  const min = Math.min(r2, g2, b2);
  const delta = max - min;
  let hue = 0;
  let value = max;
  let saturation = max === 0 ? 0 : delta / max;
  switch (max) {
    case min:
      hue = 0;
      break;
    case r2:
      hue = (g2 - b2) / delta + (g2 < b2 ? 6 : 0);
      break;
    case g2:
      hue = (b2 - r2) / delta + 2;
      break;
    case b2:
      hue = (r2 - g2) / delta + 4;
      break;
  }
  return {
    h: hue * 60 % 360,
    s: clamp(saturation * 100, 0, 100),
    v: clamp(value * 100, 0, 100)
  };
}
__name(rgbToHsv, "rgbToHsv");

// src/shared/color/conversions/hslToHsv.ts
function hslToHsv(hsl) {
  const l = hsl.l * 2;
  const s = hsl.s * (l <= 100 ? l : 200 - l) / 100;
  const saturation = l + s < 1e-9 ? 0 : 2 * s / (l + s);
  return {
    h: hsl.h,
    s: clamp(saturation * 100, 0, 100),
    v: clamp((l + s) / 2, 0, 100)
  };
}
__name(hslToHsv, "hslToHsv");

// src/shared/color/conversions/hsvToHsl.ts
function hsvToHsl(hsv) {
  const s = hsv.s / 100;
  const v = hsv.v / 100;
  const l = (2 - s) * v;
  const divisor = l <= 1 ? l : 2 - l;
  const saturation = divisor < 1e-9 ? 0 : s * v / divisor;
  return {
    h: hsv.h,
    s: clamp(saturation * 100, 0, 100),
    l: clamp(l * 50, 0, 100)
  };
}
__name(hsvToHsl, "hsvToHsl");

// src/shared/color/conversions/hsvToRgb.ts
function hsvToRgb(hsv) {
  const h = hsv.h / 60;
  const s = hsv.s / 100;
  const v = hsv.v / 100;
  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r2 = [
    v,
    q,
    p,
    p,
    t,
    v
  ][mod];
  const g2 = [
    t,
    v,
    v,
    q,
    p,
    p
  ][mod];
  const b2 = [
    p,
    p,
    t,
    v,
    v,
    q
  ][mod];
  return {
    r: clamp(r2 * 255, 0, 255),
    g: clamp(g2 * 255, 0, 255),
    b: clamp(b2 * 255, 0, 255)
  };
}
__name(hsvToRgb, "hsvToRgb");

// src/shared/color/conversions/parseHexInt.ts
function parseHexInt(str) {
  if (str.length !== 2) throw new Error("Invalid hex string: " + str);
  return parseInt(str, 16);
}
__name(parseHexInt, "parseHexInt");

// src/shared/color/conversions/parseUnit.ts
function parseUnit(str, max) {
  const isPercentage = str.indexOf("%") > -1;
  const num = parseFloat(str);
  return isPercentage ? max / 100 * num : num;
}
__name(parseUnit, "parseUnit");

// src/shared/color/conversions/intToHex.ts
function intToHex(int) {
  return int.toString(16).padStart(2, "0");
}
__name(intToHex, "intToHex");

// src/shared/color/color.ts
var DEFAULT_COLOR = {
  h: 0,
  s: 0,
  v: 0,
  a: 1
};
var Color = class _Color {
  static {
    __name(this, "Color");
  }
  isColor = true;
  #hsva;
  #initialValue;
  /**
  * @param color - The initial color value.
  * The value can be any valid color representation:
  * - A hex string: '#5500ee' | '#5500eeff'
  * - An rgba string: 'rgba(85, 0, 238, 1)' | 'rgba(85, 0, 238, 1.0)'
  * - An hsla string: 'hsla(261, 100%, 47%, 1)' | 'hsla(261, 100%, 47%, 1.0)'
  * - An {@link RgbvColor}: { r: 85, g: 0, b: 238, a: 1 }
  * - An {@link HsvColor}: { h: 261, s: 100, v: 47, a: 1 }
  * - An {@link HslColor}: { h: 261, s: 100, l: 47, a: 1 }
  * - An {@link KelvinColor}: { kelvin: 6500 }
  */
  constructor(color2) {
    this.#hsva = DEFAULT_COLOR;
    if (color2) this.set(color2);
    this.#initialValue = structuredClone(this.#hsva);
    return this;
  }
  /**
  * Sets the Color from any valid {@link ColorValue}.
  */
  set(color2) {
    if (typeof color2 === "string") {
      if (/^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(color2)) {
        this.hexString = color2;
      } else if (/^rgba?/.test(color2)) {
        this.rgbString = color2;
      } else if (/^hsla?/.test(color2)) {
        this.hslString = color2;
      }
    } else if (typeof color2 === "object") {
      if (color2 instanceof _Color) {
        this.hsva = color2.hsva;
      } else if ("r" in color2 && "g" in color2 && "b" in color2) {
        this.rgb = color2;
      } else if ("h" in color2 && "s" in color2 && "v" in color2) {
        this.hsv = color2;
      } else if ("h" in color2 && "s" in color2 && "l" in color2) {
        this.hsl = color2;
      } else if ("kelvin" in color2) {
        this.kelvin = color2.kelvin;
      }
    } else {
      throw new Error("Invalid color value: " + color2);
    }
  }
  /**
  * Shortcut to set a specific channel value.
  * @param format - hsv | hsl | rgb
  * @param channel - Individual channel to set, for example, if format = hsl, chanel = h | s | l
  * @param value - New value for the channel.
  */
  setChannel(format, channel, value) {
    this[format] = {
      ...this[format],
      [channel]: value
    };
  }
  /**
  * Reset color back to its initial value
  */
  reset() {
    this.hsva = this.#initialValue;
  }
  /**
  * Returns a new Color instance with the same values as this one.
  */
  clone() {
    return new _Color(this);
  }
  /** i.e. `{ h: 261, s: 100, v: 47 }` */
  get hsv() {
    const { h, s, v } = this.#hsva;
    return {
      h,
      s,
      v
    };
  }
  // All other setters go through this one.
  set hsv(value) {
    const oldValue = this.#hsva;
    const mergedValue = {
      ...oldValue,
      ...value
    };
    if (this.#hsva.h === mergedValue.h && this.#hsva.s === mergedValue.s && this.#hsva.v === mergedValue.v && this.#hsva.a === mergedValue.a) {
      return;
    }
    this.#hsva = {
      h: Math.round(mergedValue.h),
      s: Math.round(mergedValue.s),
      v: Math.round(mergedValue.v),
      a: mergedValue.a
    };
  }
  /** i.e. `{ h: 261, s: 100, v: 47, a: 1 }` */
  get hsva() {
    return structuredClone(this.#hsva);
  }
  set hsva(value) {
    this.hsv = value;
  }
  /** The value of `H` in `HSVA`. */
  get hue() {
    return this.#hsva.h;
  }
  set hue(value) {
    this.hsv = {
      h: value
    };
  }
  /** The value of `S` in `HSVA`. */
  get saturation() {
    return this.#hsva.s;
  }
  set saturation(value) {
    this.hsv = {
      s: value
    };
  }
  /** The value of `V` in `HSVA`. */
  get value() {
    return this.#hsva.v;
  }
  set value(value) {
    this.hsv = {
      v: value
    };
  }
  /** The value of `L` in `HSLA`. */
  get lightness() {
    return this.hsl.l;
  }
  set lightness(value) {
    this.hsl = {
      ...this.hsl,
      l: value
    };
  }
  get alpha() {
    return this.#hsva.a ?? 1;
  }
  set alpha(value) {
    this.hsv = {
      ...this.hsv,
      a: value
    };
  }
  get kelvin() {
    return rgbToKelvin(this.rgb);
  }
  set kelvin(value) {
    this.rgb = kelvinToRgb(value);
  }
  get red() {
    return this.rgb.r;
  }
  set red(value) {
    this.rgb = {
      ...this.rgb,
      r: value
    };
  }
  /**
  * A float version of the {@link red} channel value as a fraction of 1 (0-1 vs 0-255).
  */
  get r() {
    return this.rgb.r / 255;
  }
  set r(value) {
    this.red = value * 255;
  }
  get green() {
    return this.rgb.g;
  }
  set green(value) {
    this.rgb = {
      ...this.rgb,
      g: value
    };
  }
  /**
  * A float version of the {@link green} channel value as a fraction of 1 (0-1 vs 0-255).
  */
  get g() {
    return this.rgb.g / 255;
  }
  set g(value) {
    this.green = value * 255;
  }
  get blue() {
    return this.rgb.b;
  }
  set blue(value) {
    this.rgb = {
      ...this.rgb,
      b: value
    };
  }
  /**
  * A float version of the {@link blue} channel value as a fraction of 1 (0-1 vs 0-255).
  */
  get b() {
    return this.rgb.b / 255;
  }
  set b(value) {
    this.blue = value * 255;
  }
  /** i.e. `{ r: 85, g: 0, b: 238 }` */
  get rgb() {
    const { r: r2, g: g2, b: b2 } = hsvToRgb(this.#hsva);
    return {
      r: Math.round(r2),
      g: Math.round(g2),
      b: Math.round(b2)
    };
  }
  set rgb(value) {
    this.hsv = {
      ...rgbToHsv(value),
      a: "a" in value ? value.a : 1
    };
  }
  /**
  * A float version of {@link rgb} values as a fraction of 1 (0-1 vs 0-255).
  */
  get rgbf() {
    return {
      r: this.r,
      g: this.g,
      b: this.b
    };
  }
  set rgbf(value) {
    this.rgb = {
      r: value.r,
      g: value.g,
      b: value.b
    };
  }
  /** i.e. `'rgba(85, 0, 238, 1)'` */
  get rgba() {
    return {
      ...this.rgb,
      a: this.alpha
    };
  }
  set rgba(value) {
    this.rgb = value;
  }
  /** i.e. `'hsl(261, 100%, 47%)'` */
  get hsl() {
    const { h, s, l } = hsvToHsl(this.#hsva);
    return {
      h: Math.round(h),
      s: Math.round(s),
      l: Math.round(l)
    };
  }
  set hsl(value) {
    this.hsv = {
      ...hslToHsv(value),
      a: "a" in value ? value.a : 1
    };
  }
  /** i.e. `'hsla(261, 100%, 47%, 1)'` */
  get hsla() {
    return {
      ...this.hsl,
      a: this.alpha
    };
  }
  set hsla(value) {
    this.hsl = value;
  }
  /** i.e. `'rgb(85, 0, 238)'` */
  get rgbString() {
    return `rgb(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b})`;
  }
  set rgbString(value) {
    let match;
    let r2;
    let g2;
    let b2;
    let a = 1;
    if (match = REGEX_FUNCTIONAL_RGB.exec(value)) {
      r2 = parseUnit(match[1], 255);
      g2 = parseUnit(match[2], 255);
      b2 = parseUnit(match[3], 255);
    } else if (match = REGEX_FUNCTIONAL_RGBA.exec(value)) {
      r2 = parseUnit(match[1], 255);
      g2 = parseUnit(match[2], 255);
      b2 = parseUnit(match[3], 255);
      a = parseUnit(match[4], 1);
    } else {
      throw new Error("Invalid rgb string: " + value);
    }
    this.rgb = {
      r: r2,
      g: g2,
      b: b2,
      a
    };
  }
  /** i.e. `'rgba(85, 0, 238, 1)'` */
  get rgbaString() {
    const rgba = this.rgba;
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }
  set rgbaString(value) {
    this.rgbString = value;
  }
  /**
  * Hex string with an alpha channel, i.e. `'#5500eeff'`. Identical to {@link hex8String}.
  */
  get hex() {
    return this.hex8String;
  }
  /** Hex string with no alpha channel, i.e. `'#5500ee'` */
  get hexString() {
    const rgb = this.rgb;
    return `#${intToHex(rgb.r)}${intToHex(rgb.g)}${intToHex(rgb.b)}`;
  }
  set hexString(value) {
    const match = value.match(REGEX_HEX_3) || value.match(REGEX_HEX_4) || value.match(REGEX_HEX_6) || value.match(REGEX_HEX_8);
    if (!match) throw new Error("Invalid hex string");
    const [r2, g2, b2, a = 255] = match.slice(1).map((c2) => parseHexInt(c2.length === 1 ? `${c2}${c2}` : c2));
    this.rgb = {
      r: r2,
      g: g2,
      b: b2,
      a: +a / 255
    };
  }
  get hex8() {
    return this.hex8String;
  }
  /** i.e. `'#5500eeff'` */
  get hex8String() {
    const rgba = this.rgba;
    return `#${intToHex(rgba.r)}${intToHex(rgba.g)}${intToHex(rgba.b)}${intToHex(Math.floor((rgba.a ?? 1) * 255))}`;
  }
  set hex8String(value) {
    this.hexString = value;
  }
  /** i.e. `'rgb(85, 0, 238)'` */
  get hslString() {
    const hsl = this.hsl;
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }
  set hslString(value) {
    const match = REGEX_FUNCTIONAL_HSL.exec(value) || REGEX_FUNCTIONAL_HSLA.exec(value);
    if (!match) throw new Error("Invalid rgb string: " + value);
    const [r2, g2, b2, a = 1] = match.slice(1).map((val, index) => parseUnit(val, index < 3 ? 255 : 1));
    this.rgb = {
      r: r2,
      g: g2,
      b: b2,
      a
    };
  }
  /** i.e. `'hsla(261, 100%, 47%, 1)'` */
  get hslaString() {
    const hsla = this.hsla;
    return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;
  }
  set hslaString(value) {
    this.hslString = value;
  }
  toString() {
    return this.hex8String;
  }
  toJSON() {
    return {
      isColor: true,
      ...this.rgba,
      hex: this.hex8String
    };
  }
};
function isColor(color2) {
  return !!color2.isColor;
}
__name(isColor, "isColor");
function isColorFormat(color2) {
  return typeof parseColorFormat(color2) !== "undefined";
}
__name(isColorFormat, "isColorFormat");
function parseColorFormat(color2) {
  if (typeof color2 === "string") {
    if (color2.match(/^#?[0-9a-fA-F]{6}$/)) {
      return "HexString";
    } else if (color2.match(/^#?[0-9a-fA-F]{8}$/)) {
      return "Hex8String";
    } else if (color2.match(/^rgba?/)) {
      return "RgbaString";
    } else if (color2.match(/^hsla?/)) {
      return "HslaString";
    }
  } else if (typeof color2 === "object") {
    if (color2 instanceof Color) {
      return "Color";
    } else if ("r" in color2 && "g" in color2 && "b" in color2) {
      return "RgbColor";
    } else if ("h" in color2 && "s" in color2 && "v" in color2) {
      return "HsvColor";
    } else if ("h" in color2 && "s" in color2 && "l" in color2) {
      return "HslColor";
    } else if ("kelvin" in color2) {
      return "number";
    }
  }
  return void 0;
}
__name(parseColorFormat, "parseColorFormat");

// src/controllers/color/ColorComponents.ts
function _ts_decorate6(decorators, target, key, desc) {
  var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r2 = (c2 < 3 ? d(r2) : c2 > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c2 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
__name(_ts_decorate6, "_ts_decorate");
function _ts_metadata6(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata6, "_ts_metadata");
var COLOR_PICKER_DEFAULTS = {
  disabled: false
};
var ColorComponents = class {
  static {
    __name(this, "ColorComponents");
  }
  input;
  opts;
  element;
  elements;
  select;
  _evm;
  _mode;
  /**
  * Used to prevent inputs from being refreshed externally after they're updated internally.
  */
  _locked;
  _log;
  constructor(input, options) {
    this.input = input;
    this._evm = new EventManager();
    this._locked = false;
    this.updateMode = (v = this.mode) => {
      this._log.fn(`updateMode`, v).debug();
      this._mode = v;
      if (this.#modeType() === "text") {
        this.elements.text.classList.add("visible");
        for (const [, v2] of entries(this.elements.numbers)) {
          v2.classList.remove("visible");
        }
        this.#refreshText();
      } else {
        this.elements.text.classList.remove("visible");
        for (const [, v2] of entries(this.elements.numbers)) {
          v2.classList.add("visible");
        }
        if (this.mode === "rgba") {
          this.#setProps(this.elements.numbers.a, {
            min: 0,
            max: 255,
            step: 1
          });
          this.#setProps(this.elements.numbers.b, {
            min: 0,
            max: 255,
            step: 1
          });
          this.#setProps(this.elements.numbers.c, {
            min: 0,
            max: 255,
            step: 1
          });
          this.#setProps(this.elements.numbers.d, {
            min: 0,
            max: 1,
            step: 0.01
          });
        }
        if ([
          "hsla",
          "hsva"
        ].includes(this.mode)) {
          this.#setProps(this.elements.numbers.a, {
            min: 0,
            max: 360,
            step: 1
          });
          this.#setProps(this.elements.numbers.b, {
            min: 0,
            max: 100,
            step: 1
          });
          this.#setProps(this.elements.numbers.c, {
            min: 0,
            max: 100,
            step: 1
          });
          this.#setProps(this.elements.numbers.d, {
            min: 0,
            max: 1,
            step: 0.01
          });
        }
        this.elements.select.selected.innerHTML = [
          ...v
        ].map((c2, i) => `<span class="${[
          "a",
          "b",
          "c",
          "d"
        ][i]}">${c2}</span>`).join("");
      }
      this.refresh();
    };
    this.#setProps = (el, props) => {
      this._log.fn(`#setProps`, el, props).debug();
      for (const [k, v] of entries(props)) {
        el[k] = String(v);
      }
    };
    this.#refreshText = () => {
      this.elements.text.value = // @ts-ignore fuck off
      this.color[this.mode.startsWith("hex") ? this.mode + "String" : this.mode];
    };
    this.refresh = () => {
      this._log.fn("refresh").debug();
      const color2 = this.input.state.value.hex8String;
      const mode = this.mode;
      if (this.#lastColor === color2 && mode === this.#lastMode) {
        return this;
      }
      this.#lastColor = color2;
      this.#lastMode = mode;
      if (this._locked) {
        this._locked = false;
        return this;
      }
      if (this.#modeType() === "text") {
        this.#refreshText();
      } else {
        this.elements.numbers.a.value = String(this.a);
        this.elements.numbers.b.value = String(this.b);
        this.elements.numbers.c.value = String(this.c);
        this.elements.numbers.d.value = String(this.d);
      }
      return this;
    };
    const opts = {
      ...COLOR_PICKER_DEFAULTS,
      ...options
    };
    this._log = new Logger(`ColorComponents ${input.title}`, {
      fg: "wheat"
    });
    this.opts = opts;
    this._mode = input.mode;
    const parent = opts.container ?? input.elements.controllers.container;
    const componentsContainer = create("div", {
      classes: [
        "fracgui-input-color-components-container"
      ],
      parent
    });
    this.element = componentsContainer;
    const selectContainer = create("div", {
      classes: [
        "fracgui-input-color-components-select-container"
      ],
      parent: componentsContainer
    });
    this.select = new Select({
      input: this.input,
      // disabled: this.opts.disabled,
      disabled: this.disabled,
      container: selectContainer,
      options: [
        "hex",
        "hex8",
        "rgba",
        "hsla",
        "hsva"
      ]
    });
    this.select.on("change", (v) => {
      this.updateMode(v.value);
    });
    const numbersContainer = create("div", {
      classes: [
        "fracgui-input-color-components-numbers-container"
      ],
      parent: componentsContainer
    });
    const numbers = {
      a: new NumberController(this.input, this.input.opts, numbersContainer).element,
      b: new NumberController(this.input, this.input.opts, numbersContainer).element,
      c: new NumberController(this.input, this.input.opts, numbersContainer).element,
      d: new NumberController(this.input, this.input.opts, numbersContainer).element
    };
    numbers.a.classList.add("a");
    numbers.b.classList.add("b");
    numbers.c.classList.add("c");
    numbers.d.classList.add("d");
    for (const [k, v] of entries(numbers)) {
      const update = /* @__PURE__ */ __name(() => {
        this[k] = +v.value;
        this.input.set(this.color);
      }, "update");
      if (this.#modeType() === "text") {
        v.classList.add("visible");
      }
      this._evm.listen(v, "input", update);
    }
    const text = create("input", {
      classes: [
        "fracgui-controller",
        "fracgui-controller-text",
        "fracgui-input-color-components-text"
      ],
      parent: componentsContainer
    });
    this._evm.listen(text, "change", (e) => {
      const target = e.target;
      let format = parseColorFormat(target.value);
      if (!format) return;
      format = format[0].toLowerCase() + format.slice(1);
      this.input.set(target.value);
    });
    if (this.#modeType() === "text") {
      text.classList.add("visible");
    }
    this.elements = {
      container: componentsContainer,
      title: selectContainer,
      select: this.select.elements,
      numbers,
      text
    };
    this.mode = this._mode;
    if (typeof options?.disabled !== "undefined") {
      this.disabled = options.disabled;
    }
  }
  get color() {
    return this.input.state.value;
  }
  get mode() {
    return this._mode;
  }
  set mode(v) {
    this._log.fn(`set mode`, v).debug();
    this._mode = v;
    this.select.selected = v;
  }
  updateMode;
  #setProps;
  get a() {
    return this.mode === "rgba" ? this.color.rgba.r : this.color.hsla.h;
  }
  set a(v) {
    if (this.mode === "rgba") {
      this.color.red = v;
    } else {
      this.color.hue = v;
    }
    this._locked = true;
    this.input.refresh();
  }
  get b() {
    return this.mode === "rgba" ? this.color.rgba.g : this.color.hsla.s;
  }
  set b(v) {
    if (this.mode === "rgba") {
      this.color.green = v;
    } else {
      this.color.saturation = v;
    }
    this._locked = true;
    this.input.refresh();
  }
  get c() {
    switch (this.mode) {
      case "rgba":
        return this.color.blue;
      case "hsla":
        return this.color.lightness;
      case "hsva":
      default:
        return this.color.value;
    }
  }
  set c(v) {
    if (this.mode === "rgba") {
      this.color.blue = v;
    } else if (this.mode === "hsla") {
      this.color.lightness = v;
    } else if (this.mode === "hsva") {
      this.color.value = v;
    }
    this._locked = true;
    this.input.refresh();
  }
  get d() {
    return this.color.alpha;
  }
  set d(v) {
    this.color.alpha = v;
    this._locked = true;
    this.input.refresh();
  }
  #modeType() {
    if ([
      "rgba",
      "hsla",
      "hsva"
    ].includes(this.mode)) {
      return "numbers";
    }
    return "text";
  }
  #refreshText;
  #lastColor;
  #lastMode;
  refresh;
  disable() {
    if (!this.disabled) this.disabled = true;
    this.select.disable();
    this.elements.text.disabled = true;
    for (const [, v] of entries(this.elements.numbers)) {
      v.disabled = true;
    }
    return this;
  }
  enable() {
    if (this.disabled) this.disabled = false;
    this.select.enable();
    this.elements.text.disabled = false;
    for (const [, v] of entries(this.elements.numbers)) {
      v.disabled = false;
    }
    return this;
  }
  dispose() {
    this.elements.title.remove();
    this.elements.numbers.a.remove();
    this.elements.numbers.b.remove();
    this.elements.numbers.c.remove();
    this.elements.container.remove();
    this.elements.text.remove();
    this.select.dispose();
    this._evm.dispose();
  }
};
ColorComponents = _ts_decorate6([
  disableable,
  _ts_metadata6("design:type", Function),
  _ts_metadata6("design:paramtypes", [
    typeof InputColor === "undefined" ? Object : InputColor,
    typeof Partial === "undefined" ? Object : Partial
  ])
], ColorComponents);

// src/shared/mapRange.ts
var mapRange = /* @__PURE__ */ __name((value, x1, x2, y1, y2) => (value - x1) * (y2 - y1) / (x2 - x1) + y1, "mapRange");

// src/shared/debounce.ts
function debounce(func, duration = 50) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, duration);
  };
}
__name(debounce, "debounce");

// src/controllers/color/ColorPicker.ts
function _ts_decorate7(decorators, target, key, desc) {
  var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r2 = (c2 < 3 ? d(r2) : c2 > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c2 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
__name(_ts_decorate7, "_ts_decorate");
function _ts_metadata7(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata7, "_ts_metadata");
var COLOR_PICKER_DEFAULTS2 = {
  color: "#fff",
  swatches: [],
  handleSize: 10,
  container: void 0,
  disabled: false
};
var ColorPicker = class {
  static {
    __name(this, "ColorPicker");
  }
  input;
  opts;
  elements;
  element;
  _ctx;
  _height;
  _width;
  _resizeObserver;
  _gradientWhite;
  _gradientBlack;
  _dragging;
  _lockCursorPosition;
  _lastColor;
  _log;
  _evm;
  on;
  constructor(input, options) {
    this.input = input;
    this._height = 16 * 3;
    this._width = 256;
    this._dragging = false;
    this._lockCursorPosition = false;
    this._evm = new EventManager([
      "pointerdown",
      "pointerup"
    ]);
    this.on = this._evm.on.bind(this._evm);
    this.enable = () => {
      if (this.disabled) this.disabled = false;
      this.elements.container.classList.remove("fracgui-disabled");
      this.elements.alphaSlider.disabled = false;
      this.elements.hueSlider.disabled = false;
      this.elements.canvas.style.pointerEvents = "auto";
      return this;
    };
    this.disable = () => {
      if (!this.disabled) this.disabled = true;
      this.elements.container.classList.add("fracgui-disabled");
      this.elements.alphaSlider.disabled = true;
      this.elements.hueSlider.disabled = true;
      this.elements.canvas.style.pointerEvents = "none";
      return this;
    };
    this.setAlpha = (e) => {
      this.input.state.value.alpha = Number(e.target.value);
      this.input.refresh();
    };
    this.refresh = () => {
      this._log.fn("refresh").debug();
      const color2 = this.input.state.value;
      if (this._lastColor?.hex === color2.hex8String) return this;
      this._lastColor = color2.clone();
      this.elements.hueSlider.value = String(this.hue);
      this.elements.alphaSlider.value = String(this.alpha);
      this.elements.alphaSlider.style.color = color2.hexString;
      this.draw();
      if (this._lockCursorPosition) {
        this.elements.handle.style.background = color2.hexString;
        this._lockCursorPosition = false;
      } else {
        this._updateHandle();
      }
      return this;
    };
    this.draw = () => {
      this._fill(`hsl(${this.hue}, 100%, 50%)`);
      this._fill(this._gradientWhite);
      this._fill(this._gradientBlack);
    };
    this._pointerUpClickLatch = false;
    this._onPointerDown = (e) => {
      this._log.fn("_onPointerDown").debug();
      this._evm.emit("pointerdown");
      this._dragging = true;
      this._updateFromMousePosition(e);
      addEventListener("pointerup", this._onPointerUp, {
        once: true
      });
    };
    this._onPointerMove = (e) => {
      this._log.fn("_onPointerMove").debug();
      if (this._dragging) {
        this._updateFromMousePosition(e);
      }
    };
    this._onPointerUp = () => {
      this._log.fn("_onPointerUp").debug();
      this._evm.emit("pointerup");
      this._dragging = false;
      this._pointerUpClickLatch = true;
    };
    this._onClick = (e) => {
      this._log.fn("_onClick");
      if (this._pointerUpClickLatch) {
        this._log.debug("Click latch triggered. Aborting.");
        this._pointerUpClickLatch = false;
        return;
      }
      this._log.debug();
      this._updateFromMousePosition(e);
      this._dragging = false;
    };
    this._getColorAtPosition = (x, y2) => {
      this._log.fn("_getColorAtPosition").debug();
      const { width, height } = this.canvas.getBoundingClientRect();
      const r2 = this.opts.handleSize / 3;
      return {
        s: mapRange(x, r2, width - r2, 0, 100),
        v: mapRange(y2, r2, height - r2, 100, 0)
      };
    };
    this._updateStateFromHue = (e) => {
      this._log.fn("_updateStateFromHue").debug();
      this._lockCursorPosition = true;
      const hue = Number(e.target.value);
      const { s, v, a } = this.input.state.value.hsva;
      this.input.state.value.hsva = {
        h: hue,
        s,
        v,
        a
      };
      this.input.set(this.input.state.value);
      this.elements.handle.style.background = this.input.state.value.hexString;
      this.draw();
    };
    this._updateHandle = (color2 = this.input.state.value) => {
      this._drawHandle(this._getHandlePosition(color2));
    };
    this._getHandlePosition = (color2) => {
      const { width, height } = this.canvas.getBoundingClientRect();
      const r2 = this.opts.handleSize / 2;
      return {
        x: mapRange(color2.hsv.s, 0, 100, r2, width - r2),
        y: mapRange(color2.hsv.v, 0, 100, height - r2, r2)
      };
    };
    this._drawHandle = (coords) => {
      this.elements.handle.style.transform = `translate(${coords.x}px, ${coords.y}px)`;
      this.elements.handle.style.background = this.input.state.value.hexString;
    };
    const opts = {
      ...COLOR_PICKER_DEFAULTS2,
      ...options
    };
    this.opts = opts;
    this._log = new Logger(`ColorPicker ${input.title}`, {
      fg: "lightgreen"
    });
    this._log.fn("constructor").debug({
      opts,
      this: this
    });
    this._lastColor = this.input.state.value.clone();
    const style = input.expanded ? {} : {
      height: "0px"
    };
    const container = create("div", {
      classes: [
        "fracgui-input-color-picker-container"
      ],
      parent: options?.container ?? input.elements.controllers.container,
      style
    });
    this.element = container;
    const canvas = create("canvas", {
      classes: [
        "fracgui-input-color-picker-canvas"
      ],
      parent: container,
      height: this._height
    });
    const debouncedUpdateHandle = debounce(this._updateHandle, 100);
    this._resizeObserver = new ResizeObserver(() => debouncedUpdateHandle());
    this._resizeObserver.observe(canvas);
    const handle = create("div", {
      classes: [
        "fracgui-input-color-picker-handle"
      ],
      parent: container,
      style: {
        background: input.state.value.hexString
      }
    });
    const hueSlider = create("input", {
      type: "range",
      classes: [
        "fracgui-input-range",
        "fracgui-input-color-picker-hue"
      ],
      parent: container,
      min: 0,
      max: 359
    });
    this._evm.listen(hueSlider, "input", this._updateStateFromHue);
    tooltip(hueSlider, {
      parent: container,
      text: /* @__PURE__ */ __name(() => `${this.input.state.value.hsla.h}`, "text"),
      placement: "top",
      offsetX: "0px",
      anchor: {
        x: "mouse",
        y: hueSlider.querySelector("#thumb")
      },
      style: {
        background: "var(--fracgui-bg-a)",
        color: "var(--fracgui-fg-a)"
      }
    });
    const alphaSlider = create("input", {
      type: "range",
      classes: [
        "fracgui-input-range",
        "fracgui-input-color-picker-alpha"
      ],
      parent: container,
      min: 0,
      max: 1,
      step: 0.01
    });
    this._evm.listen(alphaSlider, "input", this.setAlpha);
    tooltip(alphaSlider, {
      parent: container,
      text: /* @__PURE__ */ __name(() => `${this.input.state.value.alpha}`, "text"),
      placement: "top",
      offsetX: "0px",
      anchor: {
        x: "mouse",
        y: alphaSlider.querySelector("#thumb")
      },
      style: {
        background: "var(--fracgui-bg-a)",
        color: "var(--fracgui-fg-a)"
      }
    });
    this.elements = {
      container,
      canvas,
      handle,
      hueSlider,
      alphaSlider
    };
    this.disabled = this.opts.disabled;
    this._ctx = canvas.getContext("2d");
    this.canvas.width = this._width;
    this._evm.listen(this.canvas, "click", this._onClick);
    this._evm.listen(this.canvas, "pointerdown", this._onPointerDown);
    this._evm.listen(this.input.elements.container, "pointermove", this._onPointerMove, {
      passive: true
    });
    this._updateGradients();
    setTimeout(this.draw, 10);
    setTimeout(this._updateHandle, 20);
  }
  get canvas() {
    return this.elements.canvas;
  }
  get hue() {
    return this.input.state.value.hue;
  }
  get alpha() {
    return this.input.state.value.alpha;
  }
  enable;
  disable;
  set(v) {
    this.input.state.value.set(v);
    this.input.refresh();
    this.refresh();
  }
  setAlpha;
  refresh;
  draw;
  _fill(style) {
    this._ctx.fillStyle = style;
    this._ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  _updateGradients() {
    this._gradientWhite = this._ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    this._gradientWhite.addColorStop(0, "rgba(255,255,255,1)");
    this._gradientWhite.addColorStop(1, "rgba(255,255,255,0)");
    this._gradientBlack = this._ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    this._gradientBlack.addColorStop(0, "rgba(0,0,0,0)");
    this._gradientBlack.addColorStop(1, "rgba(0,0,0,1)");
  }
  //· Pointer Events ···································································¬
  _pointerUpClickLatch;
  _onPointerDown;
  _onPointerMove;
  _onPointerUp;
  _onClick;
  /**
  * Updates the color picker's state based on the current mouse position.
  */
  _updateFromMousePosition(e) {
    this._log.fn("_updateFromMousePosition").debug();
    const { left, top, width, height } = this.canvas.getBoundingClientRect();
    const x = clamp(e.clientX - left, 0, width);
    const y2 = clamp(e.clientY - top, 0, height);
    const { s, v } = this._getColorAtPosition(x, y2);
    this.input.state.value.hsv = {
      h: this.hue,
      s,
      v
    };
    this.input.set(this.input.state.value);
    this._drawHandle(this._getHandlePosition(this.input.state.value));
  }
  //⌟
  /**
  * Maps canvas `x` and `y` coordinates to their respective `s` and `v` color values.
  */
  _getColorAtPosition;
  _updateStateFromHue;
  _updateHandle;
  /**
  * Get the current handle position for a given color.
  */
  _getHandlePosition;
  _drawHandle;
  dispose() {
    this._ctx = null;
    this.elements.alphaSlider.remove();
    this.elements.hueSlider.remove();
    this.elements.handle.remove();
    this.elements.canvas.remove();
    this.elements.container.remove();
    this._resizeObserver.disconnect();
    this._evm.dispose();
  }
};
ColorPicker = _ts_decorate7([
  disableable,
  _ts_metadata7("design:type", Function),
  _ts_metadata7("design:paramtypes", [
    typeof InputColor === "undefined" ? Object : InputColor,
    typeof Partial === "undefined" ? Object : Partial
  ])
], ColorPicker);

// src/shared/mount.ts
function append(...els) {
  let i = 0;
  const e = [
    ...els
  ];
  let p = e.shift();
  let c2 = e.shift();
  function mount(..._e) {
    if (i++ > 500) throw new Error("infinite loop detected! (500 iteration limit)");
    if (p && c2) p.appendChild(c2);
    p = c2;
    c2 = _e.shift();
    if (c2) {
      mount(..._e);
    }
  }
  __name(mount, "mount");
  mount(...e);
}
__name(append, "append");

// src/svg/CopySVG.ts
var CopySVG = class {
  static {
    __name(this, "CopySVG");
  }
  svg;
  back;
  front;
  check;
  constructor() {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.classList.add("icon", "copy");
    s.setAttribute("width", "100%");
    s.setAttribute("height", "100%");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "2");
    s.setAttribute("stroke-linecap", "round");
    s.setAttribute("stroke-linejoin", "round");
    const front = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    front.classList.add("front");
    front.setAttribute("width", "13");
    front.setAttribute("height", "13");
    front.setAttribute("rx", "1");
    front.setAttribute("ry", "1");
    front.setAttribute("x", "8");
    front.setAttribute("y", "8");
    const back = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    back.classList.add("back");
    back.setAttribute("width", "15");
    back.setAttribute("height", "15");
    back.setAttribute("rx", "1");
    back.setAttribute("ry", "1");
    back.setAttribute("x", "1");
    back.setAttribute("y", "1");
    const check = document.createElementNS("http://www.w3.org/2000/svg", "path");
    check.classList.add("check");
    check.setAttribute("d", "M17 9l-7 7-4-4");
    check.setAttribute("fill", "none");
    check.setAttribute("stroke-width", "2");
    s.appendChild(front);
    s.appendChild(back);
    s.appendChild(check);
    this.svg = s;
    this.back = back;
    this.front = front;
    this.check = check;
    return this;
  }
  appendTo(container) {
    container.appendChild(this.svg);
  }
};

// src/shared/CopyButton.ts
var CopyButton = class {
  static {
    __name(this, "CopyButton");
  }
  container;
  text;
  message;
  button;
  icon;
  /**
  * When the copy animation is active, this is `true` and the button has an `active` class.
  */
  active;
  /**
  * When the copy animation is outroing, this is `true` and the button has an `outro` class.
  */
  outro;
  #completeTimeout;
  tooltip;
  constructor(container, text, message = "Copy") {
    this.container = container;
    this.text = text;
    this.message = message;
    this.active = false;
    this.outro = false;
    this.copy = () => {
      if (typeof navigator === "undefined") return;
      if (this.active) return;
      let text2 = this.text();
      if (!text2) return;
      if (typeof text2 === "object") text2 = JSON.stringify(text2);
      navigator.clipboard?.writeText?.(text2);
      clearTimeout(this.#completeTimeout);
      this.#animateIn();
    };
    this.#animateIn = () => {
      this.active = true;
      this.tooltip.show();
      this.button.blur();
      this.button.classList.add("active");
      this.icon.svg.classList.add("active");
      this.icon.front.setAttribute("x", "5.5");
      this.icon.front.setAttribute("y", "5.5");
      this.icon.front.setAttribute("rx", "10");
      this.icon.front.setAttribute("ry", "10");
      this.tooltip.text = "Copied!";
      setTimeout(this.#animateOut, 1250);
    };
    this.#animateOut = () => {
      this.active = false;
      this.outro = true;
      this.button.classList.remove("active");
      this.icon.svg.classList.remove("active");
      this.icon.svg.classList.add("outro");
      this.button.classList.add("outro");
      this.icon.front.setAttribute("x", "8");
      this.icon.front.setAttribute("y", "8");
      this.icon.front.setAttribute("rx", "1");
      this.icon.front.setAttribute("ry", "1");
      setTimeout(this.#complete, 900);
    };
    this.#complete = () => {
      this.button.classList.remove("outro");
      this.icon.svg.classList.remove("outro");
      this.outro = false;
      this.tooltip.hide();
      clearTimeout(this.#completeTimeout);
      this.#completeTimeout = setTimeout(() => {
        this.tooltip.text = this.message;
      }, 300);
    };
    const button = create("div", {
      classes: [
        "copy-button"
      ],
      title: "Copy",
      attributes: {
        "aria-label": "Copy",
        title: "Copy"
      }
    });
    const svgContainer = create("div", {
      classes: [
        "copy-button-svg-container"
      ]
    });
    this.button = button;
    this.icon = new CopySVG();
    this.button.addEventListener("click", this.copy);
    append(container, this.button, svgContainer, this.icon.svg);
    this.tooltip = new Tooltip(this.button, {
      text: message,
      placement: "top",
      offsetY: "6px",
      delay: 300,
      parent: container,
      style: {
        minWidth: "4.25rem",
        background: "var(--fracgui-bg-a)",
        color: "var(--fracgui-fg-a)"
      }
    });
  }
  copy;
  #animateIn;
  #animateOut;
  #complete;
};

// src/inputs/InputColor.ts
var COLOR_INPUT_DEFAULTS = {
  __type: "ColorInputOptions",
  value: "#FF0000FF",
  mode: "hex",
  expanded: false
};
var InputColor2 = class _InputColor extends Input {
  static {
    __name(this, "InputColor");
  }
  __type = "InputColor";
  initialValue;
  state;
  /**
  * The color picker instance.
  */
  picker;
  /**
  * RGBA/HSLA/HSVA number component inputs.
  */
  components;
  /**
  * When `true`, the color picker is visible.
  */
  expanded;
  _mode;
  get mode() {
    return this._mode;
  }
  set mode(v) {
    this._mode = v;
    this.components.mode = v;
  }
  _log;
  constructor(options, folder) {
    const opts = Object.assign({}, COLOR_INPUT_DEFAULTS, options, {
      __type: "ColorInputOptions"
    });
    super(opts, folder);
    this.expanded = opts.expanded;
    this._mode = opts.mode;
    this._log = new Logger(`InputColor ${opts.title}`, {
      fg: "cyan"
    });
    this._log.fn("constructor").debug({
      opts,
      this: this
    }).groupEnd();
    if (opts.binding) {
      this.initialValue = new Color(opts.binding.target[opts.binding.key]);
      this.state = state(this.initialValue.clone());
      this._evm.add(this.state.subscribe((v) => {
        opts.binding.target[opts.binding.key] = v;
      }));
    } else {
      this.initialValue = new Color(opts.value);
      this.state = state(this.initialValue.clone());
    }
    const container = create("div", {
      classes: [
        "fracgui-input-color-container"
      ],
      parent: this.elements.content
    });
    this.elements.controllers.container = container;
    this.elements.controllers.currentColor = this._createCurrentColor(container);
    const body = create("div", {
      classes: [
        "fracgui-input-color-body"
      ],
      parent: container
    });
    this.picker = new ColorPicker(this, {
      container: body
    });
    this.components = new ColorComponents(this, {
      container: body
    });
    this.elements.controllers.body = {
      container: body,
      picker: this.picker.elements,
      components: this.components.elements
    };
    this._dirty = () => this.state.value.hex !== this.initialValue.hex;
    setTimeout(() => {
      this.expanded ? this.open() : this.close(0);
    }, 10);
    this._emit("change");
    this.refresh();
    this.picker.on("pointerdown", this._lock);
    this.picker.on("pointerup", this._unlock);
  }
  set(v) {
    if (isColor(v)) {
      this.commit({
        to: v.rgba,
        from: this.state.value.rgba,
        setter: /* @__PURE__ */ __name((v2) => {
          this.state.value.set(v2);
          this.state.refresh();
          this.refresh();
        }, "setter")
      });
      this.state.set(new Color(v.rgba));
    } else {
      const newColor = new Color(v);
      this.commit({
        to: newColor.rgba,
        from: this.state.value.rgba,
        setter: /* @__PURE__ */ __name((v2) => {
          this.state.value.set(v2);
          this.state.refresh();
          this.refresh();
        }, "setter")
      });
      this.state.set(newColor);
    }
    const newValue = this.state.value;
    this._log.fn("set").debug({
      v,
      newValue,
      this: this
    });
    this._emit("change", newValue);
    this.refresh(newValue);
    return this;
  }
  refresh = /* @__PURE__ */ __name((v = this.state.value) => {
    this._log.fn("refresh").debug({
      v,
      this: this
    });
    this.elements.controllers.currentColor.display.style.backgroundColor = v.hex;
    this.picker.refresh();
    this.components.refresh();
    super.refresh();
    return this;
  }, "refresh");
  //· Getters & Setters ········································································¬
  get aTitle() {
    return this.mode === "rgba" ? "r" : "h";
  }
  get bTitle() {
    return this.mode === "rgba" ? "g" : "s";
  }
  get cTitle() {
    return this.mode === "rgba" ? "b" : this.mode === "hsla" ? "l" : "v";
  }
  get dTitle() {
    return "a";
  }
  //⌟
  _createCurrentColor(parent) {
    const container = create("div", {
      classes: [
        "fracgui-input-color-current-color-container"
      ],
      parent
    });
    const displayBackground = create("div", {
      classes: [
        "fracgui-input-color-current-color-background"
      ],
      parent: container
    });
    const display = create("div", {
      classes: [
        "fracgui-input-color-current-color-display"
      ],
      parent: displayBackground
    });
    this._evm.listen(display, "click", this.togglePicker);
    const copyButton = new CopyButton(container, () => {
      return this.state.value.hex;
    }, "Copy Hex");
    return {
      container,
      displayBackground,
      display,
      copyButton
    };
  }
  //· Open/Close ···············································································¬
  static #pickerHeight = "75px";
  get _pickerContainer() {
    return this.picker.elements.container;
  }
  togglePicker = /* @__PURE__ */ __name(async () => {
    if (!this.expanded) {
      await this.open();
    } else {
      await this.close();
    }
  }, "togglePicker");
  open = /* @__PURE__ */ __name(async () => {
    this.expanded = true;
    this.elements.container.dataset["search_height"] = "100px";
    const pickerAnim = this._pickerContainer?.animate([
      {
        height: "0px",
        clipPath: "inset(0 0 100% 0)"
      },
      {
        height: _InputColor.#pickerHeight,
        clipPath: "inset(0 0 -50% 0)"
      }
    ], {
      duration: 200,
      easing: "cubic-bezier(.08,.38,0,0.92)",
      fill: "forwards"
    });
    const containerAnim = this.elements.container.animate({
      maxHeight: "100px",
      height: "100px"
    }, {
      duration: 200,
      easing: "cubic-bezier(.08,.38,0,0.92)",
      fill: "forwards"
    });
    this._pickerContainer?.style.setProperty("overflow", "visible");
    this._pickerContainer?.classList.add("expanded");
    await Promise.all([
      pickerAnim?.finished,
      containerAnim?.finished
    ]);
    if (this._pickerContainer && document.contains(this._pickerContainer)) {
      pickerAnim?.commitStyles();
    }
    if (this.elements.container && document.contains(this.elements.container)) {
      containerAnim?.commitStyles();
    }
  }, "open");
  close = /* @__PURE__ */ __name(async (duration = 300) => {
    this.expanded = false;
    delete this.elements.container.dataset["search_height"];
    const pickerAnim = this._pickerContainer?.animate([
      {
        height: _InputColor.#pickerHeight,
        clipPath: "inset(0 0 -100% 0)"
      },
      {
        height: "0px",
        clipPath: "inset(0 0 100% 0)"
      }
    ], {
      duration,
      easing: "cubic-bezier(.13,.09,.02,.96)",
      fill: "forwards"
    });
    const containerAnim = this.elements.container.animate({
      minHeight: "var(--fracgui-input_height)",
      maxHeight: "var(--fracgui-input_height)",
      height: "var(--fracgui-input_height)"
    }, {
      duration,
      easing: "cubic-bezier(.13,.09,.02,.96)",
      fill: "forwards"
    });
    this._pickerContainer?.style.setProperty("overflow", "hidden");
    this._pickerContainer?.classList.remove("expanded");
    await Promise.all([
      pickerAnim?.finished,
      containerAnim?.finished
    ]);
    if (this._pickerContainer && document.contains(this._pickerContainer)) {
      pickerAnim?.commitStyles();
    }
    if (this.elements.container && document.contains(this.elements.container)) {
      containerAnim?.commitStyles();
    }
  }, "close");
  //⌟
  //· Super Overrides ··········································································¬
  /**
  * Prevents the range slider from registering undo history commits while dragging on the
  * canvas, storing the initial value on pointerdown for the eventual commit in {@link unlock}.
  */
  _lock = /* @__PURE__ */ __name(() => {
    this.lock(this.state.value.rgba);
  }, "_lock");
  /**
  * Saves the commit stored in #lock on pointerup.
  */
  _unlock = /* @__PURE__ */ __name(() => {
    this.unlock({
      target: this,
      to: this.state.value.rgba,
      setter: /* @__PURE__ */ __name((v) => {
        this.state.value.set(v);
        this.state.refresh();
        this._emit("change", this.state.value);
        this.refresh();
      }, "setter")
    });
  }, "_unlock");
  enable() {
    this.picker.enable();
    super.enable();
    return this;
  }
  disable() {
    this.picker.disable();
    super.disable();
    return this;
  }
  save() {
    return super.save({
      value: this.state.value.hex
    });
  }
  load(json) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    this.id = data.presetId;
    this.disabled = data.disabled;
    this.hidden = data.hidden;
    this.initialValue = new Color(data.value);
    this.set(this.initialValue.clone());
  }
  //⌟
  dispose() {
    this._log.fn("dispose").debug({
      this: this
    });
    this.picker.dispose();
    super.dispose();
  }
};

// src/controllers/text.ts
var textController = /* @__PURE__ */ __name((input, _opts, parent) => {
  const controller = create("input", {
    type: "textarea",
    classes: [
      "fracgui-controller",
      "fracgui-controller-text"
    ],
    value: input.state.value,
    parent,
    attributes: {
      spellcheck: "false"
    }
  });
  return controller;
}, "textController");

// src/inputs/InputText.ts
var TEXT_INPUT_DEFAULTS = {
  __type: "TextInputOptions",
  value: "foo",
  maxLength: 50
};
var InputText = class extends Input {
  static {
    __name(this, "InputText");
  }
  __type = "InputText";
  initialValue;
  state;
  // get element() {
  // 	return this.elements.controllers.input
  // }
  #log;
  constructor(options, folder) {
    const opts = Object.assign({}, TEXT_INPUT_DEFAULTS, options);
    super(opts, folder);
    this.#log = new Logger(`InputText ${opts.title}`, {
      fg: "cyan"
    });
    this.#log.fn("constructor").info({
      opts,
      this: this
    });
    if (opts.binding) {
      this.initialValue = opts.binding.target[opts.binding.key];
      this.state = state(this.initialValue);
      this._evm.add(this.state.subscribe((v) => {
        opts.binding.target[opts.binding.key] = v;
      }));
    } else {
      this.initialValue = opts.value;
      this.state = state(opts.value);
    }
    const container = create("div", {
      classes: [
        "fracgui-input-text-container"
      ],
      parent: this.elements.content
    });
    this.elements.controllers = {
      container,
      input: textController(this, opts, container)
    };
    this._evm.listen(this.elements.controllers.input, "input", this.set);
    this._evm.add(this.state.subscribe(() => {
      this.refresh();
    }));
  }
  enable() {
    super.enable();
    this.elements.controllers.input.disabled = false;
    return this;
  }
  disable() {
    super.disable();
    this.elements.controllers.input.disabled = true;
    return this;
  }
  set = /* @__PURE__ */ __name((v) => {
    if (typeof v === "undefined") return;
    if (typeof v !== "string") {
      if (v?.target && "value" in v.target) {
        this.commit({
          to: v.target.value
        });
        this.state.set(v.target.value);
      }
    } else {
      this.commit({
        to: v
      });
      this.state.set(v);
    }
    this._emit("change", this.state.value);
    return this;
  }, "set");
  refresh = /* @__PURE__ */ __name(() => {
    const v = this.state.value;
    this.elements.controllers.input.value = v;
    super.refresh(v);
    return this;
  }, "refresh");
  dispose() {
    super.dispose();
  }
};

// src/svg/createFolderSVG.ts
function createFolderSvg(folder) {
  const strokeWidth = 1;
  const x = 12;
  const y2 = 12;
  const r2 = 4;
  const fill = "var(--fracgui-theme-a)";
  const theme = "var(--fracgui-theme-a)";
  const icon = document.createElement("div");
  icon.classList.add("fracgui-folder-icon-container");
  const count = folder.allChildren.length + folder.inputs.size;
  icon.style.setProperty("filter", `hue-rotate(${folder.hue}deg)`);
  const circs = [
    {
      id: 1,
      cx: 16.43,
      cy: 11.93,
      r: 1.1103
    },
    {
      id: 2,
      cx: 15.13,
      cy: 15.44,
      r: 0.8081
    },
    {
      id: 3,
      cx: 15.13,
      cy: 8.423,
      r: 0.8081
    },
    {
      id: 4,
      cx: 12.49,
      cy: 16.05,
      r: 0.4788
    },
    {
      id: 5,
      cx: 12.42,
      cy: 7.876,
      r: 0.545
    },
    {
      id: 6,
      cx: 10.43,
      cy: 15.43,
      r: 0.2577
    },
    {
      id: 7,
      cx: 10.43,
      cy: 8.506,
      r: 0.2769
    },
    {
      id: 8,
      cx: 17.85,
      cy: 14.59,
      r: 0.5635
    },
    {
      id: 9,
      cx: 17.85,
      cy: 9.295,
      r: 0.5635
    },
    {
      id: 10,
      cx: 19.19,
      cy: 12.95,
      r: 0.5635
    },
    {
      id: 11,
      cx: 19.19,
      cy: 10.9,
      r: 0.5635
    },
    {
      id: 12,
      cx: 20.38,
      cy: 11.96,
      r: 0.2661
    },
    {
      id: 13,
      cx: 19.74,
      cy: 14.07,
      r: 0.2661
    },
    {
      id: 14,
      cx: 19.74,
      cy: 9.78,
      r: 0.2661
    },
    {
      id: 15,
      cx: 20.7,
      cy: 12.96,
      r: 0.2661
    },
    {
      id: 16,
      cx: 20.7,
      cy: 10.9,
      r: 0.2661
    },
    {
      id: 17,
      cx: 21.38,
      cy: 11.96,
      r: 0.2661
    }
  ];
  function circ(c2) {
    return (
      /*html*/
      `<circle
				class="alt c${c2.id}"
				cx="${c2.cx * 1.1}"
				cy="${c2.cy}"
				r="${c2.r}"
				style="transition-delay: ${c2.id * 0.05}s;"
			/>`
    );
  }
  __name(circ, "circ");
  function toCircs(ids) {
    return ids.map((id) => circ(circs[id - 1])).join("\n");
  }
  __name(toCircs, "toCircs");
  const circMap = {
    0: [],
    1: [
      1
    ],
    2: [
      2,
      3
    ],
    3: [
      1,
      2,
      3
    ],
    4: [
      2,
      3,
      4,
      5
    ],
    5: [
      1,
      2,
      3,
      4,
      5
    ],
    6: [
      2,
      3,
      4,
      5,
      6,
      7
    ],
    7: [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ],
    8: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    9: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
    ],
    10: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10
    ],
    11: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11
    ],
    12: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    13: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13
    ],
    14: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14
    ],
    15: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15
    ],
    16: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    17: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17
    ]
  };
  const circles = toCircs(circMap[Math.min(count, circs.length)]);
  const bounce = "cubic-bezier(0.36, 0, 0.66, -0.56)";
  const ease = "cubic-bezier(0.23, 1, 0.320, 1)";
  const css = (
    /*css*/
    `
			.fracgui-folder-icon {
				overflow: visible;
				backface-visibility: hidden;
			}

			.fracgui-folder-icon circle, .fracgui-folder-icon line {
				transform-origin: center;

				transition-duration: 0.25s;
				transition-timing-function: ${ease};
				backface-visibility: hidden;
			}

			/*//?	Circle A	*/
			.closed .fracgui-folder-icon circle.a {
				transform: scale(1);
				
				stroke: transparent;
				fill: ${fill};
				
				transition: all .5s ${bounce}, stroke 2s ${bounce}, fill .2s ${bounce} 0s;
			}
			.fracgui-folder-icon circle.a {
				transform: scale(0.66);

				stroke: ${fill};
				fill: ${theme};

				transition: all .33s ${bounce}, stroke 2s ${bounce}, fill .2s ease-in 0.25s;
			}

			/*//?	Circle Alt	*/
			.closed .fracgui-folder-icon circle.alt {
				transform: translate(-3px, 0) scale(1.8);

				transition-duration: 0.5s;
				transition-timing-function: ${ease};
			}
			 .fracgui-folder-icon circle.alt {
				transform: translate(0, 0) scale(0);

				stroke: none;
				fill: ${theme};

				transition-duration: 0.75s;
				transition-timing-function: ${ease};
			}
		`.trim()
  );
  icon.innerHTML = /*html*/
  `
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 24 24"
			fill="none"
			stroke-width="${strokeWidth}"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="fracgui-folder-icon"
			overflow="visible"
		>
			<circle class="a" cx="${x}" cy="${y2}" r="${r2}" stroke="${theme}" fill="${fill}" />

			${circles}

			<style lang="css">
				${css}
			</style>
		</svg>`.trim();
  if (folder.closed.value) icon.classList.add("closed");
  return icon;
}
__name(createFolderSvg, "createFolderSvg");
function createFolderConnector(folder) {
  const container = create("div", {
    classes: [
      "fracgui-connector-container"
    ]
  });
  const width = 20;
  const height = folder.element.clientHeight;
  const stroke = 1;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "fracgui-connector-svg");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("stroke-width", `${stroke}`);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("overflow", "visible");
  svg.setAttribute("backface-visibility", "hidden");
  svg.setAttribute("preserveAspectRatio", "xMinYMin slice");
  svg.style.setProperty("filter", `hue-rotate(${folder.hue}deg)`);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("vector-effect", "non-scaling-stroke");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "var(--fracgui-theme-a)");
  path.setAttribute("stroke-width", `${stroke}`);
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("d", `M10,0 Q0,0 0,10 L0,${height}`);
  const headerHeight = folder.elements.header.clientHeight;
  path.setAttribute("transform", `translate(0, ${headerHeight / 2})`);
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradient.setAttribute("id", "gradient");
  linearGradient.setAttribute("x1", "0%");
  linearGradient.setAttribute("y1", "0%");
  linearGradient.setAttribute("x2", "0%");
  linearGradient.setAttribute("y2", "100%");
  function stop(offset, opacity, color2 = "var(--fracgui-theme-a)") {
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", `${offset}%`);
    stop1.setAttribute("style", `stop-color: ${color2}; stop-opacity: ${opacity}`);
    linearGradient.appendChild(stop1);
    return stop1;
  }
  __name(stop, "stop");
  stop(0, 0.5);
  stop(1, 0.5);
  stop(5, 0.4);
  stop(20, 0.3);
  stop(40, 0.2);
  stop(100, 0.2);
  path.setAttribute("stroke", "url(#gradient)");
  defs.appendChild(linearGradient);
  svg.insertBefore(defs, svg.firstChild);
  svg.appendChild(path);
  container.appendChild(svg);
  return {
    container,
    svg,
    path
  };
}
__name(createFolderConnector, "createFolderConnector");
function animateConnector(folder, action) {
  if (!folder.graphics?.connector) return;
  const path = folder.graphics.connector.path;
  const length = `${path.getTotalLength()}`;
  path.style.strokeDasharray = `${length}`;
  const { duration, from, to, delay, easing } = action === "open" ? {
    duration: 600,
    delay: 0,
    from: length,
    easing: "cubic-bezier(.29,.1,.03,.94)",
    to: "0"
  } : {
    duration: 150,
    delay: 0,
    from: "0",
    easing: "cubic-bezier(.15,.84,.19,.98)",
    to: length
  };
  const keyframes = [
    {
      strokeDashoffset: from
    },
    {
      strokeDashoffset: to
    }
  ];
  const timing = {
    duration,
    delay,
    easing,
    fill: "forwards"
  };
  folder.graphics.connector.path.animate(keyframes, timing);
}
__name(animateConnector, "animateConnector");

// src/shared/cancelClassFound.ts
function composedPathContains(e, classname) {
  return e.composedPath().some((n) => n.classList?.contains(classname));
}
__name(composedPathContains, "composedPathContains");

// src/svg/TerminalSvg.ts
function _ts_decorate8(decorators, target, key, desc) {
  var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r2 = (c2 < 3 ? d(r2) : c2 > 3 ? d(target, key, r2) : d(target, key)) || r2;
  return c2 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
__name(_ts_decorate8, "_ts_decorate");
function _ts_metadata8(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata8, "_ts_metadata");
var TerminalSvg = class {
  static {
    __name(this, "TerminalSvg");
  }
  class = "fracgui-terminal-icon";
  element;
  classes = [
    this.class,
    "fracgui-cancel"
  ];
  constructor(folder) {
    const parent = folder.isRoot ? folder.elements.header : folder.elements.title;
    if (folder.isRoot) this.classes.push("fracgui-terminal-icon-root");
    this.element = create("div", {
      parent,
      classes: this.classes,
      innerHTML: (
        /*html*/
        `
                <svg class="icon terminal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" x2="20" y1="19" y2="19"></line>
                </svg>
                `.replaceAll(/\t|\n/g, "")
      ),
      tooltip: {
        text: "<code>console.log(folder)</code>",
        delay: 1500,
        placement: "right"
      },
      onclick: /* @__PURE__ */ __name((e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(folder);
      }, "onclick")
    });
  }
  static style = (
    /*css*/
    `
        .fracgui-terminal-icon {
            position: absolute;
            right: -1.5rem;
            top: 0;
            bottom: 0;

            width: 16px;
            height: 16px;

            color: var(--fracgui-fg-d);
            transform: translateY(15%);
            opacity: 0;

            transition: opacity 0.2s;
            transition-delay: 0.5s;

            z-index: 1;
        }

        .fracgui-terminal-icon-root {
            right: unset;
            left: 0.5rem;
            top: 0.25rem;
        }


        .fracgui-terminal-icon:hover {
            opacity: 0.75;
        }

        .fracgui-terminal-icon svg {
            width: 100%;
            height: 100%;
        }
    `
  );
};
TerminalSvg = _ts_decorate8([
  styled,
  _ts_metadata8("design:type", Function),
  _ts_metadata8("design:paramtypes", [
    typeof Folder === "undefined" ? Object : Folder
  ])
], TerminalSvg);

// src/shared/fuzzySearch.ts
function fuzzysearch(needle, haystack) {
  const n = needle.length;
  const h = haystack.length;
  if (n > h) {
    return false;
  }
  if (n === h) {
    return needle === haystack;
  }
  outer: for (let i = 0, j = 0; i < n; i++) {
    let nch = needle.charCodeAt(i);
    while (j < h) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
__name(fuzzysearch, "fuzzysearch");

// src/toolbar/Search.ts
var Search = class {
  static {
    __name(this, "Search");
  }
  folder;
  elements;
  needle;
  showing;
  tooltip;
  get defaultTooltipText() {
    return "Search " + (this.folder.isRoot ? "All" : this.folder.title);
  }
  _evm;
  constructor(folder) {
    this.folder = folder;
    this.needle = "";
    this.showing = false;
    this._evm = new EventManager();
    this.search = (query) => {
      this.needle = query;
      for (const [key, controller] of this.folder.allInputs) {
        const search_result = fuzzysearch(this.needle.toLocaleLowerCase(), key.toLowerCase()) ? "hit" : "miss";
        const result = this.needle === "" ? "hit" : search_result;
        const node = controller.elements.container;
        if (node.dataset["search"] === result) continue;
        const style = getComputedStyle(node);
        node.dataset["search_height"] ??= style.minHeight;
        node.dataset["search_overflow"] ??= style.overflow ?? "unset";
        node.dataset["search_contain"] ??= style.contain ?? "none";
        node.dataset["search_opacity"] ??= style.opacity ?? 1;
        if (result === "hit") {
          this._expandInput(node);
        } else if (result === "miss") {
          this._collapseInput(node);
        }
        node.dataset["search"] = result;
      }
    };
    this._expandInput = async (node) => {
      if (node.dataset["search"] === "miss") {
        node.style.setProperty("overflow", node.dataset["search_overflow"]);
        node.style.setProperty("contain", node.dataset["search_contain"]);
        const targetHeight = node.dataset["search_height"] ?? "100%";
        const anim = node.animate([
          {
            opacity: 0,
            height: "0px",
            minHeight: "0px"
          },
          {
            opacity: 1,
            height: targetHeight,
            minHeight: targetHeight
          }
        ], {
          duration: 300,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "forwards"
        });
        await anim.finished;
        anim.commitStyles();
      }
    };
    this._collapseInput = async (node) => {
      node.style.setProperty("overflow", "hidden");
      node.style.setProperty("contain", "size");
      const anim = node.animate([
        {
          opacity: 0,
          height: "0px",
          minHeight: "0px"
        }
      ], {
        duration: 300,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        fill: "forwards"
      });
      await anim.finished;
      anim.commitStyles();
    };
    this.clear = () => {
      for (const [, controller] of this.folder.allInputs) {
        this._expandInput(controller.elements.container);
      }
    };
    this.toggle = (e) => {
      e?.stopImmediatePropagation();
      this.showing ? this.close() : this.open();
    };
    this.open = () => {
      this.showing = true;
      this.elements.container.classList.add("active");
      this.elements.input.focus();
      removeEventListener("click", this._clickOutside);
      addEventListener("click", this._clickOutside);
      removeEventListener("keydown", this._escape);
      addEventListener("keydown", this._escape);
      this.tooltip.hide();
      clearTimeout(this._tooltipTimeout);
      this._tooltipTimeout = setTimeout(() => {
        this.tooltip.text = "Cancel (esc)";
        this.tooltip.placement = "top";
        this.tooltip.offsetX = "-40px";
        this.tooltip.offsetY = "-2px";
      }, 100);
      for (const folder2 of this.folder.allChildren) {
        if (!folder2.closed.value) continue;
        folder2.element.dataset["searchclosed"] = "true";
        folder2.open();
      }
    };
    this.close = () => {
      this.showing = false;
      this.elements.container.classList.remove("active");
      if (document.activeElement === this.elements.input || document.activeElement === this.elements.button) {
        document.activeElement?.blur();
      }
      this.clear();
      removeEventListener("click", this._clickOutside);
      removeEventListener("keydown", this._escape);
      this.tooltip.hide();
      clearTimeout(this._tooltipTimeout);
      this._tooltipTimeout = setTimeout(() => {
        this.tooltip.text = this.defaultTooltipText;
        this.tooltip.placement = "left";
        this.tooltip.offsetX = TOOLTIP_DEFAULTS.offsetX;
        this.tooltip.offsetY = TOOLTIP_DEFAULTS.offsetY;
      }, 100);
      for (const folder2 of this.folder.allChildren) {
        if (!folder2.element.dataset["searchclosed"]) continue;
        folder2.element.dataset["searchclosed"] = "";
        folder2.close();
      }
    };
    this._clickOutside = (e) => {
      if (!this.needle && !e.composedPath().includes(this.elements.container)) {
        this.close();
      }
    };
    this._escape = (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    };
    const container = create("div", {
      classes: [
        "fracgui-toolbar-item",
        "fracgui-search-container"
      ]
    });
    folder.elements.toolbar.container.prepend(container);
    const input = create("input", {
      classes: [
        "fracgui-controller-text",
        "fracgui-search-input",
        "fracgui-cancel"
      ],
      parent: container
    });
    this._evm.listen(input, "input", (e) => this.search(e.target.value));
    const button = create("button", {
      classes: [
        "fracgui-search-button",
        "fracgui-cancel"
      ],
      parent: container
    });
    this.tooltip = new Tooltip(button, {
      text: this.defaultTooltipText,
      placement: "left",
      delay: 500
    });
    const icon = this._searchIcon();
    button.appendChild(icon);
    this._evm.listen(button, "click", this.toggle);
    this.elements = {
      container,
      input,
      button,
      icon
    };
    return this;
  }
  search;
  _expandInput;
  _collapseInput;
  clear;
  toggle;
  _tooltipTimeout;
  open;
  close;
  _clickOutside;
  _escape;
  _searchIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M13.34 13.34 L19 19");
    svg.appendChild(path);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "8");
    circle.setAttribute("cy", "8");
    circle.setAttribute("r", "7");
    svg.appendChild(circle);
    svg.classList.add("search-icon");
    svg.style.pointerEvents = "none";
    return svg;
  }
  dispose() {
    this._evm.dispose();
    this.tooltip.dispose();
    this.elements.container.remove();
  }
};

// src/Folder.ts
var FOLDER_DEFAULTS = Object.freeze({
  presetId: "",
  title: "",
  children: [],
  closed: false,
  hidden: false,
  controls: /* @__PURE__ */ new Map(),
  saveable: true
});
var INTERNAL_FOLDER_DEFAULTS = {
  __type: "InternalFolderOptions",
  parentFolder: void 0,
  isRoot: true,
  _skipAnimations: true,
  gui: void 0,
  _headerless: false
};
var Folder2 = class _Folder {
  static {
    __name(this, "Folder");
  }
  //· Props ····················································································¬
  __type = "Folder";
  isRoot = true;
  id = nanoid();
  gui;
  /**
  * A preset namespace to use for saving/loading.  By default, the {@link title|`title`}
  * is used, in combiniation with the parent folder's title (and so on up the hierarchy).
  * Therefore, if you want to use presets, you will only need to set this if you:
  * - Use the same title for multiple inputs _in the same {@link Folder}_, or
  * - Leave all titles empty
  * Otherwise, this can be left as the default and presets will work as expected.
  * @defaultValue {@link title|`title`}
  */
  presetId;
  /**
  * Whether this Folder should be saved as a {@link FolderPreset} when saving the
  * {@link GuiPreset} for the {@link Gui} this Folder belongs to.  If `false`, this Input will
  * be skipped.
  * @defaultValue `true`
  */
  saveable;
  /**
  * The child folders of this folder.
  */
  children = [];
  /**
  * All inputs added to this folder.
  */
  inputs = /* @__PURE__ */ new Map();
  /**
  * The root folder.  All folders have a reference to the same root folder.
  */
  root;
  parentFolder;
  settingsFolder;
  // closed: State<boolean>
  closed = state(false);
  element;
  elements = {};
  graphics;
  evm = new EventManager([
    "change",
    "refresh",
    "toggle",
    "mount"
  ]);
  on = this.evm.on.bind(this.evm);
  _title;
  _hidden = /* @__PURE__ */ __name(() => false, "_hidden");
  _log;
  /** Used to disable clicking the header to open/close the folder. */
  _disabledTimer;
  /** The time in ms to wait after mousedown before disabling toggle for a potential drag. */
  _clickTime = 200;
  /** Whether clicking the header to open/close the folder is disabled. */
  _clicksDisabled = false;
  _depth = -1;
  //⌟
  constructor(options) {
    if (!("container" in options)) {
      throw new Error("Folder must have a container.");
    }
    const opts = Object.assign({}, FOLDER_DEFAULTS, INTERNAL_FOLDER_DEFAULTS, {
      gui: this.gui,
      isRoot: true
    }, options);
    this._log = new Logger(`Folder ${opts.title}`, {
      fg: "DarkSalmon"
    });
    this._log.fn("constructor").debug({
      opts,
      this: this
    });
    this.isRoot = opts.isRoot;
    if (this.isRoot) {
      this._depth = 0;
      this.parentFolder = this;
      this.root = this;
    } else {
      if (!opts.parentFolder) {
        throw new Error("Non-root folders must have a parent folder.");
      }
      this.parentFolder = opts.parentFolder;
      this._depth = this.parentFolder._depth + 1;
      this.root = this.parentFolder.root;
    }
    this.gui = opts.gui;
    this._title = opts.title ?? "";
    this.element = this._createElement(opts.container);
    this.elements = this._createElements(this.element);
    this.presetId = this.resolvePresetId(opts);
    this.saveable = !!opts.saveable;
    if (this.isRoot || opts.searchable) {
      new Search(this);
    }
    if (opts._skipAnimations) {
      this.element.classList.add("instant");
      setTimeout(() => {
        this.element.classList.remove("instant");
      }, 0);
    }
    this.hidden = opts.hidden ? toFn(opts.hidden) : () => false;
    this.evm.add(this.closed.subscribe((v) => {
      v ? this.close() : this.open();
      this.evm.emit("toggle", v);
    }));
    this._createGraphics(opts._headerless).then(() => {
      if (opts.closed) {
        this.closed.set(opts.closed);
      }
      this.evm.emit("mount");
    });
  }
  //· Getters/Setters ··········································································¬
  /**
  * The folder's title.  Changing this will update the UI.
  */
  get title() {
    return this._title;
  }
  set title(v) {
    if (v === this._title) return;
    this._title = v;
    this.elements.title.animate({
      opacity: 0,
      transform: "translateY(-0.33rem)"
    }, {
      duration: 75,
      easing: "ease-out",
      fill: "forwards"
    }).onfinish = () => {
      this.elements.title.textContent = v;
      this.elements.title.animate([
        {
          opacity: 0,
          transform: "translateY(.33rem)"
        },
        {
          opacity: 1,
          transform: "translateY(0rem)"
        }
      ], {
        delay: 0,
        duration: 75,
        easing: "ease-in",
        fill: "forwards"
      });
    };
  }
  /**
  * Whether the folder is visible.
  */
  get hidden() {
    return this._hidden();
  }
  set hidden(v) {
    this._hidden = toFn(v);
    this._hidden() ? this.hide() : this.show();
  }
  /**
  * A flat array of all child folders of this folder (and their children, etc).
  */
  get allChildren() {
    return this.children.flatMap((child) => [
      child,
      ...child.allChildren
    ]);
  }
  /**
  * A flat array of all inputs in all child folders of this folder (and their children, etc).
  * See Input Generators region.
  */
  get allInputs() {
    const allControls = /* @__PURE__ */ new Map();
    for (const child of [
      this,
      ...this.allChildren
    ]) {
      for (const [key, value] of child.inputs.entries()) {
        allControls.set(key, value);
      }
    }
    return allControls;
  }
  isRootFolder() {
    return this.isRoot;
  }
  //⌟
  //· Folders ··················································································¬
  addFolder(title, options) {
    options ??= {};
    options.title ??= title;
    this._log.fn("addFolder").debug({
      options,
      this: this
    });
    const defaults = Object.assign({}, INTERNAL_FOLDER_DEFAULTS, {
      parentFolder: this,
      depth: this._depth + 1,
      gui: this.gui
    });
    const overrides = {
      __type: "InternalFolderOptions",
      container: this.elements.content,
      isRoot: false
    };
    const opts = Object.assign({}, defaults, options, overrides);
    const folder = new _Folder(opts);
    folder.on("change", (v) => this.evm.emit("change", v));
    this.children.push(folder);
    this._createSvgs();
    if (opts._headerless) {
      folder.elements.header.style.display = "none";
    }
    return folder;
  }
  _handleClick(event) {
    if (event.button !== 0) return;
    this._log.fn("#handleClick").debug({
      event,
      this: this
    });
    this.element.removeEventListener("pointerup", this.toggle);
    this.element.addEventListener("pointerup", this.toggle, {
      once: true
    });
    if (composedPathContains(event, "fracgui-cancel")) return this._disableClicks();
    clearTimeout(this._disabledTimer);
    this._disabledTimer = setTimeout(() => {
      this.elements.header.removeEventListener("pointermove", this._disableClicks);
      this.elements.header.addEventListener("pointermove", this._disableClicks, {
        once: true
      });
      this._disabledTimer = setTimeout(() => {
        this.elements.header.removeEventListener("pointermove", this._disableClicks);
        this.element.removeEventListener("pointerup", this.toggle);
        this._clicksDisabled = false;
      }, this._clickTime);
    }, 150);
    if (this._clicksDisabled) return;
  }
  _disableClicks = /* @__PURE__ */ __name(() => {
    if (!this._clicksDisabled) {
      this._clicksDisabled = true;
      this._log.fn("disable").debug("Clicks DISABLED");
    }
    this._clicksDisabled = true;
    clearTimeout(this._disabledTimer);
  }, "_disableClicks");
  _resetClicks() {
    this._log.fn("cancel").debug("Clicks ENABLED");
    removeEventListener("pointerup", this.toggle);
    this._clicksDisabled = false;
  }
  //·· Open/Close ······································································¬
  toggle = /* @__PURE__ */ __name(() => {
    this._log.fn("toggle").debug();
    clearTimeout(this._disabledTimer);
    if (this._clicksDisabled) {
      this._resetClicks();
      return;
    }
    if (this.element.classList.contains("fracgui-dragged")) {
      this.element.classList.remove("fracgui-dragged");
      return;
    }
    const state2 = !this.closed.value;
    this.closed.set(state2);
    this.evm.emit("toggle", state2);
  }, "toggle");
  open(updateState = false) {
    this._log.fn("open").debug();
    this.element.classList.remove("closed");
    if (updateState) this.closed.set(false);
    this._clicksDisabled = false;
    this.#toggleAnimClass();
    animateConnector(this, "open");
  }
  close(updateState = false) {
    this._log.fn("close").debug();
    this.element.classList.add("closed");
    if (updateState) this.closed.set(true);
    this._clicksDisabled = false;
    this.#toggleAnimClass();
    animateConnector(this, "close");
  }
  toggleHidden() {
    this._log.fn("toggleHidden").debug();
    this.element.classList.toggle("hidden");
  }
  hide() {
    this._log.fn("hide").error();
    this.element.classList.add("hidden");
  }
  show() {
    this._log.fn("show").debug();
    this.element.classList.remove("hidden");
  }
  #toggleTimeout;
  #toggleAnimClass = /* @__PURE__ */ __name(() => {
    this.element.classList.add("animating");
    clearTimeout(this.#toggleTimeout);
    this.#toggleTimeout = setTimeout(() => {
      this.element.classList.remove("animating");
    }, 600);
  }, "#toggleAnimClass");
  //⌟
  //·· Save/Load ···············································································¬
  resolvePresetId = /* @__PURE__ */ __name((opts) => {
    this._log.fn("resolvePresetId").debug({
      opts,
      this: this
    });
    const getPaths = /* @__PURE__ */ __name((folder) => {
      if (folder.isRootFolder.bind(folder) || !(folder.parentFolder === this)) return [
        folder.title
      ];
      return [
        ...getPaths(folder.parentFolder),
        folder.title
      ];
    }, "getPaths");
    const paths = getPaths(this);
    let presetId = opts?.presetId || paths.join("__");
    if (!presetId) {
      let i = 0;
      for (const child of this.allChildren) {
        if (child.presetId == presetId) i++;
      }
      if (i > 0) presetId += i;
    }
    return presetId;
  }, "resolvePresetId");
  save() {
    this._log.fn("save").debug({
      this: this
    });
    if (this.saveable !== true) {
      throw new Error("Attempted to save unsaveable Folder: " + this.title);
    }
    const preset = {
      __type: "FolderPreset",
      id: this.presetId,
      title: this.title,
      closed: this.closed.value,
      hidden: toFn(this._hidden)(),
      children: this.children.filter((c2) => c2.title !== Gui.settingsFolderTitle && c2.saveable).map((child) => child.save()),
      inputs: Array.from(this.inputs.values()).filter((i) => i.opts.saveable).map((input) => input.save())
    };
    return preset;
  }
  /**
  * Updates all inputs with values from the {@link FolderPreset}.  If the preset has children,
  * those presets will also be passed to the corresponding child folders'
  * {@link Folder.load|`load`} method.
  */
  load(preset) {
    this._log.fn("load").debug({
      preset,
      this: this
    });
    this.closed.set(preset.closed);
    this.hidden = preset.hidden;
    for (const child of this.children) {
      const data = preset.children?.find((f) => f.id === child.presetId);
      if (data) child.load(data);
    }
    for (const input of this.inputs.values()) {
      const data = preset.inputs.find((c2) => c2.presetId === input.id);
      if (data) input.load(data);
    }
  }
  //⌟
  //⌟
  //· Input Generators ·········································································¬
  /**
  * Updates the ui for all inputs belonging to this folder to reflect their current values.
  */
  refresh() {
    this._log.fn("refresh").debug(this);
    for (const input of this.inputs.values()) {
      input.refresh();
    }
  }
  /**
  * Updates the ui for all inputs in this folder and all child folders recursively.
  */
  refreshAll() {
    for (const input of this.allInputs.values()) {
      input.refresh();
    }
    this.evm.emit("refresh");
  }
  addMany(obj, options) {
    const folder = options?.folder ?? this;
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object") {
        if (isColor(value)) {
          this.addColor({
            title: key,
            value
          });
          continue;
        }
        const subFolder = folder.addFolder(key);
        subFolder.addMany(value, {
          folder: subFolder
        });
      } else {
        const opts = {
          title: key,
          value,
          binding: {
            target: obj,
            key
          }
        };
        if (typeof value === "number") {
          if (value > 0) {
            opts.max = value * 2;
            opts.step = value / 10;
            opts.min = 0;
          } else if (value == 0) {
            opts.min = -1;
            opts.step = 0.01;
            opts.max = 1;
          } else {
            opts.min = value * 2;
            opts.step = value / 10;
            opts.max = 0;
          }
        }
        this.add(opts);
      }
    }
  }
  add(titleOrOptions, maybeOptions) {
    const opts = this._resolveOptions(titleOrOptions, maybeOptions);
    const input = this._createInput(opts);
    this.inputs.set(input.id, input);
    this._refreshIcon();
    return input;
  }
  /**
  * Binds an input to a target object and key.  The input will automatically update the target
  * object's key when the input value changes.
  * @param target - The object to bind the input to.
  * @param key - The key of the target object to bind the input to.
  * @param options - The {@link InputOptions}, the type of which is inferred based on the type
  * of the value at the {@link target} object's {@link key}.
  * @example
  * ```ts
  * const gui = new Gui()
  * const params = { foo: 5, bar: 'baz' }
  * const folder = gui.addFolder('params')
  *
  * const numberInput = folder.bind(params, 'foo', { min: 0, max: 10, step: 1 })
  * //    ^? `InputNumber`
  *
  * const textInput = folder.bind(params, 'bar', { maxLength: 50 })
  * //    ^? `InputText`
  */
  bind(target, key, options) {
    const value = target[key];
    const opts = options ?? {};
    opts.title ??= key;
    opts.binding = {
      target,
      key,
      initial: value
    };
    const input = this._createInput(opts);
    this.inputs.set(input.id, input);
    this._refreshIcon();
    return input;
  }
  addNumber(titleOrOptions, maybeOptions) {
    const opts = this._resolveOptions(titleOrOptions, maybeOptions);
    const input = new InputNumber(opts, this);
    this.inputs.set(input.id, input);
    this._refreshIcon();
    return input;
  }
  bindNumber(titleOrTarget, keyOrOptions, options) {
    const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
    const input = new InputNumber(opts, this);
    this.inputs.set(input.title, input);
    this._refreshIcon();
    return input;
  }
  addText(titleOrOptions, maybeOptions) {
    const opts = this._resolveOptions(titleOrOptions, maybeOptions);
    const input = new InputText(opts, this);
    this.inputs.set(input.id, input);
    this._refreshIcon();
    return input;
  }
  bindText(titleOrTarget, keyOrOptions, options) {
    const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
    const input = new InputText(opts, this);
    this.inputs.set(input.title, input);
    this._refreshIcon();
    return input;
  }
  addColor(titleOrOptions, maybeOptions) {
    const opts = this._resolveOptions(titleOrOptions, maybeOptions);
    const input = new InputColor2(opts, this);
    this.inputs.set(input.id, input);
    this._refreshIcon();
    return input;
  }
  bindColor(titleOrTarget, keyOrOptions, options) {
    const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
    const input = new InputColor2(opts, this);
    this.inputs.set(input.title, input);
    this._refreshIcon();
    return input;
  }
  addButton(titleOrOptions, maybeOptions) {
    const opts = this._resolveOptions(titleOrOptions, maybeOptions);
    const input = new InputButton(opts, this);
    this.inputs.set(input.id, input);
    this._refreshIcon();
    return input;
  }
  bindButton(titleOrTarget, keyOrOptions, options) {
    const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
    const input = new InputButton(opts, this);
    this.inputs.set(input.title, input);
    this._refreshIcon();
    return input;
  }
  addButtonGrid(titleOrOptions, maybeOptions) {
    const opts = this._resolveOptions(titleOrOptions, maybeOptions);
    const input = new InputButtonGrid(opts, this);
    this.inputs.set(input.id, input);
    this._refreshIcon();
    return input;
  }
  bindButtonGrid(titleOrTarget, keyOrOptions, options) {
    const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
    const input = new InputButtonGrid(opts, this);
    this.inputs.set(input.title, input);
    this._refreshIcon();
    return input;
  }
  addSelect(titleOrOptions, maybeOptions) {
    const opts = this._resolveOptions(titleOrOptions, maybeOptions);
    const input = new InputSelect(opts, this);
    this.inputs.set(input.id, input);
    this._refreshIcon();
    return input;
  }
  bindSelect(titleOrTarget, keyOrOptions, options) {
    const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
    const input = new InputSelect(opts, this);
    this.inputs.set(input.title, input);
    this._refreshIcon();
    return input;
  }
  addSwitch(titleOrOptions, maybeOptions) {
    const opts = this._resolveOptions(titleOrOptions, maybeOptions);
    const input = new InputSwitch(opts, this);
    this.inputs.set(input.id, input);
    this._refreshIcon();
    return input;
  }
  bindSwitch(titleOrTarget, keyOrOptions, options) {
    const opts = this._resolveBinding(titleOrTarget, keyOrOptions, options);
    const input = new InputSwitch(opts, this);
    this.inputs.set(input.title, input);
    this._refreshIcon();
    return input;
  }
  /**
  * Does validation / error handling.
  * If no title was provided, this method will also assign the binding key to the title.
  * @returns The processed options.
  */
  _validateOptions(options, validate) {
    if (options.binding?.key && !options.title) {
      options.title = options.binding.key;
    }
    if (validate) {
      const b2 = options.binding;
      let value = options.value;
      if (!value) {
        value = b2?.target[b2?.key];
      }
      if (!value) {
        if (b2) {
          let err = false;
          if (typeof b2.target === "undefined") {
            err = true;
            console.error(`\x1B[96mgooey\x1B[39m ~ \x1B[91mError\x1B[39m Binding "target" is undefined:`, b2);
          }
          if (typeof b2.key === "undefined") {
            err = true;
            console.error(`\x1B[96mgooey\x1B[39m ~ \x1B[91mError\x1B[39m Binding "key" is undefined:`, b2);
          }
          if (typeof b2.target[b2.key] === "undefined") {
            err = true;
            console.error(`\x1B[96mgooey\x1B[39m ~ \x1B[91mError\x1B[39m The provided binding key \x1B[33m"${b2.key}"\x1B[39m does not exist on provided \x1B[33mtarget\x1B[39m:`, b2);
          }
          if (err) {
            throw new Error("gooey ~ Failed to bind input to the provided target object.", {
              cause: options
            });
          }
        } else {
          throw new Error("gooey ~ No value or binding provided.", {
            cause: options
          });
        }
      }
    }
    return options;
  }
  _createInput(options) {
    this._log.fn("#createInput").debug(this);
    const type = this._resolveType(options);
    options = this._validateOptions(options);
    switch (type) {
      case "InputText":
        return new InputText(options, this);
      case "InputNumber":
        return new InputNumber(options, this);
      case "InputColor":
        return new InputColor2(options, this);
      case "InputSelect":
        return new InputSelect(options, this);
      case "InputButton":
        return new InputButton(options, this);
      case "InputSwitch":
        return new InputSwitch(options, this);
    }
    throw new Error("Invalid input type: " + type + " for options: " + options);
  }
  _resolveOptions(titleOrOptions, maybeOptions) {
    const twoArgs = typeof titleOrOptions === "string" && typeof maybeOptions === "object";
    const title = twoArgs ? titleOrOptions : maybeOptions?.title ?? "";
    const options = twoArgs ? maybeOptions : titleOrOptions;
    options.title ??= title;
    return options;
  }
  _resolveBinding(titleOrTarget, keyOrOptions, options) {
    let opts;
    let shouldHaveValue = false;
    if (typeof titleOrTarget === "string") {
      opts = keyOrOptions ?? {};
      opts.title = titleOrTarget;
    } else {
      shouldHaveValue = true;
      const target = titleOrTarget;
      const key = keyOrOptions;
      opts = options ?? {};
      opts.binding = {
        target,
        key,
        initial: target[key]
      };
    }
    return this._validateOptions(opts, shouldHaveValue);
  }
  _resolveType(options) {
    this._log.fn("resolveType").debug({
      options,
      this: this
    });
    let value = options.value ?? options.binding?.target[options.binding.key];
    if ("onClick" in options) {
      return "InputButton";
    }
    if ("options" in options && Array.isArray(options.options) || isLabeledOption(value)) {
      value ??= options.options[0];
      options.value ??= value;
      return "InputSelect";
    }
    switch (typeof value) {
      case "boolean": {
        return "InputSwitch";
      }
      case "number": {
        return "InputNumber";
      }
      case "string": {
        if (isColorFormat(value)) return "InputColor";
        return "InputText";
      }
      case "function": {
        return "InputButton";
      }
      case "object": {
        if (Array.isArray(value)) {
          return "InputSelect";
        }
        if (isColor(value)) {
          return "InputColor";
        }
        if (isLabeledOption(value)) {
          return "InputSelect";
        }
        throw new Error("Invalid input view: " + JSON.stringify(value));
      }
      default: {
        throw new Error("Invalid input view: " + value);
      }
    }
  }
  //⌟
  //· Elements ·················································································¬
  _createElement(el) {
    this._log.fn("#createElement").debug({
      el,
      this: this
    });
    if (this.isRoot) {
      return create("div", {
        id: `fracgui-root_${this.id}`,
        classes: [
          "fracgui-root",
          "fracgui-folder",
          "closed"
        ],
        dataset: {
          theme: this.gui.theme ?? "default"
        },
        parent: el
      });
    }
    return create("div", {
      parent: this.parentFolder.elements.content,
      classes: [
        "fracgui-folder",
        "closed"
      ]
    });
  }
  _createElements(element) {
    this._log.fn("#createElements").debug({
      element,
      this: this
    });
    const header = create("div", {
      parent: element,
      classes: [
        "fracgui-header"
      ]
    });
    header.addEventListener("pointerdown", this._handleClick.bind(this));
    const title = create("div", {
      parent: header,
      classes: [
        "fracgui-title"
      ],
      textContent: this.title
    });
    const toolbar = create("div", {
      parent: header,
      classes: [
        "fracgui-toolbar"
      ]
    });
    const contentWrapper = create("div", {
      classes: [
        "fracgui-content-wrapper"
      ],
      parent: element
    });
    const content = create("div", {
      classes: [
        "fracgui-content"
      ],
      parent: contentWrapper
    });
    return {
      header,
      toolbar: {
        container: toolbar
      },
      title,
      contentWrapper,
      content
    };
  }
  //⌟
  //· SVG's ····················································································¬
  async _createGraphics(headerless = false) {
    this._log.fn("createGraphics").debug({
      this: this
    });
    await Promise.resolve();
    if (!this.isRootFolder()) {
      this.graphics = {
        icon: createFolderSvg(this)
      };
      this.elements.header.prepend(this.graphics.icon);
      if (!headerless) {
        this.graphics.connector = createFolderConnector(this);
        this.element.prepend(this.graphics.connector.container);
      }
    }
    if (DEV) new TerminalSvg(this);
  }
  _createSvgs() {
    this._log.fn("#createSvgs").debug({
      this: this
    });
  }
  get hue() {
    const localIndex = this.parentFolder.children.indexOf(this);
    const i = this.parentFolder.isRootFolder() ? localIndex - 1 : localIndex;
    const depth = this._depth - 1;
    return i * 20 + depth * 80;
  }
  _refreshIcon() {
    this._log.fn("#refreshIcon").debug(this);
    if (this.graphics) {
      this.graphics.icon.replaceWith(createFolderSvg(this));
    }
  }
  //⌟
  disposed = false;
  dispose() {
    if (this.disposed && DEV) {
      this._log.fn("dispose").error("Already disposed.", this);
      return;
    }
    this.elements.header.removeEventListener("click", this.toggle);
    this.elements.header.addEventListener("pointerdown", this._handleClick);
    this.element.remove();
    for (const input of this.inputs.values()) {
      input.dispose();
    }
    for (const child of this.children) {
      child.dispose();
    }
    try {
      this.parentFolder.children.splice(this.parentFolder.children.indexOf(this), 1);
    } catch (err) {
      this._log.fn("dispose").error("Error removing folder from parent", {
        err
      });
    }
    this.disposed = true;
  }
};

// src/Gui.ts
var GUI_STORAGE_DEFAULTS = {
  __type: "GuiStorageOptions",
  key: "fracgui",
  closed: true,
  theme: true,
  presets: true,
  position: false,
  size: false
};
var GUI_WINDOWMANAGER_DEFAULTS = {
  __type: "WindowManagerOptions",
  preserveZ: false,
  zFloor: 0,
  bounds: void 0,
  obstacles: void 0,
  resizable: {
    grabberSize: 9,
    color: "var(--bg-d)",
    sides: [
      "right",
      "left"
    ],
    corners: []
  },
  draggable: {
    bounds: void 0,
    classes: {
      default: "fracgui-draggable",
      dragging: "fracgui-dragging",
      cancel: "fracgui-cancel",
      dragged: "fracgui-dragged"
    }
  }
};
var GUI_DEFAULTS = {
  __type: "GuiOptions",
  title: "gui",
  storage: false,
  closed: false,
  position: "top-right",
  margin: 16,
  container: "body",
  theme: "default",
  themeMode: "dark",
  themes: [
    default_default,
    flat_default,
    scout_default
  ],
  resizable: true,
  draggable: true
};
var Gui = class _Gui {
  static {
    __name(this, "Gui");
  }
  __type = "Gui";
  id = nanoid();
  folder;
  /**
  * The initial options passed to the gui.
  */
  opts;
  /**
  * Whether the gui root folder is currently collapsed.
  */
  closed;
  /**
  * The {@link PresetManager} instance for the gui.
  */
  presetManager;
  /**
  * Whether any of the inputs have been changed from their default values in the active preset.
  */
  dirty = false;
  wrapper;
  container;
  settingsFolder;
  static settingsFolderTitle = "fracgui-settings-folder";
  /**
  * The {@link UndoManager} instance for the gui, handling undo/redo functionality.
  * @internal
  */
  _undoManager = new UndoManager();
  themer;
  themeEditor;
  windowManager;
  /**
  * `false` if this {@link Gui}'s {@link WindowManager} belongs to an existing, external
  * instance _(i.e. a separate {@link Gui} instance or custom {@link WindowManager})_.  The
  * {@link WindowManager} will be disposed when this {@link Gui} is disposed.
  * @internal
  */
  _isWindowManagerOwner = false;
  /**
  * The time of the gui's creation.
  * @internal
  */
  _birthday = Date.now();
  /**
  * The number of milliseconds post-instantiation to watch for adders for repositioning.
  * @internal
  */
  _honeymoon = 1e3;
  _theme;
  _log;
  // Forwarding the Folder API...
  on;
  addFolder(title, options) {
    if (this._honeymoon && this._birthday - Date.now() < 1e3) {
      this._honeymoon = false;
      this._reveal(true);
    }
    return this.folder.addFolder(title, options);
  }
  add;
  addMany;
  addButtonGrid;
  addSelect;
  addButton;
  addText;
  addNumber;
  addSwitch;
  addColor;
  constructor(options) {
    const opts = deepMergeOpts([
      GUI_DEFAULTS,
      options ?? {}
    ], {
      concatArrays: false
    });
    opts.container ??= document.body;
    let reposition = false;
    if (typeof opts.storage === "object") {
      opts.storage = Object.assign({}, GUI_STORAGE_DEFAULTS, opts.storage);
    }
    const storageOpts = resolveOpts(opts.storage, GUI_STORAGE_DEFAULTS);
    if (storageOpts) {
      opts.storage = {
        ...storageOpts,
        key: `${storageOpts.key}::${opts.title?.toLowerCase().replaceAll(/\s/g, "-")}`
      };
      if (!(`${opts.storage.key}::wm::0::position` in localStorage)) {
        reposition = true;
      }
    } else {
      reposition = true;
    }
    this.opts = opts;
    this._log = new Logger(`Gui ${this.opts.title}`, {
      fg: "palevioletred"
    });
    this._log.fn("constructor").debug({
      options,
      opts
    });
    this.container = select(this.opts.container)[0];
    this.wrapper = create("div", {
      classes: [
        "fracgui-wrapper"
      ],
      style: {
        display: "contents"
      },
      parent: this.container
    });
    this.folder = new Folder2({
      ...this.opts,
      __type: "FolderOptions",
      container: this.wrapper,
      // @ts-expect-error @internal
      gui: this
    });
    this.on = this.folder.on.bind(this.folder);
    this.addFolder = this.folder.addFolder.bind(this.folder);
    this.add = this.folder.add.bind(this.folder);
    this.addMany = this.folder.addMany.bind(this.folder);
    this.addButtonGrid = this.folder.addButtonGrid.bind(this.folder);
    this.addSelect = this.folder.addSelect.bind(this.folder);
    this.addButton = this.folder.addButton.bind(this.folder);
    this.addText = this.folder.addText.bind(this.folder);
    this.addNumber = this.folder.addNumber.bind(this.folder);
    this.addSwitch = this.folder.addSwitch.bind(this.folder);
    this.addColor = this.folder.addColor.bind(this.folder);
    const handleUndoRedo = /* @__PURE__ */ __name((e) => {
      if (globalThis.navigator?.userAgent?.match(/mac/i)) {
        if (e.metaKey && e.key === "z") {
          e.preventDefault();
          e.shiftKey ? this._undoManager.redo() : this._undoManager.undo();
        }
      } else if (e.ctrlKey) {
        if (e.key === "z") {
          e.preventDefault();
          this._undoManager.undo();
        }
        if (e.key === "y") {
          e.preventDefault();
          this._undoManager.redo();
        }
      }
    }, "handleUndoRedo");
    removeEventListener("keydown", handleUndoRedo);
    addEventListener("keydown", handleUndoRedo);
    this.closed = state(!!this.opts.closed, {
      key: this.opts.storage ? `${this.opts.storage.key}::closed` : void 0
    });
    this.folder.elements.toolbar.settingsButton = this._createSettingsButton(this.folder.elements.toolbar.container);
    this.settingsFolder = this.folder.addFolder(_Gui.settingsFolderTitle, {
      closed: true,
      hidden: false,
      // @ts-expect-error @internal
      _headerless: true
    });
    this.themer = this.opts._themer ?? this._createThemer(this.settingsFolder);
    this.theme = this.opts.theme;
    this.presetManager = this._createPresetManager(this.settingsFolder);
    this.applyAltStyle(this.settingsFolder);
    this.windowManager ??= this._createWindowManager(this.opts, this.opts.storage);
    this._reveal(reposition);
    return this;
  }
  async _reveal(reposition) {
    await Promise.resolve();
    if (!this.container) return;
    const ghost = this.wrapper.cloneNode(true);
    ghost.style.visibility = "hidden";
    this.container.prepend(ghost);
    const rect = ghost.children[0].getBoundingClientRect();
    ghost.remove();
    if (typeof this.opts.position === "string") {
      const placementPosition = place(rect, this.opts.position, {
        bounds: this.opts.container,
        margin: this.opts.margin
      });
      if (reposition || this.opts.storage && this.opts.storage.position === false) {
        const win = this.windowManager?.windows.get(this.folder.element.id);
        if (win?.draggableInstance) {
          win.draggableInstance.position = placementPosition;
        }
      } else {
        console.error("//todo - set position here or enforce window manager");
      }
    }
    this.container.appendChild(this.wrapper);
    this.folder.element.animate([
      {
        opacity: 0
      },
      {
        opacity: 1
      }
    ], {
      fill: "none",
      duration: 400
    });
  }
  _createPresetManager(settingsFolder) {
    const { presets, defaultPreset, storage } = this.opts;
    let localStorageKey;
    if (typeof storage === "object" && storage.presets) {
      localStorageKey = storage.key + "::presets";
    }
    return new PresetManager(this, settingsFolder, {
      presets,
      defaultPreset,
      localStorageKey
    });
  }
  _createWindowManager(options, storageOpts) {
    if (this.windowManager) return this.windowManager;
    let dragOpts = void 0;
    if (this.opts.draggable) {
      dragOpts = Object.assign({}, GUI_WINDOWMANAGER_DEFAULTS.draggable);
      dragOpts.handle = this.folder.elements.header;
      dragOpts.position = this.opts.position;
      dragOpts.localStorageKey = storageOpts && storageOpts.key ? storageOpts.key : void 0;
      dragOpts.bounds = this.container;
      if (storageOpts && storageOpts.position === false) {
        dragOpts.localStorageKey = void 0;
      }
    }
    let resizeOpts = void 0;
    if (this.opts.resizable) {
      resizeOpts = Object.assign({}, GUI_WINDOWMANAGER_DEFAULTS.resizable);
      resizeOpts.bounds = this.container;
      resizeOpts.localStorageKey = storageOpts && storageOpts.key ? storageOpts.key : void 0;
      if (storageOpts && storageOpts.size === false) {
        resizeOpts.localStorageKey = void 0;
      }
    }
    if (options?._windowManager instanceof WindowManager) {
      const windowManager2 = options._windowManager;
      windowManager2.add(this.folder.element, {
        id: this.id,
        resizable: resizeOpts,
        draggable: dragOpts
      });
      return windowManager2;
    }
    const windowManagerOpts = resolveOpts({
      ...GUI_WINDOWMANAGER_DEFAULTS,
      draggable: dragOpts,
      resizable: resizeOpts
    }, WINDOWMANAGER_DEFAULTS);
    this._log.fn("_createWindowManager").debug({
      windowManagerOpts,
      options,
      opts: this.opts,
      dragOpts,
      resizeOpts
    });
    const windowManager = new WindowManager({
      ...windowManagerOpts,
      draggable: dragOpts,
      resizable: resizeOpts
    });
    this._isWindowManagerOwner = true;
    windowManager.add(this.folder.element, {
      id: this.id
    });
    return windowManager;
  }
  set theme(theme) {
    this._theme = theme;
    this.folder.element.setAttribute("theme", theme);
    this.folder.element.setAttribute("mode", this.themer.mode.value);
  }
  get theme() {
    return this._theme;
  }
  /**
  * Saves the current gui state as a preset.
  */
  save(title, id = nanoid(10)) {
    const preset = {
      __type: "GuiPreset",
      __version: 0,
      id,
      title,
      data: this.folder.save()
    };
    return preset;
  }
  /**
  * Loads a given preset into the gui, updating all inputs.
  */
  load(preset) {
    this._log.fn("load").debug({
      preset
    });
    this.dirty = false;
    this.lockCommits(preset);
    this.folder.load(preset.data);
    Promise.resolve().then(() => this.unlockCommits());
  }
  _undoLock = false;
  lockCommit = {
    from: void 0
  };
  /**
  * Commits a change to the input's value to the undo manager.
  */
  commit(commit) {
    if (this._undoLock) {
      this._log.fn("commit").debug("LOCKED: prevented commit while locked");
      return;
    }
    this._log.fn("commit").debug("commited", commit);
    this._undoManager?.commit(commit);
  }
  /**
  * Prevents the input from registering undo history, storing the initial
  * for the eventual commit in {@link unlockCommits}.
  */
  lockCommits = /* @__PURE__ */ __name((from) => {
    this._undoManager.lockedExternally = true;
    this.lockCommit.from = from;
    this._log.fn(o("lock")).debug("commit", {
      from,
      lockCommit: this.lockCommit
    });
  }, "lockCommits");
  /**
  * Unlocks commits and saves the current commit stored in lock.
  */
  unlockCommits = /* @__PURE__ */ __name((commit) => {
    commit ??= {};
    commit.target ??= this;
    commit.from ??= this.lockCommit.from;
    this._undoManager.lockedExternally = false;
    this.commit(commit);
    this._log.fn(o("unlock")).debug("commit", {
      commit,
      lockCommit: this.lockCommit
    });
  }, "unlockCommits");
  _createThemer(folder) {
    this._log.fn("createThemer").debug({
      folder
    });
    let finalThemer = void 0;
    const themer = this.opts._themer;
    const themerOptions = {
      localStorageKey: this.opts.storage ? this.opts.storage.key + "::themer" : void 0,
      mode: this.opts.themeMode,
      autoInit: !this.themer,
      persistent: !!(this.opts.storage && this.opts.storage.theme),
      themes: this.opts.themes,
      theme: this.opts.themes.find((t) => t.title === this.opts.theme),
      vars: GUI_VARS
    };
    themerOptions.vars = deepMergeOpts([
      GUI_VARS,
      themerOptions.vars
    ]);
    if (themer) {
      finalThemer = themer;
    } else {
      themerOptions.wrapper = this.wrapper;
      finalThemer = new Themer(this.folder.element, themerOptions);
    }
    this.folder.evm.add(finalThemer.mode.subscribe(() => {
      if (this.settingsFolder) {
        this.applyAltStyle(this.settingsFolder);
      }
    }));
    const uiFolder = folder.addFolder("ui", {
      closed: true
    });
    uiFolder.on("mount", () => {
      uiFolder.graphics?.connector?.svg.style.setProperty("filter", "saturate(0.1)");
      uiFolder.graphics?.icon.style.setProperty("filter", "saturate(0)");
    });
    if (folder) {
      uiFolder.addSelect({
        title: "theme",
        labelKey: "title",
        options: finalThemer.themes.value,
        binding: {
          target: finalThemer,
          key: "theme"
        }
      });
      uiFolder.addButtonGrid({
        title: "mode",
        activeOnClick: true,
        value: [
          [
            "light",
            "dark",
            "system"
          ].map((m2) => ({
            text: m2,
            onClick: /* @__PURE__ */ __name(() => finalThemer?.mode.set(m2), "onClick"),
            active: /* @__PURE__ */ __name(() => finalThemer?.mode.value === m2, "active")
          }))
        ]
      });
    }
    return finalThemer;
  }
  isGui() {
    return this.__type === "Gui";
  }
  _createSettingsButton(parent) {
    const button = create("button", {
      parent,
      classes: [
        "fracgui-toolbar-item",
        "fracgui-settings-button"
      ],
      innerHTML: settings_icon_default,
      tooltip: {
        text: /* @__PURE__ */ __name(() => {
          return this.settingsFolder?.closed.value ? "Open Settings" : "Close Settings";
        }, "text"),
        placement: "left",
        delay: 750,
        delayOut: 0,
        hideOnClick: true
      }
    });
    button.addEventListener("click", () => {
      this.settingsFolder.toggle();
      this.folder.elements.toolbar.settingsButton?.classList.toggle("open", !this.settingsFolder.closed.value);
    });
    return button;
  }
  // todo - convert this crap to a css utility class
  applyAltStyle(folder) {
    this._setVar(folder.elements.content, `box-shadow`, `0px 0px 10px 0px hsl(10deg, 0%, var(--${VAR_PREFIX}-shadow-lightness), inset`);
    folder.elements.content.style.setProperty("background", `--${VAR_PREFIX}-folder_background`);
    this._setProps(folder.element, [
      [
        "background",
        `color-mix(in sRGB, var(--${VAR_PREFIX}-bg-b) 100%, transparent)`
      ]
    ]);
    switch (this.themer?.activeMode) {
      case "dark": {
        this._setVars(folder.elements.contentWrapper, [
          //- ['input-container_background', `var(--${VAR_PREFIX}-bg-b)`],
          [
            "input-container_color",
            `var(--${VAR_PREFIX}-fg-b)`
          ],
          [
            "folder-header_background",
            `color-mix(in sRGB, var(--${VAR_PREFIX}-bg-a) 75%, transparent)`
          ],
          [
            "controller-dim_background",
            `color-mix(in sRGB, var(--${VAR_PREFIX}-bg-a) 50%, transparent)`
          ],
          [
            "controller_background",
            `color-mix(in sRGB, var(--${VAR_PREFIX}-bg-c) 50%, transparent)`
          ]
        ]);
        break;
      }
      case "light": {
        this._setVars(folder.elements.contentWrapper, [
          [
            "folder-header_background",
            `color-mix(in sRGB, var(--${VAR_PREFIX}-bg-a) 60%, transparent)`
          ],
          [
            "controller_background",
            `var(--${VAR_PREFIX}-light-a)`
          ]
        ]);
        break;
      }
    }
  }
  _setProps(el, props) {
    for (const [k, v] of props) {
      el.style.setProperty(k, v);
    }
  }
  _setVar(el, key, value) {
    el.style.setProperty(`--${VAR_PREFIX}-${key}`, value);
    Promise.resolve().then(() => {
      if (!el.style.getPropertyValue(`--${VAR_PREFIX}-${key}`)) {
        console.warn(`No property found for --${VAR_PREFIX}-${key}`);
      }
    });
  }
  _setVars(el, props) {
    for (const [key, value] of props) {
      this._setVar(el, key, value);
    }
  }
  dispose = /* @__PURE__ */ __name(() => {
    this._log.fn("dispose").debug(this);
    this.themer?.dispose();
    if (this._isWindowManagerOwner) {
      this.windowManager?.dispose();
      this.container?.remove();
    }
    this.settingsFolder?.dispose();
    this.folder?.dispose();
  }, "dispose");
};
export {
  Color,
  Folder2 as Folder,
  GUI_DEFAULTS,
  GUI_STORAGE_DEFAULTS,
  GUI_WINDOWMANAGER_DEFAULTS,
  Gui,
  isColor,
  isColorFormat,
  parseColorFormat,
  state
};
