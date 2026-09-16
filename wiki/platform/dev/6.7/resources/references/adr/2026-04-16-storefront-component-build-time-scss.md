---
id: platform/dev/6.7/resources/references/adr/2026-04-16-storefront-component-build-time-scss.md
title: Build-time SCSS compilation for Storefront components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-04-16-storefront-component-build-time-scss.html
sourceHash: eed4b2ab74a60c8de91068bb893523361adc8c4f
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront components", "component scss", "vite", "ThemeCompiler", "theme:compile", "assets:install", "composer build:js:storefront", "css custom properties", "--sw-color-brand-primary", "Resources/public/storefront/components", "build-meta.json", "theme_css_vars", "scssphp"]
summary: "ADR: Storefront component SCSS is compiled at build time by Vite, not the PHP ThemeCompiler; theme values reach components as --sw-* CSS custom properties."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2026-04-16) for the Storefront Twig UX component system: component SCSS is compiled at build time by Vite (the toolchain that already builds component JavaScript) instead of by the PHP `ThemeCompiler` (`scssphp/scssphp`) during `theme:compile`.

## When to use

- You ship Storefront components (Storefront core, plugin or app) that include SCSS.
- A component stylesheet needs theme-configurable values such as the brand colour.
- You package an extension release and must decide which built assets to include.

## Key steps / config

1. Place component styles at `Resources/views/components/**/*.scss` in the bundle.
2. Build with Vite: `composer build:js:storefront` (or the individual component build). Each SCSS file compiles to its own CSS file in `Resources/public/storefront/components/` next to the component JS, together with a `.vite/build-meta.json`.
3. Publish via the normal asset flow: `assets:install` copies them to `public/bundles/<bundle>/storefront/components`.
4. Theme compile does not compile component SCSS; it reads each bundle's Vite build meta file and puts component CSS information into the import map stored in the theme runtime config.
5. Use CSS custom properties for theme values: `var(--sw-color-brand-primary)` instead of `$sw-color-brand-primary`. The active theme's configuration is rendered at request time as a `<style>` block of `--sw-*` custom properties in the storefront page template (Twig function `theme_css_vars()` in block `layout_head_theme_css_vars`).
6. Extensions (plugins and apps) must include the compiled output of `Resources/public/storefront/components/` in their release artifact, so no build step is needed on the merchant's server.

## Essential identifiers

- `Shopware\Storefront\Theme\ThemeCompiler`
- `theme:compile`, `assets:install`, `composer build:js:storefront`
- `Resources/views/components/**/*.scss` → `Resources/public/storefront/components/`
- `public/bundles/<bundle>/storefront/components/.vite/build-meta.json`
- `theme_css_vars()`, block `layout_head_theme_css_vars`
- `var(--sw-*)` custom properties

## Gotchas

- Component SCSS cannot use SCSS theme variables (`$sw-*`); Bootstrap / Shopware skin abstracts (mixins, functions, fixed design tokens) remain available.
- Component SCSS cannot depend on runtime feature-flag state; handle flag-dependent styling via markup, classes, data attributes or JavaScript.
- Component CSS is compiled once per build, not on every `theme:compile`; rerun the build whenever component SCSS changes.
- Rationale: the PHP compiler lacks the JS toolchain's Sass load paths and Node packages, and for apps would have to unpack the app zip on every `theme:compile`.

## Code check (6.7.13.0)
- confirmed `ThemeCompiler` — PHP theme compiler using ScssPhp — vendor/shopware/storefront/Theme/ThemeCompiler.php:33
- confirmed `build-meta.json` — theme compile reads per-bundle component build meta for the import map — vendor/shopware/storefront/Theme/ThemeCompiler.php:189
- confirmed `storefront/components` — component asset base `/bundles/<bundle>/storefront/components/` — vendor/shopware/storefront/Theme/ThemeCompiler.php:337
- confirmed `outDir` — Storefront component Vite build writes to `../../public/storefront/components` — vendor/shopware/storefront/Resources/app/storefront/vite.components.config.mts:66
- confirmed `**/*.scss` — component build globs SCSS files per bundle — vendor/shopware/storefront/Resources/app/storefront/build/vite/build-components.js:280
- confirmed `var(--sw-color-brand-primary)` — SCSS variable expressions mapped to CSS custom properties — vendor/shopware/storefront/Theme/ThemeConfigValueAccessor.php:134
- confirmed `theme_css_vars` — Twig function emitting theme CSS vars — vendor/shopware/storefront/Framework/Twig/Extension/ConfigExtension.php:31
- confirmed `layout_head_theme_css_vars` — block rendering theme CSS vars in page head — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:143
- confirmed `composer build:js:storefront` — documented build command — vendor/shopware/storefront/Resources/app/storefront/build/README.md:16
