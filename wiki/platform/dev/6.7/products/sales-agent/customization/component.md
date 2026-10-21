---
id: platform/dev/6.7/products/sales-agent/customization/component.md
title: Component Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/customization/component.html
sourceHash: e1e454e1b9961cc2fa64f0f42ea3ef7bd182215b
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales agent", "component customization", "login.vue", "sales-agent/pages/auth", "~/layers/sales-agent", "nuxt layer", "override component", "custom layer", "example layer", "vue component", "login page"]
summary: Override a Sales Agent frontend component (e.g. login.vue) by copying it from the default sales-agent layer into your custom Nuxt layer and editing it.
lastBuilt: 2026-10-21
---
## What it is

Describes how to customize a single component of the Sales Agent frontend, using the login page as the example, through the Nuxt layer concept. The default component is shadowed by a copy in your custom layer, so core files are never modified.

## When to use

When you need to change the style, template or behaviour of an existing Sales Agent page or component without editing the default layer.

## Key steps / config

1. Inspect the default layer: browse `~/layers/sales-agent` to see all available components.
2. Find the component to change, here `login.vue` inside `sales-agent/pages/auth`.
3. Copy that file into your custom layer, giving you an identical component in the custom-layer directory.
4. Modify the copied file: change the style, add new functionality or update the template.
5. From then on the frontend ignores the `login.vue` of the default layer and uses only the one from your custom layer.

A worked example is provided in the `example` layer of the Sales Agent source code.

## Essential identifiers

- `~/layers/sales-agent` — default layer directory holding all components
- `sales-agent/pages/auth/login.vue` — login page component used as the example
- `example` — sample customization layer in the source code

## Gotchas

- All paths in the instructions refer to your customization layer folder; changes are never made in the default layer.
- The copy in your layer replaces the default component entirely rather than merging with it — the default `login.vue` is ignored once your copy exists.

## Code check (6.7.15.1)
- unverified `login.vue` — component of the separate Sales Agent Nuxt frontend, not in the installed core, storefront or administration packages
- unverified `~/layers/sales-agent` — Sales Agent frontend directory, out of scope
- unverified `example` — sample layer in the Sales Agent source, out of scope
