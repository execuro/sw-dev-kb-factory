---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/hosting/installation-updates/extension-management.md
relatedPages:
  - platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md
  - platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/extensions.md
sourceHash: 4b6e0517c32f09049a7083e2850355bb6d48e851
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/extension-management.html
title: Extension Management
version: "6.7"
versions:
  - "6.7"
keywords: ["extension management", "composer", "packages.shopware.com", "store.shopware.com", "plugin:install", "plugin:refresh", "runtime_extension_management", "classmap-authoritative", "auth.json", "composer registry", "read-only extension manager", "custom/plugins"]
summary: "Install Shopware extensions via Composer registry, migrate from custom/plugins, classmap-authoritative, read-only Admin extension manager."
lastBuilt: 2026-10-21
---
## What it is

How to manage plugins and apps with Composer instead of uploading them via the Administration into `custom/plugins` / `custom/apps`, and how to lock the Administration Extension Manager. Admin-managed extensions are hard to track, can be changed live without version control, need manual per-extension updates, cannot be updated together with Shopware, and prevent an optimized Composer class loader.

## When to use

Setting up reproducible deployments, clusters, or any project where the extension set should live in `composer.json`/`composer.lock`.

## Key steps / config

1. Get a token: in the Shopware Account, open your shop, click an extension, "Install via Composer", generate and save a token.
2. Register the Shopware Composer Registry (creates `auth.json` in the project root):

```bash
composer config repositories.shopware-packages '{"type": "composer", "url": "https://packages.shopware.com"}'
composer config bearer.packages.shopware.com <your-token>
```

3. Install and activate:

```bash
composer require store.shopware.com/{extension-name}
bin/console plugin:install --activate <extension-name>
```

4. Migrating an already installed extension: `composer require store.shopware.com/{extension-name}`, delete `custom/plugins/{extension-name}` or `custom/apps/{extension-name}`, then `bin/console plugin:refresh`.
5. Once everything comes from Composer, set `"classmap-authoritative": true` next to `"optimize-autoloader": true` under `config` in `composer.json` and run `composer dump-autoload`.
6. Make the Administration Extension Manager read-only in `config/packages/z-shopware.yaml`, then clear the cache:

```yaml
shopware:
    deployment:
        runtime_extension_management: false
```

7. The [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) then installs, updates, (de)activates and removes extensions per `.config/shopware-project.yml` during deploys — see [Extensions and Apps](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/extensions.md).

## Essential identifiers

- `shopware.deployment.runtime_extension_management` (default `true`)
- `bin/console plugin:install --activate`, `bin/console plugin:refresh`
- `store.shopware.com/{extension-name}`, `https://packages.shopware.com`, `auth.json`
- `classmap-authoritative`, `composer dump-autoload`

## Gotchas

- Do not commit `auth.json`; it holds your token and should be in `.gitignore`.
- Removing a Composer package or uninstalling a plugin does not cancel a paid subscription — cancel in the Shopware Account.
- With `runtime_extension_management: false` only extension configuration stays accessible in the Administration, and the First Run Wizard no longer downloads extensions (e.g. PayPal, Shopware Store).

## Version notes

- Disabling runtime extension management is available since Shopware 6.6.4.0.

## Code check (6.7.15.1)
- confirmed `runtime_extension_management` — boolean under `shopware.deployment`, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:352
- confirmed `shopware.deployment.runtime_extension_management` — exposed to Admin as `disableExtensionManagement` — vendor/shopware/core/Framework/Api/Controller/InfoController.php:217
- confirmed `shopware.deployment.runtime_extension_management` — also gates the app update scheduled task — vendor/shopware/core/Framework/App/ScheduledTask/UpdateAppsTask.php:29
- confirmed `plugin:install` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `activate` — `plugin:install` option, shortcut `-a` — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:52
- confirmed `plugin:refresh` — core console command — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:22
- unverified `classmap-authoritative` — Composer setting, out of scope
