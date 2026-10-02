# public/assets

Structure for real AKIVRO.dev assets, ready for files to be dropped in as
they become available. Nothing here has been invented — see each
subfolder's note for what it's for and how it plugs into the site.

```
public/assets/
├── brand/     logo, favicon source, brand marks
├── projects/  real project/website/app screenshots for the Work section
├── devices/   real device-frame photos, if you'd rather use photography
│              than the CSS-built laptop/phone/browser in components/story/
└── icons/     any additional icon assets beyond app/icon.svg
```

## How to wire a real asset in once it exists

- **Logo** — replace the "AKIVRO.dev" text in `components/site/Navigation.jsx`
  and `components/site/Footer.jsx` with an `<Image src="/assets/brand/logo.svg" .../>`.
- **Favicon** — `app/icon.svg` is the current placeholder mark (Next's
  file-based icon convention). Replace that file directly, or add
  `app/icon.png` instead and delete `icon.svg`.
- **Project images** — add files under `projects/`, then fill in the
  `PROJECTS` array in `components/site/Work.jsx` with
  `{ name, category, description, tech, href, image: "/assets/projects/…" }`
  and pass `image` through to `<ProjectCard>` (currently a CSS gradient
  placeholder — see `components/site/ProjectCard.jsx`).
- **Social preview image** — add one under `brand/` and set
  `openGraph.images` / `twitter.images` in `app/layout.js`. Deliberately
  left unset for now rather than shipping a fake one.

Until real files land here, the site keeps using the CSS/SVG placeholders
built in Phase 2/3/4 — nothing is blocked on these assets existing.
