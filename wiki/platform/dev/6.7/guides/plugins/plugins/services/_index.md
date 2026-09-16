---
id: platform/dev/6.7/guides/plugins/plugins/services/_index.md
title: Services
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/services/
sourceHash: 95dcf36ce258514ee3bcf124a755680038601dc1
codeCheckedAgainst: "6.7.13.0"
keywords: ["services", "service layer", "dependency injection", "DI container", "service decoration", "decorator", "add custom service", "adjusting a service", "services.php", "getDecorated", "plugin services", "symfony container"]
summary: Index of plugin service guides - registering a custom service, dependency injection, and changing core behavior via service decoration.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

Section index for the service layer of Shopware plugin development. Services hold reusable plugin logic, dependency injection wires services together, and service decoration lets a plugin change the behavior of an existing Shopware service.

## When to use

Pick the child guide matching the task:

- Register reusable plugin logic as a service: [Add Custom Service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md)
- Inject Shopware or plugin services into another service: [Dependency Injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)
- Change the behavior of an existing Shopware service: [Adjusting a Service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)

## Key steps / config

- Service definitions live in the plugin's `src/Resources/config/services.php` (Symfony `ContainerConfigurator`); the Shopware `Bundle` base class loads every `Resources/config/services.*` file it finds (plus `services_test.*` in the test environment).
- Decoratable core services usually expose an abstract class with an abstract `getDecorated()` method; the base implementation throws `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`, and a decorator registered with `->decorate(...)` and `service('.inner')` returns the inner service from it.

## Essential identifiers

- `src/Resources/config/services.php`
- `getDecorated()`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`

## Code check (6.7.13.0)
- confirmed `services.*` — Bundle loads Resources/config/services.* via xml/yaml/php loaders — vendor/shopware/core/Framework/Bundle.php:222
- confirmed `services_test.*` — loaded additionally in the test environment — vendor/shopware/core/Framework/Bundle.php:227
- confirmed `DecorationPatternException` — thrown by base class getDecorated() — vendor/shopware/core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `AbstractProductDetailRoute::getDecorated()` — core example of an abstract decoratable contract — vendor/shopware/core/Content/Product/SalesChannel/Detail/AbstractProductDetailRoute.php:13
- confirmed `DecorationPatternException` — ProductDetailRoute base throws it from getDecorated() — vendor/shopware/core/Content/Product/SalesChannel/Detail/ProductDetailRoute.php:81
