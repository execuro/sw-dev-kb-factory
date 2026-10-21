---
id: platform/dev/6.7/guides/plugins/apps/app-base-guide.md
title: App Base Guide
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide.html
sourceHash: ea343c469fb6a4d2e95afee198cb78b415a7c7d7
codeCheckedAgainst: "6.7.15.1"
keywords: ["app base guide", "manifest.xml", "custom/apps", "app:refresh", "app:install", "app:activate", "app:list", "app:validate", "--no-validate", "manifest-3.0.xsd", "create app", "app registry", "install app"]
summary: Shared foundation for every Shopware app - custom/apps folder, manifest.xml meta block, app:refresh, app:install --activate, cache clear.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/concepts/extensions/apps-concept.md
  - platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md
  - platform/dev/6.7/guides/plugins/apps/create-admin-extension.md
  - platform/dev/6.7/resources/references/app-reference/manifest-reference.md
---
## What it is

The common starting point for every Shopware app: create an app folder in `custom/apps`, add a valid `manifest.xml`, refresh the app registry, then install and activate the app. Background: [App concept](platform/dev/6.7/concepts/extensions/apps-concept.md).

## When to use

Before building any app. After the manifest is valid, the path diverges:

- **Apps requiring a backend** (registration, signed server-to-server communication, webhooks, Admin API credentials/permissions, payment methods, tax providers): continue with [App registration & backend setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md).
- **Admin UI apps** (Administration module iterated locally with Vite and the Admin Extension SDK `@shopware-ag/admin-extension-sdk`, no app backend needed): continue with [Build an Admin UI app](platform/dev/6.7/guides/plugins/apps/create-admin-extension.md).

Prerequisites: Shopware running locally, Administration access, shell access to the PHP container for `bin/console`.

## Key steps / config

1. Pick a technical name in UpperCamelCase, e.g. `MyExampleApp`.
2. Create the folder `custom/apps/MyExampleApp/` containing `manifest.xml`. The folder name must match `<meta><name>` (the validator compares them case-insensitively).
3. Write the manifest against the schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd` (set as `xsi:noNamespaceSchemaLocation`, with the usual XMLSchema-instance namespace declared):

```xml
<manifest xsi:noNamespaceSchemaLocation="…/manifest-3.0.xsd">
    <meta>
        <name>MyExampleApp</name>
        <label>Label</label>
        <label lang="de-DE">Name</label>
        <description>…</description>
        <author>…</author>
        <copyright>…</copyright>
        <version>1.0.0</version>
        <icon>Resources/config/plugin.png</icon>
        <license>MIT</license>
    </meta>
</manifest>
```

Required meta fields in code: `label`, `name`, `author`, `copyright`, `license`, `version`. Details: [Manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md).

4. From the project root inside the PHP container (e.g. `/var/www/html`):

```bash
bin/console app:refresh
bin/console app:install --activate MyExampleApp
bin/console app:list
```

`app:install` takes the technical name (`<meta><name>`), not a filesystem path. Without `--activate` the app is installed inactive; activate it later under **Extensions → My Extensions → Apps** or with `bin/console app:activate MyExampleApp`.

5. Clear caches if changes do not show: `bin/console cache:clear` (also `cache:clear:http` or `cache:clear:all`).

## Essential identifiers

- `custom/apps` (container parameter `shopware.app_dir`)
- `manifest.xml`, `manifest-3.0.xsd`
- `bin/console app:refresh` (alias `app:update`)
- `bin/console app:install --activate <Name>`, option `--no-validate`
- `bin/console app:activate`, `app:list`, `app:validate`

## Gotchas

- Missing or empty `<author>` / `<copyright>` makes `bin/console app:refresh` fail.
- If `app:refresh` reports validation errors, fix them and rerun.
- Apps are validated during installation; `--no-validate` on `app:install` skips this and is meant only for debugging. Use `bin/console app:validate` to find configuration issues.

## Code check (6.7.15.1)
- confirmed `shopware.app_dir` — set to `%kernel.project_dir%/custom/apps` — vendor/shopware/core/Framework/DependencyInjection/app.php:192
- confirmed `AppNameValidator::validate()` — folder name vs meta name, compared lowercased — vendor/shopware/core/Framework/App/Validation/AppNameValidator.php:17
- confirmed `Metadata::REQUIRED_FIELDS` — label, name, author, copyright, license, version — vendor/shopware/core/Framework/App/Manifest/Xml/Meta/Metadata.php:18
- confirmed `author` — element in manifest-3.0.xsd meta type — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:175
- confirmed `app:refresh` — command, alias app:update — vendor/shopware/core/Framework/App/Command/RefreshAppCommand.php:27
- confirmed `app:install` — command name — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:29
- confirmed `no-validate` — app:install option — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:122
- confirmed `app:activate` — command name — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:16
- confirmed `app:list` — command name — vendor/shopware/core/Framework/App/Command/AppListCommand.php:20
- confirmed `app:validate` — command name — vendor/shopware/core/Framework/App/Command/ValidateAppCommand.php:25
