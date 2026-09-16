---
id: platform/dev/6.6/resources/references/adr/2022-10-17-hide-and-show-cms-content.md
title: Hide and show CMS content
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-10-17-hide-and-show-cms-content.html"
sourceHash: 2db75d4d1e20d7d636f40a4e81bf6fe37095ae84
keywords: ["cms_section", "cms_block", "visibility column", "hidden-mobile", "hidden-tablet", "hidden-desktop", "cms-section-default.html.twig", "cms-section-block-container.html.twig", "sw-checkbox-field", "device visibility", "CSS media queries"]
summary: "Documents the per-device visibility JSON column on cms_section/cms_block, exposed via admin checkboxes and CSS media-query classes."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting how Shopware 6 lets merchants hide or show CMS sections and blocks per device (mobile/tablet/desktop) using client-side CSS media queries, configured through a new visibility setting in the administration.

## When to use

Relevant when a merchant wants a CMS section or block to appear on some viewport sizes and not others, or when investigating how the visibility toggle in the CMS block/section settings maps to storefront markup.

## Key steps / config

- Context/decision: visibility is enforced client-side via CSS media queries rather than server-side, to avoid a full-page reload or extra ajax calls per block/section.
- A JSON `visibility` column is added to the `cms_section` and `cms_block` tables to store the per-device config, shaped like:

```json
{
    "mobile": true,
    "tablet": true,
    "desktop": true
}
```

- Blocks and sections are visible on all viewports by default. The administration adds a visibility section under block/section settings using bindings such as `v-model="visibility.mobile"`, `visibility.tablet`, `visibility.desktop` on `sw-checkbox-field` components (translation keys like `sw-cms.sidebar.contentMenu.visibilityMobile`).
- In the storefront, `src/Storefront/Resources/views/storefront/section/cms-section-default.html.twig` and `src/Storefront/Resources/views/storefront/section/cms-section-block-container.html.twig` read the stored `block.visibility` config; when a block has no `visibility` set, it defaults to all three viewports `true`. CSS classes `hidden-mobile`, `hidden-tablet`, `hidden-desktop` are added to `blockClasses` for whichever viewport is turned off.

## Essential identifiers

- `cms_section`, `cms_block` tables, `visibility` JSON column
- `cms-section-default.html.twig`, `cms-section-block-container.html.twig`
- CSS classes `hidden-mobile`, `hidden-tablet`, `hidden-desktop`

## Gotchas

Visibility is resolved entirely on the client via CSS, so hidden content is still rendered in the HTML response for all viewports — it is not removed server-side.
