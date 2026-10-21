---
id: platform/dev/6.7/resources/references/adr/2022-07-19-blog-concept.md
title: Concept for blogs using Shopping Experiences
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-07-19-blog-concept.html
sourceHash: 7bde92149af03342a541fb0c360c3007e89461c5
codeCheckedAgainst: "6.7.15.1"
keywords: ["blog", "custom entities", "admin-ui.xml", "cms-aware", "CmsAwareFields", "shopping experiences", "cms", "content types", "blog post", "sw_title", "sw_cms_page", "navigation-parent", "custom entity snippets"]
summary: "ADR: blogs as CMS content types built on Custom Entities with admin-ui.xml (generated admin module) and cms-aware fields; cms-aware is disabled in 6.7."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-07-18) proposing blogs for the Shopping Experiences CMS, built on Custom Entities as a showcase for how to use them in the CMS. Blog posts become a "content type" (a custom entity) shown in the Administration's Content section, and blogs are categories that list posts instead of products.

## When to use

When modelling blog-like content with Custom Entities, generating an Administration module via `admin-ui.xml`, or checking how far the planned `cms-aware` behaviour is actually available.

## Key steps / config

1. **Admin module via `admin-ui.xml`** — an entity listed in `admin-ui.xml` gets a generated listing and detail page in the Administration. Per the installed XSD, `<entity>` requires `navigation-parent` and `position`; `icon` defaults to `pencil` and `color` to `#758CA3`; a listing `<column>` can set `hidden`.

```xml
<admin-ui>
    <entity name="custom_entity_example" navigation-parent="sw-content" position="50" icon="regular-tools-alt" color="#f00">
        <listing><columns><column ref="name"/><column ref="position" hidden="true"/></columns></listing>
        <detail><tabs><tab name="main"><card name="general"><field ref="name"/></card></tab></tabs></detail>
    </entity>
</admin-ui>
```

   Every entity named in `admin-ui.xml` must exist in the custom entity schema, otherwise an "entity not given" error is thrown.

2. **CMS-aware fields** — the `cms-aware` flag (declared per entity in a separate `cms-aware.xml`, keeping schema and UI apart) is meant to merge predefined `sw_`-prefixed fields into the entity. The installed field set in `CmsAwareFields::getCmsAwareFields()` is `sw_title`, `sw_content`, `sw_cms_page` (many-to-one to `cms_page`), `sw_slot_config`, `sw_categories` (many-to-many to `category`), `sw_seo_meta_title`, `sw_seo_meta_description`, `sw_seo_url`, `sw_og_title`, `sw_og_description`, `sw_og_image`. The Administration detail page adds layout and SEO tabs when the entity carries the `cms-aware` flag, rendering the CMS page relation as a CMS page selection.

3. **Blog = category** — a blog is a category of a new type holding blog posts, metadata, SEO data and a CMS page whose template contains a post listing; posts relate to categories and tags via mapping tables (`blog_post_category`, `blog_post_tag`).

4. **Snippets** — generated modules read snippets keyed by entity name:

```json
{ "custom_entity_bundle": {
    "moduleTitle": "...", "moduleDescription": "...",
    "tabs": { "main": "..." }, "cards": { "general": "..." },
    "fields": { "swTitle": "...", "swContentHelpText": "...", "swContentPlaceholder": "..." } } }
```

## Essential identifiers

- `admin-ui.xml` (`AdminUiXmlSchema::FILENAME`), schema `admin-ui-1.0.xsd`
- `cms-aware` entity flag, `Shopware\Core\System\CustomEntity\Xml\Config\CmsAware\CmsAwareFields`
- `navigation-parent="sw-content"`
- Snippet keys `moduleTitle`, `moduleDescription`, `tabs`, `cards`, `fields`

## Gotchas

- In 6.7.15.1 `CustomEntityEnrichmentService::enrich()` has the cms-aware enrichment commented out ("Re-implement, when re-enabling cms-aware", NEXT-22697), so the `sw_` fields are not added automatically.
- The ADR's field list (`sw_media_id`, `sw_cms_page_id`, `sw_cms_page_version_id`, `sw_seo_keywords`) does not match the installed set, which uses `sw_cms_page`, `sw_slot_config`, `sw_categories`, `sw_seo_url` and Open Graph fields instead.
- The category type `blog` is not among the installed `CategoryDefinition` types (`page`, `link`, `folder`); the blog-as-category part is a proposal.
- No `cms-aware-1.0.xsd` ships next to `CmsAwareFields`.

## Code check (6.7.15.1)
- corrected `CmsAwareFields::getCmsAwareFields()` — docs: sw_media_id, sw_cms_page_id, sw_cms_page_version_id, sw_seo_keywords; code has sw_cms_page, sw_slot_config, sw_categories, sw_seo_url, sw_og_* — vendor/shopware/core/System/CustomEntity/Xml/Config/CmsAware/CmsAwareFields.php:22
- confirmed `sw_title` — translatable string field — vendor/shopware/core/System/CustomEntity/Xml/Config/CmsAware/CmsAwareFields.php:25
- corrected `cms-aware` — docs: flag adds fields; enrichment is commented out pending re-enable — vendor/shopware/core/System/CustomEntity/Xml/Config/CustomEntityEnrichmentService.php:26
- confirmed `admin-ui.xml` — schema filename constant — vendor/shopware/core/System/CustomEntity/Xml/Config/AdminUi/AdminUiXmlSchema.php:16
- confirmed `navigation-parent` — required attribute; icon default pencil, color default #758CA3 — vendor/shopware/core/System/CustomEntity/Xml/Config/AdminUi/admin-ui-1.0.xsd:19
- confirmed `moduleTitle` — generated detail page reads `<entity>.moduleTitle` snippet — vendor/shopware/administration/Resources/app/administration/src/module/sw-custom-entity/page/sw-generic-custom-entity-detail/sw-generic-custom-entity-detail.html.twig:8
- confirmed `cms-aware-tab-layout` — detail page tab added for cms-aware entities — vendor/shopware/administration/Resources/app/administration/src/module/sw-custom-entity/page/sw-generic-custom-entity-detail/index.ts:102
- corrected `CategoryDefinition::TYPE_PAGE` — docs: new category type blog; installed types are page, link, folder — vendor/shopware/core/Content/Category/CategoryDefinition.php:57
- unverified `cms-aware-1.0.xsd` — not found in the installed CmsAware config directory
