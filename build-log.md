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

## Module 2 — Base layout & header — 2026-08-29
- Built: src/layouts/Base.astro (meta description/canonical/OG shell, theme-color, font imports moved here from the page, skip-to-content link, main landmark); src/components/Header.astro (sticky minimal text nav rendered from site.nav, PAL sparkline wordmark + name, persistent Resume button, accent underline on hover, aria-label="Main"); src/pages/index.astro re-rendered through Base (placeholder body kept for Module 3). Verified: npm run build (1 page) + astro check (0 errors/0 warnings) + dev-server HTML markers all present.
- Key decisions:
  - Baseline git commit created before this module per user request: f51ddd6 "Module 1: Astro scaffold, design tokens, site content module" (main branch)
  - No hamburger on mobile: 4 links + Resume button fit 375px via tightened gaps/padding (gap-x-2.5, px-4); wordmark name hidden under sm:, sparkline monogram stays
  - No scroll-spy / active-section JS — site keeps zero client JS
  - Footer landmark intentionally deferred to Module 8 (Base.astro gets the Footer import then)
- Files touched: src/layouts/Base.astro (new), src/components/Header.astro (new), src/pages/index.astro (rewritten), build-log.md (appended)
- Known issues: /resume.pdf still 404 until Module 8; og:image TODO comment in Base.astro until Module 8; Module 2 changes not yet committed (awaiting user go-ahead); 375/768/1440 visual check is a quick manual pass on the running dev server
- Next module: Module 3 — Hero

