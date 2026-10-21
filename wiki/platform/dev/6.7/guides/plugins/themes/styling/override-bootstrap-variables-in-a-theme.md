---
id: platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md
title: Override Bootstrap variables in a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.html
sourceHash: 216ade9892c138432159597907990fd8c265f09e
codeCheckedAgainst: "6.7.15.1"
keywords: ["overrides.scss", "theme.json", "style", "!default", "$border-radius", "$icon-base-color", "$modal-backdrop-bg", "bootstrap variables", "scss variables", "override variables", "theme:compile", "storefront skin"]
summary: Override Bootstrap and Storefront SCSS !default variables in a theme via an overrides.scss entry listed before @Storefront in theme.json style.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/architecture/storefront-concept.md", "platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md"]
---
## What it is

The Storefront theme is a skin on top of Bootstrap. Bootstrap and the Storefront declare their SCSS variables with the `!default` flag, so a theme overrides them by declaring its own values *before* those defaults are loaded — through an `overrides.scss` entry placed ahead of `@Storefront`. Background: [Storefront concept](platform/dev/6.7/concepts/framework/architecture/storefront-concept.md).

## When to use

Changing global look parameters such as `$border-radius`, colours or font weights of an existing theme (prerequisite: an installed, activated theme assigned to a sales channel, see [Create a first theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md)).

## Key steps / config

1. In `<plugin root>/src/Resources/theme.json`, list the overrides file first in `style`, before `@Storefront`:

```json
{
  "style": [
    "app/storefront/src/scss/overrides.scss",
    "@Storefront",
    "app/storefront/src/scss/base.scss"
  ]
}
```

2. Put only variable assignments in `<plugin root>/src/Resources/app/storefront/src/scss/overrides.scss`:

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

- `overrides.scss` — variable-override entry point
- `theme.json` `style` section, `@Storefront`
- `!default` — flag on the overridable defaults
- `$border-radius`, `$icon-base-color`, `$modal-backdrop-bg`, `$disabled-btn-bg`, `$disabled-btn-border-color`, `$font-weight-semibold`

## Gotchas

- Only variable overrides belong in `overrides.scss` — no selectors/CSS like `.container { background: #f00 }`. With `composer run watch:storefront` (platform-only) or `shopware-cli project storefront-watch` (production template), SCSS variables are injected dynamically by webpack, so selectors in this file can appear multiple times in the built CSS.
- The Shopware skin already sets `$border-radius: 0 !default`, so the source's `$border-radius: 0` example changes nothing visible with the default skin; use a different value to test.
- `$disabled-btn-bg`, `$disabled-btn-border-color` and `$font-weight-semibold` are defined in the Shopware skin, `$icon-base-color` and `$modal-backdrop-bg` in the Storefront base variables.

## Version notes

- The source refers to Bootstrap 4 theming docs; the installed Storefront ships Bootstrap 5.3.8. The `!default` override mechanism is the same.

## Code check (6.7.15.1)
- corrected `bootstrap` — docs: Bootstrap 4; installed Storefront depends on Bootstrap 5.3.8 — vendor/shopware/storefront/Resources/app/storefront/package.json:41
- corrected `$border-radius` — docs: example resets it to 0; skin default is already `0 !default` — vendor/shopware/storefront/Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_bootstrap.scss:56
- confirmed `$icon-base-color` — `!default` Storefront variable — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/variables/_custom.scss:18
- confirmed `$modal-backdrop-bg` — `!default` Storefront Bootstrap variable — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/variables/_bootstrap.scss:12
- confirmed `$disabled-btn-bg` — `!default` skin variable — vendor/shopware/storefront/Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_custom.scss:12
- confirmed `$disabled-btn-border-color` — `!default` skin variable — vendor/shopware/storefront/Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_custom.scss:13
- confirmed `$font-weight-semibold` — `!default` skin variable — vendor/shopware/storefront/Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_custom.scss:21
- confirmed `style` — theme.json `style` entries are compiled in listed order — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:81
- confirmed `theme:compile` — console command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- unverified `shopware-cli project storefront-watch` — shopware-cli is a separate tool, out of scope
