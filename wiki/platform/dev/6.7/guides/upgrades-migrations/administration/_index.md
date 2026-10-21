---
id: platform/dev/6.7/guides/upgrades-migrations/administration/_index.md
title: Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/
sourceHash: 2d01354dc4e21698df55305b823c19f469f69e95
codeCheckedAgainst: "6.7.15.1"
keywords: ["administration upgrade", "vue 3 migration", "meteor components", "pinia migration", "vite migration", "vue migration build", "native vue", "shopware-cli", "automatic refactoring", "admin extensions", "codemods"]
summary: Index of Administration migration guides (Vue 3, Meteor components, Pinia, Vite, Vue migration build removal, native Vue) for admin extensions.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/automatic-refactoring.md"]
---
## What it is

The index of guides on architectural changes and migration paths that affect Administration extensions. Use them to prepare plugins for major transitions of the Administration framework. Depending on your Shopware version, some of these changes (for example Vue 3, Pinia and Vite) may already be complete.

## When to use

You maintain an Administration plugin and need to adapt it to a framework change in the Administration.

## Key steps / config

The section covers these migrations:

- Vue 3 migration
- Meteor components
- Pinia migration
- Vite migration
- Vue migration build removal
- Native Vue implementation

Shopware CLI can detect and fix supported Administration migration patterns automatically. See [Shopware CLI automatic refactoring](platform/dev/6.7/products/tools/cli/automatic-refactoring.md).

## Code check (6.7.15.1)
- confirmed `createApp` — Administration boots a Vue 3 app — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:14
- confirmed `mapState` — Administration uses Pinia store helpers — vendor/shopware/administration/Resources/app/administration/src/app/init/component-helper.init.ts:12
