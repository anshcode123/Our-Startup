# AKIVRO.dev — Frontend & Backend Architecture

This repository is cleanly separated into two workspaces:

```text
Anshul.dev/
├── frontend/          # Public Next.js marketing website & Lenis + GSAP ScrollTrigger engine
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── package.json
│   ├── next.config.js
│   ├── jsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/           # Express.js + PostgreSQL + Prisma ORM + Cloudinary API server
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── lib/
│   ├── prisma/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── README.md
└── package.json
```

## Getting started

### Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev
```

Or from the repository root:

```bash
npm run frontend
```

Then open http://localhost:3000.

To temporarily see ScrollTrigger's debug markers during development, run inside `frontend/`:

```bash
NEXT_PUBLIC_SCROLL_DEBUG=true npm run dev
```

## Architecture

```
Lenis (smooth scroll physics)
  -> GSAP ticker (single shared animation-frame loop)
    -> ScrollTrigger (kept in sync with Lenis' scroll position)
      -> scroll-driven animations (pin, parallax, scale, rotate, opacity, timelines)
```

- `lib/animations/scroll.js` — owns the one shared Lenis instance, wires it
  into the GSAP ticker, and keeps ScrollTrigger in sync. Ref-counted so it's
  safe to mount/unmount without creating duplicate engines.
- `lib/animations/scrollUtils.js` — generic, reusable builders
  (`createPinnedSection`, `createParallax`, `createScaleAnimation`,
  `createRotationAnimation`, `createOpacityAnimation`,
  `createScrollTimeline`, `createScrollProgress`, `responsiveValue`) that
  future phases compose into real sections. Nothing here hardcodes a
  laptop, phone, or any other final visual.
- `components/scroll/SmoothScroll.jsx` — mount once (already wired into
  `app/layout.js`) to start/stop the engine.
- `components/scroll/ScrollProgress.jsx` — minimal fixed 0–100% readout.
- `components/scroll/ScrollDemo.jsx` — the temporary Phase 1 demo page,
  proving out sticky pinning, parallax, scale, rotation, opacity, a
  combined scrubbed timeline, and a cross-fade section transition.

All scroll-linked animations use `scrub`, `transform`, and `opacity` only
(no layout-triggering properties), respect `prefers-reduced-motion`, and are
cleaned up via `gsap.context().revert()` on unmount.

## Phase 2 — the cinematic story

The homepage (`app/page.js`) now renders `<CinematicStory>`
(`components/story/`), the idea → design → UI → code → development →
mobile app → website → software → testing → process recap → launch scroll
story, built entirely on the Phase 1 engine — no second scroll system, no
new animation library.

- `components/story/CinematicStage.jsx` — the full experience: one pinned
  stage, one scrubbed master `gsap.timeline()` built by
  `lib/animations/storyAnimations.js` from per-object builder files
  (`ideaAnimation.js`, `laptopAnimation.js`, `uiAssemblyAnimation.js`,
  `codeAnimation.js`, `developmentAnimation.js`, `phoneAnimation.js`,
  `browserAnimation.js`, `dashboardAnimation.js`, `testingAnimation.js`,
  `connectionAnimation.js`, `launchAnimation.js`). Reused via
  `responsiveValue()` for scroll distance and `prefers-reduced-motion` (see
  below) — nothing here duplicates Lenis/ScrollTrigger setup.
- `components/story/SimpleStory.jsx` — the reduced-motion fallback: the
  same visuals, stacked in normal document flow, statically visible, no
  pinning, no scrub.
- `components/story/CinematicStory.jsx` — picks between the two based on
  `prefers-reduced-motion` (checked on mount and on change). As of Phase 3
  it renders only the story itself — `<FinalCTA>` moved to top-level page
  composition (see below) so it can sit later in the page.
- All visual "devices" (laptop, phone, browser) are CSS/HTML/SVG — no
  image assets — with a `children` slot so the same laptop frame can show
  the UI-assembly, then code, content in turn.
- The Phase 1 demo page still exists at `/demo` for a quick regression
  check that the underlying scroll engine hasn't changed.

## Phase 3 — full site structure & content

The homepage now composes the whole site (`app/page.js`):
`Navigation → Hero → CinematicStory → Services → WhyUs → Work → Process →
About → Technology → FinalCTA → Contact`, plus a page-level `Footer`.
Everything here is `components/site/`, built on top of Phase 1/2 with no
duplicate scroll system:

- `Navigation.jsx` — fixed nav, background fades in after 40px of scroll
  (one lightweight `ScrollTrigger`, not a scroll-linked state spam),
  active-section highlighting, and a mobile menu that calls the shared
  Lenis instance's `.stop()`/`.start()` so the page genuinely can't scroll
  behind it (not just a CSS `overflow: hidden` hack).
- `Hero.jsx` — the page's one visible `<h1>`; its text scrub-fades out on
  the way to the pinned cinematic story so there's no hard cut.
- `Services.jsx`, `WhyUs.jsx` — ordinary (non-pinned) scroll-reveal
  sections using plain `ScrollTrigger` + ease, deliberately restrained
  next to the cinematic story.
- `Work.jsx` / `ProjectCard.jsx` — reusable card, `placeholder` mode when
  `PROJECTS` (in `Work.jsx`) is empty, which it is on purpose — no
  invented clients or case studies. Add real entries there later.
- `Process.jsx` — reuses Phase 2's exact `<ConnectionVisual>` and
  `setConnectionInitialState`/`addConnectionStage` builders (now
  parameterized with a `stages` prop and an `fadeOutAtEnd` option) on its
  own standalone `ScrollTrigger`, instead of a second implementation.
- `About.jsx`, `Technology.jsx` — static, honest content; no invented
  years/team-size/clients; technology list is a plain array to edit.
- `Contact.jsx` / `Footer.jsx` — direct `mailto:`/link buttons, no
  backend form. Content lives in `lib/siteConfig.js`: `CONTACT.email` is
  a placeholder built from the site's own domain, and
  WhatsApp/Instagram/LinkedIn are left empty (and hidden) until real URLs
  exist — nothing fake gets rendered.
- `lib/scrollToSection.js` — the one shared "smooth-scroll to a section"
  helper (built on `getLenis()`), used by Navigation, Hero, FinalCTA, and
  Footer instead of four separate implementations.

`components/story/FinalCTA.jsx` was updated in place with the real
"Have an idea? / Let's build it." copy and now also renders `<RocketVisual>`
on its own small scroll trigger as a callback to the earlier launch — it's
no longer rendered automatically inside `<CinematicStory>` (that component
now only renders the animated/reduced-motion story itself), so it can sit
later in the page per the requested section order.

`app/layout.js` carries the real SEO metadata (title, description, Open
Graph, Twitter card); `app/icon.svg` is a plain generated favicon mark
(no external asset). No OG image was added, since a real one would need
actual brand photography.

Known gaps: not run in a real browser; `CONTACT.email` is a reasonable
placeholder (`hello@AKIVRO.dev`) rather than a confirmed real inbox —
swap it in `lib/siteConfig.js`; social links stay hidden until filled in
the same file.

## Phase 4 — visual polish, real-asset support & premium interactions

Focused, targeted improvements on top of Phase 1–3 — no rebuild, no new
dependencies, no removed sections.

- **Design tokens**: colors now run through CSS custom properties in
  `app/globals.css` (`--color-bg`, `--color-text`, `--color-muted`,
  `--color-border`, `--color-accent`), mapped in `tailwind.config.js` to
  the existing `ink`/`paper`/`line`/`muted` classes plus a new `accent`
  token (`#e3b168`, warm gold — chosen to read premium/technical rather
  than neon or crypto-adjacent). One color to change to retheme.
  `accent` uses Tailwind's documented `rgb(var(...) / <alpha>)` pattern
  (via `--color-accent-rgb`) specifically so `bg-accent/30`-style opacity
  modifiers work — a plain `var(--color-accent)` reference can't be
  decomposed into channels and would have made those modifiers silently
  no-op.
