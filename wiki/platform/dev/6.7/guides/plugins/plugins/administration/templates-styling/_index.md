---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/_index.md
title: Templates and Styling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/
sourceHash: 1f3f1672a187c6cdd9320fdb1c7dcf69445dbaaf
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration templates", "administration styling", "twig", "vue", "scss", "snippets", "translations", "static assets", "responsive behavior", "Shopware.Component.register", "asset filter", "v-responsive"]
summary: Overview of Shopware 6.7 Administration plugin guides for Twig/Vue templates, SCSS styles, snippet translations, static assets and responsive behavior.
lastBuilt: 2026-09-15
---
## What it is

The landing page for the Administration "Templates and Styling" guides. These guides cover the visual and structural side of Administration extensions in plugins: templates, styles, assets and translations.

## When to use

Start here when an Administration plugin needs to:

- write Twig/Vue-based component templates,
- add custom SCSS styles to a component,
- register and use snippet translations,
- work with static assets (images etc.) in the Administration,
- react to element or viewport size changes.

## Key steps / config

The section contains five guides:

- **Writing Templates** — Twig/Vue templates for Administration components.
- **Add Custom Styles** — a `.scss` file imported in the component's `index.js`, registered via `Shopware.Component.register`; Administration SCSS variables such as `$color-shopware-brand-500` are available.
- **Adding Snippets** — per-locale JSON snippet files (e.g. `en-GB.json`); the Administration loads snippets from the `/_admin/snippets?locale=` endpoint.
- **Using Assets** — files under `Resources/app/administration/static`, resolved at runtime with the `asset` filter (`Shopware.Filter.getByName('asset')`).
- **Adding Responsive Behavior** — the `this.$device` helper and the `v-responsive` directive.

## Gotchas

- The snippet guide's `$tc` helper is deprecated in the installed code (`@deprecated tag:v6.8.0`, use `$t`); see the Code check below.

## Code check (6.7.13.0)
- confirmed `Shopware.Component.register` — component registration used by core modules — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-services/index.ts:5
- confirmed `$color-shopware-brand-500` — defined in the Administration SCSS variables file — vendor/shopware/administration/Resources/app/administration/src/app/assets/scss/variables.scss:53
- confirmed `/_admin/snippets` — snippet API service fetches snippets per locale — vendor/shopware/administration/Resources/app/administration/src/core/service/api/snippet.api.service.ts:43
- confirmed `Shopware.Filter.getByName` — used with `'asset'` in core modules — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-services/page/sw-settings-services-index/index.ts:46
- confirmed `asset` — filter registered via `Shopware.Filter.register` — vendor/shopware/administration/Resources/app/administration/src/app/filter/asset.filter.ts:5
- confirmed `v-responsive` — directive registered as `responsive` — vendor/shopware/administration/Resources/app/administration/src/app/directive/responsive.directive.ts:16
- confirmed `$device` — DeviceHelper exposed on app global properties — vendor/shopware/administration/Resources/app/administration/src/app/plugin/device-helper.plugin.js:23
- deprecated `$tc` — marked `@deprecated tag:v6.8.0`, use `$t` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:185
