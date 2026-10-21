---
id: platform/dev/6.7/resources/references/adr/2020-08-12-document-template-refactoring.md
title: Document template refactoring
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-12-document-template-refactoring.html
sourceHash: a67684bd24e3eb9f013463e60dce908f4d814300
codeCheckedAgainst: "6.7.15.1"
keywords: ["document template", "base.html.twig", "invoice.html.twig", "delivery_note.html.twig", "sw_extends", "twig use", "block()", "@Framework/documents/includes", "logo.html.twig", "nested line items", "pdf document", "invoice customization", "adr"]
summary: "ADR: Shopware document templates are split into includes pulled in via Twig use + block(); override blocks in base.html.twig or invoice.html.twig."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2020-08-12) on how Shopware's document (PDF) templates are structured. To support nested line items, which are now rendered recursively instead of in a flat loop, the single monolithic `base.html.twig` was split into smaller templates. The ADR decides how document-type templates (`invoice.html.twig`, `delivery_note.html.twig`) and plugins can still override parts of those split-out templates.

## When to use

- You customise invoice, delivery note, credit note or storno document templates in a plugin or theme.
- You wonder why `sw_extends` on a template under `documents/includes` has no effect.

## Key steps / config

Two options were evaluated:

1. A block around each `sw_include`, overridden per document type to include a different file (e.g. an `invoice_header.html.twig`). Rejected: to swap one block you must override the include, several includes may need overriding, and two plugins overriding the same include conflict because inheritance does not apply.
2. Twig's `use` tag plus the `block()` function. Chosen: the blocks of used templates become available in the using template, so they can be overridden directly.

Decision — the base template pulls in the includes with `use` and renders them with `block()`:

```twig
{% use '@Framework/documents/includes/logo.html.twig' %}

{{ block('logo') }}
```

In 6.7.15.1, `base.html.twig` uses `loop`, `footer`, `summary`, `payment_shipping`, `comment` and `shipping_address` from `@Framework/documents/includes/`; `loop.html.twig` in turn uses `logo`, `letter_header`, `table_open`, `position`, `table_close`, `shipping_costs`, and renders `{{ block('logo') }}`.

To customise a document type, extend the base template and override the block directly:

```twig
{% sw_extends '@Framework/documents/base.html.twig' %}

{% block document_headline %}
    <h1>invoice</h1>
{% endblock %}
```

`document_headline` is the block the installed `invoice.html.twig` overrides (defined in `includes/table_open.html.twig`). The ADR's example used a block named `headline`, which is illustrative.

## Essential identifiers

- `@Framework/documents/base.html.twig`
- `@Framework/documents/invoice.html.twig`, `delivery_note.html.twig`
- `@Framework/documents/includes/*.html.twig` (e.g. `logo.html.twig`, `loop.html.twig`)
- Twig `{% use %}` tag, `{{ block('...') }}` function, Shopware `sw_extends`

## Gotchas

- Templates in `src/Core/Framework/Resources/views/documents/includes` cannot be extended via `sw_extends`: templates rendered through `use`/`block()` are not inherited. This differs from storefront template inheritance. Override their blocks in `base.html.twig` or the document-specific template instead.
- Each include carries a "Do not extend this template!" notice pointing to this behaviour.
- Advantage of the chosen approach: several plugins overriding the same block do not collide, as they would with competing includes.

## Code check (6.7.15.1)
- confirmed `@Framework/documents/includes/loop.html.twig` — base template pulls includes in with `use` — vendor/shopware/core/Framework/Resources/views/documents/base.html.twig:10
- confirmed `@Framework/documents/includes/logo.html.twig` — used by the loop include — vendor/shopware/core/Framework/Resources/views/documents/includes/loop.html.twig:12
- confirmed `block('logo')` — rendered via the block function — vendor/shopware/core/Framework/Resources/views/documents/includes/loop.html.twig:34
- confirmed `block logo` — include notice says do not extend, override blocks in base.html.twig instead — vendor/shopware/core/Framework/Resources/views/documents/includes/logo.html.twig:12
- confirmed `sw_extends` — invoice extends `@Framework/documents/base.html.twig` — vendor/shopware/core/Framework/Resources/views/documents/invoice.html.twig:10
- corrected `document_headline` — docs: block `headline`; installed invoice overrides `document_headline` — vendor/shopware/core/Framework/Resources/views/documents/invoice.html.twig:16
- confirmed `document_headline` — defined in the table_open include — vendor/shopware/core/Framework/Resources/views/documents/includes/table_open.html.twig:17
- confirmed `nestedLineItems` — base template renders `order.nestedLineItems` — vendor/shopware/core/Framework/Resources/views/documents/base.html.twig:35
- unverified `invoice_header.html.twig` — illustrative template of the rejected option; no such file under documents/ in 6.7.15.1
