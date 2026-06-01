# Product Snapshot

## What This Project Is

Agent Team for Founders is a static Astro landing page for a founder-focused software delivery service. The page communicates the core promise: "You just talk, we handle the rest."

## What It Does

The site presents a complete single-page marketing flow:

- Header with brand mark, navigation, and contact action.
- Hero section with headline, tagline, primary `mailto:` CTA, and workflow image.
- Value proposition focused on production-ready software and full code ownership.
- How-it-works section covering Planning, Building, Deploying, and Operating.
- Differentiators for GitHub-native delivery and code ownership.
- Closing CTA band with a `mailto:` contact action.
- Footer with contact email and copyright.

## Architecture

- Framework: Astro with TypeScript, static output.
- Styling: Tailwind CSS 4 through the Vite plugin, with project design tokens in `src/styles/global.css`.
- Layout: `src/layouts/BaseLayout.astro` owns document structure, metadata, Open Graph/Twitter tags, favicon, skip link, header, and footer.
- Content composition: `src/pages/index.astro` composes all landing sections inside one `main#main-content`.
- Components:
  - Shared UI primitives live in `src/components/ui/`.
  - Page sections live in `src/components/sections/`.
  - Site chrome lives in `src/components/Header.astro` and `src/components/Footer.astro`.
- Shared site metadata, contact email, nav links, and image metadata live in `src/config/site.ts`.

## Configuration

Public environment variables:

- `PUBLIC_CONTACT_EMAIL`
- `PUBLIC_SITE_URL`

`.env.example` provides example values. If unset, the site falls back to example defaults so local builds remain deterministic.

## Verification

Available npm scripts:

- `npm run dev` starts Astro on `0.0.0.0:8080`.
- `npm run build` generates static output in `dist/`.
- `npm run preview` serves the built site on `0.0.0.0:8080`.
- `npm run verify:static` serves `dist/` locally, checks static paths/assets, hash targets, headline/tagline rendering, and `mailto:` links.

## Conventions

- Product-facing brand/name and tagline come from the issue-defined copy.
- Keep the site static and dependency-light unless a future requirement needs interactivity.
- Use shared primitives before adding section-specific layout patterns.
- Keep accessibility basics in place: one main landmark, skip link, labelled sections, ordered headings, image alt text, and contrast-conscious tokens.
