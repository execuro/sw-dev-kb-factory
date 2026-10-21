---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/_index.md
title: Tutorial
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/tutorial/
sourceHash: aa94a0b7ec82e60d23bc62b7a81c9cf178c61bcc
codeCheckedAgainst: "6.7.15.1"
keywords: ["single file component tutorial", "sfc", "administration plugin", "vue override", "useSwPreviousState", "sw-block", "swDefinePublic", "swDefineOverride", "margin hint", "product detail page", "swag-margin-hint"]
summary: Overview of the five-chapter Admin Single File Component tutorial that builds a low-margin warning plugin on the product detail page.
lastBuilt: 2026-10-21
---
## What it is

Entry page of a five-chapter tutorial that builds an Administration plugin from scratch with Single File Components. The finished plugin warns a merchant on the product detail page when a product's profit margin is too low.

## When to use

As the starting point for learning the SFC extension system hands-on; begin with chapter 1, which sets up the development environment.

## Key steps / config

1. **Set up your environment** — Docker, the plugin skeleton, and the build.
2. **Your first override** — put your own markup on the product detail page.
3. **Read the component you extend** — `useSwPreviousState()` and real product data.
4. **Build your own component** — a base SFC with props and state of its own.
5. **Make your component extensible** — `sw-block`, `swDefinePublic` and `swDefineOverride`.

## Essential identifiers

- `useSwPreviousState()`, `sw-block`, `swDefinePublic`, `swDefineOverride`

## Code check (6.7.15.1)
- confirmed `useSwPreviousState` — override composable, used in the jest transform fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:4
- confirmed `swDefineOverride` — override marker macro, used in the same fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:7
- confirmed `swDefinePublic` — its bindings feed the generated defineExpose via getExposedProps — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:531
- confirmed `sw-block` — runtime extension-point component — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:25
