---
id: platform/dev/6.7/guides/upgrades-migrations/administration/_index.md
title: Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/
sourceHash: 2d01354dc4e21698df55305b823c19f469f69e95
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration migration", "vue 3 migration", "pinia migration", "vite migration", "meteor components", "vue migration build removal", "native vue", "admin upgrade", "createPinia", "@shopware-ag/meteor-component-library", "shopware-cli automatic refactoring", "breaking changes"]
summary: "Index of Administration migration guides: Vue 3, Meteor components, Pinia, Vite, Vue migration build removal, native Vue; plus CLI automatic refactoring."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/automatic-refactoring.md"]
---
## What it is

Section index for architectural changes and migration paths that affect Administration extensions (plugins and apps extending the Shopware Administration). Depending on the Shopware version, some of these transitions, for example Vue 3, Pinia and Vite, may already be completed.

## When to use

You maintain an Administration extension and are preparing it for a major system transition in the Administration framework, or you need to find the guide for a specific migration topic.

## Key steps / config

The section contains these migration guides:

1. Vue 3 migration
2. Meteor components
3. Pinia migration
4. Vite migration
5. Vue migration build removal
6. Native Vue implementation

For automated detection and fixing of supported Administration migration patterns, use the [Shopware CLI automatic refactoring](platform/dev/6.7/products/tools/cli/automatic-refactoring.md) guide.

State of the installed Administration source (6.7.13.0): the view adapter imports `createApp` from `vue` (Vue 3 API), the store layer builds on `createPinia`/`defineStore` from `pinia`, and the entry file `app/main.ts` loads the `@shopware-ag/meteor-component-library` stylesheets. Extensions targeting this version work against Vue 3, Pinia and Meteor components.

## Essential identifiers

- `createApp` (Vue 3), `createPinia`, `defineStore` (Pinia)
- `@shopware-ag/meteor-component-library`

## Code check (6.7.13.0)
- confirmed `createApp` — Vue 3 app creation imported by the view adapter — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:14
- confirmed `createPinia` — Pinia store setup — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:2
- confirmed `defineStore` — Pinia store definition helper — vendor/shopware/administration/Resources/app/administration/src/app/store/index.ts:3
- confirmed `@shopware-ag/meteor-component-library` — Meteor styles loaded in the admin entry — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:58
- unverified `vite` — build tooling lives outside the checked admin src root
