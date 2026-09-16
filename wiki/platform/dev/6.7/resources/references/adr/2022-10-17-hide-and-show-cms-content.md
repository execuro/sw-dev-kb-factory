---
id: platform/dev/6.7/resources/references/adr/2022-10-17-hide-and-show-cms-content.md
title: Hide and show CMS content
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-10-17-hide-and-show-cms-content.html
sourceHash: 2db75d4d1e20d7d636f40a4e81bf6fe37095ae84
codeCheckedAgainst: "6.7.13.0"
keywords: ["visibility", "cms_section", "cms_block", "hidden-mobile", "hidden-tablet", "hidden-desktop", "sw-cms-visibility-config", "cms-section-block-container.html.twig", "hide block per device", "responsive cms", "viewport visibility", "shopping experiences"]
summary: "ADR: CMS sections/blocks get a visibility JSON (mobile/tablet/desktop); storefront adds hidden-* CSS classes, admin edits it in sw-cms-visibility-config."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022-10-17) for hiding or showing CMS sections and blocks per device. Visibility is stored per section/block and applied client-side with CSS media queries — no server-side filtering, no per-block AJAX calls, no full page reload.

## When to use

When a merchant wants a CMS section or block shown only on some viewports, or when you customise storefront CMS templates or admin CMS sidebar settings and must keep the visibility handling intact.

## Key steps / config

1. Data: `cms_section` and `cms_block` have a JSON column `visibility` (DAL `JsonField` with bool fields `mobile`, `tablet`, `desktop`), exposed as `CmsSectionEntity::$visibility` / `CmsBlockEntity::$visibility` (`?array`):
   ```json
   { "mobile": true, "tablet": true, "desktop": true }
   ```
2. Default: blocks and sections are visible on all viewports; a `null` value is treated as all `true`.
3. Administration: the component `sw-cms-visibility-config` renders one checkbox per device (labels `sw-cms.sidebar.contentMenu.visibilityMobile`, `visibilityTablet`, `visibilityDesktop`) and calls `onVisibilityChange('<device>', value)`.
4. Storefront: templates prepend CSS classes when a device is disabled:
   ```twig
   {% if not visibility.mobile %}
       {% set blockClasses = ['hidden-mobile']|merge(blockClasses) %}
   {% endif %}
   ```
   - Blocks: `@Storefront/storefront/section/cms-section-block-container.html.twig` (`blockClasses`).
   - Sections: `@Storefront/storefront/page/content/detail.html.twig` (`sectionClasses`).
5. The classes `hidden-mobile`, `hidden-tablet`, `hidden-desktop` are defined in the storefront SCSS component `_visibility.scss`.

## Essential identifiers

- `cms_section.visibility`, `cms_block.visibility`
- `hidden-mobile`, `hidden-tablet`, `hidden-desktop`
- `sw-cms-visibility-config`
- `cms-section-block-container.html.twig`, `page/content/detail.html.twig`

## Gotchas

- Hidden content is still rendered into the HTML and only hidden via CSS — it is not removed server-side.
- The ADR names `cms-section-default.html.twig` for section classes; in 6.7 that template has no visibility handling — override `page/content/detail.html.twig` instead.
- The ADR pseudocode uses `sw-checkbox-field`; the 6.7 component uses native checkbox inputs with icons.

## Code check (6.7.13.0)
- confirmed `visibility` — JsonField with mobile/desktop/tablet bools on cms_section — vendor/shopware/core/Content/Cms/Aggregate/CmsSection/CmsSectionDefinition.php:90
- confirmed `visibility` — JsonField on cms_block — vendor/shopware/core/Content/Cms/Aggregate/CmsBlock/CmsBlockDefinition.php:78
- confirmed `CmsBlockEntity::$visibility` — nullable array — vendor/shopware/core/Content/Cms/Aggregate/CmsBlock/CmsBlockEntity.php:58
- confirmed `hidden-mobile` — block classes merged when visibility.mobile is false, null defaults to all true — vendor/shopware/storefront/Resources/views/storefront/section/cms-section-block-container.html.twig:43
- corrected `sectionClasses` — docs: section classes added in cms-section-default.html.twig — vendor/shopware/storefront/Resources/views/storefront/page/content/detail.html.twig:32
- confirmed `.hidden-mobile` — CSS class defined in storefront SCSS — vendor/shopware/storefront/Resources/app/storefront/src/scss/component/_visibility.scss:2
- corrected `sw-cms-visibility-config__checkbox-input` — docs: sw-checkbox-field elements; 6.7 uses native input checkboxes — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-visibility-config/sw-cms-visibility-config.html.twig:16
- confirmed `sw-cms.sidebar.contentMenu.visibilityMobile` — snippet label — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-visibility-config/sw-cms-visibility-config.html.twig:13
