---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/how-to-extend-the-storefront.md
title: Extending the Storefront
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/storefront/how-to-extend-the-storefront.html"
sourceHash: 08cb7fcaa2091f5ec2bfda844b391d7616bb2fb1
keywords: ["extending the storefront", "b2b suite", "TemplateNamespaceHierarchyBuilder", "shopware.twig.hierarchy_builder", "buildNamespaceHierarchy", "TemplateNamespaceHierarchyBuilderInterface", "services.xml", "twig namespace", "template priority"]
summary: "Extend B2B Suite templates from another plugin by registering a tagged TemplateNamespaceHierarchyBuilder service."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to extend B2B Suite templates from another plugin by registering a `TemplateNamespaceHierarchyBuilder` service.

## Key steps / config
Tag the builder service in the plugin's `services.xml`:

```xml
<services>
    <service id="MyPlugin\Framework\Adapter\Twig\NamespaceHierarchy\TemplateNamespaceHierarchyBuilder">
        <tag name="shopware.twig.hierarchy_builder" priority="750"/>
    </service>
</services>
```

The `priority` value matters; `750` works for most cases but may need adjusting. Implement `Shopware\Core\Framework\Adapter\Twig\NamespaceHierarchy\TemplateNamespaceHierarchyBuilderInterface`:

```php
class TemplateNamespaceHierarchyBuilder implements TemplateNamespaceHierarchyBuilderInterface
{
    public function buildNamespaceHierarchy(array $namespaceHierarchy): array
    {
        return array_merge($namespaceHierarchy, ['MyPlugin']);
    }
}
```

## Essential identifiers
- `shopware.twig.hierarchy_builder` tag
- `Shopware\Core\Framework\Adapter\Twig\NamespaceHierarchy\TemplateNamespaceHierarchyBuilderInterface`
- `buildNamespaceHierarchy()`
