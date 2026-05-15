# Stack

A personal computing curriculum, top of the stack to the bottom — from LLMs
at the top down through transformers, GPUs, operating systems, ISAs, CPUs,
memory, digital logic, gates, and transistors at the bottom.

This is a single-user reading app. There is no audience, no analytics, no
search, no comments. It is built to be enjoyable to read on a phone, and to
remember what you've read.

## Stack (the tech)

- **Astro 5** with **MDX** content
- **TypeScript**, **Tailwind v4**
- **@vite-pwa/astro** for offline + installable PWA
- Deployed as a static site on **Cloudflare Pages**
- Progress and theme are stored in `localStorage`. There is no backend.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static build into dist/
npm run preview    # serve the built dist/ (use this to test the PWA)
```

The service worker is **only registered against the production build**, so
test installability and offline behaviour against `npm run preview`, not
`npm run dev`.

### Test install on a phone

1. `npm run preview -- --host`
2. Hit the URL it prints from a phone on the same Wi-Fi.
3. iOS: Share → Add to Home Screen. Android Chrome: menu → Install app.

## Adding a new lesson

1. Find (or create) the right module folder under `src/content/modules/`.
   Folder names use a `NN-kebab-slug` prefix that drives ordering and is
   stripped from the URL: `04-running-models-on-gpus/` becomes
   `/modules/running-models-on-gpus`.

2. Drop in an MDX file. Any file in the folder that does **not** start with
   an underscore is treated as a lesson:

   ```
   src/content/modules/01-what-is-an-llm/02-tokens-and-embeddings.mdx
   ```

3. Frontmatter:

   ```mdx
   ---
   title: 'Tokens and embeddings'
   order: 2
   estimated_minutes: 8
   threads: ['encoding', 'abstraction']  # optional, must be from the four
   draft: false                          # optional, hides the lesson
   ---

   Write the lesson body here. Markdown and MDX both work.
   ```

4. Commit and push to `main`. Cloudflare Pages will auto-build and deploy.

### Module frontmatter

Each module has its own `_module.mdx` in its folder (the underscore prefix
means it isn't routed as a lesson):

```mdx
---
title: 'What is an LLM?'
number: 1
summary: 'One-paragraph blurb that shows on the index.'
difficulty: 1                     # 1, 2, or 3
status: available                 # or "coming-soon"
---
```

`number` controls the order modules appear on the index. To open a module
for reading, set `status: available`. Until then it links to a "coming
soon" placeholder.

### Threads

Four cross-cutting threads run through the whole stack:

- `abstraction`
- `encoding`
- `state-and-memory`
- `protocols-and-contracts`

Tag any lesson with whichever apply by adding them to the `threads` array
in frontmatter. The `/threads` page lists them and which lessons touch
each.

## Deploying to Cloudflare Pages

1. Push the repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect
   to Git**. Select this repo.
3. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 20 or 22 (env var `NODE_VERSION=22`)
4. Save and deploy. Subsequent pushes to the default branch auto-deploy.

The `public/_headers` file makes sure the service worker and manifest are
served with the right cache rules.

## Layout

```
src/
  content/
    modules/
      01-what-is-an-llm/
        _module.mdx              # module metadata
        01-the-shape-of-the-thing.mdx
  content.config.ts              # content collection schemas + thread metadata
  layouts/Base.astro             # head, header, footer, SW register
  components/                    # Header, ProgressBar, CompleteButton, ...
  lib/
    progress.ts                  # localStorage progress tracking
    lessons.ts                   # content-collection helpers
  pages/
    index.astro                  # module index
    modules/[slug]/index.astro   # module overview
    modules/[slug]/[lesson].astro
    threads.astro
    settings.astro               # reset progress lives here
    offline.astro
    404.astro
  styles/global.css              # theme tokens, reading typography

public/
  favicon.svg
  icons/                         # PWA icons (regenerate with scripts/generate-icons.mjs)
  _headers                       # Cloudflare Pages headers

scripts/
  generate-icons.mjs             # only run if you change the monogram
```

## What this app intentionally is not

No search. No quizzes. No auth. No backend. No comments. No sharing. No
analytics. If you find yourself wanting any of these, the answer is "not
yet, and possibly not ever".
