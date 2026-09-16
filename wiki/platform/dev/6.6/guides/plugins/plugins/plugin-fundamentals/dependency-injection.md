---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md
title: Dependency injection
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.html
sourceHash: 296d4264883b31285fbc9d83134f21d1286b1c3e
keywords: ["dependency injection", "di container", "services.xml", "service argument", "constructor injection", "SystemConfigService", "Shopware\\Core\\System\\SystemConfig\\SystemConfigService", "core.basicInformation.shopName", "getString", "SalesChannelContext", "symfony service container", "inject service"]
summary: "Inject a service into a plugin service: add an argument type=service in services.xml and accept it in the constructor, e.g. SystemConfigService."
lastBuilt: 2026-09-15
---
## What it is

A short 6.6 plugin guide showing how to inject one service into another through the Symfony service container, using `SystemConfigService` injected into a custom `ExampleService` as the example.

## When to use

When a plugin service needs another Shopware or plugin service. Prerequisites: an existing plugin (Plugin Base Guide) and a working custom service (Adding a custom service guide). General background is in the Symfony service container documentation.

## Key steps / config

1. In `<plugin root>/src/Resources/config/services.xml` (standard Symfony container with the `services-1.0.xsd` schema), add an `argument` of `type="service"` whose `id` is the service to inject:

```xml
<services>
    <service id="Swag\BasicExample\Service\ExampleService">
        <argument type="service" id="Shopware\Core\System\SystemConfig\SystemConfigService"/>
    </service>
</services>
```

2. Accept the injected service as a constructor argument and store it in a property, in `<plugin root>/src/Service/ExampleService.php`:

```php
class ExampleService
{
    public function __construct(private SystemConfigService $systemConfigService) {}

    public function getShopname(SalesChannelContext $context): string
    {
        return $this->systemConfigService->getString('core.basicInformation.shopName', $context->getSalesChannel()->getId());
    }
}
```

(The source uses an explicit `private SystemConfigService $systemConfigService;` property assigned in the constructor; the effect is the same.)

Arguments are passed to the constructor in the order they are declared in `services.xml`.

## Essential identifiers

- `Shopware\Core\System\SystemConfig\SystemConfigService`
- `SystemConfigService::getString()`
- `core.basicInformation.shopName` (system config key)
- `Shopware\Core\System\SalesChannel\SalesChannelContext`
- `Swag\BasicExample\Service\ExampleService` (example service id)
