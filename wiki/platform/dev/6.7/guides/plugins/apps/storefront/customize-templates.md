---
id: platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md
title: Customize Templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/storefront/customize-templates.html
sourceHash: f12592fb1deee20567d1e5758194781e9a288cd3
codeCheckedAgainst: "6.7.13.0"
keywords: ["twig", "template override", "sw_extends", "Resources/views", "logo.html.twig", "layout_header_logo_link", "parent()", "dump()", "cache:clear", "app storefront templates", "block override", "storefront components"]
summary: "Override Storefront Twig templates from an app: mirror the path under Resources/views, sw_extends the original, override blocks, clear the cache"
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-base-guide.md"]
---
## What it is

How an app overrides Storefront Twig templates: place a file with the same relative path under the app's `Resources/views` directory, extend the original with `sw_extends`, and override individual blocks.

## When to use

You build an app (see [App base guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md)) and need to change or extend Storefront markup, e.g. replace the header logo.

## Key steps / config

1. Template directory: Shopware loads app templates from `<app root>/Resources/views`.
2. Locate the original template in the Storefront bundle, e.g. `Storefront/Resources/views/storefront/layout/header/logo.html.twig`.
3. Recreate the exact same path below `views` in your app: `<app root>/Resources/views/storefront/layout/header/logo.html.twig`. Starting from `views`, the path must be identical for the override to load.
4. Extend the original and override a block:

```twig
{% sw_extends '@Storefront/storefront/layout/header/logo.html.twig' %}

{% block layout_header_logo_link %}
    <h2>Hello world!</h2>
{% endblock %}
```

5. To append instead of replace, call `{{ parent() }}` inside the block. A file that only contains the `sw_extends` line changes nothing.
6. Clear the cache and reload the Storefront: `./bin/console cache:clear`.
7. Activate the app and assign the theme to the sales channel (sidebar > sales channel > Theme tab).

Finding variables: use `{{ variableName }}` as in plain Twig; `{{ dump() }}` prints all variables available on the page.

## Essential identifiers

- `Resources/views` — app template directory
- `sw_extends` — Shopware's Twig extends tag
- `@Storefront/storefront/layout/header/logo.html.twig`, block `layout_header_logo_link`
- `parent()`, `dump()`
- `./bin/console cache:clear`

## Gotchas

- The installed app template loader only picks up `*.twig` files located under `storefront`, `documents`, `components` or `files` subdirectories of `Resources/views`; files elsewhere are ignored.
- Changes may not show until the cache is cleared.
- The FroshDevelopmentHelper plugin (community tool) adds template block hints to the rendered HTML and page data to the profiler's Twig tab.

## Version notes

- Since Shopware 6.7.11.0 a Storefront component system for reusable atomic template components is available to apps as well; see the Storefront Components concept documentation.

## Code check (6.7.13.0)
- confirmed `TEMPLATE_DIR` — app templates read from `/Resources/views` — vendor/shopware/core/Framework/App/Template/TemplateLoader.php:17
- confirmed `ALLOWED_TEMPLATE_DIRS` — only storefront, documents, components, files subdirs — vendor/shopware/core/Framework/App/Template/TemplateLoader.php:19
- confirmed `ALLOWED_FILE_EXTENSIONS` — `*.twig` only — vendor/shopware/core/Framework/App/Template/TemplateLoader.php:26
- confirmed `sw_extends` — Twig token parser tag — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `layout_header_logo_link` — block exists in Storefront logo template — vendor/shopware/storefront/Resources/views/storefront/layout/header/logo.html.twig:3
- confirmed `getTemplatePathsForApp()` — template paths collected during app lifecycle — vendor/shopware/core/Framework/App/Lifecycle/Handler/TemplateLifecycleHandler.php:66
- unverified `cache:clear` — Symfony console command, vendor/symfony out of scope
