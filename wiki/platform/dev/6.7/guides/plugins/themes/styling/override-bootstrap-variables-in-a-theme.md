---
id: platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md
title: Override Bootstrap variables in a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.html
sourceHash: 216ade9892c138432159597907990fd8c265f09e
codeCheckedAgainst: "6.7.13.0"
keywords: ["overrides.scss", "theme.json", "@Storefront", "theme:compile", "$border-radius", "!default", "bootstrap variables", "scss variables", "variable overrides", "storefront theme styling", "shopware-cli project storefront-watch", "composer run watch:storefront"]
summary: "Override Bootstrap/Storefront SCSS !default variables by listing overrides.scss before @Storefront in a theme's theme.json style array, then theme:compile."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/architecture/storefront-concept.md", "platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md"]
---
## What it is

The Storefront theme is a skin on top of Bootstrap. Bootstrap and the Storefront declare their SCSS variables with the `!default` flag, so a theme can change them (e.g. `$border-radius`) only by declaring the new value before those defaults are loaded. This is done through a dedicated SCSS entry point, `overrides.scss`. Background on why Bootstrap is used: [Storefront concept](platform/dev/6.7/concepts/framework/architecture/storefront-concept.md).

## When to use

You have an installed, activated theme assigned to a sales channel (see [Create a theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md)) and want to change default SCSS variables globally, such as border radius, colors, font weights or modal backdrop, without writing CSS rules.

## Key steps / config

1. In `<plugin root>/src/Resources/theme.json`, list `app/storefront/src/scss/overrides.scss` in `style` **before** `@Storefront`. `bin/console theme:create` generates exactly this layout:

```json
{
  "name": "SwagBasicExampleTheme",
  "views": ["@Storefront", "@Plugins"],
  "style": [
    "app/storefront/src/scss/overrides.scss",
    "@Storefront",
    "app/storefront/src/scss/base.scss"
  ],
  "script": ["@Storefront", "..."],
  "asset": ["@Storefront", "app/storefront/src/assets"]
}
```

2. In `<plugin root>/src/Resources/app/storefront/src/scss/overrides.scss`, declare only variable assignments:

```scss
$border-radius: 0;
$icon-base-color: #f00;
$modal-backdrop-bg: rgba(255, 0, 0, 0.5);
$disabled-btn-bg: #f00;
$disabled-btn-border-color: #fc8;
$font-weight-semibold: 300;
```

3. Run `bin/console theme:compile` and check the Storefront.

## Essential identifiers

- `overrides.scss` (entry point listed before `@Storefront`)
- `theme.json` keys `style`, `script`, `asset`, `views`
- `@Storefront`, `@Plugins`
- `bin/console theme:compile`, `bin/console theme:create`
- Storefront `!default` variables: `$border-radius`, `$icon-base-color`, `$modal-backdrop-bg`, `$disabled-btn-bg`, `$disabled-btn-border-color`, `$font-weight-semibold`

## Gotchas

- Put only variable overrides in `overrides.scss`; no selectors like `.container { background: #f00 }`. With `composer run watch:storefront` (platform-only setups) or `shopware-cli project storefront-watch` (production template), webpack injects SCSS variables dynamically, and selectors/properties in this file can appear multiple times in the built CSS.
- In the installed Shopware skin, `$border-radius` already defaults to `0`, so the docs' `$border-radius: 0` example produces no visible change against the default theme; pick a different value to test.
- The source links to Bootstrap 4 theming docs; the variables themselves are defined in the Storefront SCSS under `abstract/variables/` and `skin/shopware/abstract/variables/`.

## Code check (6.7.13.0)
- confirmed `theme:compile` — console command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `theme:create` — generator for a new theme plugin — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:20
- confirmed `app/storefront/src/scss/overrides.scss` — generated theme.json lists it before `@Storefront` — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:196
- confirmed `@Storefront` — inheritance slot resolved from theme.json — vendor/shopware/storefront/Theme/Twig/ThemeInheritanceBuilder.php:96
- corrected `$border-radius` — docs: resetting to `0` removes the radius; installed Shopware skin default is already `0 !default` — vendor/shopware/storefront/Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_bootstrap.scss:56
- confirmed `$icon-base-color` — `!default` Storefront variable — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/variables/_custom.scss:18
- confirmed `$modal-backdrop-bg` — `!default` variable — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/variables/_bootstrap.scss:12
- confirmed `$disabled-btn-bg` — `!default` variable — vendor/shopware/storefront/Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_custom.scss:12
- confirmed `$font-weight-semibold` — `!default` variable (600) — vendor/shopware/storefront/Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_custom.scss:21
- unverified `shopware-cli project storefront-watch` — external CLI, out of scope
