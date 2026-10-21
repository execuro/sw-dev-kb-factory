---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/dependency-injection.md
title: Dependency injection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/dependency-injection.html
sourceHash: 09df7330310f7a29dac0544cd78038e8a82dc210
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "dependency injection", "DIC", "DependencyInjectionConfiguration", "B2BContainerBuilder", "addConfiguration", "registerConfigurations", "ContactFrameworkConfiguration", "getServiceFiles", "getCompilerPasses", "getDependingConfigurations", "service tags", "service decoration"]
summary: B2B Suite DI - DependencyInjectionConfiguration per component and B2BContainerBuilder registration in a plugin's build() method; service tags.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

How the B2B Suite registers its services in the Symfony dependency injection container (DIC): each component ships a `DependencyInjectionConfiguration` that declares its service files, compiler passes and depending components, and a plugin activates components through `B2BContainerBuilder`. See [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) and [service decoration](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md), an equally important extension point.

## When to use

When a plugin needs B2B Suite components (e.g. contacts) wired into the container, or when extending central B2B services via tags.

## Key steps / config

The abstract base `Shopware\B2B\Common\DependencyInjectionConfiguration` is the initializer of DI contents for every component:

```php
abstract class DependencyInjectionConfiguration
{
    /** @return string[] array of service xml files */
    abstract public function getServiceFiles(): array;
    /** @return CompilerPassInterface[] */
    abstract public function getCompilerPasses(): array;
    /** @return DependencyInjectionConfiguration[] child components required by this component */
    abstract public function getDependingConfigurations(): array;
}
```

Every macro layer of a component defines its own dependencies, so you require only the top-most components you use; everything else is injected automatically. Enable a component in your plugin's `build()` (Shopware 6.7 plugin base `Shopware\Core\Framework\Plugin`, whose `build()` returns `void`):

```php
use Shopware\B2B\Common\B2BContainerBuilder;
use Shopware\B2B\Contact\Framework\DependencyInjection\ContactFrameworkConfiguration;
use Shopware\Core\Framework\Plugin;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class MyB2bPlugin extends Plugin
{
    public function build(ContainerBuilder $container): void
    {
        parent::build($container);
        $containerBuilder = B2BContainerBuilder::create();
        $containerBuilder->addConfiguration(new ContactFrameworkConfiguration());
        $containerBuilder->registerConfigurations($container);
    }
}
```

The B2B Suite also uses Symfony service tags heavily as a replacement for collect events to extend central B2B services with custom logic; the example plugins show the usage.

## Essential identifiers

- `Shopware\B2B\Common\DependencyInjectionConfiguration` (`getServiceFiles`, `getCompilerPasses`, `getDependingConfigurations`)
- `Shopware\B2B\Common\B2BContainerBuilder` (`create`, `addConfiguration`, `registerConfigurations`)
- `Shopware\B2B\Contact\Framework\DependencyInjection\ContactFrameworkConfiguration`
- `Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface`

## Gotchas

- The source snippet extends `Shopware\Components\Plugin` and declares `build()` without a return type; that class does not exist in Shopware 6.7 (it is the Shopware 5 base). Use `Shopware\Core\Framework\Plugin`, whose inherited `build(ContainerBuilder $container): void` registers the plugin's own container files, migrations, filesystems and events - call `parent::build()` to keep that.

## Code check (6.7.15.1)
- absent `Shopware\Components\Plugin` — not found anywhere in the installed code
- confirmed `Shopware\Core\Framework\Plugin` — abstract plugin base extends Bundle — vendor/shopware/core/Framework/Plugin.php:17
- corrected `Bundle::build()` — docs: build(ContainerBuilder $container) without return type, no parent call — vendor/shopware/core/Framework/Bundle.php:35
- confirmed `Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface` — used by core compiler passes — vendor/shopware/core/Framework/MessageQueue/MessageHandlerCompilerPass.php:6
- unverified `Shopware\B2B\Common\DependencyInjectionConfiguration` — B2B Suite plugin code, not in the installed core/storefront/administration packages
- unverified `Shopware\B2B\Common\B2BContainerBuilder` — B2B Suite plugin code, out of scope
- unverified `Shopware\B2B\Contact\Framework\DependencyInjection\ContactFrameworkConfiguration` — B2B Suite plugin code, out of scope
