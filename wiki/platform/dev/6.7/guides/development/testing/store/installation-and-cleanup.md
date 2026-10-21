---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md
relatedPages:
  - platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md
sourceHash: 356e02526638cfffbfb656f63bf5b67a64142afc
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/installation-and-cleanup.html
title: Uninstallation and data cleanup
version: "6.7"
versions:
  - "6.7"
keywords: ["uninstall", "keepUserData", "UninstallContext", "Plugin::uninstall()", "extension manager", "data cleanup", "keep extension data", "completely delete", "store review", "custom fields", "cms elements", "reinstall"]
summary: Shopware Store rules for extension install/uninstall - keep vs. completely delete data, deactivating payment methods, CMS and custom-field cleanup.
lastBuilt: 2026-10-21
---
## What it is

Store review requirement for Shopware 6.7 extensions: install, uninstall, reinstall and delete must run without errors, and a "completely delete" uninstall must leave the shop as if the extension had never been installed, apart from business-critical entities.

## When to use

When implementing the plugin lifecycle methods (`install()`, `uninstall()`) or testing an extension before Store submission.

## Key steps / config

The Extension Manager (including its debug console) drives installation, uninstallation, reinstallation and deletion.

- Install, uninstall and reinstall must complete without exceptions.
- No 400/500 errors during install or uninstall unless clearly tied to an API.
- Do not modify or overwrite the Extension Manager.
- Validate special PHP requirements during installation; on failure show a growl message in the Administration.

Uninstall options the merchant must be able to choose:

- **Keep extension data** (snippets, media, tables) — data may remain.
- **Completely delete extension data** — remove the extension's custom tables and data.

In a plugin, the choice arrives as `UninstallContext::keepUserData()` inside `Plugin::uninstall(UninstallContext $uninstallContext)`:

```php
public function uninstall(UninstallContext $uninstallContext): void
{
    if ($uninstallContext->keepUserData()) {
        return;
    }
    // drop own tables, remove own CMS elements, deactivate payment/shipping methods
}
```

Rules for "completely delete":

- Business-critical configuration is an exception: **deactivate** payment or shipping methods instead of deleting them.
- Data in Shopware core tables, data shared with other extensions (e.g. sales channels), or tables Shopware cleans up automatically may not need manual removal.
- Remove all CMS elements the extension added.
- For custom fields, remove the association; values may remain in core storage.

After uninstall, [Shopping Experiences](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md) must keep working in the Storefront. The free "Adminer for Admin" Store extension can help inspect the database in a test environment.

## Essential identifiers

- `Plugin::install()`, `Plugin::uninstall()`
- `UninstallContext::keepUserData()`

## Gotchas

- When `keepUserData()` is false, the core lifecycle already drops the plugin's migration records before calling `uninstall()`, then deletes the plugin's system config, its custom entities and its registered custom fields afterwards — your own `uninstall()` still has to drop the tables it created.

## Code check (6.7.15.1)
- confirmed `Plugin::uninstall()` — base method takes `UninstallContext` — vendor/shopware/core/Framework/Plugin.php:63
- confirmed `Plugin::install()` — base method takes `InstallContext` — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `UninstallContext::keepUserData()` — returns bool for the merchant's keep-data choice — vendor/shopware/core/Framework/Plugin/Context/UninstallContext.php:27
- confirmed `Plugin::removeMigrations()` — called before `uninstall()` when user data is not kept — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:229
- confirmed `deletePluginConfiguration` — plugin system config removed after `uninstall()` when data is not kept — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:235
- confirmed `removePluginCustomFields` — custom entities and plugin custom fields removed by core when data is not kept — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:252
- unverified `Adminer for Admin` — third-party Store extension, outside the code roots
