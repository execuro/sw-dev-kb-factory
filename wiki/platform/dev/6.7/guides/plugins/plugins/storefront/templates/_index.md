---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/_index.md
title: Templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/
sourceHash: 48b5b7a496bccd28077f482b7ddd187282e27e17
codeCheckedAgainst: "6.7.15.1"
keywords: ["storefront templates", "twig", "sw_extends", "template override", "template inheritance", "agentic files", "header footer esi", "twig function", "twig.extension", "Resources/views", "plugin templates", "theme templates"]
summary: Index of Shopware 6.7 Storefront template guides for plugins - overriding Twig templates, agentic files, ESI header/footer, custom Twig functions.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/agentic-files.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md"]
---
## What it is

Section index for customizing and extending Storefront Twig templates from a plugin. It lists the guides in this section and one reference page.

## When to use

Start here when a plugin needs to change Storefront markup and you need to pick the right guide.

## Key steps / config

Guides in this section:

- [Customize Templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md) — mirror a core template path under the plugin's `Resources/views` directory and extend it with `{% sw_extends '@Storefront/...' %}`, overriding individual blocks.
- [Agentic Files](platform/dev/6.7/guides/plugins/plugins/storefront/templates/agentic-files.md) — public per-sales-channel files (`/llms.txt`, `/agents.md`, `/.well-known/ai-catalog.json`) rendered from templates under `Resources/views/files/<file-family>/`.
- [Customize Header/Footer](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md) — header and footer are ESI sub-requests since 6.7.0.0; pass page data via the `base_esi_header` / `base_esi_footer` blocks.
- [Add Custom Twig Functions](platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md) — a Twig `AbstractExtension` registered with the `twig.extension` service tag.

Reference:

- [Shopware's Twig Functions](platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md)

## Essential identifiers

- `sw_extends`
- `Resources/views`
- `twig.extension`

## Code check (6.7.15.1)
- confirmed `sw_extends` — Shopware's extends token parser tag name — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `Resources/views` — bundle template directory registered in the Twig namespace hierarchy — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/BundleHierarchyBuilder.php:38
- confirmed `twig.extension` — service tag used for Storefront Twig extensions — vendor/shopware/storefront/DependencyInjection/services.php:324
- confirmed `base_esi_header` — ESI header block in base template — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:54
