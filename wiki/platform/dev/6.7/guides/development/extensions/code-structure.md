---
id: platform/dev/6.7/guides/development/extensions/code-structure.md
title: Code Structure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/code-structure.html
sourceHash: 33e6790c632ffb096449d23966cef542bc7833c1
codeCheckedAgainst: "6.7.13.0"
keywords: ["code structure", "extension type", "shopware-platform-plugin", "shopware-bundle", "bundle", "static plugin", "managed plugin", "store plugin", "app", "theme", "plugin dependency", "theme inheritance", "upgrade", "psr-4"]
summary: Choosing Shopware extension types (bundle, static/managed plugin, app, theme) and structuring code, shared foundations and dependencies for easier upgrades.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/bundle.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/themes/theme-base-guide.md"]
---
## What it is

Guidance on picking the right Shopware extension type and structuring its code (projects/bundles, plugins, apps, themes, shared foundations) so that upgrades touch as little as possible.

## When to use

When starting a new extension or restructuring existing ones: choosing between bundle, plugin, app, or theme, laying out folders and namespaces, or deciding where shared code and dependencies should live.

## Key steps / config

### Shared patterns

- Namespaces follow PSR-4 and match folder names. Avoid deep nesting that hides ownership.
- Centralize configuration defaults and document override points. Use environment variables only in the project layer, never in Store plugins.
- Ship a short README with purpose, install/update steps and known constraints.

### Choose the extension type

| Type | Use when |
|---|---|
| Custom project/bundle | Bespoke installation you fully control ([bundle guide](platform/dev/6.7/guides/plugins/plugins/bundle.md)) |
| Static plugin | Project-specific plugin, the recommended option ([plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) |
| Managed plugin | Same layout, hardened for Store review: strict metadata, no project hacks, testable, BC guarantees ([plugins overview](platform/dev/6.7/guides/plugins/plugins/_index.md)) |
| App | Cannot host PHP in the shop, or need SaaS-style isolation ([app base guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md)) |
| Theme | Storefront visual customization only ([theme base guide](platform/dev/6.7/guides/plugins/themes/theme-base-guide.md)) |

### Project/bundle structure

- Keep domain logic in bundles (not templates or controllers) and expose it via dependency injection.
- Use the Composer package type consistently and align namespaces with the bundle name. Core discovers plugins by the Composer type `shopware-platform-plugin`. The docs also name `shopware-bundle`.
- Put integration points (events, DAL extensions, decorators) behind service classes.

### Plugin structure

- Start from the default plugin skeleton. No bespoke autoloaders or custom entrypoints.
- Keep configuration, migrations, administration and storefront assets in their default folders. A `Shopware\Core\Framework\Plugin` extends `Shopware\Core\Framework\Bundle`, which by default expects migrations in the `<BundleNamespace>\Migration` namespace and routes/config under `Resources/config`.
- Put schema changes in migrations, and make install/update code idempotent.
- Store plugins must not assume hostnames, queues, cron timing or file access. Document requirements and provide safe fallbacks.

### App structure

- Keep the manifest minimal and explicit: permissions, webhooks, actions and extensions match documented entrypoints.
- Separate the app backend (API/webhook handlers) from UI assets. Avoid stateful coupling to the shop runtime and design for multi-tenant hosting.

### Shared foundations

- Move logic into a shared foundation only when several extensions really need it. Keep dependent plugins and themes thin.
- Declare a [plugin dependency](platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md) when a plugin cannot work without the foundation.
- Use [theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) for shared styling instead of coupling themes through business-logic plugins.
- Draw the boundary around what changes together, not just what can be reused.

## Essential identifiers

- `shopware-platform-plugin` — Composer `type` of a Shopware plugin
- `Shopware\Core\Framework\Plugin`, `Shopware\Core\Framework\Bundle`
- `Bundle::getMigrationNamespace()` — defaults to `<namespace>\Migration`

## Gotchas

- Every added dependency grows the set of version combinations to test during upgrades. Avoid dependency chains added only for convenience, and document the compatibility range of the ones you keep.
- A shared foundation couples the release lifecycle of every extension that depends on it.
- Spreading related logic across many independent plugins increases upgrade friction. Prefer one repository with consistent tooling for extensions maintained together.

## Code check (6.7.13.0)
- confirmed `PluginFinder::COMPOSER_TYPE` — value is shopware-platform-plugin, used to detect plugin packages — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- unverified `shopware-bundle` — not referenced in vendor/shopware core/storefront; handled by Composer tooling outside scope
- confirmed `Plugin` — abstract class Plugin extends Bundle — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle` — abstract base of bundles, registers container file, migration path, filesystems, events — vendor/shopware/core/Framework/Bundle.php:32
- confirmed `Bundle::getMigrationNamespace()` — default namespace suffix \Migration — vendor/shopware/core/Framework/Bundle.php:45
- confirmed `Bundle::configureRoutes()` — imports routes from Resources/config — vendor/shopware/core/Framework/Bundle.php:78
