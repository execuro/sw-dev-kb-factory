---
id: platform/dev/6.6/guides/plugins/apps/storefront/customize-templates.md
title: Customize templates
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/storefront/customize-templates.html
sourceHash: f34cecb25ab72728d1537a5fddb08406f4f4a0e3
keywords: ["sw_extends", "storefront templates", "logo.html.twig", "Resources/views", "twig blocks", "cache:clear", "dump()", "layout_header_logo_link", "FroshDevelopmentHelper", "template override"]
summary: "How to override a Storefront twig template block from an app by mirroring the original file path under Resources/views."
lastBuilt: "2026-09-15"
---
## What it is
A guide to customizing Storefront templates from an app, demonstrated by replacing the header logo block with plain text.

## When to use
Use when an app must change Storefront markup by overriding specific twig blocks rather than the whole page.

## Key steps / config
Shopware looks for app templates under `<app root>/Resources/views` by default. To override a core template, mirror its path exactly starting from `views`, e.g. the core file at `Storefront/Resources/views/storefront/layout/header/logo.html.twig` is overridden at `<app root>/Resources/views/storefront/layout/header/logo.html.twig`.

```twig
{% sw_extends '@Storefront/storefront/layout/header/logo.html.twig' %}

{% block layout_header_logo_link %}
    <h2>Hello world!</h2>
{% endblock %}
```

Use `{{ parent() }}` inside a block to append rather than replace. Clear the cache after changes:

```bash
./bin/console cache:clear
```

Use `{{ dump() }}` in a template to print all available variables for that page.

## Essential identifiers
- `sw_extends`
- `layout_header_logo_link`
- `bin/console cache:clear`
- `dump()`

## Gotchas
After activating the app, the app's theme must also be assigned to the correct sales channel (Theme tab) for changes to appear. The `FroshDevelopmentHelper` community plugin can help locate template blocks and inspect available variables via the profiler.
