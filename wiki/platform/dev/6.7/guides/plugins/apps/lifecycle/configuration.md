---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/configuration.html
sourceHash: 878fc631499053b030a614d604574108c88d6695
codeCheckedAgainst: "6.7.15.1"
keywords: ["config.xml", "Resources/config/config.xml", "/api/_action/system-config", "{appName}.config.{fieldName}", "SystemConfig", "system_config:read", "services.config.app", "services.config.get", "SystemConfigFacade", "config twig function", "cache-relevant", "app configuration", "app settings"]
summary: "App config.xml settings stored as {appName}.config.{field}; read/write via /api/_action/system-config, Twig config() or app scripts."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md", "platform/dev/6.7/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md"]
---
## What it is

Apps provide merchant-facing configuration through a `config.xml` with the same schema as [plugin configurations](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md). Values are stored in the system config under the key `{appName}.config.{fieldName}`.

## When to use

When an app needs settings a merchant edits in the Administration (`Extensions > My extensions`), and the app backend, Storefront templates or app scripts must read them.

## Key steps / config

1. Place the file at `Resources/config/config.xml` inside the app folder, next to `manifest.xml`:

```text
DemoApp/
├── Resources/config/config.xml
└── manifest.xml
```

2. During development, open the config page at `{APP_URL}/admin#/sw/extension/config/{appName}`.
3. Mark an `<input-field>` or `<component>` with `cache-relevant="true"` if its value changes cached Storefront output.
4. **Read over the Admin API** (app needs `system_config:read`):

```txt
GET /api/_action/system-config?domain=DemoApp.config&salesChannelId=<id>
{ "DemoApp.config.field1": true, "DemoApp.config.field2": "..." }
```

`domain` is required; `salesChannelId` is optional.
5. **Write over the Admin API** (app needs `system_config:update`, `system_config:create` and `system_config:delete`):

```txt
POST /api/_action/system-config?salesChannelId=<id>
Content-Type: application/json
{ "DemoApp.config.field1": true }
```

6. **Read in Storefront Twig** with the `config` function ([Twig function reference](platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md)): `{{ config('DemoApp.config.field1') }}`.
7. **Read in [app scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md)** via the [`config` service](platform/dev/6.7/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.md):
   - `{% set configValue = services.config.app('field1') %}` — own app's config, no `{appName}.config` prefix, no extra permission.
   - `{% set configValue = services.config.get('core.listing.productsPerPage') %}` — any key, needs `system_config:read`.

## Essential identifiers

- File: `Resources/config/config.xml`; key pattern `{appName}.config.{fieldName}`
- Route: `/api/_action/system-config` (GET `api.action.core.system-config.value`, POST `api.action.core.save.system-config`)
- Permissions: `system_config:read`, `system_config:update`, `system_config:create`, `system_config:delete`
- Twig: `config()`; script service: `services.config` (`Shopware\Core\System\SystemConfig\Facade\SystemConfigFacade`) with `app()` and `get()`
- Attribute: `cache-relevant`

## Gotchas

- The source prose mentions a `systemConfig()` Twig function; the function registered in 6.7.15.1 is `config`, as in the source's own example.
- `services.config.app()` throws a `BadMethodCallException` outside app scripts.
- Both `get()` and `app()` default to the current context's sales channel when no `salesChannelId` is passed.

## Version notes

App scripts (and thus the `config` script service) exist since Shopware 6.4.8.0.

## Code check (6.7.15.1)
- confirmed `Resources/config/config.xml` — app config is read from this path in the app filesystem — vendor/shopware/core/System/SystemConfig/Service/AppConfigReader.php:26
- confirmed `cache-relevant` — boolean attribute on config.xsd fields — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:31
- confirmed `/api/_action/system-config` — GET requires system_config:read and a domain query param — vendor/shopware/core/System/SystemConfig/Api/SystemConfigController.php:68
- confirmed `SystemConfigController::saveConfiguration()` — POST requires system_config:update, create and delete; optional salesChannelId — vendor/shopware/core/System/SystemConfig/Api/SystemConfigController.php:103
- confirmed `SystemConfigFacade::get()` — throws MissingPrivilegeException without system_config:read — vendor/shopware/core/System/SystemConfig/Facade/SystemConfigFacade.php:49
- confirmed `SystemConfigFacade::app()` — prefixes key with appName . '.config.', no privilege check — vendor/shopware/core/System/SystemConfig/Facade/SystemConfigFacade.php:77
- corrected `config` — docs prose: systemConfig() Twig function; registered Twig function is config — vendor/shopware/core/Framework/Adapter/Twig/Extension/ConfigExtension.php:54
- confirmed `.config.` — extension config prefix extensionName . '.config.' — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:413
