---
id: platform/dev/6.6/guides/plugins/plugins/content/cms/add-data-to-cms-elements.md
title: Add data to CMS element
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/cms/add-data-to-cms-elements.html"
sourceHash: "4dcb3a0a2500aef058509b2966ba7f872a0a2469"
keywords: ["CmsElementResolver", "AbstractCmsElementResolver", "shopware.cms.data_resolver", "CriteriaCollection", "collect", "enrich", "getType", "CmsSlotEntity", "ResolverContext", "getFieldConfig", "setData"]
summary: "Explains implementing a custom AbstractCmsElementResolver to resolve complex CMS element config data like media/product entities."
lastBuilt: "2026-09-15"
---
## What it is
Explains implementing a custom `CmsElementResolver` to resolve complex configuration data (e.g. entity references) for a custom CMS element during loading, beyond simple text/boolean values.

## When to use
Needed when a CMS element's configuration stores something like a media or product entity ID (or requires an external API call) that must be resolved into real data before rendering.

## Key steps / config
1. Extend `Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver` and implement `getType()`, `collect()`, and `enrich()`.
```php
class DailyMotionCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string { return 'dailymotion'; }
    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection { }
    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void { }
}
```
2. `getType()` must return the element's technical name (must match the name used when registering the CMS element) — the resolver is invoked for every slot of that type.
3. Register the resolver in `services.xml` tagged `shopware.cms.data_resolver`:
```xml
<service id="Swag\BasicExample\DataResolver\DailyMotionCmsElementResolver">
    <tag name="shopware.cms.data_resolver" />
</service>
```
4. `collect()` reads the slot's field config via `$slot->getFieldConfig()->get('<key>')`, builds a `CriteriaCollection`, and adds a `Criteria` for referenced entities (e.g. `MediaDefinition::class`) keyed by a unique name derived from `$slot->getUniqueIdentifier()`.
5. `enrich()` also reads field config via `getFieldConfig()`, may perform additional logic (e.g. an external API call), and attaches results to the slot via `$slot->setData($response)`.

## Essential identifiers
- `Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver`
- `Shopware\Core\Content\Cms\DataResolver\CriteriaCollection`
- `Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity` (`getFieldConfig()`, `getUniqueIdentifier()`, `setData()`)
- `Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext`
- Tag `shopware.cms.data_resolver`
