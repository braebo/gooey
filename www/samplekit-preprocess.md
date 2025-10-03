# Samplekit Preprocess

## Code Decoration
The @samplekit/preprocess-shiki npm package and samplekit.svelte-pp-shiki VS Code extension allow you to write code blocks to be decorated by Shiki directly within your Svelte template.

## Feature Overview
Write decorated code in your Svelte.
const focusedFeature = () => {
	return 'spotlight'; 
}
@samplekit/preprocess-shiki wraps Shiki, a package that parses code blocks, converts them to HTML, and adds CSS variables. You can pass a custom Shiki Highlighter, provide custom themes and languages, or use the themes and languages bundled with Shiki. Because you have full control over the output CSS, you can style however you'd like!
Work with existing tooling.
By using a shiki- delimiter inside regular HTML comments, authoring in normal .svelte files is possible. It also ensures Prettier, ESLint, svelte-check, svelte.svelte-vscode, etc. leave the code alone. This lightweight approach preserves your control over the DOM and means there's no need to invent a new file extension like .svx or to disable other tools. The Shiki blocks are processed into regular HTML with CSS variables before Svelte sees it. If the preprocessor isn't installed yet, nothing breaks – the code simply turns into an HTML comment. There's also a complementary preprocessor which handles generic markdown using Marked.

Add any data attributes or class to any line, substring, or index range.
// btw, it works with tailwind too
There are no fixed highlight or diff classes. Simply write c"bazinga" to add a bazinga class and s"tailwind" to highlight the tailwind substring. This works by wrapping Shiki's Decorations API.
Write inline code too.
You can easily show off something like const foo on the same line by writing: <!-- shiki-ts const foo shiki-ts -->. More generally, you can register custom default properties and ShikiTransformers to transform the decorated HTML in any way you'd like.
Code with TextMate support.
The VS Code extension detects the default languages and injects code syntax highlighting directly into your Svelte files. Because VS Code and Shiki both use TextMate grammar, you can easily configure your rendered output to match your code editor. This is what it looks like while editing in a .svelte file with the Darker theme installed:
<!-- shiki-start
```css
pre[data-shiki-block] code > [data-line-diff-add]::before {
	content: '+';
	color: hsl(var(--success-9));
}
```
shiki-end -->

## Installation
Install the preprocessor
pnpm add -D @samplekit/preprocess-shiki
Add to svelte.config.js
import { createShikiLogger, processCodeblockSync, getOrLoadOpts } from '@samplekit/preprocess-shiki';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const opts = await getOrLoadOpts();

const preprocessorRoot = `${import.meta.dirname}/src/routes/`;
const formatFilename = (/** @type {string} */ filename) => filename.replace(preprocessorRoot, '');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		processCodeblockSync({
			include: (filename) => filename.startsWith(preprocessorRoot),
			logger: createShikiLogger(formatFilename),
			opts,
		}),
		vitePreprocess(),
	],
	kit: {
		adapter: adapter(),
	},
};

export default config;

## Note
Among other customizations, getOrLoadOpts() accepts a Shiki Highlighter or a combination of custom themes/languages and Shiki pre-bundled theme/language names. If none are provided, it creates a default. Every language you've loaded will be available to the preprocessor in inline and fenced code.

## Install the VS Code extension (for snippets and syntax highlighting)
samplekit.svelte-pp-shiki
Example Usage
Inline Code
Author with the highlighting extension:

<!-- shiki-ts const foo = "bar"; shiki-ts -->
Author without the highlighting extension:

<!-- shiki-ts const foo = "bar"; shiki-ts -->
Rendered with custom CSS: const foo = "bar";
Fenced Code
Author with the highlighting extension:

<!-- shiki-start
l"2" d"highlight"
```ts
console.log('hello world');
const highlighted = true;
```
shiki-end -->
Author without the highlighting extension:

<!-- shiki-start
l"2" d"highlight"
```ts
console.log('hello world');
const highlightedLine = true;
```
shiki-end -->
Rendered with custom CSS:

