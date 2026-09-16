---
id: platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md
title: Install and Activate Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/install-activate-plugin.html
sourceHash: 076e6ae078ad67ad7ea665b8bc2537d31108ba45
codeCheckedAgainst: "6.7.13.0"
keywords: ["bin/console plugin:refresh", "bin/console plugin:install --activate", "plugin:install", "plugin:refresh", "plugin:activate", "--activate", "--reinstall", "--skipPluginList", "install plugin", "activate plugin", "enable extension", "plugin list", "SwagBasicExample"]
summary: "Refresh the plugin list with bin/console plugin:refresh, then install and activate a new plugin in one step with plugin:install --activate <PluginName>."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md"]
---
## What it is

The CLI steps that make a newly created plugin known to Shopware and then install and activate it, run from the Shopware project root directory.

## When to use

Right after creating a plugin (the guide's example is `SwagBasicExample`), before any of its code takes effect in the shop.

## Key steps / config

1. Refresh the plugin list so Shopware discovers the new plugin:

   ```bash
   bin/console plugin:refresh
   ```

   The command prints a table titled `Shopware Plugin Service` with columns `Plugin`, `Label`, `Version`, `Upgrade version`, `Author`, `Installed`, `Active`, `Upgradeable`. A freshly created plugin appears with `Installed: No`, `Active: No` — this confirms it was loaded. Add `--skipPluginList` (`-s`) to suppress the table.

2. Install and activate in one command:

   ```bash
   bin/console plugin:install --activate SwagBasicExample
   ```

   Output is titled `Shopware Plugin Lifecycle Service`, lists `Install 1 plugin(s):` and ends with `Plugin "SwagBasicExample" has been installed and activated successfully.`

   `--activate` has the short form `-a`. If the plugin is already installed but inactive, the command notes this and only activates it. `--reinstall` uninstalls an already-installed plugin first, then installs it again.

3. Separate activation is also available as `bin/console plugin:activate <PluginName>`.

After step 2 the plugin is installed and active. Continue with the [plugin lifecycle](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md) guide.

## Essential identifiers

- `bin/console plugin:refresh`
- `bin/console plugin:install --activate <PluginName>`
- `bin/console plugin:activate`
- Options: `--activate` / `-a`, `--reinstall`, `--skipPluginList` / `-s`
- Plugin name argument = the technical name shown in the `Plugin` column (e.g. `SwagBasicExample`), not the `Label`

## Gotchas

- A warning about the `version` field in the plugin's `composer.json` during `plugin:refresh` is expected and does not affect the result.
- Use the technical plugin name from the `Plugin` column, not the readable label.

## Code check (6.7.13.0)
- confirmed `plugin:refresh` — console command name of PluginRefreshCommand — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:21
- confirmed `skipPluginList` — option to skip printing the plugin table, short `-s` — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:40
- confirmed `Shopware Plugin Service` — output title of plugin:refresh — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:49
- confirmed `plugin:install` — console command name of PluginInstallCommand — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `activate` — option on plugin:install, short `-a`, activates after installation — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:50
- confirmed `reinstall` — option on plugin:install that uninstalls an installed plugin first — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:51
- confirmed `plugin:activate` — standalone activation command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginActivateCommand.php:14
