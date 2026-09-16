---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/dependency-injection.md
title: Dependency injection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/dependency-injection.html
sourceHash: 09df7330310f7a29dac0544cd78038e8a82dc210
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "dependency injection", "DependencyInjectionConfiguration", "B2BContainerBuilder", "ContactFrameworkConfiguration", "getServiceFiles", "getCompilerPasses", "getDependingConfigurations", "registerConfigurations", "service tags", "dic", "service container"]
summary: "B2B Suite DI: abstract DependencyInjectionConfiguration per component, B2BContainerBuilder in the plugin build() method, and service tags as extension points."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

How the B2B Suite registers its services with the Symfony dependency injection container: each component provides a `DependencyInjectionConfiguration` that declares its service files, compiler passes and dependent configurations, and a plugin enables components through `B2BContainerBuilder`.

## When to use

When a plugin needs to enable B2B Suite components, or extend central B2B services via service decoration or service tags. Basic DIC usage is covered in [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md); service decoration in [adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

1. Every macro layer of every component defines its own dependencies by extending the abstract `Shopware\B2B\Common\DependencyInjectionConfiguration`:

```php
abstract class DependencyInjectionConfiguration
{
    /** @return string[] array of service xml files */
    abstract public function getServiceFiles(): array;
    /** @return CompilerPassInterface[] */
    abstract public function getCompilerPasses(): array;
    /** @return DependencyInjectionConfiguration[] child components */
    abstract public function getDependingConfigurations(): array;
}
```

2. Require only the top-level components you want; their dependencies are added automatically. In the plugin's `build(ContainerBuilder $container)` method:

```php
$containerBuilder = B2BContainerBuilder::create();
$containerBuilder->addConfiguration(new ContactFrameworkConfiguration());
$containerBuilder->registerConfigurations($container);
```

`ContactFrameworkConfiguration` is `Shopware\B2B\Contact\Framework\DependencyInjection\ContactFrameworkConfiguration`; the builder is `Shopware\B2B\Common\B2BContainerBuilder`.

3. In Shopware 6.7 the plugin base class is `Shopware\Core\Framework\Plugin`, whose inherited `build()` is declared `build(ContainerBuilder $container): void` — an override must keep the `void` return type.
4. Extend central B2B services via Symfony service tags (used instead of collect events) or service decoration; the example plugins show the tag usage.

## Essential identifiers

- `Shopware\B2B\Common\DependencyInjectionConfiguration` (`getServiceFiles()`, `getCompilerPasses()`, `getDependingConfigurations()`)
- `Shopware\B2B\Common\B2BContainerBuilder` (`create()`, `addConfiguration()`, `registerConfigurations()`)
- `Shopware\B2B\Contact\Framework\DependencyInjection\ContactFrameworkConfiguration`
- `Shopware\Core\Framework\Plugin`, `build(ContainerBuilder $container): void`

## Gotchas

- The source's plugin example extends `Shopware\Components\Plugin` (a Shopware 5 class) and declares `build()` without a return type; neither matches the installed 6.7 core, where the base is `Shopware\Core\Framework\Plugin` and `build()` returns `void`.

## Code check (6.7.13.0)
- corrected `Plugin` — docs: `Shopware\Components\Plugin`; installed base is `Shopware\Core\Framework\Plugin` — vendor/shopware/core/Framework/Plugin.php:17
- corrected `build` — docs: `build(ContainerBuilder $container)` without return type; code returns `void` — vendor/shopware/core/Framework/Bundle.php:34
- unverified `Shopware\B2B\Common\DependencyInjectionConfiguration` — B2B Suite class, not in vendor/shopware core/storefront/administration
- unverified `Shopware\B2B\Common\B2BContainerBuilder` — B2B Suite class, out of scope of installed packages
- unverified `ContactFrameworkConfiguration` — B2B Suite class, out of scope
- unverified `CompilerPassInterface` — vendor/symfony, out of scope
