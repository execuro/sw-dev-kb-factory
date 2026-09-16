---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/how-to-extend-the-storefront.md
title: Extending the Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/how-to-extend-the-storefront.html
sourceHash: 4ec08eaba7b9de429b549a87158fe3ab2a859e8e
codeCheckedAgainst: "6.7.13.0"
keywords: ["TemplateNamespaceHierarchyBuilderInterface", "buildNamespaceHierarchy", "TemplateNamespaceHierarchyBuilder", "shopware.twig.hierarchy_builder", "BundleHierarchyBuilder", "TemplateFinder", "services.php", "template namespace hierarchy", "override b2b suite templates", "twig inheritance order", "tag priority"]
summary: Extend B2B Suite templates from another plugin by registering a TemplateNamespaceHierarchyBuilderInterface service tagged shopware.twig.hierarchy_builder.
lastBuilt: 2026-09-15
---
## What it is

To extend B2B Suite storefront templates from another plugin, the plugin registers its own template namespace hierarchy builder: a service implementing `Shopware\Core\Framework\Adapter\Twig\NamespaceHierarchy\TemplateNamespaceHierarchyBuilderInterface`, tagged `shopware.twig.hierarchy_builder`, which adds the plugin's namespace to the Twig template lookup chain.

## When to use

When your plugin's templates that extend B2B Suite templates are not picked up (wrong inheritance order) and you need to control where your plugin's namespace sits in the hierarchy.

## Key steps / config

1. Register the builder in the plugin's `src/Resources/config/services.php` with the tag and an explicit priority (the source suggests `750`, adjusting if problems occur):

```php
$services->set(TemplateNamespaceHierarchyBuilder::class)
    ->tag('shopware.twig.hierarchy_builder', ['priority' => 750]);
```

2. Implement the interface. In 6.7.13.0 the hierarchy passed in and returned is `array<string, int>` keyed by namespace (bundle) name; `TemplateFinder` only uses the keys. Add your plugin as a key, not as a list value:

```php
namespace MyPlugin\Framework\Adapter\Twig\NamespaceHierarchy;

use Shopware\Core\Framework\Adapter\Twig\NamespaceHierarchy\TemplateNamespaceHierarchyBuilderInterface;

class TemplateNamespaceHierarchyBuilder implements TemplateNamespaceHierarchyBuilderInterface
{
    public function buildNamespaceHierarchy(array $namespaceHierarchy): array
    {
        return array_merge($namespaceHierarchy, ['MyPlugin' => $priority]); // int priority
    }
}
```

Replace `MyPlugin` with your plugin name.

3. Builders run in sequence (chain of responsibility): each receives the previous builder's result. The core `BundleHierarchyBuilder` is tagged with priority `1000`. Services implementing the interface are also autoconfigured with the tag; set the tag explicitly when you need a priority.

## Essential identifiers

- `Shopware\Core\Framework\Adapter\Twig\NamespaceHierarchy\TemplateNamespaceHierarchyBuilderInterface`
- `TemplateNamespaceHierarchyBuilderInterface::buildNamespaceHierarchy(array $namespaceHierarchy): array`
- Tag `shopware.twig.hierarchy_builder` (priority attribute)
- `Shopware\Core\Framework\Adapter\Twig\NamespaceHierarchy\BundleHierarchyBuilder` (core builder, priority 1000)
- `TemplateFinder`

## Gotchas

- The source's sample returns `array_merge($namespaceHierarchy, ['MyPlugin'])`, which adds an integer key `0` with value `MyPlugin`. Since `TemplateFinder` reduces the hierarchy with `array_keys()`, that would register a namespace named `0`, not `MyPlugin`.
- Per the interface docblock, lower integer values mean higher precedence after sorting; the values are otherwise discarded. `Bundle::getTemplatePriority()` defaults to `0`.
- The tag priority (`750` in the source) is the part to tune if inheritance does not work.
- The aggregating `NamespaceHierarchyBuilder` is deprecated (becomes internal in v6.8.0); do not depend on it directly.

## Code check (6.7.13.0)
- confirmed `TemplateNamespaceHierarchyBuilderInterface` — installed interface in core Twig adapter — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/TemplateNamespaceHierarchyBuilderInterface.php:8
- corrected `TemplateNamespaceHierarchyBuilderInterface::buildNamespaceHierarchy()` — docs: append list value `['MyPlugin']`; code takes/returns `array<string, int>` keyed by namespace — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/TemplateNamespaceHierarchyBuilderInterface.php:42
- confirmed `shopware.twig.hierarchy_builder` — consumed as tagged_iterator — vendor/shopware/core/Framework/DependencyInjection/services.xml:394
- confirmed `BundleHierarchyBuilder` — core builder tagged priority 1000 — vendor/shopware/core/Framework/DependencyInjection/services.xml:398
- confirmed `shopware.twig.hierarchy_builder` — autoconfigured for interface implementations — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:182
- confirmed `TemplateFinder::getNamespaceHierarchy()` — uses only array_keys of the hierarchy — vendor/shopware/core/Framework/Adapter/Twig/TemplateFinder.php:136
- confirmed `Bundle::getTemplatePriority()` — default returns 0 — vendor/shopware/core/Framework/Bundle.php:108
- deprecated `NamespaceHierarchyBuilder` — becomes internal in v6.8.0 — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/NamespaceHierarchyBuilder.php:8
- unverified `priority` — tagged_iterator ordering by priority is Symfony DI behavior, out of scope
