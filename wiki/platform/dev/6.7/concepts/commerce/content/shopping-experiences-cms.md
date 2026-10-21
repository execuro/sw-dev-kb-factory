---
id: platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md
title: Shopping Experiences (CMS)
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/content/shopping-experiences-cms.html
sourceHash: e0a2108834d9d7cef75e53ec57027f3876386077
codeCheckedAgainst: "6.7.15.1"
keywords: ["cms", "shopping experiences", "layout", "cms page", "section", "block", "slot", "element", "CmsElementResolverInterface", "SalesChannelCmsPageLoader", "CmsSlotsDataResolver", "CmsPageLoadedEvent", "CmsPageLoaderCriteriaEvent", "slotConfig", "data hydration"]
summary: CMS concept - page/section/block/slot/element tree, page and section types, resolving pipeline in SalesChannelCmsPageLoader, element resolvers and extensions.
lastBuilt: 2026-10-20
---
## What it is

The concept behind Shopping Experiences, Shopware's CMS: reusable pages/layouts (technically the same thing) whose content is hydrated dynamically based on their assignment to categories or other entities, and which are presentation-channel agnostic (headless).

## When to use

When building custom CMS blocks/elements, writing an element resolver, hooking into CMS loading, or rendering CMS pages in a headless frontend.

## Key steps / config

### Structure

A tree: **page** → many **sections** → many **blocks** → zero or more **slots** → exactly one **element** per slot.

```json
{"cmsPage": {"sections": [{"blocks": [{"slots": [
  {"slot": "content", "type": "product-listing"}
]}]}]}}
```

- **Page** `type`: `page`, `landingpage`, `product_list`, `product_detail`.
- **Section** `type`: `default` (regular single-column content) or `sidebar` (sidebar + content column). Blocks are stacked inside.
- **Block**: a row unit with its own layout/styling; UI categories such as `text`, `image`, `video`, `text-image`, `commerce`, `sidebar`, `form`, `html` (plus dynamic `favorite`, `app`). Slots are abstract and named, e.g. block `text-hero` has one slot `content` that can hold a `text` or an `image` element.
- **Element**: context-free primitive rendered inside a block slot. Built-ins include `text`, `html`, `form`, `image`, `image-slider`, `image-gallery`, `video`, `youtube-video`, `vimeo-video`, `product-listing`, `product-box`, `product-slider`, `product-name`, `manufacturer-logo`, `buy-box`, `cross-selling`, `product-description-reviews`, `category-navigation`, `category-name`, `sidebar-filter`.
- **Configuration** on each section/block/element: product ID, mapped field (e.g. `category.description`), static values, CSS config. Slot config values use `{source: "static"|..., value: ...}`; static values pass through, mapped fields are resolved at runtime.

### Resolving process (`SalesChannelCmsPageLoader::load()`)

1. Dispatch `CmsPageLoaderCriteriaEvent` (adjust criteria).
2. Load the layout with sections, blocks, slots, background media.
3. Sort sections, blocks, slots by `position`.
4. Build the resolver context (request, sales channel context, optional entity).
5. Merge the entity's `slotConfig` overrides into slot config.
6. `CmsSlotsDataResolver` resolves slots: collect (`collect()` returns a `CriteriaCollection`) → optimize (merge ID-based criteria, split search criteria) → fetch via DAL → enrich (`enrich()`).
7. Dispatch `CmsPageLoadedEvent`.
8. Collect cache tags (product IDs etc.) for HTTP cache invalidation.
9. Return the page to the view layer.

### Custom element resolver

```php
class MyResolver implements CmsElementResolverInterface
{
    public function getType(): string { /* ... */ }
    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection { /* ... */ }
    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Content\Cms\SalesChannel\SalesChannelCmsPageLoader`
- `Shopware\Core\Content\Cms\DataResolver\CmsSlotsDataResolver`
- `Shopware\Core\Content\Cms\DataResolver\Element\CmsElementResolverInterface`
- `CmsPageLoaderCriteriaEvent`, `CmsPageLoadedEvent`
- `CmsSlotsDataResolveExtension`, `CmsSlotsDataCollectExtension`, `CmsSlotsDataEnrichExtension`

## Gotchas

- The docs list section type `fullwidth`; the installed `CmsSectionDefinition` defines `default` and `sidebar` only.
- The Admin preview is only as representative as your presentation channel resembles it — a major implication for headless frontends.
- Elements have no knowledge of their context; data loading belongs in resolvers.

## Version notes

Since 6.6.7 the whole resolution pipeline can be intercepted with the extensions `CmsSlotsDataResolveExtension`, `CmsSlotsDataCollectExtension`, `CmsSlotsDataEnrichExtension` without writing a full resolver.

## Code check (6.7.15.1)
- confirmed `CmsElementResolverInterface::getType()` — with `collect()` and `enrich()` — vendor/shopware/core/Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:13
- confirmed `CmsElementResolverInterface::collect()` — returns `?CriteriaCollection` — vendor/shopware/core/Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:15
- confirmed `SalesChannelCmsPageLoader::load()` — orchestrator — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:44
- confirmed `CmsPageLoaderCriteriaEvent` — dispatched before loading — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:51
- confirmed `CmsPageLoadedEvent` — dispatched after resolution — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:103
- confirmed `CmsSlotsDataResolver` — slot data resolver — vendor/shopware/core/Content/Cms/DataResolver/CmsSlotsDataResolver.php:28
- confirmed `CmsSlotsDataResolveExtension` — extension point — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataResolveExtension.php:23
- confirmed `CmsSlotsDataCollectExtension` — extension point — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataCollectExtension.php:25
- confirmed `CmsSlotsDataEnrichExtension` — extension point — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataEnrichExtension.php:28
- corrected `CmsSectionDefinition::TYPE_DEFAULT` — docs: section type `fullwidth`; code: `default` (plus `sidebar`) — vendor/shopware/core/Content/Cms/Aggregate/CmsSection/CmsSectionDefinition.php:40
