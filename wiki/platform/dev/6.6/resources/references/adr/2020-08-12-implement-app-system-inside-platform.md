---
id: platform/dev/6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md
title: Implement app system inside platform
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html
sourceHash: 1366c96aad63aef349e1c9a24df9b7e5855598e7
keywords: ["app system", "manifest file", "Webhook", "Action-Button", "Custom Modules", "Custom Fields", "@TechnicalAppName", "@Plugins fallback namespace", "app-system plugin", "no PHP code execution", "storefront customizations", "theme inheritance"]
summary: "ADR: migrates the app-system plugin into platform core with webhook, action-button, custom-module and custom-field extension points."
lastBuilt: 2026-09-15
---
## What it is
Explains the decision to migrate the app system, previously a standalone plugin, into the Shopware platform core, as an extension mechanism that works identically in cloud (SaaS) and on-premise environments.

## When to use
Relevant when building or reasoning about apps as opposed to plugins: apps cannot run PHP on the shopware server, cannot run arbitrary JS inside the administration, and cannot rely on constant filesystem access.

## Key steps / config
- The app system moves into the `Shopware\Core\Framework\App` namespace, part of the core bundle, analogous to the plugin system.
- Extension points: Webhook (register for shopware events, notified on a predefined URL), Action-Button (extra buttons on detail/listing pages performing custom actions), Custom Modules (own UI embedded via iFrame), Custom Fields (own custom field sets shown alongside others in the administration), Storefront Customizations (theme, twig templates, JS/CSS, same inheritance model as plugins).
- Apps can be explicitly placed in the theme inheritance chain via `@TechnicalAppName`; otherwise they fall back to the shared `@Plugins` namespace.
- Migration releases: app-system plugin `v0.2.0` is released before migration starts; after migration, `v0.3.0` migrates app data from the plugin's old data structures to the new platform structures, after which the plugin can be deleted.

## Essential identifiers
- `Shopware\Core\Framework\App`
- `@TechnicalAppName`
- `@Plugins`
- app-system plugin `v0.2.0` / `v0.3.0`

## Gotchas
- No PHP code execution is allowed for apps on the shopware server; third-party backend code must run on third-party servers and communicate over the API.
- No general JS administration extensions — only the defined extension points (Action-Buttons, Custom Modules) may extend the administration.
- No reliance on constant file access — manifest content and template changes are stored in the database; storefront theme files are only read during theme compilation, then served from the CDN.
- Manifest schema changes may only be additive/loosened in minor and patch releases; breaking schema changes require a new major version with an overlap period during which both versions are supported.
- The format of outgoing requests to third-party app backends cannot remove or rename existing parameters in minor (6.3.x) or patch (6.3.0.x) versions.

## Version notes
- After migration, the app system is considered stable: no breaking changes in minor (6.3.x) or patch (6.3.0.x) releases. The app-system plugin itself is deprecated once migration is complete.
