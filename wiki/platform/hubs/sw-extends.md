---
id: platform/hubs/sw-extends.md
title: sw_extends
summary: "How sw_extends overrides Storefront Twig templates, CMS blocks, custom fields, document templates, and Twig functions across apps and plugins."
keywords: ["sw_extends", "twig template override", "storefront templates", "cms block", "custom twig function", "custom fields storefront", "document template", "twig function reference", "accessibility", "shopware toolbox", "b2b suite modal", "subscription template scoping"]
members: ["platform/dev/6.6/guides/plugins/apps/content/cms/add-custom-cms-blocks.md", "platform/dev/6.6/guides/plugins/apps/storefront/customize-templates.md", "platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/custom-fields-of-type-media.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-twig-function.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-dynamic-content-via-ajax-calls.md", "platform/dev/6.6/guides/plugins/plugins/storefront/customize-templates.md", "platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/modal-component.md", "platform/dev/6.6/products/extensions/subscriptions/guides/template-scoping.md", "platform/dev/6.6/resources/accessibility/storefront/_index.md", "platform/dev/6.6/resources/references/adr/2020-08-12-document-template-refactoring.md", "platform/dev/6.6/resources/references/storefront-reference/twig-function-reference.md", "platform/dev/6.6/resources/tooling/ide/shopware-toolbox.md", "platform/dev/6.7/concepts/commerce/checkout-concept/document/extension-points.md", "platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md", "platform/dev/6.7/guides/development/tooling/shopware-toolbox.md", "platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md", "platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/customize-document-data-and-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-custom-fields-storefront.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/_index.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/modal-component.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md", "platform/dev/6.7/resources/references/adr/2020-08-12-document-template-refactoring.md", "platform/func/tutorials-and-faq/changing-a-template.md"]
lastBuilt: "2026-09-15"
---

`sw_extends` is the Twig tag Shopware apps, plugins and themes use to override Storefront
templates, CMS blocks, document templates and custom-field output by mirroring the original
file path and extending its blocks. Come here instead of grepping when you need to decide
which override mechanism (template block, CMS block XML, Twig function extension, document
data provider) applies to a given customization, or when a topic has separate 6.6 and 6.7
guides that mostly overlap.

**Template overrides (apps & plugins)**
- [Customize templates](platform/dev/6.6/guides/plugins/apps/storefront/customize-templates.md) — app: mirror a Storefront view path under `Resources/views` and `sw_extends` it.
- [Customize templates](platform/dev/6.6/guides/plugins/plugins/storefront/customize-templates.md) — plugin: same pattern under the plugin's view path (6.6).
- [Customize Templates](platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md) — app version updated for 6.7; near-duplicate of the 6.6 app guide.
- [Customize Templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md) — plugin version updated for 6.7; near-duplicate of the 6.6 plugin guide.
- [Templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/_index.md) — 6.7 index page grouping the plugin template guides.
- [Changing A Template](platform/func/tutorials-and-faq/changing-a-template.md) — deriving a theme and overriding blocks with `sw_extends`/`parent()`.

**Custom CMS blocks (apps)**
- [Add custom CMS blocks](platform/dev/6.6/guides/plugins/apps/content/cms/add-custom-cms-blocks.md) and [Add Custom CMS Blocks](platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md) — near-duplicate `cms.xml`/`preview.html`/`styles.css` guides, 6.6 vs 6.7.
- [Add CMS block](platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md) — plugin variant via `cmsService.registerCmsBlock`.

**Custom Twig functions**
- [Add custom twig functions](platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-twig-function.md) and [Add Custom Twig Functions](platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md) — near-duplicate `AbstractExtension`/`twig.extension` guides, 6.6 vs 6.7.
- [Shopware's twig functions](platform/dev/6.6/resources/references/storefront-reference/twig-function-reference.md) and [Twig Functions Reference](platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md) — near-duplicate full function/filter/tag reference, 6.6 vs 6.7.
- [Add dynamic content via AJAX calls](platform/dev/6.6/guides/plugins/plugins/storefront/add-dynamic-content-via-ajax-calls.md) — controller + JS plugin fetch pattern.
- [Add Custom Assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md) — serving plugin static assets via `asset()`/SCSS.

**Custom fields in the storefront**
- [Using custom fields of type media](platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/custom-fields-of-type-media.md) — resolving media UUIDs via `searchMedia`.
- [Add custom field in the storefront](platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md) and [Add Custom Field in the Storefront](platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-custom-fields-storefront.md) — near-duplicate custom-field rendering guides, 6.6 vs 6.7.

**Document templates**
- [Document template refactoring](platform/dev/6.6/resources/references/adr/2020-08-12-document-template-refactoring.md) and its [6.7 copy](platform/dev/6.7/resources/references/adr/2020-08-12-document-template-refactoring.md) — same ADR, use/block over include overrides.
- [Extension Points](platform/dev/6.7/concepts/commerce/checkout-concept/document/extension-points.md) and [Customize Document Data and Templates](platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/customize-document-data-and-templates.md) — Document System v2 tagged providers/renderers plus `sw_extends` template overrides.

**Accessibility & tooling**
- [Storefront](platform/dev/6.6/resources/accessibility/storefront/_index.md) and [Storefront Accessibility](platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md) — WCAG 2.1 AA rollout via feature flag, 6.6 vs 6.7.
- [Shopware Toolbox](platform/dev/6.6/resources/tooling/ide/shopware-toolbox.md) and [Shopware 6 Toolbox](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) — JetBrains plugin generators/inspections referencing `sw_extends`, 6.6 vs 6.7.

**Extension products**
- [Modal component](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/modal-component.md) and its [6.7 copy](platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/modal-component.md) — B2B Suite modal template overrides.
- [Template scoping](platform/dev/6.6/products/extensions/subscriptions/guides/template-scoping.md) and its [6.7 copy](platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md) — scoping `sw_extends` to the subscription checkout only.
