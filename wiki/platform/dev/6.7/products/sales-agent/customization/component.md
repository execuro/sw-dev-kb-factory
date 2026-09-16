---
id: platform/dev/6.7/products/sales-agent/customization/component.md
title: Component Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/customization/component.html
sourceHash: e1e454e1b9961cc2fa64f0f42ea3ef7bd182215b
codeCheckedAgainst: "6.7.13.0"
keywords: ["sales agent", "component customization", "override component", "nuxt layer", "login.vue", "layers/sales-agent", "pages/auth", "custom layer", "vue component", "example layer"]
summary: "Override a Sales Agent component (e.g. sales-agent/pages/auth/login.vue) by copying it into your custom Nuxt layer and editing the copy."
lastBuilt: 2026-09-15
---
## What it is

How to customize a Sales Agent frontend component, using the login page as the example, via the Nuxt layer concept — without altering the core files of the default layer. All changes happen in your customization layer folder.

## When to use

When you need to change the style, template or behavior of an existing Sales Agent page or component.

## Key steps / config

1. Inspect the default layer in `~/layers/sales-agent` to find the component; for the login page this is `login.vue` in `sales-agent/pages/auth`.
2. Copy the file into your custom layer at the matching location, so the custom layer holds the same default component.
3. Modify the copy (style, new functionality, template).
4. The app now ignores `login.vue` from the default layer and uses only the one from the custom layer.

A worked example is in the `example` layer of the frontend source code.

## Essential identifiers

- `~/layers/sales-agent`
- `sales-agent/pages/auth/login.vue`
- `example` layer

## Gotchas

- The custom-layer copy fully replaces the default file: the default layer's `login.vue` is ignored once the override exists.

## Code check (6.7.13.0)
- unverified `login.vue` — component of the separate Sales Agent frontend repository; not in vendor/shopware
- unverified `layers/sales-agent` — Sales Agent default layer path; out of scope of the installed Shopware packages
