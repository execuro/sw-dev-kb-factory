---
id: platform/dev/6.7/guides/plugins/plugins/content/cms/add-data-to-cms-elements.md
title: Add Data to CMS Element
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-data-to-cms-elements.html
sourceHash: 7b57053968e28ba7731f36e5849f702d7a816a3e
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractCmsElementResolver", "CmsElementResolverInterface", "shopware.cms.data_resolver", "CriteriaCollection", "ElementDataCollection", "ResolverContext", "EntityResolverContext", "CmsSlotsDataResolveExtension", "CmsSlotsDataCollectExtension", "CmsSlotsDataEnrichExtension", "cms-slots-data.resolve.pre", "cms data resolver", "shopping experiences element data", "custom cms element"]
summary: Resolve entity or external data for a custom CMS element via an AbstractCmsElementResolver (collect/enrich), plus cms-slots-data extension events.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md"]
---
## What it is

How to load complex data (entities such as media or products, or external API data) into a custom CMS element by writing a CMS element resolver, and how to hook into the CMS slot resolution pipeline through the three CMS extension points.

## When to use

A custom CMS element (see [Add CMS element](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md)) stores more than scalar config, e.g. a media ID, and the storefront needs the loaded entity; or you need to change entity data before built-in resolvers copy it into CMS slots.

## Key steps / config

1. Create a class extending `Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver`. It implements `CmsElementResolverInterface`, so declare `getType()`, `collect()` and `enrich()`:

```php
class DailyMotionCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string { return 'dailymotion'; }
    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection { /* ... */ }
    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void { /* ... */ }
}
```

`getType()` must return the CMS element name; the resolver is called for every slot of that type.

2. Register it with the tag `shopware.cms.data_resolver` (`$services->set(DailyMotionCmsElementResolver::class)->tag('shopware.cms.data_resolver');`).
3. `collect`: read config via `$slot->getFieldConfig()->get('myCustomMedia')`, build `new Criteria([$mediaId])`, and call `$criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, $criteria)`. Return `null` when there is nothing to load. For an attribute entity (no definition class), pass `example_entity.definition` as the second argument.
4. `enrich`: use the loaded results or other logic, then `$slot->setData(...)` — the argument must be a `Struct`.
5. To alter entity data before resolvers copy it, subscribe to `cms-slots-data.resolve.pre` (event object `CmsSlotsDataResolveExtension`). Read the context via the public readonly property `$event->resolverContext`; only an `EntityResolverContext` has `getEntity()`, so check for it before calling it, then modify e.g. a `ProductEntity`.

## Essential identifiers

- `Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver`
- `Shopware\Core\Content\Cms\DataResolver\CriteriaCollection::add(string $key, string $definition, Criteria $criteria)`
- `Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext`, `EntityResolverContext`
- `shopware.cms.data_resolver`
- `Shopware\Core\Content\Cms\Extension\CmsSlotsDataCollectExtension` (`cms-slots-data.collect`)
- `Shopware\Core\Content\Cms\Extension\CmsSlotsDataEnrichExtension` (`cms-slots-data.enrich`)
- `Shopware\Core\Content\Cms\Extension\CmsSlotsDataResolveExtension` (`cms-slots-data.resolve`)

## Gotchas

- Resolvers copy entity values into CMS structs; changing the entity in a later event such as `ProductPageLoadedEvent` has no effect on CMS output. Intervene via the `.pre`/`.post` extension hooks.
- The docs' subscriber calls `$event->getResolverContext()` and `$resolverContext->getEntity()`; the extension classes expose a public `resolverContext` property (no getter), and `getEntity()` exists only on `EntityResolverContext`.
- `CriteriaCollection::add()` throws on a duplicate key — make keys unique per slot (e.g. with the slot's unique identifier).

## Code check (6.7.13.0)
- confirmed `CmsElementResolverInterface::getType()` — collect()/enrich() declared alongside; AbstractCmsElementResolver implements it — vendor/shopware/core/Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:13
- confirmed `shopware.cms.data_resolver` — tag used by core resolvers — vendor/shopware/core/Content/DependencyInjection/product.xml:252
- confirmed `CriteriaCollection::add()` — key, definition string, Criteria; duplicate key throws — vendor/shopware/core/Content/Cms/DataResolver/CriteriaCollection.php:25
- confirmed `CmsSlotsDataCollectExtension::NAME` — value cms-slots-data.collect — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataCollectExtension.php:27
- confirmed `CmsSlotsDataEnrichExtension::NAME` — value cms-slots-data.enrich — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataEnrichExtension.php:30
- confirmed `CmsSlotsDataResolveExtension::NAME` — value cms-slots-data.resolve — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataResolveExtension.php:25
- confirmed `.pre` — ExtensionDispatcher appends .pre/.post to the extension name — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:25
- corrected `CmsSlotsDataResolveExtension::$resolverContext` — docs: $event->getResolverContext() getter — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataResolveExtension.php:44
- corrected `EntityResolverContext::getEntity()` — docs: called on plain ResolverContext — vendor/shopware/core/Content/Cms/DataResolver/ResolverContext/EntityResolverContext.php:23
- confirmed `CmsSlotEntity::setData()` — accepts a Struct — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotEntity.php:127
