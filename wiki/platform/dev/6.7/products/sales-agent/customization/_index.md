---
id: platform/dev/6.7/products/sales-agent/customization/_index.md
title: Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/customization/
sourceHash: 2e0e37bc8d92214e842ff78be601c9dd17d0b65d
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales agent", "sales-agent", "nuxt layer", "nuxt 3", "nuxt.config.ts", "example layer", "frontend customization", "override files", "custom layer", "layers"]
summary: Sales Agent frontend customization overview; Nuxt 3 app where you keep the default sales-agent layer untouched and override files in your own layer.
lastBuilt: 2026-10-21
---
## What it is

Entry page for customizing the *Sales Agent* frontend. The frontend is a Nuxt 3 application that uses the Nuxt Layer concept: you override the content of individual files by placing a file with the same path in your own Nuxt layer, instead of editing the shipped code.

## When to use

Read this before changing anything in the Sales Agent frontend (branding, translations, components). The sub-pages for branding, i18n and component customization all assume you already have a customization layer.

## Key steps / config

1. Locate the default Nuxt layer named `sales-agent` in the Sales Agent source code. Do not modify it.
2. Create a new Nuxt layer for your customizations.
3. Import that layer in `nuxt.config.ts` (see the Nuxt documentation's layer composition guide for the mechanics of extending layers).
4. Alternatively, start from the customization layer named `example` that ships within the frontend source code: rename it and modify its contents to suit your needs.

## Essential identifiers

- `sales-agent` — default Nuxt layer (keep untouched)
- `example` — sample customization layer shipped with the frontend source
- `nuxt.config.ts` — where your layer is imported

## Gotchas

- Changes made directly in the `sales-agent` layer defeat the override model; keep all edits in your own layer so the default layer stays as shipped.

## Code check (6.7.15.1)
- unverified `sales-agent` — Nuxt layer of the separate Sales Agent frontend repository, not part of the installed core, storefront or administration packages
- unverified `example` — sample layer lives in the Sales Agent frontend source, out of scope
- unverified `nuxt.config.ts` — Nuxt configuration of the Sales Agent app; no Nuxt code in the installed Shopware packages
