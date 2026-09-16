---
id: "platform/dev/6.6/guides/plugins/themes/create-a-theme.md"
title: "Create a first theme"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/themes/create-a-theme.html"
sourceHash: "0be91731d67ae39c15763e2b08ee189a2cae422e"
keywords: ["theme:create", "plugin:refresh", "plugin:install", "theme:change", "SwagBasicExampleTheme", "create theme", "sales channel theme", "theme plugin structure", "install theme", "activate theme", "plugin-based theme"]
summary: "Steps through creating, installing, activating and assigning a plugin-based theme to a sales channel via bin/console commands."
lastBuilt: "2026-09-15"
---
## What it is
Walks through creating a first Shopware theme from scratch as a plugin-based theme, then installing, activating and assigning it to a sales channel.

## When to use
Use this as the starting point before any other theme guide — customizing assets, SCSS/JS or configuration all assume a theme plugin already exists and is active.

## Key steps / config
1. Choose a technical theme name in UpperCamelCase, prefixed with a company shorthand (Shopware itself uses `Swag`), and beginning with a capital letter — the guide's running example is `SwagBasicExampleTheme`.
2. Create the theme plugin scaffold:

```bash
bin/console theme:create SwagBasicExampleTheme
```

3. Refresh the plugin list so Shopware recognizes the new theme:

```bash
bin/console plugin:refresh
```

4. Install and activate the theme:

```bash
bin/console plugin:install --activate SwagBasicExampleTheme
```

5. Assign the theme to a sales channel via an interactive prompt:

```bash
bin/console theme:change
```

The command asks for a sales channel first, then the theme to assign to it.

The resulting plugin-based theme has this directory structure:

```
src/
├── Resources
│   ├── app/storefront/dist/storefront/js/<theme-name>/<theme-name>.js
│   ├── app/storefront/src/{assets,main.js,scss/{base.scss,overrides.scss}}
│   └── theme.json
└── <ThemeName>.php
```

## Essential identifiers
- `bin/console theme:create <Name>` — scaffolds a new theme plugin
- `bin/console plugin:refresh` — makes Shopware aware of the new plugin
- `bin/console plugin:install --activate <Name>` — installs and activates the theme plugin
- `bin/console theme:change` — assigns a theme to a sales channel interactively
- `theme.json` — the theme's configuration file

## Gotchas
The theme's technical name must start with a capital letter, as stated explicitly in the source.
