I have a (proof of concept) docs page — https://gooey.braebo.dev/docs &nbsp;<em><sup>( only the root `/docs` page is implemented )</sup></em>

<hr>

Before I start writing all the docs/examples, I need an adult to [save me from my code][1] because [it's making me uncomfortable.][2]

[1]: https://github.com/braebo/gooey/blob/main/www/src/lib/data/docs/02_basics/Basics.svelte
[2]: https://github.com/braebo/gooey/blob/main/www/src/routes/docs/%2Bpage.server.ts

### Goals

1.  sveltekit docs site
1.  interactive stuff
1.  pre-render shiki code-bits

&nbsp;&nbsp;<sup> 4. <sup>(bonus)</sup> get twoslash working <em>once and for all</em></sup>

<br>

#2 and #3 complicate things; the interactive stuff is usually woven throughout the [page like this][3]. In the past, I've only done this for smaller libs with docs that fit on a single-[page like this][4]. I'd _really_ like to finally get twoslash working for once... a bonus goal.

[3]: https://pocket-shader.braebo.dev/#custom-uniforms
[4]: https://fractils.fractal-hq.com/#theme

<br>

> I need to finally bother the homies in svelte discord / ambassadors for their concensus is on the least worst solution and do that.
