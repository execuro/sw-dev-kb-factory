---
id: platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md
title: Install and Activate Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/install-activate-plugin.html
sourceHash: 076e6ae078ad67ad7ea665b8bc2537d31108ba45
codeCheckedAgainst: "6.7.15.1"
keywords: ["install plugin", "activate plugin", "plugin:refresh", "plugin:install", "--activate", "bin/console", "SwagBasicExample", "plugin list", "plugin lifecycle", "PluginInstallCommand", "PluginRefreshCommand", "enable plugin"]
summary: Register, install and activate a new plugin from the CLI with bin/console plugin:refresh and plugin:install --activate <PluginName>.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md"]
---
## What it is

The two console commands that make a newly created plugin known to Shopware and then install and activate it, run from the Shopware project root.

## When to use

Right after creating a plugin (e.g. `SwagBasicExample`), or whenever a plugin directory was added and Shopware does not list it yet.

## Key steps / config

1. Refresh the plugin list so Shopware picks up the new plugin:

```bash
bin/console plugin:refresh
```

The output ("Shopware Plugin Service") is a table with the columns `Plugin`, `Label`, `Version`, `Upgrade version`, `Author`, `Installed`, `Active`, `Upgradeable`; the new plugin appears with `Installed`/`Active` = `No`. `--skipPluginList` (`-s`) suppresses the table.

2. Install and activate in one step:

```bash
bin/console plugin:install --activate SwagBasicExample
```

It prints "Shopware Plugin Lifecycle Service" and `Plugin "SwagBasicExample" has been installed and activated successfully.`

Next: the [plugin lifecycle](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md) guide.

## Essential identifiers

- `bin/console plugin:refresh` (`--skipPluginList`/`-s`)
- `bin/console plugin:install` (`--activate`/`-a`, `--reinstall`)

## Gotchas

- A warning about the `version` field in `composer.json` during refresh is expected and does not affect the result.
- If the plugin is already installed but inactive, `plugin:install --activate` only activates it; if already installed, it is otherwise skipped.
- Combining `--refresh` with `--activate` installs but does not activate ("Can not refresh and activate in same request.").

## Code check (6.7.15.1)
- confirmed `plugin:refresh` — command name — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:22
- confirmed `skipPluginList` — option suppressing the list output — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:40
- confirmed `plugin:install` — command name — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `activate` — option `-a`, activates after installation — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:52
- confirmed `activatePlugin` — already-installed inactive plugin is activated — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:82
- confirmed `refresh` — refresh plus activate skips activation — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:100
