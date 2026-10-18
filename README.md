# Ebidensya

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

Ebidensya is a front-end prototype of an evidence intake tool for Philippine litigation teams. A client's pile of Messenger screenshots, GCash receipts, bank slips, barangay records and scanned PDFs becomes a sorted case file: a sourced timeline, an exhibit list, a witness list, conflicts and gaps, a proof matrix and a trial binder, with every unreadable page flagged for review instead of guessed. This repo is the marketing site plus a clickable demo app, built as a fully static Next.js export over sample case data.

> Sample case data throughout. Names, dockets, documents and contact details in `data/` and the site footer are fictional.

## What is in the demo

- **Marketing site** (`/`, `/how-it-works`, `/pricing`): product pitch, supported sources, plans and FAQ, rendered from `data/site.json`.
- **Demo app** (`/app`): a case list, a hearings list and a review queue across four sample cases.
- **Case file** (`/app/cases/[caseId]/...`): Overview, Evidence (with a per-file viewer showing extracted fields and their confidence), Timeline, Chronology, Exhibits, Witnesses, Conflicts and gaps, Proof matrix, Trial binder and Hearing.
- **Ask this case file**: a browser-only assistant (`lib/ai.ts`) that retrieves from the case JSON, answers only from evidence read at or above the quote threshold (80% confidence), cites the files it used, and lists anything below it as withheld. `lib/ai.ts` documents the one-function seam for swapping in a hosted model behind your own API route.
- Light and dark themes, responsive down to 320px.

There is no backend, no upload and no OCR in this build. Every page renders from the JSON files under `data/` at build time (`output: "export"` in `next.config.ts`).

## Getting started

Requires Node.js 20+. The AI self-check runs TypeScript directly, so it needs a Node version with built-in type stripping (22.18+ or 23.6+).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run check:ai` | Self-check for the retrieval and quoting rules in `lib/ai.ts` (`node lib/ai.check.ts`, no test framework) |

Since the build is a static export, `out/` can be served by any static host.

## Project structure

```
app/
  (site)/            marketing pages: home, how-it-works, pricing
  app/               demo app: case list, hearings, review queue
    cases/[caseId]/  case file sections (evidence, timeline, exhibits, ...)
components/
  app/               app shell, case nav, evidence browser/viewer, AskCase
  site/              site chrome, hero preview, reveal animation
  ui/                wordmark, theme toggle, confidence indicator
data/
  site.json          marketing copy, plans, FAQ
  cases/*.json       four fictional sample case files
lib/
  ai.ts              client-side grounded case assistant
  ai.check.ts        self-check for ai.ts
  data.ts            static loader for the case JSON
  types.ts           case, evidence and OCR types
```

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, [Motion](https://motion.dev) and [Phosphor Icons](https://phosphoricons.com).

## License

[MIT](LICENSE). MIT covers the code; the Ebidensya name and wordmark identify the project.
