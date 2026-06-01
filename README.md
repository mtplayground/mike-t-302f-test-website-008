# Astro Landing Page

Static Astro project with TypeScript and Tailwind CSS.

## Requirements

- Node.js 20.3 or newer
- npm 9.6.5 or newer

## Setup

```bash
npm install
cp .env.example .env
```

Set the public environment variables in `.env`:

```bash
PUBLIC_CONTACT_EMAIL=contact@example.com
PUBLIC_SITE_URL=https://example.com
```

## Development

```bash
npm run dev
```

The dev server listens on `0.0.0.0:8080`.

## Build

```bash
npm run build
```

The static site is generated in `dist/`.

## Preview

```bash
npm run preview
```
