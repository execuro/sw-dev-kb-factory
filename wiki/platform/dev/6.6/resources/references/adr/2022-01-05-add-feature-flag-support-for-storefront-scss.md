---
id: "platform/dev/6.6/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md"
title: "Add feature flag support for Storefront SCSS"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.html"
sourceHash: "8db611bccb46451586032170ccb7423f6d006414"
keywords: ["feature() SCSS function", "ThemeCompiler::getFeatureConfigScssMap", "ThemeCompiler::compileTheme", "Feature::getAll", "sw-features SCSS map", "config_js_features.json", "feature:dump", "webpack.config.js", "feature flag", "FEATURE_NEXT", "storefront SCSS"]
summary: "ADR: a global feature() SCSS function reads a compiled $sw-features map so Storefront SCSS can branch on feature flags like Twig already does."
lastBuilt: "2026-09-15"
---
## What it is

This ADR adds support for checking feature flags inside Storefront SCSS, mirroring the existing Twig feature-flag support, instead of relying on workarounds like adding extra CSS classes toggled in Twig.

## When to use

Relevant when a storefront SCSS selector, mixin, function, or variable needs to change behavior based on a feature flag, or when investigating why compiled CSS for a flagged selector is present or absent.

## Key steps / config

- The feature configuration returned by `Feature::getAll()` is converted into a SCSS map by `\Shopware\Storefront\Theme\ThemeCompiler::getFeatureConfigScssMap`.
- This SCSS map is always injected into the SCSS string processed by `\Shopware\Storefront\Theme\ThemeCompiler::compileTheme`.
- The generated map has the shape: `$sw-features: ("FEATURE_NEXT_1234": false, "FEATURE_NEXT_1235": true);` — a standard Sass map.
- A globally available `feature()` SCSS function reads the map to check whether a given feature is active:
```scss
body {
    @if feature('FEATURE_NEXT_1') {
        background-color: #ff0000;
    } @else {
        background-color: #ffcc00;
    }
}
```
- For the webpack hot-proxy (dev server) path, the feature state is instead read from `var/config_js_features.json`.
- The Storefront webpack configuration `src/Storefront/Resources/app/storefront/webpack.config.js` now consumes this same `var/config_js_features.json` feature dump.

## Essential identifiers

- `feature()` SCSS function
- `\Shopware\Storefront\Theme\ThemeCompiler::getFeatureConfigScssMap`
- `\Shopware\Storefront\Theme\ThemeCompiler::compileTheme`
- `var/config_js_features.json`
- `bin/console feature:dump`

## Gotchas

When the feature dump file `var/config_js_features.json` cannot be found, all features are treated as disabled/false in both `webpack.config.js` and the hot-proxy SCSS, and a warning is shown asking to run `bin/console feature:dump` manually — SCSS behind an undumped feature flag silently behaves as if the flag were off.
