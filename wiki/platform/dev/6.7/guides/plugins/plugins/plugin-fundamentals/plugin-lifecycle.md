---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md
title: Plugin Lifecycle Methods
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.html
sourceHash: e3a1687cf60fb493416240274cf51b6630161006
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin lifecycle", "install()", "activate()", "deactivate()", "update()", "uninstall()", "postInstall()", "postUpdate()", "InstallContext", "UpdateContext", "UninstallContext", "keepUserData()", "Shopware\\Core\\Framework\\Plugin", "plugin base class", "uninstall cleanup"]
summary: Plugin base class lifecycle hooks (install, activate, deactivate, update, postInstall, postUpdate, uninstall), their context objects and keepUserData.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md", "platform/dev/6.7/guides/development/testing/ci.md"]
---
## What it is

The lifecycle hooks a Shopware plugin can override in its base class. The base class extends `Shopware\Core\Framework\Plugin`, which extends `Shopware\Core\Framework\Bundle` (migrations, filesystem, events, themes), which extends Symfony's `Bundle`. Hooks live in the plugin bootstrap file (e.g. `<plugin root>/src/SwagBasicExample.php`) and can use the service container via `$this->container`.

## When to use

When a plugin must create, enable, disable, migrate or clean up data or system integration at install, activation, deactivation, update or uninstall time.

## Key steps / config

All hooks are optional no-op `public function ...(): void` methods on `Plugin`; override the ones you need:

| Method | Context | Runs |
|---|---|---|
| `install()` | `InstallContext` | on install |
| `postInstall()` | `InstallContext` | after successful install |
| `activate()` | `ActivateContext` | during activation |
| `deactivate()` | `DeactivateContext` | during deactivation |
| `update()` | `UpdateContext` | on update |
| `postUpdate()` | `UpdateContext` | after successful update |
| `uninstall()` | `UninstallContext` | on uninstall |

```php
public function uninstall(UninstallContext $uninstallContext): void
{
    if ($uninstallContext->keepUserData()) {
        return;
    }
    // Remove or deactivate the data created by the plugin
}
```

1. `install()`: register entities (e.g. a payment method), create initial data, prepare requirements — but keep created entities inactive.
2. `activate()`: activate entities created in `install()`, or create data that needs the plugin to be active.
3. `deactivate()`: deactivate those entities, or remove ones that would interfere while the plugin is inactive.
4. `update()`: non-database adjustments, feature toggles, config changes, logic depending on old/new version. Put schema/data changes in plugin migrations instead.
5. `postInstall()` / `postUpdate()`: actions that must run only after the process fully completed.
6. `uninstall()`: clean up plugin data, unless `keepUserData()` returns `true`.

`InstallContext` offers `getContext()` (system `Context`: language, currency, permissions), `getCurrentShopwareVersion()`, `getCurrentPluginVersion()`, `getMigrationCollection()`, and `isAutoMigrate()` / `setAutoMigrate()`. `ActivateContext`, `DeactivateContext`, `UpdateContext` and `UninstallContext` all extend it. `UpdateContext` adds `getUpdatePluginVersion()` (target version; `getCurrentPluginVersion()` is the version before the update). `UninstallContext` adds `keepUserData()`.

## Essential identifiers

- `Shopware\Core\Framework\Plugin`, `Shopware\Core\Framework\Bundle`
- `install()`, `postInstall()`, `activate()`, `deactivate()`, `update()`, `postUpdate()`, `uninstall()`
- `InstallContext`, `ActivateContext`, `DeactivateContext`, `UpdateContext`, `UninstallContext`
- `getUpdatePluginVersion()`, `getCurrentPluginVersion()`, `keepUserData()`, `isAutoMigrate()`, `setAutoMigrate()`

## Gotchas

- Do not create fully active business data in `install()`; the plugin is not active yet.
- Do not blindly delete entities in `uninstall()` — e.g. a payment method used by real orders would break those orders; deactivate instead.
- If `keepUserData()` is `true`, never delete persistent plugin data. When it is `false`, the core itself removes the plugin's migrations before calling `uninstall()` and deletes the plugin's system config, custom entities and custom fields afterwards.
- In the installed code, `activate()` runs after the plugin is flagged active and the container rebuilt, with auto-migrate disabled; migrations run right after it. `deactivate()` runs before the plugin is flagged inactive.
- The source's `keepUserData` snippet names the parameter `$context` but uses `$uninstallContext`; use one consistent name.
- Run CI (static analysis, tests, reproducible artifact) before plugin updates, see [CI](platform/dev/6.7/guides/development/testing/ci.md).

## Code check (6.7.13.0)
- confirmed `Plugin` — abstract class Plugin extends Bundle — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle` — abstract class Bundle extends SymfonyBundle — vendor/shopware/core/Framework/Bundle.php:32
- confirmed `Plugin::install()` — takes InstallContext, no-op default — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `Plugin::postInstall()` — takes InstallContext — vendor/shopware/core/Framework/Plugin.php:43
- confirmed `Plugin::postUpdate()` — takes UpdateContext — vendor/shopware/core/Framework/Plugin.php:51
- confirmed `Plugin::uninstall()` — takes UninstallContext — vendor/shopware/core/Framework/Plugin.php:63
- confirmed `UpdateContext::getUpdatePluginVersion()` — target plugin version — vendor/shopware/core/Framework/Plugin/Context/UpdateContext.php:24
- confirmed `InstallContext::setAutoMigrate()` — auto-migration control — vendor/shopware/core/Framework/Plugin/Context/InstallContext.php:54
- confirmed `UninstallContext::keepUserData()` — keep-data flag — vendor/shopware/core/Framework/Plugin/Context/UninstallContext.php:27
- corrected `activate()` — docs: executed before plugin activation; code sets active and rebuilds container first — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:396