- **Bug fix**: `RocketVisual`'s SVG gradient used a hardcoded `id`, but
  it's mounted twice at once (cinematic stage + FinalCTA) — duplicate IDs
  make `url(#id)` unreliable across browsers. Fixed with React's `useId()`.
- **Accent used sparingly**: idea-visual glow, rocket window/flame, the
  connecting line (shared by the cinematic recap and Process), nav
  active-link state, service-card numbering, dashboard nav/bars/new
  progress bar, testing checkmarks. Everything else stays neutral.
- **Device polish**: laptop/phone/browser share a new `.device-reflection`
  glass-sheen overlay and deeper layered shadows; phone gained a notch +
  home indicator; browser gained an address-bar label; dashboard gained
  an accent progress bar (animated via `scaleX`, not `width`, per the
  GPU-friendly-animation rule) plus tinted nav/bars.
- **Code visual**: line numbers, a window-chrome bar, and hand-written
  syntax-like coloring (still fully fictional example markup — no real
  code, keys, or secrets).
- **Micro-interactions**: `components/ui/MagneticButton.jsx` (desktop-only
  pointer-following hover, off under `prefers-reduced-motion`, re-checks
  both on change) applied to the two primary CTAs (Hero, FinalCTA);
  `components/ui/CustomCursor.jsx` (a small accent dot that trails the
  real pointer — the native cursor is never hidden), mounted once in
  `app/layout.js`; a shared `.link-underline` reveal utility applied to
  nav and footer links; lift/border-transition hover added to Service and
  WhyUs cards; zoom-on-hover added to the ProjectCard visual placeholder.
