---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2026-04-16-storefront-component-build-time-scss.md
sourceHash: eed4b2ab74a60c8de91068bb893523361adc8c4f
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-04-16-storefront-component-build-time-scss.html
title: Build-time SCSS compilation for Storefront components
version: "6.7"
versions:
  - "6.7"
keywords: ["storefront components", "component scss", "vite", "build-time compilation", "ThemeCompiler", "theme:compile", "scssphp", "css custom properties", "--sw-color-brand-primary", "Resources/views/components", "Resources/public/storefront/components", "assets:install", "composer build:js:storefront", "import map"]
summary: "ADR: Storefront component SCSS is compiled at build time by Vite, not by the PHP ThemeCompiler; theming uses CSS custom properties (var(--sw-*))."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record for the Storefront component system (theme-agnostic Twig UX components contributed by the Storefront, plugins and apps). It decides that component SCSS is compiled at **build time** by Vite, the same toolchain that already compiles component JavaScript, instead of by the PHP theme compiler (`ThemeCompiler` via `scssphp/scssphp`) during `theme:compile`.

The rejected alternative had several problems: the PHP pipeline was built for the monolithic per-theme `all.css` and is tied to the theme lifecycle; component styles would be recompiled on every `theme:compile` even when unchanged; the PHP compiler lacks the Sass load paths, Node.js packages and modern Sass features of the JS toolchain; it would need to know which component files belong to which bundle; and for apps it would have to download and unpack the app zip on every `theme:compile` just to find SCSS files.

## When to use

- You write SCSS for a Storefront component in a bundle, plugin or app.
- You need a component style to follow the active theme configuration (brand colours, spacing).
- You package an extension release that contains Storefront components.

## Key steps / config

1. Place component styles next to their JS under `Resources/views/components/**/*.scss` (plain `.css` is also picked up). A component may have only one style source.
2. Build: `composer build:js:storefront` (or the individual component build). Each SCSS file is compiled to its own CSS file in `Resources/public/storefront/components/`, alongside the compiled JS. Rerun the build whenever component SCSS changes.
3. Publish through the normal asset flow: `assets:install` copies the output to `public/bundles/<bundle>/storefront/components`.
4. `theme:compile` reads the bundle-local Vite build meta (`public/bundles/<bundle>/storefront/components/.vite/build-meta.json`) and adds each component's CSS to the import map stored in the theme runtime config.
5. For theme-dependent values, use CSS custom properties instead of SCSS theme variables:

```scss
.my-component {
    color: var(--sw-color-brand-primary); // not $sw-color-brand-primary
}
```

The active theme's configuration is rendered at request time as a `<style>` block of `--sw-*` custom properties in the storefront page template.

## Essential identifiers

- `ThemeCompiler` (`Shopware\Storefront\Theme\ThemeCompiler`), `theme:compile`
- `Resources/views/components/`, `Resources/public/storefront/components/`
- `public/bundles/<bundle>/storefront/components`, `.vite/build-meta.json`
- `composer build:js:storefront`, `assets:install`
- `var(--sw-color-brand-primary)` / `--sw-*` custom properties

## Gotchas

- Component SCSS **cannot use SCSS theme variables** (`$sw-*`); they are only resolved at theme-compile time. Bootstrap and Shopware skin abstracts (mixins, functions, fixed design tokens) remain available.
- Component SCSS **cannot use runtime feature-flag state**. Handle flag-dependent styling at runtime via markup, classes, data attributes or JavaScript.
- Component CSS is compiled once per deployment, not per `theme:compile`; forgetting the build step leaves stale CSS.
- Plugins and apps must ship the precompiled `Resources/public/storefront/components/` output in their release artifact, so no build is needed on the merchant's server.
- Having both `Foo.scss` and `Foo.css` for one component makes the component build throw.
- When theme config values are converted to custom properties, values using SCSS-only functions such as `darken(...)` are skipped; simple `$var` references become `var(--var)`.

## Code check (6.7.15.1)
- confirmed `ThemeCompiler` — PHP theme compiler class still exists alongside the component pipeline — vendor/shopware/storefront/Theme/ThemeCompiler.php:33
- confirmed `storefront/components` — import map entries point at `/bundles/<bundle>/storefront/components/` — vendor/shopware/storefront/Theme/ThemeCompiler.php:182
- confirmed `build-meta.json` — component entries come from per-bundle Vite build metadata — vendor/shopware/storefront/Theme/ThemeCompiler.php:189
- confirmed `Resources/views/components` — Vite component build source root — vendor/shopware/storefront/Resources/app/storefront/build/vite/build-components.js:38
- confirmed `**/*.scss` — component build globs SCSS files under the component root — vendor/shopware/storefront/Resources/app/storefront/build/vite/build-components.js:280
- confirmed `A component may only have one style source` — build throws on both .scss and .css — vendor/shopware/storefront/Resources/app/storefront/build/vite/build-components.js:302
- confirmed `Resources/public/storefront/components/` — compiled output tree served without path rewriting — vendor/shopware/storefront/Resources/app/storefront/build/vite/build-components.js:350
- confirmed `var(--sw-color-brand-primary)` — SCSS variable expressions in theme config map to CSS custom properties — vendor/shopware/storefront/Theme/ThemeConfigValueAccessor.php:134
- unverified `composer build:js:storefront` — composer script lives in the root composer.json, outside the three code roots
