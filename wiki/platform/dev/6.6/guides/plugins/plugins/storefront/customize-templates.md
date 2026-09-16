---
id: platform/dev/6.6/guides/plugins/plugins/storefront/customize-templates.md
title: Customize templates
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/customize-templates.html
sourceHash: 537d49b0da6fb21b61a381a01ceefe1316ceb6f0
keywords: ["customize templates", "sw_extends", "views directory", "logo.html.twig", "layout_header_logo_link", "cache:clear", "dump()", "FroshDevelopmentHelper", "template override", "block override", "Twig variables"]
summary: How to override a Storefront template block in a Shopware 6 plugin by mirroring the core view path and using sw_extends.
lastBuilt: 2026-09-15
---
## What it is

This guide covers customizing Storefront templates from a plugin, using the example of replacing the header logo with plain text.

## When to use

Use this whenever a plugin needs to change existing Storefront markup rather than add new pages entirely.

## Key steps / config

1. Shopware looks for plugin templates in a `views` directory under the plugin's `Resources` folder: `<plugin root>/src/Resources/views`. This is registered automatically once the folder exists.
2. Find the template to override by its filename inside `<shopware root>/src/Storefront` — for the logo, this is `logo.html.twig` in `storefront/layout/header`.
3. Recreate the exact same directory structure under the plugin's `views` folder: `<plugin root>/src/Resources/views/storefront/layout/header/logo.html.twig`. Matching the path starting from `views` is what makes Shopware load the override automatically.
4. Extend the original file and override the relevant block:

```twig
{% sw_extends '@Storefront/storefront/layout/header/logo.html.twig' %}

{% block layout_header_logo_link %}
    <h2>Hello world!</h2>
{% endblock %}
```

Use `{{ parent() }}` inside the block to append content instead of fully replacing it.

5. Clear the cache to see changes take effect:

```bash
./bin/console cache:clear
```

Also make sure the plugin's theme (if any) is assigned to the correct Sales Channel via the Theme tab.

6. To discover available template variables, use `{{ dump() }}` inside a template, which prints all variables available on that page.

## Essential identifiers

- plugin view path `<plugin root>/src/Resources/views`
- twig tag `{% sw_extends %}`
- example block `layout_header_logo_link`
- `./bin/console cache:clear`
- twig `dump()` function

## Gotchas

The override path must match the core path exactly starting from the `views` directory — any mismatch means the override is silently not loaded. The community plugin `FroshDevelopmentHelper` can add template-block hints to rendered HTML and expose page data in the Twig profiler tab, making it easier to find the right block and variables.
