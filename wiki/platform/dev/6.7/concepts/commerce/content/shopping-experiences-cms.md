---
id: platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md
title: Shopping Experiences (CMS)
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/content/shopping-experiences-cms.html
sourceHash: babaaa4ccf9c11acb892f33bde93acbbbe4ed24e
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopping experiences", "cms", "layout", "cms page", "section", "block", "slot", "element", "SalesChannelCmsPageLoader", "CmsElementResolverInterface", "CmsSlotsDataResolver", "CmsPageLoaderCriteriaEvent", "CmsPageLoadedEvent", "CmsSlotsDataResolveExtension", "hydration"]
summary: Shopware CMS (Shopping Experiences) concept - page/section/block/slot/element tree, page and section types, slot data resolution via element resolvers.
lastBuilt: 2026-09-15
---
## What it is

Concept page for Shopware's CMS, "Shopping Experiences": reusable pages/layouts (technically the same thing) built as a tree of sections, blocks, slots and elements, whose content is hydrated dynamically from the entity they are assigned to (e.g. a category), independent of the presentation channel (headless).

## When to use

- Understanding the data shape of a CMS page from the API or DAL.
- Writing a custom CMS element resolver or hooking into CMS slot resolution.
- Reusing one layout for many categories/products with entity-specific content.

## Key steps / config

### Structure

Page → sections → blocks → slots (each slot holds exactly one element). Skeleton:

```json
{ "cmsPage": { "sections": [ { "blocks": [ { "slots": [
  { "slot": "content", "type": "product-listing" }
] } ] } ] } }
```

- **Page** `type`: `page`, `landingpage`, `product_list`, `product_detail`.
- **Section** `type`: `default` or `sidebar` (DAL `Choice` constraint); separate `sizingMode` field (`boxed` / `full_width`). Blocks inside a section are usually stacked.
- **Block**: a row unit with its own layout/styling; admin categories include `text`, `image`, `video`, `text-image`, `commerce`, `sidebar`, `form`, `html` (plus dynamic `favorite`, `app`). Slots of a block are abstract names, e.g. block `text-hero` has slot `content` which may hold a `text` or `image` element.
- **Element**: context-free primitive rendered in a slot. Built-in types include `text`, `html`, `form`, `image`, `image-slider`, `video`, `youtube-video`, `vimeo-video`, `product-listing`, `product-box`, `product-slider`, `product-name`, `manufacturer-logo`, `buy-box`, `cross-selling`, `product-description-reviews`, `category-navigation`.
- **Configuration** on each component: product ID, mapped field (e.g. `category.description`), static values, CSS config. Slot config skeleton: `config: { content: { source: "static", value: ... } }`; static values pass through, mapped values resolve at runtime.

### Resolution (`SalesChannelCmsPageLoader::load()`)

1. Dispatch `CmsPageLoaderCriteriaEvent` (listeners adjust criteria).
2. Load the page with `sections.backgroundMedia`, `sections.blocks.backgroundMedia`, `sections.blocks.slots`.
3. Sort sections and blocks by `position`; slots by their `slot` name.
4. Build a `ResolverContext` (sales channel context, request, optionally the entity).
5. Merge config overrides (e.g. category `slotConfig`) into slot config.
6. `CmsSlotsDataResolver::resolve()`: each resolver's `collect()` returns a `CriteriaCollection`; criteria are optimized (ID-based merged, search criteria separate) and fetched from the DAL; each resolver's `enrich()` fills its slot.
7. Dispatch `CmsPageLoadedEvent`.
8. Add product IDs as cache tags for HTTP cache invalidation.
9. Return the page to the view layer.

Custom element resolver implements `CmsElementResolverInterface`:

```php
class MyResolver implements CmsElementResolverInterface
{
    public function getType(): string { /* ... */ }
    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection { /* ... */ }
    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void { /* ... */ }
}
```

Event-based alternative: extensions `CmsSlotsDataResolveExtension`, `CmsSlotsDataCollectExtension`, `CmsSlotsDataEnrichExtension` intercept the pipeline without a full resolver.

## Essential identifiers

- `Shopware\Core\Content\Cms\SalesChannel\SalesChannelCmsPageLoader`
- `Shopware\Core\Content\Cms\DataResolver\Element\CmsElementResolverInterface`
- `Shopware\Core\Content\Cms\DataResolver\CmsSlotsDataResolver`, `CriteriaCollection`, `ResolverContext`
- `CmsPageLoaderCriteriaEvent`, `CmsPageLoadedEvent`
- `CmsSlotsDataResolveExtension`, `CmsSlotsDataCollectExtension`, `CmsSlotsDataEnrichExtension`

## Gotchas

- The docs list section types `sidebar` and `fullwidth`; the installed `cms_section.type` only accepts `default` or `sidebar` — full width is the `sizingMode` value `full_width`.
- The docs say slots are sorted by `position`; the loader sorts slots by their `slot` name.
- The admin preview is only as representative as your presentation channel resembles it — a major implication for headless frontends.

## Version notes

- Event-based CMS extensions available since Shopware 6.6.7.

## Code check (6.7.13.0)
- confirmed `SalesChannelCmsPageLoader::load()` — orchestrates loading/resolution — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:44
- confirmed `CmsPageLoaderCriteriaEvent` — dispatched before loading — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:51
- corrected `CmsSlotEntity::getSlot()` — docs: slots sorted by position — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:89
- confirmed `CmsPageLoadedEvent` — dispatched after resolution — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:103
- confirmed `CmsElementResolverInterface::getType()` — one of three interface methods with collect/enrich — vendor/shopware/core/Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:13
- confirmed `CmsElementResolverInterface::collect()` — returns ?CriteriaCollection — vendor/shopware/core/Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:15
- confirmed `CmsElementResolverInterface::enrich()` — fills slot with ElementDataCollection — vendor/shopware/core/Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:17
- corrected `TYPE_DEFAULT` — docs: section types sidebar/fullwidth — vendor/shopware/core/Content/Cms/Aggregate/CmsSection/CmsSectionDefinition.php:37
- confirmed `CmsSlotsDataResolveExtension` — extension point in slot resolver — vendor/shopware/core/Content/Cms/DataResolver/CmsSlotsDataResolver.php:84
- confirmed `product_detail` — page types landingpage, page, product_list, product_detail — vendor/shopware/core/Content/Cms/CmsPageDefinition.php:62
