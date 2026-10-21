---
id: platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md
title: Customize Templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/storefront/customize-templates.html
sourceHash: f12592fb1deee20567d1e5758194781e9a288cd3
codeCheckedAgainst: "6.7.15.1"
keywords: ["app template override", "storefront twig", "sw_extends", "Resources/views", "logo.html.twig", "layout_header_logo_link", "parent()", "dump()", "twig block", "cache:clear", "storefront components", "app theme"]
summary: Override Storefront Twig templates from an app by mirroring the file path under Resources/views and extending it with sw_extends.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-base-guide.md"]
---
## What it is

How an app overrides Storefront Twig templates: place a file with the same relative path as the core template under the app's `Resources/views` directory, extend the original with `sw_extends`, and override individual blocks. Example: replacing the header logo with text.

## When to use

You have an app (see [App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md)) and need to change Storefront markup by overriding or appending to a Twig block.

## Key steps / config

1. Templates are loaded from `<app root>/Resources/views` by default.
2. Find the core template, e.g. by searching `src/Storefront` for the term. The logo lives at `Storefront/Resources/views/storefront/layout/header/logo.html.twig`.
3. Recreate the same path from `views` on: `<app root>/Resources/views/storefront/layout/header/logo.html.twig`. The path must match exactly for the override to load automatically.
4. Extend the original and override a block:

```twig
{% sw_extends '@Storefront/storefront/layout/header/logo.html.twig' %}

{% block layout_header_logo_link %}
    <h2>Hello world!</h2>
{% endblock %}
```

5. To append instead of replace, call `{{ parent() }}` inside the block.
6. Clear the cache: `./bin/console cache:clear`.
7. Activate the app and assign the theme to the sales channel (sidebar > sales channel > tab Theme).
8. Use variables as in plain Twig (`{{ variableName }}`); list all available ones with `{{ dump() }}`.

## Essential identifiers

- `Resources/views` (app template directory)
- `sw_extends`, `@Storefront` namespace
- `storefront/layout/header/logo.html.twig`, block `layout_header_logo_link`
- `parent()`, `dump()`
- `./bin/console cache:clear`

## Gotchas

- An `sw_extends` with no block overrides changes nothing.
- The app template loader only picks up `*.twig` files in the `storefront`, `documents`, `components` and `files` subdirectories of `Resources/views` (per installed code, not stated in the docs).
- The FroshDevelopmentHelper plugin (third party) adds block/include hints to rendered HTML and page data to the profiler's Twig tab.

## Version notes

- Since 6.7.11.0 a Storefront Components system offers reusable, composable atomic template components that apps can use.

## Code check (6.7.15.1)
- confirmed `Resources/views` — app template directory constant `TEMPLATE_DIR` — vendor/shopware/core/Framework/App/Template/TemplateLoader.php:17
- confirmed `TemplateLoader::ALLOWED_TEMPLATE_DIRS` — `storefront`, `documents`, `components`, `files` — vendor/shopware/core/Framework/App/Template/TemplateLoader.php:19
- confirmed `sw_extends` — tag registered by `ExtendsTokenParser` — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `layout_header_logo_link` — block in the core logo template — vendor/shopware/storefront/Resources/views/storefront/layout/header/logo.html.twig:3
- unverified `cache:clear` — Symfony console command, vendor/symfony out of scope
- unverified `dump()` — Twig debug function, out of scope
