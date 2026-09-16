---
id: platform/dev/6.7/products/digital-sales-rooms/customization/_index.md
title: Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/customization/
sourceHash: 023aa53aea7c608844cad4226ab7263078ce8728
codeCheckedAgainst: "6.7.13.0"
keywords: ["digital sales rooms", "dsr", "dsr-frontends", "nuxt layer", "nuxt 3", "nuxt.config.ts", "dsr layer", "example layer", "customization", "frontend template", "override"]
summary: Customize the Digital Sales Rooms Nuxt 3 frontend by adding your own Nuxt layer on top of the untouched default dsr layer, imported in nuxt.config.ts.
lastBuilt: 2026-09-15
---
## What it is

Overview of how to customize the *Digital Sales Rooms* (DSR) frontend template. The DSR frontend is built with Nuxt 3 and uses the Nuxt Layer concept: your own layer overrides file content from the default layer.

## When to use

You need to change the look, texts, or components of the DSR frontend (`dsr-frontends` template) without editing the shipped files.

## Key steps / config

1. In the `dsr-frontends` template, leave the default Nuxt layer `dsr` untouched.
2. Create a new Nuxt layer for your customizations and import it in `nuxt.config.ts` (see the Nuxt layers composition guide: nuxt.com/docs/guide/going-further/layers).
3. Alternatively, start from the shipped customization layer `example` in the frontend source — rename it and modify its contents.

## Essential identifiers

- `dsr-frontends` — the frontend template repository
- `dsr` — default Nuxt layer (do not modify)
- `example` — sample customization layer
- `nuxt.config.ts` — where the custom layer is imported

## Gotchas

- Customizations made directly in the `dsr` layer are against the documented approach; all changes belong in your own layer.

## Code check (6.7.13.0)
- unverified `dsr-frontends` — separate Nuxt frontend project, not part of vendor/shopware core/storefront/administration
- unverified `nuxt.config.ts` — Nuxt frontend file, out of scope of the installed Shopware code
- unverified `dsr` — default DSR Nuxt layer, not present in the installed Shopware packages
