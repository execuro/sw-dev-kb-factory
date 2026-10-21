---
id: platform/dev/6.7/resources/references/adr/2022-10-17-hide-and-show-cms-content.md
title: Hide and show CMS content
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-10-17-hide-and-show-cms-content.html
sourceHash: 2db75d4d1e20d7d636f40a4e81bf6fe37095ae84
codeCheckedAgainst: "6.7.15.1"
keywords: ["visibility", "cms_section", "cms_block", "sw-cms-visibility-config", "hidden-mobile", "hidden-tablet", "hidden-desktop", "cms-section-block-container.html.twig", "hide cms block per device", "responsive visibility", "shopping experiences", "media queries", "adr"]
summary: "ADR: CMS sections/blocks get a visibility JSON field (mobile/tablet/desktop); storefront adds hidden-mobile/-tablet/-desktop CSS classes to hide them."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-10-17, area content) adding per-device visibility to CMS (Shopping Experiences) sections and blocks. Merchants can hide or show a section or block on mobile, tablet or desktop; hiding is done client-side via CSS media queries.

## When to use

When you build or override CMS section/block templates or admin settings and need to respect the visibility config, or when a block disappears on one viewport and you need to know why.

## Key steps / config

Design choice: no server-side filtering (would need a full page reload) and no per-block AJAX calls (too many requests per page) — only CSS classes driven by stored config.

1. **Data** — `cms_section` and `cms_block` each have a `visibility` JSON field, chosen as JSON to allow more visibility options later. Shape:

```json
{ "mobile": true, "tablet": true, "desktop": true }
```

2. **Administration** — sections and blocks are visible on all viewports by default. The component `sw-cms-visibility-config` adds a visibility group to block and section settings: one checkbox per device (`sw-cms-visibility-config__checkbox-input`), labelled with the snippets `sw-cms.sidebar.contentMenu.visibilityMobile`, `...visibilityTablet`, `...visibilityDesktop`; each toggles via `onVisibilityChange('<device>', ...)`.

3. **Storefront** — when `visibility` is null, all three devices default to `true`; for each device set to false, a class is prepended to the element's classes:

```twig
{% if not visibility.mobile %}
    {% set blockClasses = ['hidden-mobile']|merge(blockClasses) %}
{% endif %}
```

Blocks: `storefront/section/cms-section-block-container.html.twig` (`blockClasses`). Sections: `storefront/page/content/detail.html.twig` (`sectionClasses`).

## Essential identifiers

- Field `visibility` (JSON with `mobile`, `tablet`, `desktop` booleans) on `cms_section` / `cms_block`
- Admin component `sw-cms-visibility-config`
- CSS classes `hidden-mobile`, `hidden-tablet`, `hidden-desktop`
- Templates `cms-section-block-container.html.twig`, `page/content/detail.html.twig`

## Gotchas

- A null `visibility` means visible everywhere; templates must treat it that way.
- Hidden content is still rendered into the HTML and only hidden by CSS.
- The ADR names `src/Storefront/Resources/views/storefront/section/cms-section-default.html.twig` for section classes; in 6.7 the section visibility logic lives in `page/content/detail.html.twig`.
- The ADR sketches `sw-checkbox-field` with `v-model`; the 6.7 admin component uses native checkbox inputs with `mt-icon` device icons instead.

## Code check (6.7.15.1)
- confirmed `visibility` — JsonField with mobile/desktop/tablet BoolFields on section — vendor/shopware/core/Content/Cms/Aggregate/CmsSection/CmsSectionDefinition.php:93
- confirmed `visibility` — JsonField on block — vendor/shopware/core/Content/Cms/Aggregate/CmsBlock/CmsBlockDefinition.php:81
- confirmed `block.visibility` — null defaults all devices to true — vendor/shopware/storefront/Resources/views/storefront/section/cms-section-block-container.html.twig:32
- confirmed `hidden-mobile` — block class merge — vendor/shopware/storefront/Resources/views/storefront/section/cms-section-block-container.html.twig:43
- confirmed `hidden-desktop` — block class merge — vendor/shopware/storefront/Resources/views/storefront/section/cms-section-block-container.html.twig:49
- corrected `section.visibility` — docs: handled in cms-section-default.html.twig — vendor/shopware/storefront/Resources/views/storefront/page/content/detail.html.twig:21
- confirmed `hidden-tablet` — section class merge — vendor/shopware/storefront/Resources/views/storefront/page/content/detail.html.twig:35
- corrected `sw-cms-visibility-config__checkbox-input` — docs: sw-checkbox-field with v-model; code: native input — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-visibility-config/sw-cms-visibility-config.html.twig:16
- confirmed `sw-cms.sidebar.contentMenu.visibilityMobile` — snippet label — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-visibility-config/sw-cms-visibility-config.html.twig:13
