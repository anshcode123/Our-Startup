# Anshul.dev — Phase 1: Scroll Engine Foundation

A fresh Next.js (App Router, JavaScript) project containing the reusable
Lenis + GSAP ScrollTrigger scroll-animation engine that later phases will
build the cinematic Anshul.dev story on top of. This phase ships a temporary
demo page only — not the final homepage.

## Getting started

This sandbox has no network access, so dependencies could not be installed
or the dev server started here. On your machine, from this folder:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To temporarily see ScrollTrigger's debug markers during development, run:

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
placeholder (`hello@anshul.dev`) rather than a confirmed real inbox —
swap it in `lib/siteConfig.js`; social links stay hidden until filled in
the same file.
