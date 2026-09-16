---
id: platform/dev/6.6/products/sales-agent/appearance.md
title: Appearance
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/sales-agent/appearance.html
sourceHash: 1400eedf841d95ef2d23fe75cd7fc636a5550fd9
keywords: ["Sales Agent appearance", "theme customization", "config.ts", "favicon", "logo", "SCSS", "Sass", "UnoCSS", "meteor component library", "package.json"]
summary: How to customize Sales Agent theme, favicon, and logo via config.ts; SCSS is a deprecated-leaning dev dependency in favor of UnoCSS.
lastBuilt: "2026-09-15"
---
## What it is

Describes how to customize the appearance of Sales Agent: theme, colors, logo, favicon.

## Key steps / config

- SCSS (Sass) is currently included as a dev dependency (see `package.json`), required as a peer dependency of the meteor component library, but its use is discouraged since Sales Agent already provides UnoCSS for styling (also integrated into the Shopware Frontends framework), and SCSS is likely to be removed in the future.
- Customize the app by editing `config.ts`.
- Replace favicon and logo, preferably using square image dimensions:
  - Favicon: `./public/favicon.ico`
  - Logo: `./public/logo.svg`

## Essential identifiers

- `config.ts`
- `./public/favicon.ico`
- `./public/logo.svg`

## Gotchas

SCSS support is likely to be removed from Sales Agent in the future; prefer UnoCSS for styling.
