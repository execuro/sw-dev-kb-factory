---
id: platform/dev/6.7/products/sales-agent/customization/_index.md
title: Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/customization/
sourceHash: 2e0e37bc8d92214e842ff78be601c9dd17d0b65d
codeCheckedAgainst: "6.7.13.0"
keywords: ["sales agent", "customization", "nuxt layer", "nuxt 3", "sales-agent", "example layer", "nuxt.config.ts", "layers", "override", "frontend customization"]
summary: "Sales Agent frontend customization: leave the default Nuxt layer sales-agent untouched, add your own layer (or adapt example) via nuxt.config.ts."
lastBuilt: 2026-09-15
---
## What it is

Overview of customizing the Sales Agent frontend, a Nuxt 3 application built on the Nuxt Layer concept: file content from the default layer can be overridden by files in your own Nuxt layer.

## When to use

Before changing anything in the Sales Agent frontend (branding, components, i18n) — it defines where customizations live.

## Key steps / config

1. Do not modify the default Nuxt layer named `sales-agent`.
2. Create a new Nuxt layer and import it in `nuxt.config.ts` (see the Nuxt layers composition guide).
3. Alternatively, start from the customization layer named `example` shipped in the frontend source code: rename it and modify its contents.

## Essential identifiers

- `sales-agent` (default layer, keep untouched)
- `example` (sample customization layer)
- `nuxt.config.ts`

## Code check (6.7.13.0)
- unverified `sales-agent` — Nuxt layer in the separate Sales Agent frontend repository; no occurrence in vendor/shopware
- unverified `nuxt.config.ts` — Sales Agent app config file; out of scope of the installed Shopware packages
