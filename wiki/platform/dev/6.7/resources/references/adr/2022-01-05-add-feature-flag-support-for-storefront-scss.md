---
id: platform/dev/6.7/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md
title: Add feature flag support for Storefront SCSS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.html
sourceHash: 8db611bccb46451586032170ccb7423f6d006414
codeCheckedAgainst: "6.7.13.0"
keywords: ["feature()", "$sw-features", "ThemeCompiler", "getFeatureConfigScssMap", "Feature::getAll", "config_js_features.json", "feature:dump", "webpack.config.js", "feature flag", "scss", "storefront theme compile", "adr"]
summary: "ADR: Storefront SCSS can check feature flags via the global feature() function reading the $sw-features map injected by ThemeCompiler or webpack."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record that adds feature flag checks inside Storefront SCSS, analogous to the Twig `feature()` check. The active feature configuration is injected into every SCSS compile as a Sass map named `$sw-features`, and a global SCSS function `feature()` reads from it.

## When to use

- You need to change Storefront styles depending on a feature flag (for example a major flag) without inventing extra template classes toggled in Twig.
- You want styles behind a flag to be absent from the compiled CSS when the flag is off.
- You need to make breaking changes in SCSS functions, mixins or variables backward-compatible behind a flag.

## Key steps / config

1. Use the global function in any Storefront SCSS file:

```scss
body {
    @if feature('FEATURE_NEXT_1') {
        background-color: #ff0000;
    } @else {
        background-color: #ffcc00;
    }
}
```

2. The map injected into the compiled SCSS has this shape:
   `$sw-features: ("FEATURE_NEXT_1234": false, "FEATURE_NEXT_1235": true);`
   It is built from `Feature::getAll()` by the private method `\Shopware\Storefront\Theme\ThemeCompiler::getFeatureConfigScssMap()` and prepended to the theme variables and styles before compilation, as part of `\Shopware\Storefront\Theme\ThemeCompiler::compileTheme()`.
3. For the webpack hot-proxy build, the map comes from `var/config_js_features.json` instead. Generate that file with `bin/console feature:dump`.

The function itself is a thin wrapper: `@return map-get($sw-features, $feature-flag);`.

## Essential identifiers

- `feature()` (SCSS function, `scss/abstract/functions/feature.scss`)
- `$sw-features` (SCSS map)
- `\Shopware\Storefront\Theme\ThemeCompiler`
- `Feature::getAll()`
- `var/config_js_features.json`
- `bin/console feature:dump`
- `Resources/app/storefront/webpack.config.js`

## Gotchas

- If `var/config_js_features.json` does not exist, the Storefront `webpack.config.js` treats all features as disabled (false) for the hot-proxy SCSS and prints a warning asking you to run `bin/console feature:dump`.
- `getFeatureConfigScssMap()` is private in `ThemeCompiler`; it is not an extension point. The map is added inside the private `compileStyles()` step of the theme compile.

## Code check (6.7.13.0)
- confirmed `ThemeCompiler::getFeatureConfigScssMap()` — private, builds `$sw-features` from `Feature::getAll()` — vendor/shopware/storefront/Theme/ThemeCompiler.php:657
- corrected `ThemeCompiler::compileStyles()` — docs: map added to the string processed by compileTheme; code prepends it in private compileStyles() — vendor/shopware/storefront/Theme/ThemeCompiler.php:588
- confirmed `ThemeCompiler::compileTheme()` — public theme compile entry point — vendor/shopware/storefront/Theme/ThemeCompiler.php:75
- confirmed `$sw-features` — map syntax `$sw-features: (...)` — vendor/shopware/storefront/Theme/ThemeCompiler.php:663
- confirmed `Feature::getAll()` — static method on Shopware\Core\Framework\Feature — vendor/shopware/core/Framework/Feature.php:340
- confirmed `feature()` — SCSS function returning map-get($sw-features, $feature-flag) — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/functions/feature.scss:15
- confirmed `var/config_js_features.json` — read by Storefront webpack config, warning if missing — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:36
- confirmed `feature:dump` — console command writing var/config_js_features.json — vendor/shopware/core/Framework/Feature/Command/FeatureDumpCommand.php:15
