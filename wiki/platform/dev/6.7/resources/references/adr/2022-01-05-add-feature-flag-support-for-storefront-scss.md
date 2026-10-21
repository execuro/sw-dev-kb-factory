---
id: platform/dev/6.7/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md
title: Add feature flag support for Storefront SCSS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.html
sourceHash: 8db611bccb46451586032170ccb7423f6d006414
codeCheckedAgainst: "6.7.15.1"
keywords: ["feature flag", "scss", "storefront theme", "$sw-features", "feature()", "ThemeCompiler", "getFeatureConfigScssMap", "Feature::getAll", "config_js_features.json", "feature:dump", "webpack.config.js", "hot proxy"]
summary: "ADR: Storefront SCSS can check feature flags via the global feature() function, backed by a $sw-features map injected by ThemeCompiler or webpack."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-01-05, area: storefront) that adds feature-flag checks to Storefront SCSS, analogous to the Twig `feature()` check. Without it, flag-dependent styles needed workarounds (extra classes toggled in Twig), styles of flag-hidden selectors still ended up in the compiled CSS, and breaking changes to SCSS functions, mixins or variables could not be made backward-compatible behind a flag.

## When to use

You write or change Storefront/theme SCSS whose output must differ depending on whether a feature flag (including a major-version flag) is active, or you debug why a flag check in SCSS always evaluates to false during hot-proxy development.

## Key steps / config

1. The feature configuration from `Feature::getAll()` is converted to a SCSS map by `\Shopware\Storefront\Theme\ThemeCompiler::getFeatureConfigScssMap` (a private method) and prepended to the SCSS string before every theme compilation (`\Shopware\Storefront\Theme\ThemeCompiler::compileTheme`).
2. The generated map has this shape: `$sw-features: ("FEATURE_NEXT_1234": false, "FEATURE_NEXT_1235": true);` (Sass maps, see https://sass-lang.com/documentation/values/maps).
3. For the webpack hot-proxy, the map is built from `var/config_js_features.json` instead; `src/Storefront/Resources/app/storefront/webpack.config.js` reads that file.
4. Read a flag with the global SCSS function `feature()` (defined in the Storefront `abstract/functions/feature.scss`, it returns `map-get($sw-features, $feature-flag)`):

```scss
body {
    @if feature('FEATURE_NEXT_1') {
        background-color: #ff0000;
    } @else {
        background-color: #ffcc00;
    }
}
```

5. Generate or refresh the dump file with `bin/console feature:dump` (alias `administration:dump:features`).

## Essential identifiers

- `feature()` (SCSS function), `$sw-features` (SCSS map)
- `\Shopware\Storefront\Theme\ThemeCompiler::getFeatureConfigScssMap`, `\Shopware\Storefront\Theme\ThemeCompiler::compileTheme`
- `Feature::getAll()`
- `var/config_js_features.json`, `src/Storefront/Resources/app/storefront/webpack.config.js`
- `bin/console feature:dump`

## Gotchas

- If `var/config_js_features.json` is missing, all features are treated as disabled/false in `webpack.config.js` and hot-proxy SCSS; webpack prints a warning asking you to run `bin/console feature:dump`.
- Because the map is compiled in, styles behind an inactive flag are not emitted into the compiled CSS — but only after the theme is recompiled with the new flag state.

## Code check (6.7.15.1)
- confirmed `ThemeCompiler::getFeatureConfigScssMap()` — private, builds the map from Feature::getAll() — vendor/shopware/storefront/Theme/ThemeCompiler.php:658
- confirmed `ThemeCompiler::compileTheme()` — public compile entry point — vendor/shopware/storefront/Theme/ThemeCompiler.php:75
- confirmed `Feature::getAll()` — source of the feature map — vendor/shopware/storefront/Theme/ThemeCompiler.php:660
- confirmed `$sw-features` — map format `$sw-features: (...)` — vendor/shopware/storefront/Theme/ThemeCompiler.php:664
- confirmed `feature()` — SCSS function using map-get on $sw-features — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/functions/feature.scss:15
- confirmed `var/config_js_features.json` — read by the Storefront webpack config — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:36
- confirmed `feature:dump` — webpack warning when the dump is missing — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:41
- confirmed `feature:dump` — console command, alias administration:dump:features — vendor/shopware/core/Framework/Feature/Command/FeatureDumpCommand.php:16
