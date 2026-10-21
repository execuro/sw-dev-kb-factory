---
id: platform/hubs/sw-extends.md
title: sw_extends
summary: Twig sw_extends template overriding in Storefront, CMS blocks, documents and B2B/subscription templates, across 6.6 and 6.7.
keywords: ["sw_extends", "twig", "storefront templates", "template override", "sw_include", "twig blocks", "template scoping", "document templates", "cms blocks", "twig functions"]
members: ["platform/dev/6.6/guides/plugins/apps/content/cms/add-custom-cms-blocks.md", "platform/dev/6.6/guides/plugins/apps/storefront/customize-templates.md", "platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/custom-fields-of-type-media.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-twig-function.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-dynamic-content-via-ajax-calls.md", "platform/dev/6.6/guides/plugins/plugins/storefront/customize-templates.md", "platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/modal-component.md", "platform/dev/6.6/products/extensions/subscriptions/guides/template-scoping.md", "platform/dev/6.6/resources/accessibility/storefront/_index.md", "platform/dev/6.6/resources/references/adr/2020-08-12-document-template-refactoring.md", "platform/dev/6.6/resources/references/storefront-reference/twig-function-reference.md", "platform/dev/6.6/resources/tooling/ide/shopware-toolbox.md", "platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md", "platform/dev/6.7/guides/development/tooling/shopware-toolbox.md", "platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md", "platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/customize-document-data-and-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/_index.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/modal-component.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md", "platform/dev/6.7/resources/references/adr/2020-08-12-document-template-refactoring.md", "platform/func/tutorials-and-faq/changing-a-template.md"]
lastBuilt: 2026-10-21
---

# sw_extends

`sw_extends` is the Shopware Twig tag used to override a template: mirror the original file path in the extension's `Resources/views`, `sw_extends` the original and replace individual blocks. It also underlies multi-inheritance (`sw_include`, `sw_use`) and the `scopes` option for restricting overrides. Come here when a task involves overriding Storefront, CMS block or document templates, or when you need the exact tag and function names; the pages below show which guide and version applies.

## Developer 6.7

Template overriding and Twig extension:
- [Templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/_index.md) — index of 6.7 Storefront template guides: overrides, agentic files, ESI header/footer, custom Twig functions.
- [Customize Templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md) — override a Twig template from a plugin via `Resources/views` and `sw_extends`.
- [Customize Templates](platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md) — the same override approach for apps.
- [Twig Functions Reference](platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md) — `sw_*` tags, functions, filters and extensions.
- [Add Custom Twig Functions](platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md) — `AbstractExtension` tagged `twig.extension` in `services.php`.
- [Add Custom Assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md) — static plugin assets, `assets:install`, Twig `asset()`.

CMS and documents:
- [Add Custom CMS Blocks](platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md) — app CMS blocks via `cms.xml`, `preview.html`, `styles.css` and a Twig template.
- [Customize Document Data and Templates](platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/customize-document-data-and-templates.md) — Document System v2 providers and template overrides.
- [Document template refactoring](platform/dev/6.7/resources/references/adr/2020-08-12-document-template-refactoring.md) — ADR on document includes pulled in via Twig `use` and `block()`.

Extensions, tooling, accessibility:
- [Modal component](platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/modal-component.md) — B2B Suite `_modal.html.twig` and `modalSettings`.
- [Template scoping](platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md) — restrict `sw_extends` to scopes (`default`, `subscription`, `mixed-subscription`).
- [Shopware 6 Toolbox](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) — PHPStorm plugin with generators and `shopware-block` Twig versioning.
- [Storefront Accessibility](platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md) — `ACCESSIBILITY_TWEAKS` flag (default in 6.7) and adapting Twig overrides.

## Developer 6.6

Near-duplicates of the 6.7 pages above unless noted; use them only for 6.6 projects.
- [Customize templates](platform/dev/6.6/guides/plugins/plugins/storefront/customize-templates.md) — plugin template override.
- [Customize templates](platform/dev/6.6/guides/plugins/apps/storefront/customize-templates.md) — app template override.
- [Add custom twig functions](platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-twig-function.md) — custom Twig function via `AbstractExtension`.
- [Shopware's twig functions](platform/dev/6.6/resources/references/storefront-reference/twig-function-reference.md) — Twig function and filter reference, including deprecated breadcrumb helpers.
- [Add custom CMS blocks](platform/dev/6.6/guides/plugins/apps/content/cms/add-custom-cms-blocks.md) — app CMS blocks.
- [Add CMS block](platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md) — plugin CMS block via `cmsService.registerCmsBlock` (6.6 only in this hub).
- [Using custom fields of type media](platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/custom-fields-of-type-media.md) — `searchMedia` in Twig.
- [Add dynamic content via AJAX calls](platform/dev/6.6/guides/plugins/plugins/storefront/add-dynamic-content-via-ajax-calls.md) — JSON controller plus JavaScript plugin fetch.
- [Add custom field in the storefront](platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md) — render custom field values and snippet labels.
- [Modal component](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/modal-component.md) — B2B Suite modal templates.
- [Template scoping](platform/dev/6.6/products/extensions/subscriptions/guides/template-scoping.md) — subscription checkout scoping.
- [Document template refactoring](platform/dev/6.6/resources/references/adr/2020-08-12-document-template-refactoring.md) — same ADR as in 6.7.
- [Shopware Toolbox](platform/dev/6.6/resources/tooling/ide/shopware-toolbox.md) — JetBrains plugin with live templates and generators.
- [Storefront](platform/dev/6.6/resources/accessibility/storefront/_index.md) — `ACCESSIBILITY_TWEAKS` rollout, default on in v6.7.0.

## Functional

- [Changing A Template](platform/func/tutorials-and-faq/changing-a-template.md) — derive a theme, override blocks with `sw_extends` and `parent()`, show snippets and custom fields, customize document templates.
