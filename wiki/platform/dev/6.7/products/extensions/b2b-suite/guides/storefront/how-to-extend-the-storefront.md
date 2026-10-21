---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/how-to-extend-the-storefront.md
title: Extending the Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/how-to-extend-the-storefront.html
sourceHash: 4ec08eaba7b9de429b549a87158fe3ab2a859e8e
codeCheckedAgainst: "6.7.15.1"
keywords: ["TemplateNamespaceHierarchyBuilderInterface", "TemplateNamespaceHierarchyBuilder", "buildNamespaceHierarchy", "shopware.twig.hierarchy_builder", "BundleHierarchyBuilder", "services.php", "b2b suite", "template inheritance", "twig namespace", "override b2b templates", "priority 750"]
summary: Extend B2B Suite storefront templates from another plugin by tagging a TemplateNamespaceHierarchyBuilder with shopware.twig.hierarchy_builder.
lastBuilt: 2026-10-21
---
## What it is

To let a plugin extend the B2B Suite's storefront templates, the plugin registers its own Twig namespace hierarchy builder: a class implementing `Shopware\Core\Framework\Adapter\Twig\NamespaceHierarchy\TemplateNamespaceHierarchyBuilderInterface`, tagged `shopware.twig.hierarchy_builder` with a chosen priority so the plugin's namespace lands in the right place relative to the B2B Suite.

## When to use

When templates of your plugin should extend or override B2B Suite templates and the default bundle ordering does not put your plugin's namespace where it needs to be.

## Key steps / config

1. Create the builder (replace `MyPlugin` with your plugin name):

```php
namespace MyPlugin\Framework\Adapter\Twig\NamespaceHierarchy;

use Shopware\Core\Framework\Adapter\Twig\NamespaceHierarchy\TemplateNamespaceHierarchyBuilderInterface;

class TemplateNamespaceHierarchyBuilder implements TemplateNamespaceHierarchyBuilderInterface
{
    public function buildNamespaceHierarchy(array $namespaceHierarchy): array
    {
        return array_merge($namespaceHierarchy, ['MyPlugin']);
    }
}
```

2. Register it in `<plugin root>/src/Resources/config/services.php`:

```php
$services->set(TemplateNamespaceHierarchyBuilder::class)
    ->tag('shopware.twig.hierarchy_builder', ['priority' => 750]);
```

The priority matters most. `750` works for most cases; if template resolution is wrong, adjust it. Core's `BundleHierarchyBuilder` is tagged with priority `1000`, so a builder at `750` is called after it and receives the hierarchy that builder produced.

## Essential identifiers

- `TemplateNamespaceHierarchyBuilderInterface::buildNamespaceHierarchy(array $namespaceHierarchy): array`
- tag `shopware.twig.hierarchy_builder` (attribute `priority`)
- `BundleHierarchyBuilder` (core builder, priority `1000`)

## Gotchas

- The interface documents the hierarchy as `array<string, int>`: namespace name as key, an ordering value as value (lower value means higher precedence). The docs' `array_merge($namespaceHierarchy, ['MyPlugin'])` appends `MyPlugin` as a value under a numeric key rather than as a key; check the resulting order if templates do not resolve as expected.
- Implementing the interface already autoconfigures the `shopware.twig.hierarchy_builder` tag, but without a priority; set the tag explicitly to control ordering.

## Code check (6.7.15.1)
- confirmed `TemplateNamespaceHierarchyBuilderInterface` — interface exists at the documented namespace — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/TemplateNamespaceHierarchyBuilderInterface.php:8
- corrected `TemplateNamespaceHierarchyBuilderInterface::buildNamespaceHierarchy()` — docs: append a plain list entry; interface documents array<string, int> keyed by namespace — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/TemplateNamespaceHierarchyBuilderInterface.php:40
- confirmed `shopware.twig.hierarchy_builder` — tagged services are collected via tagged_iterator — vendor/shopware/core/Framework/DependencyInjection/services.php:578
- confirmed `BundleHierarchyBuilder` — core builder tagged with priority 1000 — vendor/shopware/core/Framework/DependencyInjection/services.php:44
- confirmed `NamespaceHierarchyBuilder` — calls each tagged builder in sequence, passing the previous result — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/NamespaceHierarchyBuilder.php:10
- confirmed `TemplateNamespaceHierarchyBuilderInterface` — autoconfiguration adds the tag automatically, without priority — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:182
