# Build Log — arvindramachandran.tech
Read this file at the start of every session before touching code.

## Session 0 — 2026-08-29
- Built: Setup only. PRD reviewed; all §8 open decisions finalized (see below). No code yet.
- Key decisions (PRD §8, now closed — PRD to be treated as amended):
  - Typefaces: Space Grotesk (display) + IBM Plex Sans (body) + IBM Plex Mono (mono), self-hosted via @fontsource
  - Accent: amber/terminal orange #B45309 (hover #92400E) on off-white #FAFAF7 / off-black #141412
  - MED lives as homepage section (no /med page at v1)
  - Deploy target: Cloudflare Pages
  - Contact: mailto: only (no form)
  - Phone number: NOT shown on site (resume PDF only)
- Files touched: build-log.md (created)
- Known issues: none
- Next module: Module 1 — Project scaffold & design system

## Module 1 — Project scaffold & design system — 2026-08-29
- Built: Astro 5 + Tailwind v4 (@tailwindcss/vite) scaffold in portfolio/; design tokens in src/styles/global.css (Space Grotesk / IBM Plex Sans / IBM Plex Mono; paper/ink/muted/line/accent palette); single typed content module src/data/site.ts holding every PRD §6 fact (nav, hero, about, MED case-study data + architecture stages, secondary project, 6 skill groups, experience, education, SnowPro cert w/ credential ID S132356-260124-SOL); temporary placeholder index.astro exercising the tokens; favicon.svg = PAL sparkline-with-anomaly motif. Verified: npm run build (1 page) + astro check (0 errors/0 warnings). git repo initialized on main, no commits yet (commits await explicit request).
- Key decisions:
  - Tailwind v4 CSS-first config (@theme tokens in global.css, no tailwind.config.js) — deliberate escape from the default Tailwind look (PRD §3)
  - Fonts self-hosted via @fontsource packages; imports live in index.astro for now, move into Base.astro in Module 2
  - Nav semantics: "Work" anchors to the MED case-study section (#work); "Projects" anchors to secondary projects (#projects); MED CTA points to #work
  - astro check wired as `npm run check` for typechecking every module; Lighthouse/contrast/link audit deferred to Module 9
- Files touched: package.json, package-lock.json, astro.config.mjs, tsconfig.json, .gitignore, src/styles/global.css, src/data/site.ts, src/pages/index.astro, public/favicon.svg, build-log.md (appended)
- Known issues: /resume.pdf is a 404 until Module 8; MED repo URL + Medium article URL + Credly verify URL are TODO markers in site.ts; index.astro is a placeholder to be replaced by the Base layout in Module 2; site not yet visible anywhere (deploy comes with Cloudflare Pages setup later)
- Next module: Module 2 — Base layout & header
