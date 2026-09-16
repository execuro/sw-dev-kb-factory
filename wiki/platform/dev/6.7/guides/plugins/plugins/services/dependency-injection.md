---
id: platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
title: Dependency Injection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/services/dependency-injection.html
sourceHash: cfd9889ad50073d4d89bfc9a322146bada3aca68
codeCheckedAgainst: "6.7.13.0"
keywords: ["dependency injection", "SystemConfigService", "services.php", "constructor injection", "autowire", "autoconfigure", "ContainerConfigurator", "service()", "args", "core.basicInformation.shopName", "getString", "SalesChannelContext", "di container"]
summary: Inject a service (e.g. SystemConfigService) into a plugin service via constructor; autowiring or explicit args([service(...)]) in services.php.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to inject one service into another in a Shopware plugin using the Symfony service container. The example injects `Shopware\Core\System\SystemConfig\SystemConfigService` into a custom `ExampleService` (`Swag\BasicExample\Service\ExampleService`).

## When to use

You already have a working plugin service (see [Add Custom Service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md), built on the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and it needs another service, for example system config access to read the shop name for a sales channel.

## Key steps / config

1. Add the dependency as a constructor parameter (constructor property promotion) in `<plugin root>/src/Service/ExampleService.php`:

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

2. Wire it, depending on how the service is registered in `<plugin root>/src/Resources/config/services.php`:
   - **Autowire/autoconfigure**: if `services.php` already declares `autowire` and `autoconfigure`, nothing else is needed; `SystemConfigService` is injected automatically.
   - **Explicit declaration**: add the dependency as an argument using the `service()` helper:

```php
use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

return static function (ContainerConfigurator $configurator): void {
    $services = $configurator->services();
    $services->set(ExampleService::class)
        ->args([service(SystemConfigService::class)]);
};
```

The installed bundle base class loads every `Resources/config/services.*` file of the plugin, so a PHP configurator file `services.php` is picked up by the PHP file loader.

## Essential identifiers

- `Shopware\Core\System\SystemConfig\SystemConfigService` — `getString(string $key, ?string $salesChannelId = null): string`
- `Shopware\Core\System\SalesChannel\SalesChannelContext` — `getSalesChannel()`
- `Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator`
- `Symfony\Component\DependencyInjection\Loader\Configurator\service`
- Config key `core.basicInformation.shopName`
- File `src/Resources/config/services.php`

## Code check (6.7.13.0)
- confirmed `SystemConfigService` — class exists in core — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:30
- confirmed `SystemConfigService::getString()` — signature `(string $key, ?string $salesChannelId = null): string` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:86
- confirmed `SalesChannelContext::getSalesChannel()` — returns SalesChannelEntity — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:95
- confirmed `core.basicInformation.shopName` — read via getString in core — vendor/shopware/core/Content/Cms/Service/CmsFormSlotConfigResolver.php:46
- confirmed `services.*` — Bundle loads every Resources/config/services.* file — vendor/shopware/core/Framework/Bundle.php:222
- confirmed `PhpFileLoader` — PHP service config loader used for bundle service files — vendor/shopware/core/Framework/Bundle.php:218
- unverified `ContainerConfigurator` — vendor/symfony, out of scope
