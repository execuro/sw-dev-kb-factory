---
id: platform/dev/6.7/guides/plugins/plugins/content/cms/add-data-to-cms-elements.md
title: Add Data to CMS Element
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-data-to-cms-elements.html
sourceHash: 7b57053968e28ba7731f36e5849f702d7a816a3e
codeCheckedAgainst: "6.7.15.1"
keywords: ["cms data resolver", "AbstractCmsElementResolver", "CmsElementResolverInterface", "shopware.cms.data_resolver", "CriteriaCollection", "ResolverContext", "EntityResolverContext", "ElementDataCollection", "CmsSlotsDataResolveExtension", "cms-slots-data.resolve.pre", "getFieldConfig", "collect", "enrich", "element data"]
summary: Load entity or API data into a custom CMS element via AbstractCmsElementResolver, and intercept cms-slots-data.* extension points.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md"]
---
## What it is

How to load complex data (media, products, other entities, external API data) into a custom CMS element's slot on the server side, using a CMS element resolver, and how to intercept the slot resolution pipeline via CMS extension points. Builds on the `dailymotion` element from [Add CMS element](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md).

## When to use

When an element's config stores IDs or payloads that must be turned into entities or fetched data before Storefront rendering, or when a plugin must alter entity values before built-in resolvers copy them into CMS slots.

## Key steps / config

1. Create a resolver extending `Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver` (which implements `CmsElementResolverInterface`):

```php
class DailyMotionCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string { return 'dailymotion'; }
    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection { /* ... */ }
    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void { /* ... */ }
}
```

`getType()` returns the element `name`; the resolver runs for every slot of that type.

2. Register it in `src/Resources/config/services.php`: `$services->set(DailyMotionCmsElementResolver::class)->tag('shopware.cms.data_resolver');` (the tag is also autoconfigured for any `CmsElementResolverInterface` service).
3. `collect()`: read config with `$slot->getFieldConfig()->get('myCustomMedia')`, take `->getValue()`, and return a `CriteriaCollection` — `$criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, new Criteria([$mediaId]))`. Return `null` when nothing must be loaded. For an attribute entity (no definition class) the docs pass `example_entity.definition` as the second argument.
4. `enrich()`: use the loaded results or other logic, then `$slot->setData(...)` — the argument must be a `Struct`.
5. Extension points under `Shopware\Core\Content\Cms\Extension` (dispatched with `.pre`/`.post` suffixes): `CmsSlotsDataCollectExtension` (`cms-slots-data.collect`), `CmsSlotsDataEnrichExtension` (`cms-slots-data.enrich`), `CmsSlotsDataResolveExtension` (`cms-slots-data.resolve`). Subscriber shape:

```php
public static function getSubscribedEvents(): array
{
    return ['cms-slots-data.resolve.pre' => 'onCmsSlotsResolvePre'];
}

public function onCmsSlotsResolvePre(CmsSlotsDataResolveExtension $event): void
{
    $context = $event->resolverContext;
    if ($context instanceof EntityResolverContext && $context->getEntity() instanceof ProductEntity) { /* modify */ }
}
```

## Essential identifiers

- `AbstractCmsElementResolver`, `CmsElementResolverInterface`, `getType()`, `collect()`, `enrich()`
- `shopware.cms.data_resolver`
- `CriteriaCollection::add()`, `ElementDataCollection`, `ResolverContext`, `EntityResolverContext`
- `CmsSlotEntity::getFieldConfig()`, `CmsSlotEntity::setData()`
- `CmsSlotsDataCollectExtension`, `CmsSlotsDataEnrichExtension`, `CmsSlotsDataResolveExtension`

## Gotchas

- CMS elements are not live-bound to entities: resolvers (e.g. `ProductNameCmsElementResolver`) copy values into CMS structs. Changing the entity in a later page-loaded event (e.g. `ProductPageLoadedEvent`) has no visible effect — modify it in the CMS resolution pipeline instead.
- The docs' subscriber calls `$event->getResolverContext()` and `$resolverContext->getEntity()`. In the installed code the extension exposes a public readonly `$resolverContext` property, and `getEntity()` exists only on `EntityResolverContext`.
- `CriteriaCollection::add()` throws on a duplicate key — make keys unique per slot (hence `getUniqueIdentifier()`).

## Code check (6.7.15.1)
- confirmed `CmsElementResolverInterface` — declares `getType()`, `collect()`, `enrich()` with the documented signatures — vendor/shopware/core/Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:11
- confirmed `AbstractCmsElementResolver` — abstract, implements the interface — vendor/shopware/core/Content/Cms/DataResolver/Element/AbstractCmsElementResolver.php:22
- confirmed `shopware.cms.data_resolver` — autoconfigured for resolver implementations — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:151
- confirmed `CriteriaCollection::add()` — `(string $key, string $definition, Criteria $criteria)`, duplicate key throws — vendor/shopware/core/Content/Cms/DataResolver/CriteriaCollection.php:25
- confirmed `CmsSlotEntity::setData()` — accepts `Struct` only — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotEntity.php:127
- confirmed `CmsSlotEntity::getFieldConfig()` — returns `FieldConfigCollection` — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotEntity.php:142
- corrected `CmsSlotsDataResolveExtension::$resolverContext` — docs: `$event->getResolverContext()`; public readonly property, no getter — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataResolveExtension.php:44
- corrected `EntityResolverContext::getEntity()` — docs: called on `ResolverContext`; only defined on `EntityResolverContext` — vendor/shopware/core/Content/Cms/DataResolver/ResolverContext/EntityResolverContext.php:23
- confirmed `ExtensionDispatcher::pre()` — appends `.pre` to the extension name — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:23
- confirmed `CmsSlotsDataCollectExtension::NAME` — `cms-slots-data.collect` (enrich: `cms-slots-data.enrich`, resolve: `cms-slots-data.resolve`) — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataCollectExtension.php:27
