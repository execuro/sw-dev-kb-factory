---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md
title: Plugin lifecycle methods
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.html
sourceHash: 0598bb51e3aa55e93302ca6de4136b6d0a890349
keywords: ["plugin lifecycle", "install", "uninstall", "activate", "deactivate", "update", "postInstall", "postUpdate", "InstallContext", "UninstallContext", "ActivateContext", "DeactivateContext", "UpdateContext", "keepUserData"]
summary: "Describes Shopware plugin lifecycle methods install, uninstall, activate, deactivate, update, postInstall, postUpdate and their context classes."
lastBuilt: "2026-09-15"
---
## What it is

Documents the lifecycle methods a Shopware plugin bootstrap class can implement: `install`, `uninstall`, `activate`, `deactivate`, `update`, `postInstall`, `postUpdate`.

## When to use

When implementing setup, teardown, or migration logic for a plugin's data/entities as it moves through install, activation, update, and uninstall.

## Key steps / config

- `install(InstallContext $installContext): void` — runs on plugin install. `InstallContext` exposes current plugin version, current Shopware version, `Context`, plugin migrations collection, and `isAutoMigrate`/`setAutoMigrate`. Avoid creating data that must be active immediately here since the plugin isn't active yet; only install data that can itself be activated/deactivated (e.g. a payment method, kept inactive).
- `uninstall(UninstallContext $uninstallContext): void` — runs on uninstall. `UninstallContext` adds `keepUserData()`; if it returns `true`, do not remove plugin data:

```php
public function uninstall(UninstallContext $uninstallContext): void
{
    parent::uninstall($uninstallContext);
    if ($uninstallContext->keepUserData()) {
        return;
    }
    // Remove or deactivate the data created by the plugin
}
```

- `activate(ActivateContext $activateContext): void` — activate entities created in `install`, or create new ones now that the plugin is active. `ActivateContext` provides the same info as `InstallContext`.
- `deactivate(DeactivateContext $deactivateContext): void` — mostly the opposite of `activate`: deactivate or remove entities that would harm the system while inactive.
- `update(UpdateContext $updateContext): void` — runs on plugin update; do not update database entries here (use plugin migrations instead). `UpdateContext` adds `getUpdatePluginVersion` (new version) versus `getCurrentPluginVersion` (currently installed version).
- `postInstall(InstallContext $installContext): void` / `postUpdate(UpdateContext $updateContext): void` — run after install/update fully succeed.

## Essential identifiers

- `install()`, `uninstall()`, `activate()`, `deactivate()`, `update()`, `postInstall()`, `postUpdate()`
- `InstallContext`, `UninstallContext`, `ActivateContext`, `DeactivateContext`, `UpdateContext`
- `UninstallContext::keepUserData()`
- `UpdateContext::getUpdatePluginVersion()`, `UpdateContext::getCurrentPluginVersion()`

## Gotchas

Removing data created by a plugin on uninstall can break existing references (e.g. deleting a payment method used by past orders breaks those orders); prefer deactivating such entities instead of removing them.