console.log('hello world');
const highlightedLine = true;
Tip
The l and d between the delimiter and code fence stand for line range and data attribute respectively. Lines of option groups such as this one are how you define decorations. You can also add classes with "c" and target different locations using "s" for substring, "i" for index range, "L" for all lines, or "p" for pre. See Decoration Options for details.
Output Structure
The preprocessor transpiles the code to HTML and injects styles that you can target with CSS. If no cssVarToThemeName is defined in opts, the default is used: { dark: 'darker', light: 'rose-pine-dawn' } . The opts parameter used on this site includes the default custom theme – Darker – and two extra Shiki bundled themes:
const opts = await getOrLoadOpts({
	highlighter: {
		lang: { bundled: ['svelte', 'latex'] },
		theme: { bundled: ['rose-pine-dawn', 'catppuccin-latte'] }, // to remove 'darker', pass in custom: []
		cssVarToThemeName: { daffodil: 'rose-pine-dawn', dark: 'darker', bellflower: 'catppuccin-latte' },
	},
});
Each definition provided to cssVarToThemeName outputs a css variable on the HTML prepended with cssVarPrefix.

<pre style="--h-daffodil:#575279;--h-dark:#D4D4D4;--h-bellflower:#4c4f69;--h-daffodil-bg:#faf4ed;--h-dark-bg:#000;--h-bellflower-bg:#eff1f5" data-shiki="" data-shiki-lang-ts="" data-shiki-t-block=""><code><span data-line=""><span style="--h-daffodil:#575279;--h-dark:#9CDCFE;--h-bellflower:#4C4F69;--h-daffodil-font-style:italic;--h-dark-font-style:inherit;--h-bellflower-font-style:inherit">console</span><span style="--h-daffodil:#286983;--h-dark:#D4D4D4;--h-bellflower:#179299">.</span><span style="--h-daffodil:#D7827E;--h-dark:#DCDCAA;--h-bellflower:#1E66F5;--h-daffodil-font-style:inherit;--h-dark-font-style:inherit;--h-bellflower-font-style:italic">log</span><span style="--h-daffodil:#575279;--h-dark:#D4D4D4;--h-bellflower:#4C4F69">(</span><span style="--h-daffodil:#EA9D34;--h-dark:#CE9178;--h-bellflower:#40A02B">'hello world'</span><span style="--h-daffodil:#575279;--h-dark:#D4D4D4;--h-bellflower:#4C4F69">)</span><span style="--h-daffodil:#797593;--h-dark:#D4D4D4;--h-bellflower:#7C7F93">;</span></span>
<span data-line="" data-line-highlight=""><span style="--h-daffodil:#286983;--h-dark:#569CD6;--h-bellflower:#8839EF;--h-daffodil-font-style:inherit;--h-dark-font-style:italic;--h-bellflower-font-style:inherit">const</span><span style="--h-daffodil:#575279;--h-dark:#4FC1FF;--h-bellflower:#4C4F69;--h-daffodil-font-style:italic;--h-dark-font-style:inherit;--h-bellflower-font-style:inherit"> highlighted</span><span style="--h-daffodil:#286983;--h-dark:#D4D4D4;--h-bellflower:#179299"> =</span><span style="--h-daffodil:#D7827E;--h-dark:#569CD6;--h-bellflower:#FE640B;--h-daffodil-font-style:inherit;--h-dark-font-style:italic;--h-bellflower-font-style:inherit"> true</span><span style="--h-daffodil:#797593;--h-dark:#D4D4D4;--h-bellflower:#7C7F93">;</span></span></code></pre>
Info
By default, the <pre> tag has data attributes containing the language and transform. Each line is wrapped in <span data-line> and each index or substring match is wrapped in <span data-window>. This is determined by the transform map and is fully customizable.
Decoration Options
There are no fixed Shiki Transformers to use. Instead, you can write any arbitrary data property or class with some simple syntax between the opening delimiter and code fence (either ``` or ~~~). Each option group requires at least one value and one location.

Locations and Values
Kind	Description	Example
location	line range	l"3" or l"5-7"
location	substring	s"console"
location	index range	i"3-5"
location	all lines	L
location	pre	p
value	class	c"focus"
value	data attribute	d"highlight"
Info
Line and index ranges start at 1. You can write multiple lines or multiple options on one line. For example, l"4-7" l"15" c"highlight" d"diff-add" will add class .highlight and data-line-diff-add to lines 4-7 and 15.
Important
All code fenced lines have data-line. The <pre> tag has data attributes as well. Adjust the defaults via the transform map.
Basic Examples
To add the data-line-highlight property on line 1, write it like so:

<!-- shiki-start
l"1" d"highlight"
```ts
const highlighted = true;
```
shiki-end -->
const highlighted = true;
To highlight the first 5 characters using custom tailwind classes:

<!-- shiki-start
i"1-5" c"bg-gradient-to-r from-accent-5/50 to-accent-9/75"
```ts
const highlighted = true;
```
shiki-end -->
const highlighted = true;
To highlight the word `highlight`:

<!-- shiki-start
d"highlight" s"highlight"
```ts
const highlighted = true;
```
shiki-end -->
const highlighted = true;
To highlight the word `foo` on lines 2 and 3:

<!-- shiki-start
l"2-3" d"highlight" s"foo"
```md
If every foo has its bar,
and every bar has its foo,
what is a quux foo bar?
```
shiki-end -->
If every foo has its bar,
and every bar has its foo,
what is a quux foo bar?
To highlight the 4th to 51st characters starting on line 2:

<!-- shiki-start
l"2-3" d"highlight" i"4-51"
```md
# Problem:
If every foo has its bar,
and every bar has its foo,
what is a quux foo bar?
```
shiki-end -->
# Problem:
If every foo has its bar,
and every bar has its foo,
what is a quux foo bar?
Inline Options
You can also write inline syntax using //! and the same d, c, s, i options as above. The attribute or class always applies to the line you're on, so you can't use l, L, or p after //!. To add data-has-focus to the <pre> element and the .focus class on the line with `spotlight`:
<!-- shiki-start
d"has-focus" p
```ts
const focusedFeature = () => {
	return 'spotlight'; //! c"focus"
}
```
shiki-end -->
const focusedFeature = () => {
	return 'spotlight'; 
}
Note
Writing //!p will render //! and ignore the option.
Options with Quotes
The option strings are similar to Rust raw string literals. To match foo, write s"foo".

<!-- shiki-start
d"highlight" s"foo"
```ts
const myString = `works!foo`;
```
shiki-end -->
const myString = `works!foo`;
If you want to match quotation marks – such as "foo" – wrap your string in a # delimiter like so: s#""foo""#.

<!-- shiki-start
d"highlight" s#""foo""#
```ts
const myString = `works!"foo"`;
```
shiki-end -->
const myString = `works!"foo"`;
If for some bizarre reason you needed to match "#, use two # like so: s##"foo"#"##.

<!-- shiki-start
d"highlight" s##"foo"#"##
```ts
const myWeirdString = `works!"foo"#bar`;
```
shiki-end -->
const myWeirdString = `works!"foo"#bar`;
This method works for an infinite amount of # until your computer gives up the ghost.

Escaping
\n will match the literal string "\n". If you want it to match the newline character, escape it: \\n. The same goes for \, \t, and \r.

<!-- shiki-start
p c"no-lines"
d"highlight" s"foo\\n\\tbar"
```ts
const multiLineMatch = `foo
	bar`
```
shiki-end -->
const multiLineMatch = `foo
	bar`
Hide
There is one special data attribute: hide. This attribute removes those decorated nodes alongside their newline characters. Why? Consider the following two code blocks:

public method({ prop }: { prop: Prop }): void {
	this.guard(prop);
	this.#foo = prop.foo + 42;
}
public method({ prop }: { prop: Prop }): void {
	this.guard(prop);
	this.#foo = prop.foo + 42;
}
Notice how the visibility modifier and types are correctly decorated in the first but broken in the second? That's because we wrote the first so Shiki understands it's within a class:

<!-- shiki-start
```ts
export class Klass { //! d"hide"
public method({ prop }: { prop: Prop }): void {
	this.guard(prop);
	this.#foo = prop.foo + 42;
}
} //! d"hide"
```
shiki-end -->
<!-- shiki-start
```ts
public method({ prop }: { prop: Prop }): void {
	this.guard(prop);
	this.#foo = prop.foo + 42;
}
```
shiki-end -->

Themes and Languages
In addition to providing your own Shiki highlighter, the default languages and themes can easily be changed:

const defaultBundledLangNames = ['svelte', 'diff', 'json', 'sh', 'sql'];
const defaultCssVarToThemeName = { dark: 'darker', light: 'rose-pine-dawn' };
const defaultcssVarPrefix = '--h-';
const opts = await getOrLoadOpts({
	highlighter: {
		lang: { custom: [], bundled: ['svelte', 'json', 'sh', 'latex'] },
		theme: { custom: [], bundled: ['dracula', 'vitesse-light'] },
		cssVarToThemeName: { drac: 'dracula',  vl: 'vitesse-light' },
	},
	cssVarPrefix: '--decorated-'
});
Transform Map
The preprocessor first separates the raw string into code, language, decorations, and transform name. If it finds a transformName on the first line, it will use the transformMap to add specified properties to the decorations list and run ShikiTransformers. Here are the defaults:

export const defaultTransformMap = {
	block: {
		addDefaultProps: ({ mut_allLines, lang, mut_pre }) => {
			mut_pre.datas = ['shiki', `shiki-lang-${lang}`, 'shiki-t-block', ...(mut_pre.datas ?? [])];
			mut_allLines.datas = ['line', ...(mut_allLines.datas ?? [])];
		},
	},
	inline: {
		addDefaultProps: ({ lang, mut_pre }) => {
			mut_pre.datas = ['shiki', `shiki-lang-${lang}`, 'shiki-t-inline', ...(mut_pre.datas ?? [])];
		},
	},
	'no-pre': {
		addDefaultProps: ({ mut_allLines, mut_code, lang }) => {
			mut_code.datas = ['shiki', `shiki-lang-${lang}`, 'shiki-t-no-pre', ...(mut_code.datas ?? [])];
			mut_allLines.datas?.push('line');
		},
		transforms: [{ postprocess: (html) => html.replace(/^<pre[^>]*>(<code[^>]*>[\s\S]*?<\/code>)<\/pre>$/, '$1') }],
	},
	'no-code': {
		transforms: [
			{ postprocess: (html: string) => html.replace(/^<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>$/, '$1') },
		],
	},
	noop: {},
} satisfies PreprocessOpts['transformMap'];
Important
A fenced code block will call block.addDefaultProps() and inline code like <!-- shiki-ts const shiki-ts --> will call inline.addDefaultProps(). Instead of using the default, you can write the key associated with any registered transform object on the first line of your code block.
This:
<!-- shiki-start
```ts
const foo = "bar";
```
shiki-end -->
is identical to this:
<!-- shiki-start
t-block
```ts
const foo = "bar";
```
shiki-end -->
Both use transformMap['block'] which will add data attributes like so: <pre data-shiki data-shiki-t-block>. This is useful for styling via CSS. Similarly, inline code such as this: <!-- shiki-ts const foo = "bar"; shiki-ts --> will have a <pre data-shiki data-shiki-t-inline> wrapper and is completely equivalent to this:
<!-- shiki-start
t-inline
```ts
const foo = "bar";
```
shiki-end -->
You're not limited to these preset registered transform objects. To register your own or modify the default classes and data attributes, pass in a custom transformMap to getOrLoadOpts() or load them afterwards with updateOpts().
For example, this website needs to show examples including the shiki-start and shiki-end delimiter wrappers, code fence, and language. We've made adding the delimiters a one liner by registering a custom postprocess function with the key 'shiki-block'. It takes out the <pre> and <code> tags and replaces them with our custom wrapper.
opts.transformMap['shiki-block'] = {
	addDefaultProps: defaultTransformMap['block']['addDefaultProps'],
	transforms: [
		{
			postprocess: (html) => {
				const middle = html.replace(/^<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>$/, '$1');
				return shikiBlockWrapper.start + middle + shikiBlockWrapper.end;
			},
		},
	],
};
Then we can write our examples showing the delimiters:

<!-- shiki-start
t-shiki-block 
~~~md
```ts
const callMe = "Ishmael"
```
~~~
shiki-end -->
And it renders our examples wrapped with our delimiters:

<!-- shiki-start
```ts
const callMe = "Ishmael"
```
shiki-end -->
Note
You generally won't have to write fenced code (wrapped in fenced code (wrapped in preprocessor delimiters)) like is necessary for this site, but you sure can.
Whitespace Hints
Fenced
The pre tag added by the code fence preserves whitespace, so don't indent your code tags unnecessarily.

Wrong
<!-- shiki-start
```ts
		const line = 'preserves whitespace';
```
shiki-end -->
Unwanted indentation:

		const line = 'preserves whitespace'; 
Right
<!-- shiki-start
```ts
const line = 'preserves whitespace';
```
shiki-end -->
No extra whitespace:

const line = 'preserves whitespace';
No Pre
If you are using transformMap['no-pre'] because you absolute must write inside a tag like <p> which doesn't allow nested <pre>, then you'll run into the problem that Svelte doesn't respect whitespace: pre style. All whitespace will be collapsed like so: constfoo="bar"; when we intended const foo = "bar";.
You can instruct Svelte to respect your whitespace in two ways.

Add preserveWhitespace to the component.
<svelte:options preserveWhitespace={true} />
Add preserveWhitespace to the svelte.config.js compiler options.
/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		preserveWhitespace: true,
	},
	...
};

export default config;
