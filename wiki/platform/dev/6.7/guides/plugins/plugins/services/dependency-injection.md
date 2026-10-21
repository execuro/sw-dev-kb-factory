---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md
sourceHash: cfd9889ad50073d4d89bfc9a322146bada3aca68
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/services/dependency-injection.html
title: Dependency Injection
version: "6.7"
versions:
  - "6.7"
keywords: ["dependency injection", "constructor injection", "SystemConfigService", "services.php", "args", "service()", "autowire", "autoconfigure", "ExampleService", "inject service", "DI", "core.basicInformation.shopName"]
summary: "Inject a service (e.g. SystemConfigService) into a plugin service via constructor parameter, autowired or explicitly with ->args([service(...)])."
lastBuilt: 2026-10-21
---
## What it is

How to inject one service into another in a plugin, using constructor injection and the Symfony DI container. The example injects `Shopware\Core\System\SystemConfig\SystemConfigService` into `ExampleService`.

## When to use

A plugin service needs another Shopware or plugin service. Requires a registered service — see [Add Custom Service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md); builds on the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Key steps / config

1. Add the dependency as a constructor parameter:
   ```php
   class ExampleService
   {
       public function __construct(
           private SystemConfigService $systemConfigService
       ) {
       }

       public function getShopname(SalesChannelContext $context): string
       {
           return $this->systemConfigService->getString('core.basicInformation.shopName', $context->getSalesChannel()->getId());
       }
   }
   ```
2. Wire it in `src/Resources/config/services.php`:
   - **Autowire/autoconfigure** already enabled via `->defaults()->autowire()->autoconfigure()`: nothing else to do; the dependency is injected automatically.
   - **Explicit declaration**: pass the argument yourself:
     ```php
     use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

     $services->set(ExampleService::class)
         ->args([service(SystemConfigService::class)]);
     ```

## Essential identifiers

- `Shopware\Core\System\SystemConfig\SystemConfigService`, `getString()`
- `Shopware\Core\System\SalesChannel\SalesChannelContext`
- `Symfony\Component\DependencyInjection\Loader\Configurator\service`
- `->args([...])`
- Config key `core.basicInformation.shopName`

## Code check (6.7.15.1)
- confirmed `SystemConfigService::getString()` — `getString(string $key, ?string $salesChannelId = null): string` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:87
- confirmed `SystemConfigService` — service class in `Shopware\Core\System\SystemConfig` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:31
- confirmed `shopName` — field of the `core.basicInformation` config domain — vendor/shopware/core/System/Resources/config/basicInformation.xml:9
- confirmed `services.*` — plugin `Resources/config/services.*` files are loaded into the container — vendor/shopware/core/Framework/Bundle.php:238
- unverified `service()` — Symfony configurator function, vendor/symfony out of scope
