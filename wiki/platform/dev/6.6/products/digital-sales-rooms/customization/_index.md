---
id: platform/dev/6.6/products/digital-sales-rooms/customization/_index.md
title: Customization
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/customization/
sourceHash: 6967155e2644afa71ec1b1954c0f6a668103120c
keywords: ["digital sales rooms", "DSR", "customization", "Nuxt 3", "Nuxt layer", "dsr-frontends", "nuxt.config.ts", "frontend customization", "example layer", "DSR frontend template", "layer override", "component customization"]
summary: "Section index explaining how to customize the Digital Sales Rooms Nuxt 3 frontend template via Nuxt layers."
lastBuilt: "2026-09-15"
---
## What it is

This is the section index for customizing the Digital Sales Rooms (DSR) frontend template. The DSR frontend is built with Nuxt 3 and uses the Nuxt Layer concept: instead of editing the default template files directly, developers create their own Nuxt layer whose files override the default layer's content.

## When to use

Use this page as the starting point whenever you need to change how the DSR frontend looks or behaves — for example overriding a component, a page, or configuration shipped in the default `dsr` layer — without modifying the core template files, so upstream updates to the default layer remain mergeable.

## Key steps / config

- The `dsr-frontends` template ships a default Nuxt layer named `dsr`; this layer should remain untouched.
- Create a new Nuxt layer for your customizations and import it in `nuxt.config.ts`.
- The template also ships a customization layer named `example` in the frontend source code, which can be renamed and edited to hold your own overrides.

## Essential identifiers

- `dsr` — the default (untouched) Nuxt layer shipped with `dsr-frontends`.
- `example` — the pre-created customization layer developers can rename and extend.
- `nuxt.config.ts` — the file where a new customization layer is imported.
