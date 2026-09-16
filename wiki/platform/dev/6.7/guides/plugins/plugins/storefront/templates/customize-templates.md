---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md
title: Customize Templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-templates.html
sourceHash: f38804a11a150c84e25b5a1baff5be2dbfa1efdc
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw_extends", "layout_header_logo_link", "logo.html.twig", "Resources/views", "parent()", "dump()", "cache:clear", "@Storefront", "template override", "twig block", "storefront template", "plugin views directory"]
summary: Override a Storefront Twig template from a plugin by mirroring its path under src/Resources/views and extending it with sw_extends.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/storefront-components.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md"]
---
## What it is

How a plugin overrides a Storefront Twig template: place a file at the same relative path under the plugin's views directory, extend the original with `sw_extends`, and redefine the blocks you want to change. The example replaces the header logo link with a "Hello world!" heading.

## When to use

You need to change markup rendered by a core Storefront template (or another bundle's template) from a plugin, without copying the whole file. Prerequisite: a working plugin (see [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

1. **View directory.** Shopware looks for templates in the bundle's `Resources/views` directory, i.e. `<plugin root>/src/Resources/views`.
2. **Find the template.** Search `<shopware root>/src/Storefront` for the term (here "logo"). The logo template is `Storefront/Resources/views/storefront/layout/header/logo.html.twig`.
3. **Mirror the path.** Starting from `views`, the path must be exactly the same: `<plugin root>/src/Resources/views/storefront/layout/header/logo.html.twig`.
4. **Extend and override a block:**

```twig
{% sw_extends '@Storefront/storefront/layout/header/logo.html.twig' %}

{% block layout_header_logo_link %}
    <h2>Hello world!</h2>
{% endblock %}
```

   To append instead of replace, call `{{ parent() }}` inside the block.
5. **Clear the cache:** `./bin/console cache:clear`, then reload the Storefront.
6. **Find variables:** `{{ dump() }}` prints all variables available in the template; use them as `{{ variableName }}`.

## Essential identifiers

- `sw_extends` — Shopware's multi-inheritance-aware `extends` tag
- `@Storefront/storefront/layout/header/logo.html.twig`
- `layout_header_logo_link` — block in the logo template
- `<plugin root>/src/Resources/views`
- `parent()`, `dump()`
- `./bin/console cache:clear`

## Gotchas

- The override only loads when the path below `views` matches the original exactly.
- An extending file with no block overrides changes nothing.
- Activate the plugin; when working with a theme, also assign it to the sales channel (Theme tab of the sales channel).
- The FroshDevelopmentHelper plugin adds template block/include hints to the rendered HTML and page data to the profiler's Twig tab.

## Version notes

- Since Shopware 6.7.11.0 a Storefront component system for reusable atomic template components is available; see [Storefront Components](platform/dev/6.7/concepts/framework/storefront-components.md).

## Code check (6.7.13.0)
- confirmed `sw_extends` — tag name returned by the Shopware extends token parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `layout_header_logo_link` — block exists in the core logo template — vendor/shopware/storefront/Resources/views/storefront/layout/header/logo.html.twig:3
- confirmed `Resources/views` — bundle template directory used by the namespace hierarchy — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/BundleHierarchyBuilder.php:38
- unverified `cache:clear` — Symfony console command, out of scope
- unverified `dump()` — Twig debug function from Symfony/Twig, out of scope
