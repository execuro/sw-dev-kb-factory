---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.md
title: Use plugin configuration
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.html
sourceHash: 41967f00972542e03d1fd61793af2cd0200ca1d3
keywords: ["plugin configuration", "SystemConfigService", "config.xml", "MySubscriber", "product.loaded", "EntityLoadedEvent", "ProductEvents", "SwagBasicExample.config.example", "systemConfigService.get", "salesChannelId", "kernel.event_subscriber"]
summary: How to read a plugin's own configuration values, prefixed as <BundleName>.config.<name>, from a subscriber using SystemConfigService.
lastBuilt: 2026-09-15
---
## What it is

This guide shows how to read plugin configuration values — set up via a `config.xml` input field — inside plugin code, using `Shopware\Core\System\SystemConfig\SystemConfigService`.

## When to use

Use this once a plugin already defines a configuration field (e.g. via `config.xml`) and needs to read that value at runtime, for example inside an event subscriber.

## Key steps / config

The example subscriber listens to `product.loaded` (via `ProductEvents::PRODUCT_LOADED_EVENT`) and implements `EventSubscriberInterface`. The plugin's `config.xml` defines one input field named `example`:

```xml
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd">
    <card>
        <input-field>
            <name>example</name>
        </input-field>
    </card>
</config>
```

1. Inject `Shopware\Core\System\SystemConfig\SystemConfigService` into the subscriber via `services.xml`, tagging the service `kernel.event_subscriber`:

```xml
<service id="Swag\BasicExample\Subscriber\MySubscriber">
    <argument type="service" id="Shopware\Core\System\SystemConfig\SystemConfigService" />
    <tag name="kernel.event_subscriber"/>
</service>
```

2. Store it via constructor injection, then read the value with `get()`. Configuration keys are always prefixed with the bundle name to avoid collisions between plugins, following the pattern `<BundleName>.config.<configName>` — here `SwagBasicExample.config.example`:

```php
$exampleConfig = $this->systemConfigService->get('SwagBasicExample.config.example', $salesChannelId);
```

## Essential identifiers

- `Shopware\Core\System\SystemConfig\SystemConfigService` and its `get()` method
- config key pattern `<BundleName>.config.<configName>` (example: `SwagBasicExample.config.example`)
- tag `kernel.event_subscriber`
- event constant `ProductEvents::PRODUCT_LOADED_EVENT`

## Gotchas

Set the `salesChannelId` argument to `null` to read a configuration value applying to all Sales Channels, or pass the specific Sales Channel ID to read a channel-scoped override.
