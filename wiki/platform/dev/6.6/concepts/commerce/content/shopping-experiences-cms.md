---
id: platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md
title: Shopping Experiences (CMS)
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/commerce/content/shopping-experiences-cms.html
sourceHash: 2c06456ac38cd3a98f3f01267d848e230b6801e5
keywords: ["cms", "shopping experiences", "cms page", "section", "block", "slot", "element", "resolver", "element resolver", "getType", "collect", "enrich", "headless", "hydration"]
summary: "Explains the CMS page tree (sections, blocks, slots, elements) and how resolvers hydrate dynamic content at runtime."
lastBuilt: "2026-09-15"
---
## What it is

Shopware's CMS, called *Shopping Experiences*, is built on pages/layouts made of a hierarchical tree of sections, blocks, elements, and configuration, which can be reused and dynamically hydrated based on assignments to categories or other entities.

## When to use

Relevant when building CMS layouts, writing custom CMS elements, or implementing a custom element resolver that needs to hydrate slot content at runtime.

## Key steps / config

Structure (top-down): a **page** (wrapper, has a `type`: Category/Listing page, Shop page, Static page, Product pages) contains multiple **sections** (horizontal container, either two-column `sidebar`/`content` or single column), which contain **blocks** (row-spanning units, categorized as Text, Images, Commerce, Video), which contain zero or more **slots**, each holding exactly one **element** (types include text, image, product-listing, video, voice).

Example CMS page shape:

```json
{
  cmsPage: {
    sections: [{
      blocks: [{
        slots: [{
          slot: "content",
          type: "product-listing"
        }]
      }]
    }]
  }
}
```

Resolving process for dynamic content: 1) Load category, 2) Load CMS layout, 3) Build resolver context, 4) Assemble criteria for every element (via each element's `type` and the resolver context), 5) Override slot configuration with the resolved criteria results, 6) Respond with the assembled CMS page.

Custom element resolvers are registered by implementing an interface with methods:
- `getType() : string` — returns the matching type of elements
- `collect(CmsSlot, ResolverContext) : CriteriaCollection` — prepares the criteria object
- `enrich(CmsSlot, ResolverContext, ElemetDataCollection) : void` — performs additional logic on resolved data

## Essential identifiers

- `getType()`, `collect(CmsSlot, ResolverContext)`, `enrich(CmsSlot, ResolverContext, ElemetDataCollection)` — element resolver interface methods
- `text-hero` — example block type
- `voice` — element type read aloud by smart speakers

## Gotchas

Configuration can hold static values (passed as-is) or mapped fields (e.g. `category.description`, resolved at runtime). The CMS is presentation-channel-agnostic ("headless"): admin preview only represents your content as accurately as your presentation channel resembles the default Storefront — a major implication for headless frontends.
