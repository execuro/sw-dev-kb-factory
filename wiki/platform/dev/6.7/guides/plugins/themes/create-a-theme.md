---
id: platform/dev/6.7/guides/plugins/themes/create-a-theme.md
title: Create a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/create-a-theme.html
sourceHash: 58143045c3fa85226757b80bac497b5af9f81864
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme:create", "theme:change", "theme:compile", "plugin:refresh", "plugin:install", "plugin:list", "ThemeInterface", "theme.json", "create theme", "plugin-based theme", "storefront theme", "sales channel theme", "SwagBasicExampleTheme"]
summary: Scaffold a plugin-based Storefront theme with bin/console theme:create, install and activate it, assign it via theme:change; generated directory layout.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md"]
---
## What it is

How to create, install and activate a plugin-based Shopware 6 Storefront theme from the CLI and assign it to a sales channel. Requires a running Shopware 6 instance with file system and CLI access.

## When to use

- Starting a new custom Storefront theme.
- Troubleshooting a theme that is not visible or not applied.

## Key steps / config

1. Pick a name in UpperCamelCase, ideally with a company prefix, e.g. `SwagBasicExampleTheme`. The command rejects names not starting with an uppercase letter or shorter than 4 characters (letters, digits, underscore only).
2. Scaffold the theme (created under `custom/plugins/<Name>`; `--static` uses `custom/static-plugins`):
   `bin/console theme:create SwagBasicExampleTheme`
3. Register it: `bin/console plugin:refresh`
4. Install and activate: `bin/console plugin:install --activate SwagBasicExampleTheme`
5. Assign to a sales channel: `bin/console theme:change` — interactively select the sales channel (e.g. `Storefront`) and then the theme; this compiles the theme. The command also accepts a theme name argument and `--sales-channel`/`--all`/`--no-compile`/`--sync` options.

Generated structure:

```text
├── composer.json
└── src
    ├── Resources
    │   ├── app/storefront
    │   │   ├── dist/storefront/js/swag-basic-example-theme/swag-basic-example-theme.js
    │   │   └── src
    │   │       ├── assets
    │   │       ├── main.js
    │   │       └── scss/base.scss, scss/overrides.scss
    │   └── theme.json
    └── SwagBasicExampleTheme.php
```

The bootstrap class extends `Shopware\Core\Framework\Plugin` and implements `Shopware\Storefront\Framework\ThemeInterface`. The generated `theme.json` contains `name`, `author`, `views`, `style`, `script` and `asset`.

## Essential identifiers

- `bin/console theme:create`, `theme:change`, `theme:compile`
- `bin/console plugin:refresh`, `plugin:install --activate`, `plugin:list`
- `Shopware\Storefront\Framework\ThemeInterface`
- `src/Resources/theme.json`

## Gotchas

- Theme not visible: `bin/console plugin:refresh` then `bin/console plugin:list`.
- Theme not applied: `bin/console theme:change` then `bin/console theme:compile`.
- Changes not showing / errors: `bin/console cache:clear`; check `var/log/` and file permissions in `custom/plugins/`.

## Code check (6.7.13.0)
- confirmed `theme:create` — console command — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:20
- confirmed `ctype_upper` — theme name must start uppercase, then 4+ word characters — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:56
- confirmed `static` — option switches target to custom/static-plugins — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:40
- confirmed `ThemeInterface` — generated bootstrap implements it — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:154
- confirmed `theme.json` — generated at src/Resources/theme.json — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:101
- confirmed `theme:change` — console command with sales-channel/all/no-compile/sync options — vendor/shopware/storefront/Theme/Command/ThemeChangeCommand.php:26
- confirmed `theme:compile` — console command — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `plugin:refresh` — console command — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:21
- confirmed `activate` — plugin:install option to activate after install — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:50
- unverified `cache:clear` — Symfony framework command, out of scope