- **Final CTA**: rocket made more prominent (larger, more opaque) with a
  slow decorative float (CSS, gated to `no-preference`) layered under its
  own scroll-triggered rise, and the heading sized up a step so it reads
  as the story's conclusion.
- **Background**: new `.bg-noise` (very faint grain) and `.bg-accent-glow`
  (soft accent radial) utilities, used only at the hero and final CTA —
  "the couple of moments that deserve more presence," not everywhere.
- **Real-asset structure**: `public/assets/{brand,projects,devices,icons}/`
  created with a README on exactly how to wire in real files later
  (logo, favicon, project screenshots, OG image) — nothing invented in
  the meantime; the site keeps using the existing CSS/SVG placeholders.
- **SEO**: added `alternates.canonical` to `app/layout.js`'s metadata.

**Not done in this pass** (flagged rather than silently skipped): a
deeper frame-by-frame easing/timing pass across all eleven cinematic
animation files — the sequencing is delicate (see the Phase 2 notes on
GSAP label positioning) and I didn't want to risk destabilizing it
without being able to see it run in a browser. What's here is a real
visual/interaction upgrade, not a full choreography rewrite.

Known gaps: none of this has been seen in an actual browser — the
`color-mix()` CSS function used in a couple of the new glow utilities
needs a reasonably modern browser (broadly supported in current
Chrome/Edge/Safari/Firefox, which matches the site's stated browser
target); the accent color's contrast against the dark background looks
comfortably high by eye but hasn't been measured with a contrast tool.

## Phase 5 — real assets, portfolio & brand integration

No real brand/project assets were ever supplied in this project, so
nothing was invented — this phase focused on making the _structure_ ready
for them and fixing issues found while reviewing Phases 1–4.

