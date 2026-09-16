---
id: platform/func/catalogues/categories.md
title: Categories
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/catalogues/categories
sourceHash: e028c100486c76d8022577a7310e4d27c30334fbc38ddd43c61be6118517e609
revision:
  current: true
  range: "6.4.0.0 - 6.4.18"
  swMax: "6.4.18"
  swMin: "6.4.0.0"
keywords: ["categories", "category tree", "Catalogues > Categories", "context menu", "category type", "Page/List", "Structuring element/entry point", "Link", "entry point", "Main Navigation", "Footer Navigation", "Service Navigation", "landing pages", "SEO URL"]
summary: "Catalogues > Categories manages the category tree, category types, navigation entry points, layout assignment and standalone landing pages."
lastBuilt: 2026-09-15
---
## What it is
The Categories module (Catalogues > Categories) manages the category tree used for Shopware 6 storefront navigation: main navigation, footer navigation, and service navigation, as well as landing pages that sit outside the navigation tree.

## When to use
Use this page when structuring the shop's navigation, assigning products to categories, configuring category layouts via Shopping Experiences, or setting up standalone landing pages reachable only by direct URL.

## Key steps / config
- Open Catalogues > Categories; the left pane shows the category tree as a fold-out menu, reorderable by drag & drop, including moving a category into another as a subcategory.
- Per-category context menu ("...") actions: New category before, New category after, New subcategory, Edit, Delete (deletes the selected category and all subordinate categories).
- A newly created category is inactive by default and not shown in the frontend until activated in the General tab.
- General tab fields: Name, Category is active, Tags, Category type (Page/List, Structuring element/entry point, Link).
  - Page/List: a standard page, e.g. a product listing.
  - Structuring element/entry point: cannot be called up directly, provides only a menu entry with sub-items.
  - Link: links to an internal entity (category, product, landing page) or an external URL, with an Open in new tab option.
- Entry point setting determines where the category appears: Main Navigation, Footer Navigation, or Service Navigation.
- Editing tabs for Page/List categories: General, Products, Layout, SEO (other category types only need the General tab).
- Products tab: assign products manually or via a dynamic product group; switching from manual to dynamic hides previously assigned products from this category (they remain visible in parent categories).
- Layout tab: assign a layout created in Shopping Experiences, or create a new one directly; layout content is grouped by blocks and can be edited per category without leaving the category screen.
- Customisation hierarchy for layouts: a language-specific customisation takes priority, then falls back to the parent language, then the system default language, then the layout itself.
- Sorting tab: "Show Product Sorting" exposes a frontend sort dropdown; "Use Custom Sorting" unlocks Default Sorting plus a configurable, priority-ordered list of Product Sorting options.
- Landing pages (listed below the category tree) sit outside the navigation and are reachable only via sales-channel URL + a mandatory SEO URL field (e.g. entering "start" yields `www.mysaleschannel.co.uk/start`); managed via a context menu (edit/duplicate/remove) and the "add landing page" button.

## Essential identifiers
- Menu path: `Catalogues > Categories`
- Category types: `Page / List`, `Structuring element/entry point`, `Link`
- Entry points: `Main Navigation`, `Footer Navigation`, `Service Navigation`
- Landing page required field: `SEO URL`

## Gotchas
- A newly created category is inactive and invisible in the frontend until explicitly activated.
- Switching an already-populated category from manual product assignment to a dynamic product group removes the manually assigned products from that category (they remain in parent categories).
- Layout selection settings can overwrite the underlying Shopping Experience configuration.
