---
id: platform/dev/6.7/guides/plugins/apps/storefront/seo-urls.md
title: SEO URLs for App Routes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/storefront/seo-urls.html
sourceHash: eb2323b0417504d904bcafa371f2512244871617
codeCheckedAgainst: "6.7.15.1"
keywords: ["app seo url", "seo-url", "entity-seo-url", "default-template", "frontend.script_endpoint", "seoUrl", "storefront script endpoint", "/storefront/script/{hook}", "hook.query", "dal:refresh:index", "app_seo_url.seo-url", "custom entity url", "friendly url"]
summary: SEO URLs for app storefront script pages via manifest seo-url/entity-seo-url (6.7.16.0+; not present in 6.7.15.1) plus seoUrl() linking.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md", "platform/dev/6.7/guides/hosting/infrastructure/message-queue.md"]
---
## What it is

Storefront pages rendered by [app scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md) live under the technical path `/storefront/script/{hook}`. The documented feature lets an app declare static and entity-bound SEO URLs for those pages in `manifest.xml`. It is introduced in Shopware 6.7.16.0; the manifest elements do not exist in the 6.7.15.1 code checked here (see Version notes and Code check).

## When to use

- Your app renders Storefront pages via storefront scripts and you want readable URLs (e.g. `/imprint`, `/blog/<title>`) instead of `/storefront/script/<hook>`.
- You need one URL per entity (custom entity or core entity such as `product`) whose id is passed to the script.

## Key steps / config

What works on every 6.7 version:

1. Put the storefront script in `Resources/scripts/storefront-<hook>/` (hook name pattern `storefront-{hook}`). It is served by route `frontend.script_endpoint` at `/storefront/script/{hook}` (GET/POST).
2. Request query parameters are available in the script as `hook.query`, e.g. an entity id as `hook.query.id`:

```twig
{% set post = services.store.search('ce_blog', { 'ids': [hook.query.id] }).first %}
{% do hook.page.addExtension('post', post) %}
{% do hook.setResponse(services.response.render('@SwagBlog/storefront/page/blog/detail.html.twig', { 'page': hook.page })) %}
```

3. Link to the page with the `seoUrl` Twig function and the technical route; the placeholder is replaced with an SEO URL when one exists:

```twig
<a href="{{ seoUrl('frontend.script_endpoint', { 'hook': 'blog-detail', 'id': post.id }) }}">...</a>
```

4. `bin/console dal:refresh:index` rebuilds SEO URLs.

## Essential identifiers

- Route `frontend.script_endpoint`, path `/storefront/script/{hook}`
- Hook `storefront-{hook}`, script folder `Resources/scripts/storefront-<hook>/`
- `hook.query`, `hook.page`, `hook.setResponse`
- Twig function `seoUrl`
- `bin/console dal:refresh:index`

## Gotchas

- Per the docs (6.7.16.0+): `name` and `hook` must match `[a-z0-9]+(-[a-z0-9]+)*`; `name` unique across all `<seo-url>`/`<entity-seo-url>` of the app; a `<seo-url>` needs a non-empty `<path>`; an `<entity-seo-url>` needs `entity` and a non-empty `<default-template>`.
- On install/update: static paths must be URL-safe and not already used (storefront route like `/account`, another app, existing SEO URL); a hook belongs to the first app declaring it, at most one `<seo-url>` and one `<entity-seo-url>` per hook; the entity must exist and not be a mapping/translation entity.
- The app needs `<read>` permission for the entity and every association used in the template (e.g. `product` and `product_manufacturer`); own custom entities need none. Generated paths are public.
- Entity-bound URLs are generated via the message queue — a [worker](platform/dev/6.7/guides/hosting/infrastructure/message-queue.md) must run.
- `<default-template>` is only the initial value; app updates do not overwrite an existing template. Changing `entity` resets all templates of the route, including sales channel overrides.
- Deactivate/uninstall marks the app's SEO URLs deleted; uninstall also removes templates unless app data is kept. New domains get static URLs on next activation/update or `dal:refresh:index`.
- Storefront sales channels only (no headless); no `hreflang` for app routes.

## Version notes

Introduced in 6.7.16.0 — not available earlier, and absent from the 6.7.15.1 manifest schema, whose `<storefront>` only allows `<template-load-priority>`. Documented shape (inside `<storefront>`, schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`):

```xml
<storefront>
    <seo-url name="imprint" hook="company-imprint">
        <path>imprint</path>
        <path lang="de-DE">impressum</path>
    </seo-url>
    <entity-seo-url name="blog-detail" entity="ce_blog">
        <default-template>blog/{{ ceBlog.translated.title }}</default-template>
    </entity-seo-url>
</storefront>
```

- Static: one SEO URL per storefront domain, `<path>` of the domain language with fallback to the default language; `hook` defaults to `name`.
- Entity-bound: one URL per entity and language, resolving to `/storefront/script/<name>?id=<entity-id>`; the entity is exposed camel-cased (`ce_blog` → `ceBlog`). Follows write indexing behaviour; skip with `indexing-skip: app_seo_url.seo-url`.
- Routes show in Administration *Settings > SEO* as `storefront.app.<app name>.<name>` (e.g. `storefront.app.SwagBlog.blog-detail`).

## Code check (6.7.15.1)
- absent `entity-seo-url` — manifest element not found anywhere in the 6.7.15.1 code (feature is 6.7.16.0+)
- absent `app_seo_url.seo-url` — indexer skip key not found in the 6.7.15.1 code
- corrected `storefront` — docs: holds `<seo-url>`/`<entity-seo-url>`; 6.7.15.1 XSD only allows `template-load-priority` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:225
- confirmed `frontend.script_endpoint` — route `/storefront/script/{hook}`, GET and POST — vendor/shopware/storefront/Controller/ScriptController.php:34
- confirmed `StorefrontHook::HOOK_NAME` — `storefront-{hook}` — vendor/shopware/storefront/Framework/Script/Api/StorefrontHook.php:34
- confirmed `seoUrl` — Twig function registered — vendor/shopware/core/Framework/Adapter/Twig/Extension/SeoUrlFunctionExtension.php:28
- confirmed `dal:refresh:index` — console command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
