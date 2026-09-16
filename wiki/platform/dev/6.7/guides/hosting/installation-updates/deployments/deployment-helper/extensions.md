---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/extensions.md
title: Extensions and Apps
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/extensions.html
sourceHash: 292a2a6d07dc1950242b6aa8f04fd1ed60ca985e
codeCheckedAgainst: "6.7.13.0"
keywords: ["deployment helper", "extension-management", ".shopware-project.yml", "overrides", "exclude", "state: inactive", "state: remove", "keepUserData", "plugin:install", "app:install", "plugin:list", "runtime_extension_management", "extension state", "remove plugin", "store-installed plugins"]
summary: "Deployment Helper extension management: plugin vs app handling, override states (inactive/ignore/remove), install batching, Store conflicts, removal."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/extension-management.md", "platform/dev/6.7/guides/plugins/apps/_index.md", "platform/dev/6.7/guides/plugins/plugins/_index.md"]
---
## What it is

How the Shopware Deployment Helper manages extensions found in `custom/plugins`, `custom/apps` and via Composer during a deployment: install, update, activate or deactivate them according to the `deployment.extension-management` section of `.shopware-project.yml`.

## When to use

When deploying with the Deployment Helper and you need to keep a plugin/app inactive, exclude it from automatic handling, uninstall it, or avoid conflicts with extensions installed through the Shopware Store/Administration.

## Key steps / config

**Plugins vs apps**

- Plugin: in `custom/plugins/` or Composer; defined by a directory with `plugin.xml` or a PHP class; no license domain needed; lifecycle via `plugin:install`.
- App: in `custom/apps/` or Composer type `shopware-app`; defined by `manifest.xml`; installed via `app:install` and requires registration, so **a license domain must be set** when installing apps.

**Extension state** (`extension-management` is enabled by default), set per extension under `overrides`:

- not set (default): install if missing, update if outdated, activate if inactive.
- `inactive`: install/update, but keep inactive.
- `ignore`: skip entirely (manage manually via console).
- `remove`: uninstall if installed; never install.

`exclude` is shorthand; internally it becomes `overrides` with `state: ignore`:

```yaml
deployment:
  extension-management:
    enabled: true
    exclude:
      - MyPlugin
    overrides:
      TheExtensionWeWantToGetRidOf:
        state: remove
        keepUserData: true
```

**Install batching**: plugins without dependencies on other plugins are installed in one `plugin:install [Plugin1 Plugin2 ...]` call (core's `plugin:install` accepts a list of plugin names); plugins with dependencies are installed individually to preserve topological order. Fresh plugins are grouped by whether they should be activated.

**Store-installed plugins** — two options:

1. Manage everything through Composer and disable runtime extension management in the Administration:
   ```yaml
   # config/packages/z-shopware.yaml
   shopware:
       deployment:
           runtime_extension_management: false
   ```
2. Or disable Deployment Helper management with `deployment.extension-management.enabled: false` and manage states yourself (`bin/console plugin:install`, `plugin:update`, ...).

**Removing an extension**: find its name with `./bin/console plugin:list`, set `state: remove` in `.shopware-project.yml` and deploy (it gets uninstalled); then delete the code and the override entry and deploy again.

## Essential identifiers

- `.shopware-project.yml` → `deployment.extension-management` (`enabled`, `exclude`, `overrides.<Name>.state`, `keepUserData`)
- States: `inactive`, `ignore`, `remove`
- `plugin:install`, `plugin:update`, `plugin:list`, `app:install`
- `shopware.deployment.runtime_extension_management` (core, default `true`)

## Gotchas

- With `extension-management` enabled, plugins installed later via the Store are unknown to the Deployment Helper and may be deactivated or behave unexpectedly on the next deployment.
- Removal is a two-deploy process; removing the code before the `remove` deploy skips the uninstall.
- Apps fail to install without a license domain.

## Version notes

- The Deployment Helper supports Shopware 6.4+ and detects features at runtime: `theme:compile --only` (6.5.6+) for parallel compilation, falling back to serial; `--sync` (6.6.1+) to force synchronous compilation when async is enabled; it also reads installed extensions directly from the database.

## Code check (6.7.13.0)
- confirmed `plugin:install` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `plugins` — lifecycle commands take a required array argument, enabling batch installs — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/AbstractPluginLifecycleCommand.php:51
- confirmed `plugin:update` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginUpdateCommand.php:13
- confirmed `plugin:list` — core console command — vendor/shopware/core/Framework/Plugin/Command/PluginListCommand.php:28
- confirmed `app:install` — core console command — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:28
- confirmed `runtime_extension_management` — boolean node under `shopware.deployment`, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:331
- confirmed `shopware.deployment.runtime_extension_management` — false sets `disableExtensionManagement` for the Administration — vendor/shopware/core/Framework/Api/Controller/InfoController.php:211
- confirmed `only` — `theme:compile` option for given sales channel ids — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:43
- confirmed `sync` — `theme:compile` synchronous compile option — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:47
- unverified `extension-management` — `.shopware-project.yml` schema lives in the shopware/deployment-helper package, outside code-check roots