- **Fixed a real bug**: `components/story/SimpleStory.jsx` spread step
  objects that carried their own `key` field (`{...STEPS[i]}`) straight
  into JSX — the exact "props object containing a 'key' prop" warning.
  Rewritten to pass `title`/`body` as explicit props with a separate plain
  `key="idea"` (etc.) attribute; the `STEPS` array's unused third entry
  ("ui", never actually rendered) was dropped as dead data in the same
  pass. `components/site/Work.jsx`'s existing `<ProjectCard key={project.id}
{...project} />` was checked too — safe, since `project` objects don't
  carry a `key` field themselves.
- **Portfolio data separated from presentation**: `lib/content/projects.js`
  now holds the `PROJECTS` array (still empty — no real projects supplied)
  with the field shape requested (`id`, `title`, `category`, `description`,
  `image`, `technologies`, `link`); `Work.jsx` and `ProjectCard.jsx` were
  updated to match. `ProjectCard` now uses `next/image` (`fill`, `sizes`,
  `object-cover`) when a project has a real `image`, and falls back to the
  existing CSS placeholder visual when it doesn't — also fixed an edge
  case where a real project with no `link` would have still shown a
  misleading "View project →".
- **Brand mark centralized**: new `components/site/Logo.jsx` — still the
  same "AKIVRO.dev" text wordmark used since Phase 3 (no real logo file
  exists to integrate), but now defined once and used by both Navigation
  and Footer, so dropping in a real `/assets/brand/logo.svg` later is a
  one-file change. See the component's doc comment for exactly how.
- **Open Graph / Twitter image**: added `app/opengraph-image.jsx` and
  `app/twitter-image.jsx` using Next's built-in `next/og` image
  generation — a real, honest 1200×630 card with just "AKIVRO.dev" and
  "Software Development Studio" (matching `lib/og-image-content.jsx`), no
  invented stats or client logos. `public/assets/og/` still exists if a
  designed static image should replace the generated one later. Twitter
  card upgraded to `summary_large_image` now that a real image exists.
- **Contact/social channels extended**: added `CONTACT.github` (empty, in
  `lib/siteConfig.js`) alongside the existing email/WhatsApp/LinkedIn/
  Instagram fields, per this phase's explicit list. `Contact.jsx` was
  refactored from three hand-written conditionals to the same
  filter-by-truthy-value list pattern `Footer.jsx` already used, so adding
  another channel later means one array entry, not new markup.
- **Metadata**: description copy updated to match this phase's exact
  quoted text ("...for businesses ready to move forward.") — Hero's copy
  already matched, layout.js's didn't.
- **Regression check**: reviewed (not run — no browser here) every file
  touched; grepped the project for any other spread-with-key patterns and
  any leftover references to the old project-card field names. None found.

Known gaps: still no real logo, favicon, project screenshots, or contact
handles — see "Assets integrated" in the Phase 5 chat report for the
exact list of what's still a placeholder. Nothing here has been run in an
actual dev server or production build (no network/npm in this sandbox).

## Phase 6 — mobile, performance, SEO & accessibility hardening

An audit-and-fix pass, not new features. Every item below is a change
verified by re-reading the affected files, not just a checklist tick.

- **Hydration**: `Footer.jsx`'s `new Date().getFullYear()` is computed at
  render time, which can legitimately differ between a statically
  generated/server-rendered page and the browser hydrating it later (e.g.
  built in December, viewed in January). Added `suppressHydrationWarning`
  — React/Next's documented escape hatch for exactly this case. Audited
  the rest of the project for the same class of risk (`Math.random()`,
  unguarded `window`/`document` access, render-time browser-API calls) —
  nothing else found.
- **Lint**: `eslint-config-next` was an installed dependency with no
  config file actually using it — `npm run lint` wouldn't have applied
  any rules. Added `.eslintrc.json` (`extends: "next/core-web-vitals"`),
  which also brings in `eslint-plugin-jsx-a11y`'s accessibility rules.
- **robots.txt / sitemap.xml**: added via Next's file conventions
  (`app/robots.js`, `app/sitemap.js`). The homepage is the only real
  public page (`/demo`, the Phase 1 regression-testing page, is excluded
  from both — not real site content). `SITE_URL` was pulled out of
  `app/layout.js` into `lib/siteConfig.js` so layout/robots/sitemap share
  one value instead of three.
- **Contrast (real WCAG failures found and fixed)**: computed actual
  contrast ratios for the muted-text opacity values used throughout —
  `text-white/40` ≈ 3.77:1 and `text-white/30` ≈ 2.6:1 on the `#0a0a0a`
  background, both below the 4.5:1 minimum for normal-size text. This
  pattern was used for essentially every section's eyebrow label plus
  several other real-content elements (19 occurrences across 11 files).
  Bumped all of them to `text-white/50` (≈5.3:1, passes with margin).
  Deliberately left untouched: the aria-hidden decorative labels inside
  the cinematic-story visuals (dashboard nav items, code syntax colors,
  etc.) — illustrative/atmospheric, not primary content, and already
  covered by the section's real (now-fixed-contrast) heading/body text.
