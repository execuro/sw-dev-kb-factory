---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/configuration.html
sourceHash: 878fc631499053b030a614d604574108c88d6695
codeCheckedAgainst: "6.7.13.0"
keywords: ["config.xml", "app configuration", "Resources/config/config.xml", "/api/_action/system-config", "system_config:read", "SystemConfigFacade", "services.config.app", "services.config.get", "config twig function", "cache-relevant", "sw/extension/config", "app settings", "system config"]
summary: "App config.xml in Resources/config; values {appName}.config.{field}, read via /api/_action/system-config, Twig config() or services.config."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md", "platform/dev/6.7/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md"]
---
## What it is

Apps provide user-editable settings with a `config.xml` using the same schema as plugin configuration (see [plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md)). Values are stored in the system config under `{appName}.config.{fieldName}`.

## When to use

An app needs merchant-configurable options and must read or write them from its backend, Storefront templates or app scripts.

## Key steps / config

1. Place the file at `Resources/config/config.xml` inside the app folder (next to `manifest.xml`):
   ```text
   DemoApp/
     Resources/config/config.xml
     manifest.xml
   ```
   The settings page appears under `Extensions > My extensions`; directly reachable at `{APP_URL}/admin#/sw/extension/config/{appName}`.
2. If a value changes cached Storefront output, add `cache-relevant="true"` to the `<input-field>` or `<component>`.
3. **Read over the Admin API:** `GET /api/_action/system-config?domain=DemoApp.config&salesChannelId=<id>` — `domain` is required, `salesChannelId` optional. Returns a flat JSON object:
   ```json
   { "DemoApp.config.field1": true, "DemoApp.config.field2": "..." }
   ```
   Requires app permission `system_config:read`.
4. **Write over the Admin API:** `POST /api/_action/system-config?salesChannelId=<id>` with a JSON body of key/value pairs (`{"DemoApp.config.field1": true}`); returns 204. Requires `system_config:update`, `system_config:create` and `system_config:delete`.
5. **Storefront Twig:** `{{ config('DemoApp.config.field1') }}` — resolved for the current sales channel (see [Twig function reference](platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md)).
6. **App scripts** (`config` service, see [script services reference](platform/dev/6.7/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.md) and [App Scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md)):
   ```twig
   {% set configValue = services.config.app('field1') %}
   {% set configValue = services.config.get('core.listing.productsPerPage') %}
   ```
   `app()` prefixes `{appName}.config.` automatically and needs no permission; `get()` reads any key and needs `system_config:read`. Both accept an optional `salesChannelId` second argument (defaults to the script's sales channel).

## Essential identifiers

- `Resources/config/config.xml`
- `{appName}.config.{fieldName}`
- `/api/_action/system-config` (GET `api.action.core.system-config.value`, POST `api.action.core.save.system-config`)
- `system_config:read`, `system_config:update`, `system_config:create`, `system_config:delete`
- Twig function `config`
- `Shopware\Core\System\SystemConfig\Facade\SystemConfigFacade` — `app()`, `get()`
- `cache-relevant`

## Gotchas

- The source's prose calls the Twig function `systemConfig()`; the registered Twig function is `config`.
- `services.config.app()` throws outside app scripts (no app information available).
- Without the `system_config:read` privilege, `services.config.get()` throws a missing-privilege exception.

## Version notes

App scripts, and therefore the `config` script service, exist since Shopware 6.4.8.0.

## Code check (6.7.13.0)
- confirmed `Resources/config/config.xml` — app config file path read on install/update — vendor/shopware/core/Framework/App/Lifecycle/AppManager.php:422
- confirmed `cache-relevant` — boolean attribute in config schema — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:31
- confirmed `SystemConfigController::getConfigurationValues()` — GET `/api/_action/system-config`, ACL `system_config:read`, `domain` required — vendor/shopware/core/System/SystemConfig/Api/SystemConfigController.php:73
- confirmed `SystemConfigController::saveConfiguration()` — POST, ACL update/create/delete — vendor/shopware/core/System/SystemConfig/Api/SystemConfigController.php:103
- corrected `config` — docs prose: `systemConfig()` twig function; registered name is `config` — vendor/shopware/core/Framework/Adapter/Twig/Extension/ConfigExtension.php:54
- confirmed `SystemConfigFacade::app()` — prefixes `{appName}.config.`, no privilege check — vendor/shopware/core/System/SystemConfig/Facade/SystemConfigFacade.php:77
- confirmed `SystemConfigFacade::get()` — requires `system_config:read` for apps — vendor/shopware/core/System/SystemConfig/Facade/SystemConfigFacade.php:49
- confirmed `config/:namespace` — admin route `sw.extension.config` — vendor/shopware/administration/Resources/app/administration/src/module/sw-extension/index.js:176
