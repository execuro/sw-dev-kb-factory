---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/_index.md
title: Templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/
sourceHash: 48b5b7a496bccd28077f482b7ddd187282e27e17
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront templates", "twig", "sw_extends", "template inheritance", "customize templates", "agentic files", "header", "footer", "twig function", "twig.extension", "twig function reference", "plugin templates"]
summary: "Index of Storefront Twig template guides for plugins: customizing templates, agentic files, header/footer, custom Twig functions, function reference."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md"]
---
## What it is

Section overview for customizing and extending Storefront Twig templates in plugins. The source page is only a list of links to the guides in this section plus one reference page.

## When to use

Start here when you need to change Storefront markup from a plugin and want to find the right guide:

- [Customize Templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md) — overriding and extending Storefront Twig templates (template inheritance with `sw_extends`).
- [Agentic Files](platform/dev/6.7/guides/plugins/plugins/storefront/templates/agentic-files.md) — public sales-channel files such as `/llms.txt` rendered from Twig templates below `Resources/views/files/<file-family>/`.
- [Customize Header/Footer](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md) — header and footer are ESI sub-requests; pass page-dependent data via the `base_esi_header` / `base_esi_footer` blocks.
- [Add Custom Twig Functions](platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md) — registering your own Twig function via a service tagged `twig.extension`.
- Reference: [Shopware's Twig Functions](platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md) — the Twig functions Shopware provides.

## Essential identifiers

- `sw_extends` — Shopware's template inheritance tag
- `twig.extension` — DI tag for custom Twig extensions
- `base_esi_header`, `base_esi_footer` — ESI header/footer blocks in `base.html.twig`
- `Resources/views/files/<file-family>/` — agentic file template root

## Code check (6.7.13.0)
- confirmed `sw_extends` — token parser tag name — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `twig.extension` — tag used for Storefront Twig extensions — vendor/shopware/storefront/DependencyInjection/services.php:314
- confirmed `base_esi_header` — block in base template — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:54
- confirmed `base_esi_footer` — block in base template — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:113
- confirmed `SalesChannelFile::DEFAULT_FILE_FAMILY` — default file family `agentic` — vendor/shopware/core/System/SalesChannel/File/Discovery/SalesChannelFile.php:15
