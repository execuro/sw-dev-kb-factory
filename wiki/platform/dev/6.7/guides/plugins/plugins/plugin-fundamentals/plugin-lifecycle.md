---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md
title: Plugin Lifecycle Methods
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.html
sourceHash: e3a1687cf60fb493416240274cf51b6630161006
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware\\Core\\Framework\\Plugin", "install", "postInstall", "update", "postUpdate", "activate", "deactivate", "uninstall", "InstallContext", "UpdateContext", "UninstallContext", "keepUserData", "setAutoMigrate", "plugin lifecycle", "plugin hooks"]
summary: "Plugin base-class lifecycle hooks (install, activate, deactivate, update, postInstall, postUpdate, uninstall) and what each context object provides."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/development/testing/ci.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md"]
---
## What it is

The lifecycle methods a plugin base class inherits from `Shopware\Core\Framework\Plugin` (which extends `Shopware\Core\Framework\Bundle`, which extends Symfony's `Bundle`), and the context object each receives.

## When to use

You need to create, activate, adjust or clean up data when a merchant installs, activates, deactivates, updates or uninstalls your plugin.

## Key steps / config

Override the methods in `<plugin root>/src/SwagBasicExample.php`; the service container is available via `$this->container` ([Dependency Injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)).

| Method | Runs |
|---|---|
| `install(InstallContext $installContext)` | on install |
| `postInstall(InstallContext $installContext)` | after successful install |
| `activate(ActivateContext $activateContext)` | before activation |
| `deactivate(DeactivateContext $deactivateContext)` | before deactivation |
| `update(UpdateContext $updateContext)` | on update |
| `postUpdate(UpdateContext $updateContext)` | after successful update |
| `uninstall(UninstallContext $uninstallContext)` | on uninstall |

Context classes live in `Shopware\Core\Framework\Plugin\Context\`. `InstallContext` exposes `getPlugin()`, `getContext()` (system `Context`), `getCurrentShopwareVersion()`, `getCurrentPluginVersion()`, `getMigrationCollection()` ([migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)), `isAutoMigrate()`/`setAutoMigrate()`. `ActivateContext`, `DeactivateContext`, `UpdateContext` and `UninstallContext` share this; `UpdateContext` adds `getUpdatePluginVersion()` (target version), `UninstallContext` adds `keepUserData()`.

```php
public function uninstall(UninstallContext $uninstallContext): void
{
    if ($uninstallContext->keepUserData()) {
        return;
    }
    // remove or deactivate plugin data
}
```

Usage guidance from the source:
- `install()`: register entities (e.g. a payment method) but keep them inactive; avoid creating active business data before activation.
- `activate()`: activate those entities or create data that needs an active plugin.
- `deactivate()`: deactivate entities, or remove ones that would interfere while inactive.
- `update()`: non-database adjustments, config changes, version-dependent logic; schema/data changes belong in migrations.
- `uninstall()`: clean up — but deactivate rather than delete entities referenced by real orders.

## Essential identifiers

- `Shopware\Core\Framework\Plugin`, `Shopware\Core\Framework\Bundle`
- `install()`, `postInstall()`, `activate()`, `deactivate()`, `update()`, `postUpdate()`, `uninstall()`
- `InstallContext`, `ActivateContext`, `DeactivateContext`, `UpdateContext`, `UninstallContext`
- `keepUserData()`, `getUpdatePluginVersion()`, `getCurrentPluginVersion()`, `isAutoMigrate()`, `setAutoMigrate()`

## Gotchas

- When `keepUserData()` returns `true`, do not delete persistent plugin data.
- The source's keep-user-data snippet names the parameter `$context` but calls `$uninstallContext->keepUserData()`; use one consistent variable name.
- The `Plugin` constructor is `final`; plugins cannot override it.
- Run [CI](platform/dev/6.7/guides/development/testing/ci.md) before plugin updates to reduce upgrade-time failures.

## Code check (6.7.15.1)
- confirmed `Plugin::install()` — takes InstallContext, empty default — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `Plugin::postInstall()` — takes InstallContext — vendor/shopware/core/Framework/Plugin.php:43
- confirmed `Plugin::update()` — takes UpdateContext — vendor/shopware/core/Framework/Plugin.php:47
- confirmed `Plugin::activate()` — takes ActivateContext — vendor/shopware/core/Framework/Plugin.php:55
- confirmed `Plugin::deactivate()` — takes DeactivateContext — vendor/shopware/core/Framework/Plugin.php:59
- confirmed `Plugin::uninstall()` — takes UninstallContext — vendor/shopware/core/Framework/Plugin.php:63
- confirmed `InstallContext::setAutoMigrate()` — auto-migration control — vendor/shopware/core/Framework/Plugin/Context/InstallContext.php:54
- confirmed `UpdateContext::getUpdatePluginVersion()` — target plugin version — vendor/shopware/core/Framework/Plugin/Context/UpdateContext.php:24
- confirmed `UninstallContext::keepUserData()` — keep-data flag — vendor/shopware/core/Framework/Plugin/Context/UninstallContext.php:27
- confirmed `Bundle` — Shopware Bundle extends Symfony bundle — vendor/shopware/core/Framework/Bundle.php:33
