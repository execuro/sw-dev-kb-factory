---
id: platform/dev/6.7/guides/plugins/apps/app-base-guide.md
title: App Base Guide
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide.html
sourceHash: ea343c469fb6a4d2e95afee198cb78b415a7c7d7
codeCheckedAgainst: "6.7.13.0"
keywords: ["app", "manifest.xml", "custom/apps", "app:refresh", "app:install", "app:activate", "app:list", "app:validate", "--no-validate", "cache:clear", "create app", "app setup", "meta name"]
summary: Shared foundation for every Shopware app - folder in custom/apps, manifest.xml meta block, app:refresh, app:install --activate, cache clear.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/extensions/apps-concept.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/guides/plugins/apps/create-admin-extension.md", "platform/dev/6.7/resources/references/app-reference/manifest-reference.md"]
---
## What it is

The common starting point for all Shopware apps: create an app folder in `custom/apps`, add a valid `manifest.xml`, refresh the app registry, then install and activate the app. See the [App concept](platform/dev/6.7/concepts/extensions/apps-concept.md) for background.

## When to use

You are creating a new app locally. After this foundation, continue with [App registration & backend setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md) for apps needing a backend (registration, webhooks, signing, Admin API credentials, payment methods, tax providers), or [Build an Admin UI app](platform/dev/6.7/guides/plugins/apps/create-admin-extension.md) for Administration-only apps using Vite and the Admin Extension SDK.

## Key steps / config

Prerequisites: Shopware running locally, Administration access (`/admin`), shell access to the PHP container for `bin/console`.

1. Pick a technical name in UpperCamelCase, e.g. `MyExampleApp`.
2. Create `custom/apps/MyExampleApp/manifest.xml`. Schema: `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd` (full reference: [Manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md)).

```xml
<manifest xsi:noNamespaceSchemaLocation="...manifest-3.0.xsd">
    <meta>
        <name>MyExampleApp</name>
        <label>Label</label>
        <label lang="de-DE">Name</label>
        <description>...</description>
        <author>...</author>
        <copyright>...</copyright>
        <version>1.0.0</version>
        <icon>Resources/config/plugin.png</icon>
        <license>MIT</license>
    </meta>
</manifest>
```

3. From the project root in the PHP container, refresh the registry: `bin/console app:refresh` (fix reported validation errors and rerun).
4. Install by technical name (`<meta><name>`), not path: `bin/console app:install --activate MyExampleApp`.
5. Check with `bin/console app:list`. Without `--activate` the app is installed inactive; activate in **Extensions > My Extensions > Apps** or with `bin/console app:activate MyExampleApp`.
6. Clear cache if changes do not show: `bin/console cache:clear`, optionally `bin/console cache:clear:http` or `bin/console cache:clear:all`.
7. Apps are validated during installation; `bin/console app:validate` reports configuration issues.

## Essential identifiers

- `custom/apps/<Name>/manifest.xml`
- `<meta>`: `name`, `label`, `description`, `author`, `copyright`, `version`, `icon`, `license`
- `bin/console app:refresh`, `app:install`, `app:activate`, `app:list`, `app:validate`
- `--activate`, `--no-validate`, `--force`
- `bin/console cache:clear`, `cache:clear:http`, `cache:clear:all`

## Gotchas

- The folder name and `<meta><name>` must match (per source).
- `<author>` and `<copyright>` are required; if missing or empty, `app:refresh` fails. The installed `Metadata` class lists `label`, `name`, `author`, `copyright`, `license` and `version` as required meta fields.
- `--no-validate` on `app:install` skips validation; use it only while debugging.
- `app:install` asks interactively to accept requested permissions and hosts unless `--force` (`-f`) is passed; `--activate` also has the short form `-a`.
- `app:refresh` has the alias `app:update` and accepts `--activate`/`--no-validate` too.

## Code check (6.7.13.0)
- confirmed `app:refresh` — command name, alias `app:update` — vendor/shopware/core/Framework/App/Command/RefreshAppCommand.php:26
- confirmed `app:install` — takes `name` argument (array), options `force`, `activate`, `no-validate` — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:28
- confirmed `no-validate` — skips `ManifestValidator::validate()` on install — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:76
- confirmed `app:activate` — command name — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:15
- confirmed `app:list` — command name — vendor/shopware/core/Framework/App/Command/AppListCommand.php:19
- confirmed `app:validate` — command name — vendor/shopware/core/Framework/App/Command/ValidateAppCommand.php:24
- confirmed `Metadata::REQUIRED_FIELDS` — includes `author` and `copyright` — vendor/shopware/core/Framework/App/Manifest/Xml/Meta/Metadata.php:18
- confirmed `shopware.app_dir` — `%kernel.project_dir%/custom/apps` — vendor/shopware/core/Framework/DependencyInjection/app.php:182
- confirmed `cache:clear:http` — only HTTP cache — vendor/shopware/core/Framework/Adapter/Command/CacheClearHttpCommand.php:14
- confirmed `cache:clear:all` — all caches/pools — vendor/shopware/core/Framework/Adapter/Command/CacheClearAllCommand.php:14
