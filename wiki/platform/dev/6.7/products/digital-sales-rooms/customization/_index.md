---
id: platform/dev/6.7/products/digital-sales-rooms/customization/_index.md
title: Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/customization/
sourceHash: 023aa53aea7c608844cad4226ab7263078ce8728
codeCheckedAgainst: "6.7.15.1"
keywords: ["digital sales rooms", "dsr", "dsr-frontends", "nuxt 3", "nuxt layer", "nuxt.config.ts", "dsr layer", "example layer", "frontend customization", "template override", "theming"]
summary: Customizing the Nuxt 3 Digital Sales Rooms frontend via a custom Nuxt layer imported in nuxt.config.ts; the default dsr layer stays untouched.
lastBuilt: 2026-10-21
---
## What it is

How to customize the *Digital Sales Rooms* (DSR) frontend template. The DSR frontend is a Nuxt 3 app that uses the Nuxt Layer concept, so files can be overridden by your own layer instead of editing the shipped code.

## When to use

When you need to change templates, components or other file content of the DSR frontend while keeping the default code updatable.

## Key steps / config

1. In the `dsr-frontends` template, locate the default Nuxt layer named `dsr` — leave it unchanged.
2. Create a new Nuxt layer containing only the files you want to override (the source refers to the Nuxt documentation's layers / composition guide for details).
3. Import the new layer in `nuxt.config.ts`.
4. Alternatively, start from the customization layer named `example` that ships in the frontend source: rename it and modify its contents.

## Essential identifiers

- `dsr-frontends` — the frontend template repository
- `dsr` — default Nuxt layer (do not modify)
- `example` — sample customization layer
- `nuxt.config.ts` — where the custom layer is imported

## Gotchas

- Editing the `dsr` layer directly is discouraged; put all changes in your own layer.

## Code check (6.7.15.1)
- unverified `dsr-frontends` — separate Nuxt 3 frontend project; not part of vendor/shopware core, storefront or administration
- unverified `nuxt.config.ts` — Nuxt frontend config, out of scope of vendor/shopware
