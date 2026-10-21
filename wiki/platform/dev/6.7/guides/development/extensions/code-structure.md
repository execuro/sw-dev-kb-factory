---
id: platform/dev/6.7/guides/development/extensions/code-structure.md
title: Code Structure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/code-structure.html
sourceHash: 33e6790c632ffb096449d23966cef542bc7833c1
codeCheckedAgainst: "6.7.15.1"
keywords: ["code structure", "extension type", "shopware-platform-plugin", "shopware-bundle", "bundle", "static plugin", "managed plugin", "store plugin", "app", "theme", "psr-4", "plugin dependency", "theme inheritance", "upgrade friction", "shared foundation"]
summary: Guidelines for choosing an extension type (bundle, static/managed plugin, app, theme) and structuring code, dependencies and shared foundations for upgrades.
lastBuilt: 2026-10-20
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/bundle.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/apps/app-base-guide.md
  - platform/dev/6.7/guides/plugins/themes/theme-base-guide.md
---
## What it is

Structural guidelines for Shopware extensions: which extension type to pick, how to lay out bundles, plugins and apps, and how to organise shared functionality across an extension family so upgrades stay cheap.

## When to use

When starting a new extension, deciding between bundle / plugin / app / theme, or restructuring a set of related extensions that share logic.

## Key steps / config

### Shared patterns

- Match PSR-4 namespaces to folder names; avoid deep nesting that hides ownership.
- Centralise configuration defaults and document override points. Environment variables belong in the project layer only, not in Store plugins.
- Ship a brief README per extension: purpose, install/update steps, known constraints.

### Choose the extension type

| Type | Use for |
|---|---|
| Custom project/bundle | Bespoke installations you fully control — see platform/dev/6.7/guides/plugins/plugins/bundle.md |
| Static plugin | Project-specific plugins; the recommended option — start from platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md |
| Managed plugin | Same layout, hardened for Store review: strict metadata, no project-only hacks, testability, BC guarantees — see platform/dev/6.7/guides/plugins/plugins/_index.md |
| App | No PHP hosting in the shop, or SaaS-style isolation — see platform/dev/6.7/guides/plugins/apps/app-base-guide.md |
| Theme | Visual Storefront customisation only — see platform/dev/6.7/guides/plugins/themes/theme-base-guide.md |

### Project/bundle structure

- Keep domain logic in bundles, not templates or controllers; expose services via dependency injection.
- Use Composer `type: shopware-platform-plugin` (the type the plugin finder scans for) or `shopware-bundle` consistently; align namespaces with the bundle name.
- Isolate integration points (events, DAL extensions) behind service classes.

### Plugin structure

- Start from the default plugin skeleton; no bespoke autoloaders or custom entrypoints.
- Keep configuration, migrations, administration and storefront assets in their default folders (the base `Bundle` class resolves migrations to the `<namespace>\Migration` namespace and matching folder by default).
- Encapsulate schema changes in migrations; install/update code must be idempotent.
- Store plugins: no hard project assumptions (hostnames, queues, cron timing, file access); document requirements and provide fallbacks.

### App structure

- Minimal, explicit manifest: permissions, webhooks, actions and extensions match the documented entrypoints.
- Separate the app backend (API/webhook handlers) from UI assets; design for multi-tenant hosting without stateful coupling to the shop runtime.

### Shared foundations and upgrades

- Put maintenance-heavy domain/integration logic in a shared foundation only when several extensions genuinely need it; keep dependent plugins/themes thin.
- Declare a plugin dependency (platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md) when a plugin cannot run without the foundation.
- Prefer theme inheritance (platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) for shared presentation instead of coupling themes through business-logic plugins.
- Keep related extensions in one repository with consistent tooling; keep events, decorators and DAL extensions behind service classes.

## Essential identifiers

- `shopware-platform-plugin` (Composer type for plugins)
- `shopware-bundle` (Composer type for bundles)
- `Shopware\Core\Framework\Plugin`, `Shopware\Core\Framework\Bundle`

## Gotchas

- Avoid dependency chains added only for convenience: each dependency multiplies the version combinations to test during upgrades. Document the compatibility range of dependencies you keep.
- A shared foundation couples the release lifecycle of its dependents — draw the boundary by what changes together, not by what can technically be reused.
- The more surface area exposed to the platform, the more upgrade effort.

## Code check (6.7.15.1)
- confirmed `PluginFinder::COMPOSER_TYPE` — composer type scanned for plugins is `shopware-platform-plugin` — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `Plugin` — plugin base class extends the Shopware `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle` — Shopware bundle base class extends Symfony's bundle — vendor/shopware/core/Framework/Bundle.php:33
- confirmed `Bundle::getMigrationNamespace()` — defaults to `<bundle namespace>\Migration` — vendor/shopware/core/Framework/Bundle.php:46
- unverified `shopware-bundle` — composer type not referenced in vendor/shopware/core PHP; handled by composer tooling outside the checked roots
