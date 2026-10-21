---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/extensions.md
title: Extensions and Apps
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/extensions.html
sourceHash: 1513d249dda6425470df66583af55c122130b2c2
codeCheckedAgainst: "6.7.15.1"
keywords: ["extension-management", "overrides", "state: inactive", "state: remove", "keepUserData", "exclude", "runtime_extension_management", "plugin:install", "app:install", "plugin:list", "extension state", "store-installed plugins", "remove plugin on deploy", "apps vs plugins"]
summary: How Deployment Helper manages plugins and apps - override states, install batching, Store-install conflicts, two-step removal.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/_index.md", "platform/dev/6.7/guides/plugins/plugins/_index.md", "platform/dev/6.7/guides/hosting/installation-updates/extension-management.md"]
---
## What it is

How the Deployment Helper manages extensions found in `custom/plugins`, `custom/apps` and Composer. It covers how [apps](platform/dev/6.7/guides/plugins/apps/_index.md) and [plugins](platform/dev/6.7/guides/plugins/plugins/_index.md) differ, the per-extension `state` overrides, plugin install batching, conflicts with Store-installed extensions, and how to remove an extension in two deployments.

## When to use

- Control which extensions are installed, kept inactive, ignored or uninstalled during deployment.
- Decide between code-managed and Store-managed extensions.
- Remove a plugin or app from a deployed shop.

## Key steps / config

**Apps vs. plugins:**

- Plugins live in `custom/plugins/` or come from Composer. They are defined by `composer.json` plus a PHP class, are installed via `plugin:install`, and need no license.
- Apps live in `custom/apps/` or come from Composer with type `shopware-app`. They are a directory or package with a `manifest.xml` and are installed via `app:install`, which needs a handshake with the Shopware registration server.
- Apps require a license domain; plugins work without one.

**Extension states** (under `extension-management.overrides.<Name>.state`; extension management is enabled by default):

| State | Behavior |
|---|---|
| (not set) | install if missing, update if outdated, activate if inactive |
| `inactive` | install or update, but keep inactive |
| `ignore` | do not manage at all |
| `remove` | uninstall if installed, never install |

`exclude: [MyPlugin]` is shorthand; internally it becomes `overrides.MyPlugin.state: ignore`.

```yaml
deployment:
  extension-management:
    enabled: true
    exclude: [MyPlugin]
    overrides:
      D: { state: inactive }
      TheExtensionWeWantToGetRidOf: { state: remove, keepUserData: true }
```

**Install batching:** fresh plugins are grouped by whether they should be activated, and each group is installed with one `plugin:install` call. The output shows `plugin:install [Plugin1 Plugin2 ...]`. Plugins with dependencies on other plugins are installed one by one, which keeps the topological order. The source also lists "plugins that need activation" as installed individually, yet its example batch-installs and activates `A`, `B`, `C` together and installs the inactive `D` separately.

**Store-installed extensions conflict** with extension management, which does not know about runtime installs and may deactivate them. There are two options:

1. Recommended: install everything via Composer (see [extension management](platform/dev/6.7/guides/hosting/installation-updates/extension-management.md)) and disable runtime installs:

```yaml
# config/packages/z-shopware.yaml
shopware:
    deployment:
        runtime_extension_management: false
```

2. Set `deployment.extension-management.enabled: false` in `.config/shopware-project.yml` and manage extensions yourself with `bin/console plugin:install`, `plugin:update`, etc.

**Removing an extension:**

1. Find its name with `./bin/console plugin:list` (e.g. `SwagPlatformDemoData`).
2. Set `state: remove` (optionally `keepUserData: true`) and deploy. The extension is uninstalled.
3. Remove the code and the override entry, then deploy again.

## Essential identifiers

- `deployment.extension-management.{enabled,exclude,force-update,overrides}`
- `state: inactive|ignore|remove`, `keepUserData`
- `shopware.deployment.runtime_extension_management`
- `plugin:install`, `plugin:update`, `app:install`, `plugin:list`
- Composer type `shopware-app`, `manifest.xml`

## Gotchas

- Removing an extension takes two deployments: first with `state: remove`, then with the code and override entry deleted.
- Installing extensions through the Store or Administration while `extension-management` is enabled can lead to them being deactivated or behaving unexpectedly after the next deployment.

## Version notes

The helper works across Shopware 6.4+ and detects features at runtime:

- `theme:compile --only` (6.5.6+) is used for parallel compilation, with a serial fallback on older versions.
- `--sync` (6.6.1+) forces synchronous compilation when async compilation is enabled.
- The helper checks which commands and flags exist before running them, and it reads installed extensions and config directly from the database.

## Code check (6.7.15.1)
- confirmed `plugin:install` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `activate` — `plugin:install` option exists — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:52
- confirmed `InputArgument::IS_ARRAY` — plugin lifecycle commands accept several plugins per call — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/AbstractPluginLifecycleCommand.php:52
- confirmed `plugin:update` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginUpdateCommand.php:14
- confirmed `app:install` — core console command — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:29
- confirmed `plugin:list` — core console command — vendor/shopware/core/Framework/Plugin/Command/PluginListCommand.php:29
- confirmed `AppLoader::COMPOSER_TYPE` — value `shopware-app` — vendor/shopware/core/Framework/App/Lifecycle/AppLoader.php:20
- confirmed `runtime_extension_management` — under `shopware.deployment`, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:352
- confirmed `only` — `theme:compile` option exists — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:44
- confirmed `sync` — `theme:compile` option exists — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:48
