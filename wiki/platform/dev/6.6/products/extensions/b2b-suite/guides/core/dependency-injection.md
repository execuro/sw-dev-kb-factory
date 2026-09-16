---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/dependency-injection.md
title: Dependency injection
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/dependency-injection.html"
sourceHash: "5bfefc70f30515d2d982d6d98eaa8b301177310f"
keywords: ["dependency injection", "DIC", "DependencyInjectionConfiguration", "B2BContainerBuilder", "getServiceFiles", "getCompilerPasses", "getDependingConfigurations", "service tags", "b2b suite", "symfony dic", "service decoration"]
summary: "The B2B Suite initializes its Symfony DIC per component via DependencyInjectionConfiguration and B2BContainerBuilder."
lastBuilt: "2026-09-15"
---
## What it is

Explains how the B2B Suite registers its services with Symfony's dependency injection container (DIC), building on the Shopware plugin DIC guide and the Service Decoration extension point.

## Key steps / config

- The B2B Suite provides an abstract `DependencyInjectionConfiguration` class used throughout the Suite to initialize DI contents per component:

```php
namespace Shopware\B2B\Common;

abstract class DependencyInjectionConfiguration
{
    abstract public function getServiceFiles(): array;
    abstract public function getCompilerPasses(): array;
    abstract public function getDependingConfigurations(): array;
}
```

- Every component's macro layer defines its own dependencies, so requiring the components you need causes every other dependency to be injected automatically.
- To enable a component (e.g. the contact component) in a custom plugin's `build()`:

```php
public function build(ContainerBuilder $container)
{
    $containerBuilder = B2BContainerBuilder::create();
    $containerBuilder->addConfiguration(new ContactFrameworkConfiguration());
    $containerBuilder->registerConfigurations($container);
}
```

- The B2B Suite also heavily uses Symfony service tags as a modern replacement for collect events, to let custom logic extend central B2B services (see the example plugins for usage).

## Essential identifiers

- `Shopware\B2B\Common\DependencyInjectionConfiguration`
- `Shopware\B2B\Common\B2BContainerBuilder`
- `getServiceFiles()` / `getCompilerPasses()` / `getDependingConfigurations()`
- `B2BContainerBuilder::create()` / `addConfiguration()` / `registerConfigurations()`
