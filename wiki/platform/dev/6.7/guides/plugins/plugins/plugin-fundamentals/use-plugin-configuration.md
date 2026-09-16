---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.md
title: Use Plugin Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.html
sourceHash: e46b5da98d01174d951a4f9c303f6322996685fc
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin configuration", "read config", "SystemConfigService", "SystemConfigService::get", "SwagBasicExample.config.example", "systemConfigApiService", "getValues", "config() twig function", "system_config:read", "config.xml", "product.loaded", "sales channel config", "system config"]
summary: Reading plugin config values via SystemConfigService::get in PHP, systemConfigApiService.getValues in Admin JS and config() in Storefront Twig.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How to read values of a plugin's `config.xml` fields at runtime: in PHP via `SystemConfigService`, in Administration JavaScript via `systemConfigApiService`, and in Storefront Twig via the `config()` function. Defining the fields is covered in [Add plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md).

## When to use

When plugin code (a subscriber or service, a custom Admin module, or a Storefront template/JS plugin) must behave according to a configuration value the merchant set.

## Key steps / config

Example config field with technical name `example` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd`):

```xml
<config>
    <card>
        <title>Minimal configuration</title>
        <input-field><name>example</name></input-field>
    </card>
</config>
```

**Key format.** Plugin config keys are prefixed `<BundleName>.config.<configName>`, here `SwagBasicExample.config.example`. A bare `get('example')` would be ambiguous between plugins.

**PHP.** Inject `Shopware\Core\System\SystemConfig\SystemConfigService` into your service (the example uses a subscriber on `ProductEvents::PRODUCT_LOADED_EVENT` = `product.loaded`):

```php
$services->set(MySubscriber::class)
    ->args([service(SystemConfigService::class)])
    ->tag('kernel.event_subscriber');

// in the subscriber
$exampleConfig = $this->systemConfigService->get('SwagBasicExample.config.example', $salesChannelId);
```

The second argument `?string $salesChannelId` defaults to `null` (value for all sales channels); pass an ID for a channel-specific value. Typed variants `getString()`, `getInt()`, `getFloat()`, `getBool()` exist with the same signature.

**Administration JS.** Inject `systemConfigApiService` (`inject: ['systemConfigApiService']`) or fetch it with `Shopware.ApiService.getByName('systemConfigApiService')`, then:

```javascript
const config = await this.systemConfigApiService.getValues('SwagBasicExample.config');
const exampleValue = config['SwagBasicExample.config.example'];
```

`getValues(domain, salesChannelId = null, ...)` calls `GET /api/_action/system-config`, which requires the `system_config:read` ACL privilege.

**Storefront Twig.**

```twig
{% set exampleValue = config('SwagBasicExample.config.example') %}
```

`config()` reads through `SystemConfigService::get()` using the sales channel from the template context. For Storefront JS plugins (extending `PluginBaseClass`), pass the value from Twig into the page yourself (the source reads it back as `window.pluginConfig?.example`).

## Essential identifiers

- `Shopware\Core\System\SystemConfig\SystemConfigService`, `get()`
- `SwagBasicExample.config.example` (`<BundleName>.config.<configName>`)
- `systemConfigApiService`, `getValues()`
- `config()` Twig function
- `system_config:read`
- `ProductEvents::PRODUCT_LOADED_EVENT` / `product.loaded`

## Gotchas

- Always use the full prefixed key; the technical field name alone is not unique.
- The Admin API call fails without the `system_config:read` privilege.
- The source's Twig-to-JS handover snippet is empty; `window.pluginConfig` is not defined anywhere in the Storefront package, so your template must set it.

## Code check (6.7.13.0)
- confirmed `SystemConfigService::get()` — `(string $key, ?string $salesChannelId = null)` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:59
- confirmed `.config.` — plugin key prefix is bundle name plus `.config.` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:381
- confirmed `PRODUCT_LOADED_EVENT` — value `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `systemConfigApiService` — Admin API service name — vendor/shopware/administration/Resources/app/administration/src/core/service/api/system-config.api.service.js:17
- confirmed `getValues` — calls `_action/system-config` with domain and salesChannelId — vendor/shopware/administration/Resources/app/administration/src/core/service/api/system-config.api.service.js:44
- confirmed `system_config:read` — ACL on the values route — vendor/shopware/core/System/SystemConfig/Api/SystemConfigController.php:70
- confirmed `config` — Twig function, reads via SystemConfigService with context sales channel — vendor/shopware/core/Framework/Adapter/Twig/Extension/ConfigExtension.php:54
- confirmed `card` — config.xsd root `config` element takes `card` children — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:6
- unverified `window.pluginConfig` — not found in vendor/shopware/storefront; plugin-defined per source