## Module 3 — Hero — 2026-08-29
- Built: src/components/Hero.astro (mono location kicker; Space Grotesk h1 name at 48/60/72px; positioning statement in display face; mono credibility stack row "Python · SQL · Databricks · AWS · LangGraph" — no pills; exactly 2 CTAs: solid amber "View MED" → #work + outline "Resume" → /resume.pdf; asymmetric md:grid with large PAL sparkline motif + "PAL — Price Anomaly Locator" mono caption on the right, hidden on mobile); index.astro now renders Base + Hero only; global.css gained :focus-visible accent outline (site-wide keyboard a11y). Verified: build + astro check clean (7 files, 0 errors) + dev-server HTML markers all present (h1, positioning, stack row, both CTAs, sparkline caption, location kicker).
- Key decisions:
  - Kicker uses factual location line from site.ts in mono muted — accent reserved for motif dot + CTAs (PRD §3 accent discipline)
  - PAL sparkline enlarged as hero-side personal mark (ties hero → MED narrative); aria-hidden, decorative only
  - Positioning statement set in display face at statement scale — typography-led per PRD §3, no imagery
  - Zero client JS maintained; no entrance animations
- Files touched: src/components/Hero.astro (new), src/pages/index.astro (rewritten), src/styles/global.css (focus-visible rule), build-log.md (appended)
- Known issues: /resume.pdf still 404 until Module 8; 375px hero relies on hidden sparkline + wrapping CTAs (visual pass recommended on dev server)
- Next module: Module 4 — About

## Module 4 — About — 2026-08-29
- Built: src/components/About.astro (editorial marker-column layout: mono h2 "About" label in a 180px left rail, 18px relaxed prose in a max-w-2xl column, hairline border-t section divider, id="about"); src/data/site.ts `about` restructured from a single string to `string[]` (two paragraphs: background/stack, then current MED focus + targeting — facts unchanged, split is presentational only); index.astro renders Hero + About. Verified: build + astro check clean (8 files, 0 errors) + dev-server markers all present (heading, both paragraphs, section id).
- Key decisions:
  - Section pattern established: hairline top border + mono small-caps-style label rail + content column — this becomes the template for Work/Projects/Experience/Contact sections (consistency without decoration)
  - Gap/non-CS background stated plainly inside the existing PRD prose — no extra apologia, per PRD §6.2
- Files touched: src/components/About.astro (new), src/data/site.ts (about: string → string[]), src/pages/index.astro, build-log.md (appended)
- Known issues: none new (/resume.pdf 404 unchanged)
- Next module: Module 5 — Projects: MED case study

## Content amendment — location & targeting copy — 2026-08-29
- Built: user-directed copy change, no layout/code changes. Hero kicker (site.location): "open to Singapore & GCC roles" → "open to Startup & GCC roles". About ¶2: "— Singapore FinTech & AI sector primarily, GCC roles in Chennai/Hyderabad/Bengaluru as a near-term step." → "— FinTech & AI sector primarily, Startup & GCC roles in Chennai/Hyderabad/Bengaluru as a near-term step." Verified: build + astro check clean; "Singapore" absent from src/ and served HTML.
- Key decisions: positioning re-aim per user (Singapore de-emphasized) — PRD §6.1/§6.2 wording now superseded; treat PRD as amended on this point.
- Files touched: src/data/site.ts, build-log.md (appended)
- Known issues: none new
- Next module: Module 5 — Projects: MED case study

## Module 5 — Projects: MED case study — 2026-08-29
- Built: src/components/MedCaseStudy.astro — the page centerpiece (PRD §6.3), section id="work" per nav semantics. Rail label "Work" (p, not heading — the project name is the section's real h2); honest status line "In progress — building in public" in mono; h2 project name in display face; framing hook "VIX measures fear. / PAL measures fragility." with the PAL sentence in accent (the one sanctioned PAL metric callout); description prose; **custom data-driven inline SVG architecture diagram** (LangGraph → Kafka → Databricks Lakehouse → Mosaic AI/RAG: 4 boxes + arrowhead markers, rendered from site.med.architecture with computed geometry, Tailwind token classes stroke-line/fill-ink/fill-muted, role="img" + aria-label, IBM Plex Mono text) — hidden below md; **mobile gets the same data as a stacked numbered list** with ↓ connectors (md:hidden); mono stack row "Stack — LangGraph · Kafka · Databricks · Delta Lake · Snowflake · FastAPI · Streamlit · Prometheus" (no pills); links row: "GitHub repo" accent link + Medium slot rendering "Medium deep-dive — coming soon" placeholder while articleUrl is null (auto-becomes a real link when set in site.ts). index.astro renders Hero + About + MedCaseStudy. Verified: build + astro check clean (9 files, 0 errors); 10/10 HTML markers present.
- Key decisions:
  - Diagram is data-driven from site.med.architecture (single-source-of-truth preserved); geometry computed in frontmatter
  - Mobile strategy: no horizontal scroll needed — SVG at md+, stacked list below md (readability over diagram fidelity at 375px)
  - Framing sentence split computed in frontmatter from the single framing string (no hardcoded copy in component)
  - SVG uses Tailwind theme utility classes (stroke-*/fill-*) so diagram colors stay tokenized
  - "Work" rail label demoted to <p> so the project name stays the section h2 (heading hierarchy)
- Files touched: src/components/MedCaseStudy.astro (new), src/pages/index.astro, build-log.md (appended)
- Known issues: MED repo link currently resolves to github.com/arvindram27 profile (TODO in site.ts until real repo URL provided); Medium slot intentional placeholder; dev server had died and was restarted this session
- Next module: Module 6 — Secondary project card + Skills

## Module 5a — Architecture diagram sizing tweak — 2026-08-29
- Built: user-requested size reduction of the MED architecture SVG. Geometry compacted (viewBox 920×120 → 764×88: boxes 200→170w/88→64h, label/detail fonts 16/12 → 13/11); removed min-w-[680px] + overflow-x-auto wrapper — svg is now `w-full max-w-[720px]`, so it always scales-to-fit its container with zero horizontal scroll at every md+ width and is capped at 720px on large desktops (~24% smaller visual footprint, ~83px tall vs ~127px). Mobile (<md) unchanged: stacked numbered list fits 375px with no scroll. Verified: build + astro check clean; new viewBox + classes present in built HTML; dev server up.
- Key decisions: scale-to-fit beats min-width+scroll for this diagram (worst-case md render still yields ~12px effective label text — readable)
- Files touched: src/components/MedCaseStudy.astro, build-log.md (appended)
- Known issues: none new
- Next module: Module 6 — Secondary project card + Skills

## Cloudflare agent setup — 2026-08-29
- Built: environment setup per Cloudflare's official agent instructions (developers.cloudflare.com/agent-setup/prompt.md), OpenCode branch. 13 Cloudflare skills installed globally to ~/.agents/skills/ (agents-sdk, cloudflare, cloudflare-email-service, cloudflare-one, cloudflare-one-migrations, durable-objects, sandbox-*, turnstile-spin, web-perf, workers-best-practices, wrangler) — opencode auto-loads them. 5 remote MCP servers registered in ~/.config/opencode/opencode.jsonc: cloudflare, cloudflare-docs, cloudflare-bindings, cloudflare-builds, cloudflare-observability (shapes validated against https://opencode.ai/config.json — oauth:{} is valid McpOAuthConfig). OAuth for the main `cloudflare` server completed successfully via `opencode mcp auth cloudflare`; docs server needs no auth; bindings/builds/observability trigger OAuth on first use.
- Key decisions: agent-side setup only — no project files touched; deploy wiring (Cloudflare Pages ← GitHub repo arvindram27/arvindramachandran-tech) happens in Module 9 using these MCPs/wrangler skill
- Files touched: ~/.agents/skills/* (global), ~/.config/opencode/opencode.jsonc (global), build-log.md (appended)
- Known issues: requires opencode restart for MCP servers to load; turnstile-spin skill flagged High Risk by Snyk (unused by this project — ignore unless Turnstile is ever needed)
- Next module: Module 6 — Secondary project card + Skills (pointer updated after Module 5 landed; entry written before Module 5)

## Module 6 — Secondary project card + Skills — 2026-08-29
- Built: src/components/SecondaryProjects.astro (section id="projects", rail h2 "Projects" — heading hierarchy restored to the About pattern; one bordered hairline card per entry in site.secondaryProjects — currently the Multi-Agent Market Intelligence System: h3 display name, muted description, accent "GitHub repo" link to github.com/arvindram27/multi-agent-market-intelligence; array-driven so future projects append without layout changes); src/components/Skills.astro (section id="skills", rail h2 "Skills", semantic <dl> with divide-y hairlines: dt = mono category label, dd = items joined " · " — plain text blocks mirroring the resume, zero progress bars/percentages per PRD §6.4; all 6 groups from site.skills). index.astro renders Hero → About → MedCaseStudy → SecondaryProjects → Skills. Verified: build + astro check clean (11 files, 0 errors); 9/9 HTML markers present; dev server restarted (died again between sessions).
- Key decisions:
  - Card = single hairline border, no shadow/rounded-bloat (PRD §3: not soft-UI); visual weight deliberately far below MED per PRD §6.3 "shorter treatment"
  - Skills as <dl> rows: category in the mono left column, items as body prose — resume-mirroring without decoration
  - No stack tags on the secondary project (PRD lists none — nothing invented)
- Files touched: src/components/SecondaryProjects.astro (new), src/components/Skills.astro (new), src/pages/index.astro, build-log.md (appended)
- Known issues: /resume.pdf 404 unchanged; MED repo URL TODO unchanged
- Next module: Module 7 — Experience + Education/Certifications
