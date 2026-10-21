---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md
title: Customize Templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-templates.html
sourceHash: f38804a11a150c84e25b5a1baff5be2dbfa1efdc
codeCheckedAgainst: "6.7.15.1"
keywords: ["template override", "sw_extends", "twig block", "parent()", "Resources/views", "logo.html.twig", "layout_header_logo_link", "dump()", "cache:clear", "storefront templates", "template inheritance", "FroshDevelopmentHelper", "storefront components"]
summary: Override a Storefront Twig template from a plugin by mirroring its path under Resources/views, sw_extends the original and replace blocks.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/concepts/framework/storefront-components.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md"]
---
## What it is

Basic guide to overriding a Storefront Twig template in a plugin. The example replaces the header logo link with a "Hello world!" heading by extending `logo.html.twig` and overriding one block.

## When to use

When a plugin must change or extend markup of an existing Storefront template. Prerequisite: a plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

1. **View directory.** Shopware looks for templates in the plugin's `Resources/views` directory by default: `<plugin root>/src/Resources/views`.
2. **Find the template.** Search the Storefront sources (e.g. for "logo"); the logo lives at `Storefront/Resources/views/storefront/layout/header/logo.html.twig`. The FroshDevelopmentHelper plugin adds block/include hints to the rendered HTML to help locate templates.
3. **Mirror the path.** Starting from `views`, the plugin path must be exactly the same: `<plugin root>/src/Resources/views/storefront/layout/header/logo.html.twig`. The file is then picked up automatically.
4. **Extend and override a block:**

```twig
{% sw_extends '@Storefront/storefront/layout/header/logo.html.twig' %}

{% block layout_header_logo_link %}
    <h2>Hello world!</h2>
{% endblock %}
```

   To append instead of replace, render `{{ parent() }}` inside the block.
5. **Clear the cache:** `./bin/console cache:clear`, then reload the Storefront.

**Finding variables.** Variables work as in plain Twig (`{{ variableName }}`). `{{ dump() }}` prints all variables available on the page; FroshDevelopmentHelper also lists page data in the profiler's Twig tab.

## Essential identifiers

- `sw_extends`
- `@Storefront/storefront/layout/header/logo.html.twig`
- `layout_header_logo_link`
- `parent()`, `dump()`
- `./bin/console cache:clear`

## Gotchas

- Activate the plugin and assign the theme to the correct sales channel (sales channel > Theme tab), otherwise the override does not show.
- Without any block override, an `sw_extends`-only file changes nothing.

## Version notes

- Since 6.7.11.0 a Storefront component system exists for reusable atomic template components — see [Storefront Components](platform/dev/6.7/concepts/framework/storefront-components.md).
- Next topics: [Adding styles](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md), [Adding translations](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md), [Using icons](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md), [Using custom assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md).

## Code check (6.7.15.1)
- confirmed `sw_extends` — Shopware extends tag name — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `Resources/views` — bundle template directory in the namespace hierarchy — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/BundleHierarchyBuilder.php:38
- confirmed `Resources/views` — template iterator scans this directory per bundle — vendor/shopware/core/Framework/Adapter/Twig/TemplateIterator.php:73
- confirmed `layout_header_logo_link` — block exists in logo.html.twig — vendor/shopware/storefront/Resources/views/storefront/layout/header/logo.html.twig:3
- unverified `cache:clear` — Symfony console command, out of scope
- unverified `dump()` — Symfony/Twig debug function, out of scope
