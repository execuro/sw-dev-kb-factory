---
id: platform/dev/6.7/guides/hosting/installation-updates/extension-management.md
title: Extension Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/extension-management.html
sourceHash: 28af1df1306b4f5621621e33fc415a795c5ea2c7
codeCheckedAgainst: "6.7.13.0"
keywords: ["extension management", "composer", "packages.shopware.com", "store.shopware.com", "auth.json", "plugin:install", "plugin:refresh", "classmap-authoritative", "shopware.deployment.runtime_extension_management", "z-shopware.yaml", "extension manager read-only", "custom/plugins", "store plugins"]
summary: "Install store extensions via Composer (packages.shopware.com), migrate from custom/plugins, and make the Admin extension manager read-only."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/extensions.md"]
---
## What it is

How to manage Shopware extensions (plugins and apps) with Composer instead of uploading them through the Administration into `custom/plugins` / `custom/apps`, and how to make the Administration extension manager read-only.

## When to use

When you want versioned, reproducible extension state: Admin-managed extensions are hard to track, can be modified live without version control, need manual per-extension updates, cannot be updated together with Shopware, and prevent an optimized Composer class loader (dynamic lookup into `custom/plugins`).

## Key steps / config

1. In account.shopware.com open your shop, click an extension, "Install via Composer", generate and save a token.
2. Register the Shopware Composer Registry:

```bash
composer config repositories.shopware-packages '{"type": "composer", "url": "https://packages.shopware.com"}'
composer config bearer.packages.shopware.com <your-token>
```

   This creates `auth.json` in the project root (do not commit it).
3. Require and install the extension (package name is shown under "Install via Composer"):

```bash
composer require store.shopware.com/{extension-name}
bin/console plugin:install --activate <extension-name>
```

4. Migrating an already installed extension: `composer require` it, delete `custom/plugins/{extension-name}` or `custom/apps/{extension-name}`, then run `bin/console plugin:refresh`.
5. Once all extensions come from Composer, set `"classmap-authoritative": true` (next to `"optimize-autoloader": true`) under `config` in `composer.json` and run `composer dump-autoload`.
6. Read-only extension manager, in `config/packages/z-shopware.yaml`, then clear the cache once:

```yaml
shopware:
    deployment:
        runtime_extension_management: false
```

   The Administration extension manager then only allows extension configuration, and the First Run Wizard no longer downloads extensions (e.g. PayPal, Shopware Store). In core the key defaults to `true`, is exposed to the Administration as `disableExtensionManagement`, and also gates the scheduled `UpdateAppsTask`.
7. For deployments, the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) installs, updates, (de)activates and removes Composer-installed extensions according to `.shopware-project.yml` ([options](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/extensions.md)).

## Essential identifiers

- `https://packages.shopware.com`, `store.shopware.com/{extension-name}`, `auth.json`
- `bin/console plugin:install --activate`, `bin/console plugin:refresh`
- `classmap-authoritative`, `composer dump-autoload`
- `shopware.deployment.runtime_extension_management` in `config/packages/z-shopware.yaml`

## Gotchas

- Removing a Composer package or uninstalling a plugin does not cancel a paid subscription; cancel in the Shopware Account.
- `classmap-authoritative` disables live class lookup, so it only works when nothing is loaded from `custom/plugins` dynamically.

## Version notes

- `runtime_extension_management` is available since Shopware 6.6.4.0.

## Code check (6.7.13.0)
- confirmed `runtime_extension_management` — boolean under `shopware.deployment`, default `true` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:331
- confirmed `shopware.deployment.runtime_extension_management` — exposed to Admin as `disableExtensionManagement` — vendor/shopware/core/Framework/Api/Controller/InfoController.php:211
- confirmed `shopware.deployment.runtime_extension_management` — gates `UpdateAppsTask` — vendor/shopware/core/Framework/App/ScheduledTask/UpdateAppsTask.php:29
- confirmed `plugin:install` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `activate` — `plugin:install` option "Activate plugins after installation." — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:50
- confirmed `plugin:refresh` — core console command — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:21
- unverified `classmap-authoritative` — Composer setting, outside checked roots
- unverified `store.shopware.com/{extension-name}` — Composer registry package naming, not in installed code
- unverified `6.6.4.0` — introduction version of the config key not determinable from 6.7 code
