---
id: platform/func/tutorials-and-faq/changing-a-template.md
title: Changing A Template
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/changing-a-template
sourceHash: bef95476d8e2b80fe8e0f7d9af0fe1e9e074db8fa6896478e8ac6a3e7871c3fa
revision: {current: true, range: "6.1.0", swMax: null, swMin: null}
keywords: ["theme", "derived theme", "sw_extends", "twig", "storefront template", "theme:create", "dump()", "parent()", "trans", "snippets", "custom fields", "document template", "base.html.twig", "cache:clear"]
summary: "How to derive a Shopware storefront theme, override Twig blocks with sw_extends/parent(), show snippets and custom fields, and customize document templates."
lastBuilt: "2026-09-15"
---
## What it is
A walkthrough for customizing the Shopware storefront/document Twig templates by deriving a custom theme instead of editing the default theme, and for using the core template functions.

## When to use
When adjusting storefront template output, adding custom fields to a page, changing document templates (invoice, delivery note), or removing the default "Implemented with Shopware" footer branding.

## Key steps / config
- Never edit the default theme directly; always work in a derived theme.
- Create a theme: `php bin/console theme:create`. This generates an extension under **Extensions > My extensions**; install and activate it, then assign it in the sales channel settings.
- Storefront originals live under `/vendor/shopware/storefront/Resources/views/storefront`. Derive a file into `/custom/plugins/YourTheme/src/Resources/views/storefront/<folder1>/<folder2>`, keeping the `.html.twig` extension and original name, starting with:
```twig
{% sw_extends '@Storefront/storefront/_folder1_/folder_2_/file.html.twig' %}
```
- Core Twig helpers: `{{ dump() }}` lists available page variables; `{% block name_of_the_block %}` ... `{% endblock %}` overrides a block; `{{ parent() }}` includes the original block content; `{{ 'snippetName'|trans }}` renders a snippet (found under **Settings > Shop > Snippets**).
- Example footer snippet include:
```twig
{% sw_extends '@Storefront/storefront/layout/footer/footer.html.twig' %}
{% block layout_footer_service_menu_content %}
    {{ parent() }}
    {{ "sw.test.footer1"|trans }}
{% endblock %}
```
- After template changes, clear the cache: `php bin/console cache:clear` (or Admin **Settings > System > Caches & Indexes > Clear Caches**).
- Document templates: `base.html.twig` under `/vendor/shopware/core/Framework/Resources/views/documents/` is the foundation; per-type files (e.g. `invoice.html.twig`) extend it. Derive into `custom/plugins/YourTheme/src/Resources/views/documents/` via `{% sw_extends '@Framework/documents/base.html.twig' %}`.
- Add company email/website to documents by overriding `document_footer_first_column` with nested blocks `document_footer_companyEmail`/`document_footer_companyUrl`, reading `config.companyEmail`/`config.companyUrl`.
- Restrict a document change to one sales channel by checking `order.salesChannelId` inside an overridden `document_base` block; the sales channel ID is in the database table `sales_channel_translation`, column `sales_channel_id` (the leading `0x` prefix is not part of the ID).
- Show a custom field in the storefront: derive `description.html.twig` from `@Storefront/storefront/page/product-detail/description.html.twig` into `/custom/plugins/YourTheme/src/Resources/views/storefront/page/product-detail/`, override `page_product_detail_description_content_text`, call `{{ parent() }}`, then output `{{ page.product.translated.customFields._technical_name_customfield_ }}` (technical names typically start with `custom_`).
- Other custom-field variable roots: categories via `page.footer.navigation.active.translated.customFields...`, manufacturer via `page.product.manufacturer.translated.customFields...`, logged-in customer via `page.customer.customFields...` or `context.customer.customFields...`, address via `page.address.customFields...`, sales channel via `context.salesChannel.translated.customFields...`.
- Remove the Shopware logo: derive `footer.html.twig` and override `layout_footer_copyright` to output only `{{ "footer.copyrightInfo"|trans|sw_sanitize }}`.
- Remove the "Implemented with Shopware" text: edit the text module `footer.copyrightInfo` under **Settings > Shop > Text modules**, clear its value, and add a trailing space to save it as empty.

## Essential identifiers
`sw_extends`, `dump()`, `parent()`, `|trans`, `|sw_sanitize`, `php bin/console theme:create`, `php bin/console cache:clear`, `layout_footer_service_menu_content`, `layout_footer_copyright`, `document_footer_first_column`, `document_footer_companyEmail`, `document_footer_companyUrl`, `document_base`, `page_product_detail_description_content_text`, `footer.copyrightInfo`

## Gotchas
Custom fields for the customer are only available while the customer is logged in. Document-template customizations via `base.html.twig` apply to all sales channels regardless of theme activation unless explicitly restricted by checking `order.salesChannelId`.
