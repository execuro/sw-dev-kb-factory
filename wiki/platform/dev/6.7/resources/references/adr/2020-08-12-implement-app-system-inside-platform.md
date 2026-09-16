---
id: platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md
title: Implement app system inside platform
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html
sourceHash: 1366c96aad63aef349e1c9a24df9b7e5855598e7
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware\\Core\\Framework\\App", "app system", "apps", "manifest.xml", "manifest schema", "webhooks", "action-button", "custom modules", "custom-fields", "@Plugins", "app:install", "app:activate", "theme inheritance", "cloud", "adr"]
summary: "ADR: app system moved from the app-system plugin into core (Shopware\\Core\\Framework\\App); app limits, extension points and backward-compatibility promises."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-08-12): the app system, first developed as the separate `app-system` plugin, is migrated into the platform core bundle under the `Shopware\Core\Framework\App` namespace, next to the plugin system. It records why apps exist, what they cannot do, which extension points they get, and which compatibility guarantees apply once the system is declared stable.

## When to use

- You need to decide between building a plugin and an app (cloud and on-premise compatibility).
- You want to know why apps cannot run PHP or custom admin JS, and which extension points replace that.
- You need the compatibility rules for manifest schema and outgoing app requests.

## Key steps / config

### App concept

An app is a manifest file (metadata, used extension points) plus optional storefront customizations: templates, JS, CSS, snippets, theme configuration. It is designed for multi-tenant SaaS and on-premise alike.

### Limitations

- **No PHP code execution** — third-party code is not run on Shopware servers; app backends run on the app vendor's servers and talk to the shop via the API.
- **No general admin JS extensions** — app JS must not run with the current admin user's permissions; dedicated extension points (action buttons, custom modules) are provided instead.
- **No constant file access** — per-tenant files cannot live on the local filesystem, so manifest metadata and template changes are stored in the shop database; storefront theme JS/CSS is only read during theme compilation.

### Extension points

- **Webhooks** — the app is notified on a predefined URL when events happen.
- **Action buttons** — extra buttons on selected admin detail and listing pages, triggering custom actions for the selected entities.
- **Custom modules** — the app's own admin UI, embedded via iframes.
- **Custom fields** — app-registered custom field sets shown with other custom fields.
- **Storefront customizations** — theme system, Twig templates, JS and CSS like a plugin. In theme inheritance an app can be placed explicitly via `@TechnicalAppName`; otherwise it falls into the `@Plugins` wildcard.

In the installed manifest schema (`manifest-3.0.xsd`) these map to root elements next to `meta`, `setup` and `permissions`:

```xml
<manifest>
    <meta>...</meta>
    <setup>...</setup>
    <admin><action-button .../><module .../></admin>
    <storefront>...</storefront>
    <permissions>...</permissions>
    <custom-fields>...</custom-fields>
    <webhooks>...</webhooks>
</manifest>
```

New extension points must not violate the limitations above and must be deployable in the cloud.

### Migration plan (historical)

- Migration in several merge requests; feature flags only where needed, CLI install/activate commands migrated last so earlier steps stay invisible.
- `v0.2.0` of the plugin released before migration; apps working with it work unchanged in core. Plugin developers who extended the app system internals face breaking changes (class names, namespaces, entity names).
- `v0.3.0` of the plugin only migrates app data from the plugin's structures to core; shops upgrading the platform must update to it right after, then may delete the plugin.

## Essential identifiers

- `Shopware\Core\Framework\App` (namespace; entity `app`, templates in `app_template`, action buttons in `app_action_button`)
- `bin/console app:install`, `bin/console app:activate`
- `@TechnicalAppName`, `@Plugins` (theme inheritance slots)
- Manifest schema `manifest-3.0.xsd`

## Gotchas

- Stability promise: no app-breaking changes in minor or patch versions. Manifest schema changes may only add or loosen, never remove or tighten; radical changes need a new schema version supported in parallel with the old one for a transition period.
- Outgoing requests to app backends (registration, webhooks, action buttons, module loading) may gain parameters but not lose or rename them outside a major version.
- App-developer-facing changes are documented in separate `App System` sections of changelog and upgrade files.

## Version notes

- The ADR refers to 6.3 as the release line for the stability promise (minor `6.3.x`, patch `6.3.0.x`). The installed code ships two manifest schemas, `manifest-2.0.xsd` and `manifest-3.0.xsd`, with `Manifest` validating against 3.0.
- The standalone app-system plugin is deprecated after the migration.

## Code check (6.7.13.0)
- confirmed `Shopware\Core\Framework\App` — app system namespace in core — vendor/shopware/core/Framework/App/AppEntity.php:3
- confirmed `app_template` — app templates stored in the database — vendor/shopware/core/Framework/App/Template/TemplateDefinition.php:26
- confirmed `app:install` — CLI command — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:28
- confirmed `app:activate` — CLI command — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:15
- confirmed `manifest-3.0.xsd` — schema used for manifest validation — vendor/shopware/core/Framework/App/Manifest/Manifest.php:33
- confirmed `webhooks` — manifest root element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:81
- confirmed `action-button` — child of `admin`, alongside `module` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:208
- confirmed `custom-fields` — manifest root element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:69
- confirmed `storefront` — manifest root element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:47
- confirmed `@Plugins` — non-explicit bundles fall into the wildcard slot — vendor/shopware/storefront/Theme/Twig/ThemeInheritanceBuilder.php:54