- **Reduced motion (real gap found and fixed)**: `Services.jsx`,
  `WhyUs.jsx`, `Process.jsx`, and `FinalCTA.jsx` ran GSAP-driven scroll
  reveals with no `prefersReducedMotion()` check at all — the project's
  global CSS reduced-motion rule only affects CSS `animation`/
  `transition`, not GSAP's direct inline-style writes, so these four were
  silently exempt from the site's own reduced-motion support. All four
  now render straight to their resting state (no scroll-linked movement)
  when reduced motion is on; `Process.jsx` reuses the same
  `showStoryElementsAtRest` helper `SimpleStory` already used for this.
- **Mobile movement distance**: the UI-assembly scatter animation
  (`lib/animations/uiAssemblyAnimation.js`) used fixed pixel offsets
  tuned for the desktop laptop screen; since Phase 4/5 already made that
  screen fluid-width on mobile, the same offsets represented a much
  larger fraction of the smaller screen. Added a `responsiveValue`-based
  distance scale (0.5× mobile / 0.75× tablet / 1× desktop) — rotation
  values are untouched since they don't depend on available space.
- **Overflow risk**: `LaptopVisual` used fixed `340px`/`380px` widths that
  could exceed a 320–375px viewport (contained by the stage's
  `overflow-hidden`, so no actual page scroll resulted, but still an
  "extends past its own box" issue). Converted to fluid
  `vw`+`max-width`+`aspect-ratio` below `sm:`, fixed pixels above it,
  matching the pattern `BrowserVisual` already used.
- **CLS**: added `tabular-nums` to the dashboard's animated count-up
  numbers and progress percentage — prevents the few-pixel width change
  as digits change from 0 to a 2–3 digit number during the animation.
- **Minor cleanup**: removed an unnecessary `"use client"` from
  `RocketVisual.jsx` — `useId()` works in Server Components, and the
  component is only ever rendered inside parents that already declare
  `"use client"` themselves, so the directive had no effect either way.
- **Confirmed clean (audited, unchanged)**: single Lenis instance, single
  GSAP ticker/rAF loop, every `ScrollTrigger`/`gsap.context()` properly
  cleaned up on unmount (grepped every `.create(`/`gsap.context(` against
  its cleanup), no clickable `<div>`s anywhere (every `onClick` is on a
  real `<a>`/`<button>`), no CSS ordering that would desync tab order
  from visual order, no `outline-none` anywhere, `package.json` unchanged
  since Phase 1 (no new dependencies added in this or any prior phase).

Known gaps: **could not run `npm run build` or `npm run lint`** — no
network access in this sandbox to install `node_modules`
(`next: not found`). Every fix above was verified by re-reading the
affected file in full, not by an actual build/lint/browser run — treat
this phase as a thorough manual audit, and run the real build yourself
before shipping.

## Phase 7 — final QA, deployment & production launch readiness

Final audit pass — no new features, no redesign. Everything below was
verified by static analysis and full re-reads, not a live build (see the
final report for exactly why, and what to run yourself before deploying).

- **Security/debug sweep**: grepped the whole project for
  `console.log`/`debugger` (none), hardcoded `localhost`/dev URLs (none),
  and `process.env` usage (exactly two: `NODE_ENV` and the already-gated,
  public, opt-in `NEXT_PUBLIC_SCROLL_DEBUG` flag — neither is a secret,
  and the debug flag is hard-disabled outside development regardless of
  its value). No `.env` file exists, nothing to accidentally commit.
- **`.gitignore` gap fixed**: `.env*.local` doesn't match a bare `.env`
  file (no ".local" suffix) — added an explicit `.env` line alongside it.
- **Added `app/not-found.js`**: no 404 page previously existed (Next was
  falling back to its generic default). Added a minimal, on-brand one —
  same dark background, same pill-button CTA style as the rest of the
  site, link back to `/`.
- **Verified programmatically, not just by eye**: wrote a one-off script
  that resolves every local `import ... from` (relative and `@/` alias)
  across every `.js`/`.jsx` file in the project and confirms the target
  file exists — all resolved cleanly. A second pass cross-checked every
  _named_ and _default_ import against the actual exports in its target
  file — all matched. A third pass scanned every `.map()` call for a
  `key` prop — one flagged, checked by hand, and confirmed a false
  positive (it maps to `ScrollTrigger.create()` calls, not JSX, so no key
  applies).
