---
id: platform/dev/6.7/resources/references/adr/2022-07-19-blog-concept.md
title: Concept for blogs using Shopping Experiences
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-07-19-blog-concept.html
sourceHash: 7bde92149af03342a541fb0c360c3007e89461c5
codeCheckedAgainst: "6.7.13.0"
keywords: ["blog", "custom entities", "admin-ui.xml", "cms-aware.xml", "cms-aware", "admin-ui", "shopping experiences", "cms", "content types", "sw_title", "sw_cms_page_id", "moduleTitle", "navigation-parent", "blog post"]
summary: ADR concept for blogs via Custom Entities with admin-ui.xml and cms-aware flags, sw_ CMS fields and snippet structure; cms-aware is disabled in 6.7 code.
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022) proposing blogs in the Shopware CMS (Shopping Experiences) built on Custom Entities: an `admin-ui.xml` flag generates Administration listing/detail pages for content types, a `cms-aware` flag adds predefined `sw_`-prefixed CMS/SEO fields, and categories get a blog type that lists posts. In the installed 6.7 code only the `admin-ui.xml` part is active; `cms-aware` enrichment is commented out.

## When to use

Use when adding Administration listing/detail modules for a custom entity via `admin-ui.xml`, or when evaluating whether a blog/content-type implementation based on `cms-aware` custom entities is available.

## Key steps / config

1. Define the custom entity (Custom Entities concept).
2. Add `Resources/config/admin-ui.xml` (schema `admin-ui-1.0.xsd`). Each `entity` needs a `navigation-parent` (required by the XSD), e.g. `sw-content`; listing columns and detail tabs/cards reference entity fields:

```xml
<admin-ui>
    <entity name="custom_entity_example" navigation-parent="sw-content" position="50" icon="regular-tools-alt" color="...">
        <listing><columns><column ref="name"/><column ref="position" hidden="true"/></columns></listing>
        <detail>
            <tabs><tab name="main"><card name="general"><field ref="name"/></card></tab></tabs>
        </detail>
    </entity>
</admin-ui>
```

3. Provide snippets; generated modules read keys under the entity name:

```json
{ "custom_entity_bundle": {
    "moduleTitle": "...", "moduleDescription": "...",
    "tabs": { "main": "..." },
    "cards": { "general": "..." },
    "fields": { "swTitle": "...", "swContentHelpText": "...", "swContentPlaceholder": "..." } } }
```

Planned (not active in 6.7, see Gotchas): a separate `cms-aware.xml` listing `<entity name="..."/>` elements, adding CMS default fields to the entity and new component types (e.g. rendering the CMS page reference as a CMS page selection, as in categories).

Proposed blog data model: `blog_post` (id, CMS page, media, title, content, SEO meta title/description/keywords, `custom_fields`, `publish_at`), mapping tables `blog_post_category` and `blog_post_tag`, a `category` of type `blog` whose CMS page template contains a post listing, and a `cms_slot_config` listing block.

## Essential identifiers

- `admin-ui.xml`, `admin-ui-1.0.xsd`
- `navigation-parent`, `listing`/`columns`/`column ref`, `detail`/`tabs`/`tab`/`card`/`field ref`
- Snippet keys `moduleTitle`, `moduleDescription`, `tabs`, `cards`, `fields`
- `Shopware\Core\System\CustomEntity\Xml\Config\CmsAware\CmsAwareFields`

## Gotchas

- `cms-aware` is disabled in 6.7: `CustomEntityEnrichmentService::enrich()` has the `enrichCmsAware` call commented out (`@todo NEXT-22697`), and the `cms-aware` attribute is commented out in `entity-1.0.xsd`. No `cms-aware.xml` schema file ships.
- The ADR's field list differs from the code: `CmsAwareFields` defines `sw_title`, `sw_content`, `sw_cms_page`, `sw_slot_config`, `sw_categories`, `sw_seo_meta_title`, `sw_seo_meta_description`, `sw_seo_url`, `sw_og_title`, `sw_og_description`, `sw_og_image` — no `sw_media_id`, `sw_seo_keywords` or separate `sw_cms_page_id`/`sw_cms_page_version_id` columns.
- There is no `blog` category type in core; `CategoryDefinition` defines `page`, `link`, `folder`.

## Code check (6.7.13.0)
- confirmed `AdminUiXmlSchema::FILENAME` — value `admin-ui.xml` — vendor/shopware/core/System/CustomEntity/Xml/Config/AdminUi/AdminUiXmlSchema.php:16
- confirmed `navigation-parent` — required attribute on admin-ui entity — vendor/shopware/core/System/CustomEntity/Xml/Config/AdminUi/admin-ui-1.0.xsd:19
- confirmed `moduleTitle` — snippet key read as `${customEntityName}.moduleTitle` — vendor/shopware/administration/Resources/app/administration/src/module/sw-custom-entity/page/sw-generic-custom-entity-list/sw-generic-custom-entity-list.html.twig:18
- corrected `cms-aware` — docs: flag enriches entities with CMS fields; enrichment commented out (NEXT-22697) — vendor/shopware/core/System/CustomEntity/Xml/Config/CustomEntityEnrichmentService.php:26
- corrected `cms-aware` — docs: entity attribute; commented out in entity XSD — vendor/shopware/core/System/CustomEntity/Xml/entity-1.0.xsd:27
- corrected `CmsAwareFields::getCmsAwareFields()` — docs: sw_media_id, sw_cms_page_id, sw_cms_page_version_id, sw_seo_keywords; code has sw_cms_page, sw_slot_config, sw_categories, og fields — vendor/shopware/core/System/CustomEntity/Xml/Config/CmsAware/CmsAwareFields.php:22
- confirmed `sw_title` — translatable string CMS-aware field — vendor/shopware/core/System/CustomEntity/Xml/Config/CmsAware/CmsAwareFields.php:25
- corrected `CategoryDefinition::TYPE_PAGE` — docs: new category type `blog`; only page/link/folder exist — vendor/shopware/core/Content/Category/CategoryDefinition.php:57
- unverified `cms-aware-1.0.xsd` — referenced by docs; no such file under CustomEntity/Xml/Config/CmsAware
