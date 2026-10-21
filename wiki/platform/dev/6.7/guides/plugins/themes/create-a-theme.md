---
id: platform/dev/6.7/guides/plugins/themes/create-a-theme.md
title: Create a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/create-a-theme.html
sourceHash: 58143045c3fa85226757b80bac497b5af9f81864
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme:create", "plugin:refresh", "plugin:install --activate", "theme:change", "theme:compile", "plugin:list", "ThemeInterface", "theme.json", "SwagBasicExampleTheme", "create theme", "storefront theme", "theme plugin scaffold", "assign theme to sales channel"]
summary: Scaffold a plugin-based theme with bin/console theme:create, install and activate it, assign it to a sales channel with theme:change.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md
  - platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md
  - platform/dev/6.7/guides/plugins/themes/assets/add-assets-to-theme.md
---
## What it is

How to create, install and activate a plugin-based Storefront theme in Shopware 6 using the CLI, and the directory layout the scaffold produces.

## When to use

When starting a new custom theme. Requires a running Shopware 6 instance with file system and CLI access.

## Key steps / config

1. Pick an UpperCamelCase name with a company prefix, e.g. `SwagBasicExampleTheme`. The command rejects names that do not start with an uppercase letter or are shorter than 4 characters.
2. Scaffold the theme (created under `custom/plugins/<Name>`):
   ```bash
   bin/console theme:create SwagBasicExampleTheme
   ```
   Optional flags in 6.7.15.1: `--static` (create in `custom/static-plugins`), `--with-config`, `--with-snippets`, `--with-scss`, or `--full` for all three.
3. Register it with Shopware: `bin/console plugin:refresh`
4. Install and activate: `bin/console plugin:install --activate SwagBasicExampleTheme`
5. Assign it to a sales channel: `bin/console theme:change` — interactive: choose the sales channel (e.g. `Storefront`), then the theme. The theme is compiled for that sales channel. Non-interactive options exist: a `theme-name` argument, `--sales-channel`/`-s`, `--all`, `--sync`.

Generated structure:

```
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

The plugin class extends `Shopware\Core\Framework\Plugin` and implements `Shopware\Storefront\Framework\ThemeInterface`. The scaffolded `theme.json` contains `name`, `author`, `views`, `style`, `script` and `asset`; see [Theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md).

## Essential identifiers

- `bin/console theme:create`
- `bin/console plugin:refresh`, `bin/console plugin:list`
- `bin/console plugin:install --activate`
- `bin/console theme:change`, `bin/console theme:compile`
- `Shopware\Storefront\Framework\ThemeInterface`
- `src/Resources/theme.json`

## Gotchas

- Theme not visible: run `bin/console plugin:refresh` and `bin/console plugin:list`.
- Theme not applied: run `bin/console theme:change` and `bin/console theme:compile`.
- Errors or no visible changes: `bin/console cache:clear`; check `var/log/` and file permissions in `custom/plugins/`.

## Code check (6.7.15.1)
- confirmed `theme:create` — scaffolding command, creates under `custom/plugins` — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:21
- confirmed `ThemeCreateCommand::configure()` — adds `theme-name` argument plus `--static`, `--full`, `--with-config`, `--with-snippets`, `--with-scss` (not in docs) — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:36
- confirmed `ThemeInterface` — implemented by the generated plugin class — vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:201
- confirmed `plugin:refresh` — command name — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:22
- confirmed `plugin:install` — command name — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `activate` — `--activate`/`-a` option of plugin:install — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:52
- confirmed `plugin:list` — command name — vendor/shopware/core/Framework/Plugin/Command/PluginListCommand.php:29
- confirmed `theme:change` — command name — vendor/shopware/storefront/Theme/Command/ThemeChangeCommand.php:28
- confirmed `theme:compile` — command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- unverified `cache:clear` — Symfony framework command, out of scope