- **Re-confirmed the reported key-spread warning stays fixed** —
  `components/story/SimpleStory.jsx` still has zero `{...spread}` objects
  carrying their own `key` field; the one remaining spread in the project
  (`Work.jsx`'s `<ProjectCard key={project.id} {...project} />`) was
  re-verified safe, since `project` objects never contain a `key` field.
- **Link audit**: cross-checked every internal `href="#..."` anchor
  against every section's actual `id` — all resolve (`#top`, `#services`,
  `#work`, `#process`, `#about`, `#contact`). Confirmed no fake external
  URLs anywhere — every social/contact link still only renders when
  `lib/siteConfig.js` has a real, non-empty value.
- **Asset audit**: the only two `/assets/...` path strings in the entire
  codebase are inside doc comments showing how to wire in a real image
  later (`Logo.jsx`, `lib/content/projects.js`) — there is currently no
  live `src=` pointing at a file that doesn't exist, so there's nothing
  to 404 on today.
- **Tailwind production-purge check**: reviewed every dynamic
  `className={\`...\`}`template literal in the project (6 total) — all
either branch between two complete, static class strings, or forward a
complete static string through a prop; none construct a partial class
name from a variable (the classic pattern that silently drops styles
in a production build). Confirmed`tailwind.config.js`'s `content`
globs cover every directory with JSX (`app/`, `components/`, `lib/`).
- **Domain / deployment**: confirmed `SITE_URL` (`https://AKIVRO.dev`,
  centralized in `lib/siteConfig.js`) is the intended production domain
  as specified, already documented in that file as "DNS/deployment may
  not be fully pointed at it yet." Made no DNS/Vercel changes — none are
  possible or appropriate from static code, and the instructions are
  explicit that this must be verified/completed manually. No
  `vercel.json` added — this is a completely standard Next.js app with
  no custom routing/headers, so Vercel's zero-config detection is
  sufficient; adding one would be unnecessary configuration.
- **Confirmed unchanged from Phase 6's audit** (re-verified, not just
  assumed): single Lenis instance, single GSAP ticker, every
  `ScrollTrigger`/`gsap.context()` cleaned up on unmount, no unnecessary
  dependencies (`package.json` identical since Phase 1 aside from zero
  added packages), no analytics/tracking scripts anywhere.

Still not possible in this sandbox: an actual `npm run build`/`npm run
lint` run, a real browser/device QA pass, or anything involving Vercel/DNS
(no network, no deployment access). See the final chat report for the
complete, explicit list of what to verify yourself before launch.

## Phase 8 — Product CMS & Admin Portal

Phase 8 introduces a secure Product CMS & Admin Portal backed by **Node.js + Express.js + PostgreSQL + Prisma ORM + Cloudinary + HTTP-only JWT authentication**, cleanly separated across `frontend/` and `backend/`.

- **Database Schema (`backend/prisma/schema.prisma`)**:
  - `AdminUser` (`id`, `email`, `passwordHash`, `createdAt`, `updatedAt`)
  - `Product` (`id`, `title`, `slug`, `shortDescription`, `fullDescription`, `category`, `status` [`DRAFT` | `PUBLISHED`], `featured`, `thumbnailUrl`, `images`, `technologies`, `liveUrl`, `githubUrl`, `createdAt`, `updatedAt`)
- **Backend API (`backend/server.js`)**:
  - Authentication: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
  - Public Products: `GET /api/products`, `GET /api/products/:slug`
  - Admin Protected CRUD: `GET /api/products?all=true`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`, `PATCH /api/products/:id/publish`, `PATCH /api/products/:id/unpublish`
  - Cloud Image Upload: `POST /api/upload` (and `POST /api/products/upload`)
- **Frontend Routes (`frontend/app/`)**:
  - Public: `/` (featured/published products in `<Work />`), `/products`, `/products/[slug]`
  - Admin: `/admin`, `/admin/login`, `/admin/dashboard`