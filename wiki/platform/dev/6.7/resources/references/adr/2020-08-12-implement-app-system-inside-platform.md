---
id: platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md
title: Implement app system inside platform
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html
sourceHash: 1366c96aad63aef349e1c9a24df9b7e5855598e7
codeCheckedAgainst: "6.7.15.1"
keywords: ["app system", "apps", "Shopware\\Core\\Framework\\App", "manifest.xml", "manifest schema", "webhooks", "action-button", "custom modules", "custom fields", "@Plugins", "app:install", "app:activate", "saas", "cloud extension", "adr"]
summary: "ADR: app system moved from a plugin into core (Shopware\\Core\\Framework\\App); no PHP or admin JS, stable manifest and request formats."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2020-08-12) to move the app system, previously shipped as a separate public plugin (`shopware/app-system`), into the Shopware platform as part of the core bundle, analogous to the plugin system, under the `Shopware\Core\Framework\App` namespace. It also records the app system's design limits, its extension points and the stability guarantees app developers can rely on.

## When to use

- You need to understand why apps work differently from plugins (no server-side PHP, no arbitrary admin JS).
- You maintain an app and want to know which changes to the manifest schema or to outgoing requests Shopware treats as breaking.
- You are researching the history of the app system plugin versions v0.2.0/v0.3.0.

## Key steps / config

**Concept.** An extension mechanism that works the same in multi-tenant cloud (SaaS) and on-premise setups. An app consists of a manifest file (metadata, used extension points) and optional storefront customizations (templates, JS, CSS, snippets, theme configuration).

**Limitations** (all for multi-tenant security/operations):

- No PHP code execution on Shopware servers — third-party backend code runs on the app's own servers and talks to Shopware over the API.
- No general JS administration extensions — app JS must not run with the current admin user's permissions, only with those granted to the app; dedicated extension points exist instead.
- Nothing requiring constant file access — manifest metadata and template changes are stored in the shop database; theme JS/CSS files are only read during theme compilation and then served from the CDN.

**Extension points** (manifest elements in the installed schema shown in brackets):

- Webhooks (`<webhooks>/<webhook>`) — app is notified on a predefined URL when events occur.
- Action buttons (`<admin>/<action-button>`) — extra buttons on selected admin detail/listing pages that trigger custom actions for the selected entities.
- Custom modules (`<admin>/<module>`) — the app's own UI in the administration, embedded via iFrames.
- Custom fields (`<custom-fields>`) — app-registered custom field sets shown with the other custom fields.
- Storefront customizations — theme system, Twig templates, JS and CSS, like plugins. In theme inheritance, an app can be referenced explicitly as `@TechnicalAppName`; otherwise it falls into the `@Plugins` wildcard.

New extension points may be added only if they respect these limitations and can be deployed in the cloud.

**Migration process.**

1. Release v0.2.0 of the app system plugin; migrate that feature set into the platform across several merge requests, using feature flags where needed.
2. Migrate the CLI commands to install and activate apps last, so earlier steps stay invisible (the app system had no admin UI then, only CLI). The installed commands are `app:install` and `app:activate`.
3. Apps working with plugin v0.2.0 keep working in the platform; plugins that extended the app system internals may break (class names, namespaces, entity names change).
4. Release plugin v0.3.0, whose only purpose is migrating app data from the plugin's data structures to the platform's. Shops that used apps via the plugin must update to v0.3.0 right after upgrading Shopware, then can delete the plugin.

## Essential identifiers

- `Shopware\Core\Framework\App` — namespace of the app system in core
- Manifest schema files `manifest-2.0.xsd`, `manifest-3.0.xsd` (`Framework/App/Manifest/Schema/`)
- Manifest elements `webhooks`, `admin`, `action-button`, `module`, `custom-fields`
- `app_template` — entity holding app template changes in the database
- `@Plugins`, `@TechnicalAppName` — theme inheritance slots
- `app:install`, `app:activate` — CLI commands

## Gotchas

- Stability guarantee after migration: no app-breaking changes in minor or patch versions. Manifest schema changes may only add or loosen; nothing removed or made stricter. Radical changes need a new schema version, and both versions must be supported for a transition period.
- Outgoing requests to app backends (registration, webhooks, action buttons, loading custom modules) may gain parameters in minor/patch releases but parameters are never removed or renamed outside a major version, which must be documented.
- App-developer-facing changes are documented in dedicated `App System` sections of the changelog and upgrade files.
- The standalone app system plugin is deprecated once the migration is complete.

## Version notes

The ADR was written for the 6.3 line (it names 6.3.x minor and 6.3.0.x patch versions). The installed 6.7.15.1 ships two manifest schema versions (`manifest-2.0.xsd` and `manifest-3.0.xsd`), consistent with the versioned-schema rule.

## Code check (6.7.15.1)
- confirmed `Shopware\Core\Framework\App` — app system lives in core under this namespace — vendor/shopware/core/Framework/App/Manifest/Manifest.php:3
- confirmed `webhook` — manifest schema element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:252
- confirmed `action-button` — child of `admin` in the manifest schema — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:219
- confirmed `module` — custom admin module element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:220
- confirmed `custom-fields` — manifest element for custom field sets — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:69
- confirmed `app_template` — app templates stored in the database — vendor/shopware/core/Framework/App/Template/TemplateDefinition.php:26
- confirmed `@Plugins` — non-explicit extensions go into the wildcard slot — vendor/shopware/storefront/Theme/Twig/ThemeInheritanceBuilder.php:54
- confirmed `app:install` — CLI command — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:29
- confirmed `app:activate` — CLI command — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:16
- unverified `shopware/app-system` — historical standalone plugin, not part of the installed code
