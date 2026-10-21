---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md
sourceHash: e46b5da98d01174d951a4f9c303f6322996685fc
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.html
title: Use Plugin Configuration
version: "6.7"
versions:
  - "6.7"
keywords: ["SystemConfigService", "systemConfigApiService", "getValues", "config()", "SwagBasicExample.config.example", "system_config:read", "product.loaded", "ProductEvents::PRODUCT_LOADED_EVENT", "plugin configuration", "read config value", "config.xml", "sales channel config", "twig config function"]
summary: "Read plugin config values via SystemConfigService::get() in PHP, systemConfigApiService.getValues() in Admin JS, and config() in Storefront Twig."
lastBuilt: 2026-10-21
---
## What it is

How to read values defined in a plugin's `config.xml` from PHP (services, subscribers), Administration JavaScript and Storefront Twig/JS. Plugin config keys are always prefixed: `<BundleName>.config.<configName>`, e.g. `SwagBasicExample.config.example`.

## When to use

You have defined a config field (see [Add plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md)) and need its value at runtime. The guide's example reads it inside a subscriber on `product.loaded` (see [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)).

## Key steps / config

Minimal `src/Resources/config/config.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd`):

```xml
<config xsi:noNamespaceSchemaLocation=".../SystemConfig/Schema/config.xsd">
    <card>
        <title>Minimal configuration</title>
        <input-field><name>example</name></input-field>
    </card>
</config>
```

**PHP**

1. Inject `Shopware\Core\System\SystemConfig\SystemConfigService` in `src/Resources/config/services.php`:
   ```php
   $services->set(MySubscriber::class)
       ->args([service(SystemConfigService::class)])
       ->tag('kernel.event_subscriber');
   ```
2. Store it in a constructor property, then read with the prefixed key:
   `$this->systemConfigService->get('SwagBasicExample.config.example', $salesChannelId);`
   Pass `null` as `salesChannelId` for the value valid across all sales channels, or a specific sales channel ID. Typed variants `getString()`, `getInt()`, `getBool()` share the same signature.

**Administration (JS)**

- Inject `systemConfigApiService` (`inject: ['systemConfigApiService']` in a component) or fetch it with `Shopware.ApiService.getByName('systemConfigApiService')`.
- `await systemConfigApiService.getValues('SwagBasicExample.config')` returns an object keyed by full key: `config['SwagBasicExample.config.example']`. Optional second argument: `salesChannelId` (default `null`).
- The underlying endpoint is `GET /api/_action/system-config` and requires the `system_config:read` permission.

**Storefront**

- Twig: `{% set exampleValue = config('SwagBasicExample.config.example') %}` — no API call; the sales channel is taken from the template context.
- Storefront JS plugins (extending `PluginBaseClass`) cannot read system config directly; pass the value from Twig into the JS (the guide reads it from `window.pluginConfig?.example`).

## Essential identifiers

- `Shopware\Core\System\SystemConfig\SystemConfigService` — `get()`, `getString()`, `getInt()`, `getBool()`
- Key pattern `<BundleName>.config.<configName>`
- `systemConfigApiService.getValues(domain, salesChannelId)`
- Twig function `config()`
- ACL privilege `system_config:read`
- `ProductEvents::PRODUCT_LOADED_EVENT` (`product.loaded`), `EntityLoadedEvent`

## Gotchas

- Calling `get('example')` without the prefix does not find the value; field names are only unique per bundle.
- The Admin `getValues()` call takes the domain (`SwagBasicExample.config`), not a single key, and returns the full keys.

## Code check (6.7.15.1)
- confirmed `SystemConfigService::get()` — signature `get(string $key, ?string $salesChannelId = null)` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:60
- confirmed `SystemConfigService::getString()` — same key/salesChannelId signature, returns string — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:87
- confirmed `.config.` — plugin keys are prefixed with the bundle name plus `.config.` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:371
- confirmed `PRODUCT_LOADED_EVENT` — value `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `EntityLoadedEvent` — class exists in DAL Event namespace — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:19
- confirmed `config` — Twig function backed by `SystemConfigService::get()` with the context's sales channel — vendor/shopware/core/Framework/Adapter/Twig/Extension/ConfigExtension.php:54
- confirmed `systemConfigApiService` — Admin API service name — vendor/shopware/administration/Resources/app/administration/src/core/service/api/system-config.api.service.js:17
- confirmed `getValues()` — `getValues(domain, salesChannelId = null, ...)` calls `_action/system-config` — vendor/shopware/administration/Resources/app/administration/src/core/service/api/system-config.api.service.js:44
- confirmed `system_config:read` — ACL on the system-config read routes — vendor/shopware/core/System/SystemConfig/Api/SystemConfigController.php:37
- confirmed `getByName` — exposed on `Shopware.ApiService` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:235
