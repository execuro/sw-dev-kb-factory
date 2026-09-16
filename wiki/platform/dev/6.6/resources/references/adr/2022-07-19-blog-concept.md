---
id: "platform/dev/6.6/resources/references/adr/2022-07-19-blog-concept.md"
title: "Concept for blogs using Shopping Experiences"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-07-19-blog-concept.html"
sourceHash: "7bde92149af03342a541fb0c360c3007e89461c5"
keywords: ["Custom Entities", "admin-ui.xml", "cms-aware.xml", "blog", "cms-aware flag", "sw_title", "sw_content", "sw_cms_page_id", "blog_post", "Shopping Experiences", "CMS", "custom entity bundle"]
summary: "ADR: blogs are implemented as Custom Entities with admin-ui.xml/cms-aware.xml and a new category type for CMS-based blog listings."
lastBuilt: "2026-09-15"
---
## What it is
ADR proposing blogs for the Shopware CMS, implemented as a use case of Custom Entities within the Shopping Experiences (CMS) system.

## When to use
Relevant when building CMS content types backed by Custom Entities that need an auto-generated admin listing/detail UI and CMS-aware fields.

## Key steps / config
- The `admin-ui` flag in a Custom Entity's XML config makes Shopware auto-generate a listing and detail page under the Content section of the administration.
- The `cms-aware` flag adds pre-defined fields (always prefixed `sw_`) usable as CMS element defaults: `sw_title`, `sw_content`, `sw_media_id`, `sw_cms_page_id`, `sw_cms_page_version_id`, `sw_seo_meta_title`, `sw_seo_meta_description`, `sw_seo_keywords`.
- Schema and UI configuration are kept separate in two files: `admin-ui.xml` and `cms-aware.xml`.

```xml
<admin-ui>
    <entity name="custom_entity_example" navigation-parent="sw-content" position="50">
        <listing><columns><column ref="name"/></columns></listing>
        <detail><tabs><tab name="main"><card name="general"><field ref="name"/></card></tab></tabs></detail>
    </entity>
</admin-ui>
```
- A blog is modeled as a new category `type` of `blog`: categories already provide what a blog needs (SEO, CMS page, listing UI); posts replace assigned products.
- Proposed tables: `blog_post` (with the `sw_*` cms-aware fields plus `custom_fields`, `publish_at`), `category`, `blog_post_category`, `blog_post_tag`.
- Modules generated via `admin-ui.xml` follow a snippet structure keyed `custom_entity_bundle` with nested `moduleTitle`, `tabs`, `cards`, `fields`.

## Essential identifiers
`admin-ui.xml`, `cms-aware.xml`, `admin-ui` flag, `cms-aware` flag, `sw_cms_page_id`, `blog_post` table, `custom_entity_bundle` snippet key.

## Gotchas
`cms-aware` fields are always `sw_`-prefixed to avoid clashing with user-defined fields on the entity.
