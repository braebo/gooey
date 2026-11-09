# gooey

`bun run check` typechecks, `bun run test` runs the vitest browser suite headless (playwright), `bun run lint` runs publint and prettier, `bun run build` builds with tsdown, and `bun run dev` serves the `www/` demo site.

- A user-facing change ships with a changeset (`bunx changeset`); versions move only through the release PR, never by hand.
- No `link:` dependencies — they resolve only inside the bopo monorepo, and CI installs gooey on its own.
- `www/` demos import gooey from `src/`, never the published `gooey` package — the two classes differ structurally and svelte-check rejects the mix.
- `skills/gooey/SKILL.md` names paths inside the published package; a change to the README or the `dist/inputs` layout updates it in the same commit.
- An API or README change reruns `bun run llms` in the same commit.
- A push to `main` deploys `www/` to Cloudflare Pages (gooey.braebo.dev), whose dashboard runs `bun install --frozen-lockfile`, then `pnpm build:site`, and serves `www/.svelte-kit/cloudflare` on the Node in `.node-version`; `build:site` is that entry point, so it keeps its name.
