---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-styling.md
title: Add custom styling
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-custom-styling.html
sourceHash: ab27c2b6767827f13499a3629439f201e8d9faca
keywords: ["custom styling", "base.scss", "SCSS variables", "abstract/variables.scss", "build-storefront.sh", "watch-storefront.sh", "composer run build:js:storefront", "composer run watch:storefront", "hot-proxy", "storefront SCSS", "plugin styling"]
summary: How to add a base.scss file with custom styles and SCSS variables to a plugin, then build or watch the Storefront to apply changes.
lastBuilt: 2026-09-15
---
## What it is

This guide explains how to add custom SCSS styling to a plugin's Storefront templates, including using SCSS variables and building/watching the compiled output.

## When to use

Use this whenever a plugin changes or adds Storefront templates that need dedicated CSS/SCSS styling to look correct.

## Key steps / config

1. Create a `base.scss` file at `<plugin root>/src/Resources/app/storefront/src/scss/base.scss` — Shopware 6 looks for this file by default:

```css
body {
    background: blue;
}
```

2. Optionally define reusable values in `<plugin root>/src/Resources/app/storefront/src/scss/abstract/variables.scss`:

```css
$sw-storefront-assets-color-background: blue;
```

then `@import 'abstract/variables.scss';` in `base.scss` and reference the variable instead of a hard-coded value.

3. Compile the SCSS to test it, using one of the following depending on setup:

```bash
./bin/build-storefront.sh
# or, platform-only contribution setup:
composer run build:js:storefront
```

4. To see live changes, use the Storefront hot-proxy instead:

```bash
./bin/watch-storefront.sh
# or, platform-only contribution setup:
composer run watch:storefront
```

When using the hot-proxy, access the store via port `9998`, e.g. `domainToYourEnvironment.in:9998`.

## Essential identifiers

- `base.scss` — `<plugin root>/src/Resources/app/storefront/src/scss/base.scss`
- `abstract/variables.scss` — plugin SCSS variable file
- `./bin/build-storefront.sh`, `composer run build:js:storefront`
- `./bin/watch-storefront.sh`, `composer run watch:storefront`

## Gotchas

There are two equivalent command forms depending on setup — the `./bin/*.sh` scripts for a template-based project, or `composer run build:js:storefront` / `composer run watch:storefront` for a platform-only contribution setup.
