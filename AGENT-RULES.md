# Rules for anyone editing this repo (humans and agents)

## Confidentiality (non-negotiable)
1. Never write, in any tracked file, a term listed in `.confidential-terms` (local file, read it first). The pre-commit hook blocks commits, but do not rely on it.
2. Vibes work is recreated with MOCK DATA only. No real customer names, no real metrics beyond those already in `stories/*-draft.md`, no real screenshots, no internal roadmap, no named colleagues. Do not describe unannounced initiatives.
3. Anything that reproduces an internal, auth-walled Vibes screen (admin, provisioning internals) goes ONLY into `gated-src/<slug>/index.html` as a self-contained HTML file (inline CSS/JS). `gated-src/` is gitignored. Never put such content under `src/` or `public/`.
4. Numbers: use only numbers present in the story draft. Drop any `[bracketed]` placeholder rather than inventing a value. Where a draft says (CHECK) or (VERIFY), use the softer phrasing the draft suggests, or omit.
5. Never mention the product manager, internal codenames, product end-of-life plans, competitor comparisons beyond "months for competitors," or any colleague by name. Say "the engineering manager," "the head of product," "operations."

## Git
- Do NOT run `git add`, `git commit`, `git push`, or change branches. The owner reviews and commits.
- Do NOT run `next build` or `next dev` (machine is memory constrained). Verify with `npx tsc --noEmit` and `npx eslint <your files>` only.

## Where to write
- Your page: `src/app/work/<slug>/page.tsx`
- Your components: `src/components/work/<slug>/*`
- Your gated artifact (if any): `gated-src/<slug>/index.html`
- Static assets you create (SVG only, no photos): `public/work/<slug>/`
- Do not edit anything else. Shared components live in `src/components/case/` (read `src/components/case/README.md`).
