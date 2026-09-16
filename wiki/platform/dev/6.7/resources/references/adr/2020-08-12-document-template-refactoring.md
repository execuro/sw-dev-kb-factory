---
id: platform/dev/6.7/resources/references/adr/2020-08-12-document-template-refactoring.md
title: Document template refactoring
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-12-document-template-refactoring.html
sourceHash: a67684bd24e3eb9f013463e60dce908f4d814300
codeCheckedAgainst: "6.7.13.0"
keywords: ["base.html.twig", "invoice.html.twig", "delivery_note.html.twig", "sw_extends", "twig use", "block()", "@Framework/documents/includes", "document templates", "pdf document", "invoice template", "nested line items", "adr"]
summary: "ADR: document Twig templates are split into includes rendered via use/block(); override their blocks in base or invoice templates, never extend includes."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-08-12) on how Shopware's document (PDF) Twig templates are structured. To support nested line items rendered recursively, the former single `base.html.twig` was split into smaller templates under `@Framework/documents/includes/`. These are pulled in with Twig's `use` tag and rendered with the `block()` function, so all their blocks can be overridden from `base.html.twig` or a document-type template.

## When to use

- You customize an invoice, delivery note, credit note or cancellation document template from a plugin or theme.
- You wonder why extending a template in `documents/includes/` via `sw_extends` has no effect.

## Key steps / config

1. Do not extend include templates. Extend `@Framework/documents/base.html.twig` (all documents) or a document-specific template such as `invoice.html.twig`, and override the block you need there — blocks from the includes are available in the using template.
2. Document-specific templates extend the base:

```twig
{% sw_extends '@Framework/documents/base.html.twig' %}

{% block document_headline %}
    ...
{% endblock %}
```

3. The base template composes includes with `use` and renders their blocks:

```twig
{% use '@Framework/documents/includes/logo.html.twig' %}

{{ block('logo') }}
```

In core, `base.html.twig` uses `includes/loop.html.twig`, `footer`, `summary`, `payment_shipping`, `comment` and `shipping_address`; `loop.html.twig` in turn uses `logo`, `letter_header`, `table_open`, `position`, `shipping_costs` and `table_close`.

## Essential identifiers

- `@Framework/documents/base.html.twig`
- `@Framework/documents/invoice.html.twig`, `delivery_note.html.twig`, `credit_note.html.twig`, `storno.html.twig`
- `@Framework/documents/includes/logo.html.twig` (block `logo`)
- `@Framework/documents/includes/loop.html.twig`
- `sw_extends`, Twig `use`, Twig `block()`

## Gotchas

- Templates in `Core/Framework/Resources/views/documents/includes` cannot be extended via `sw_extends`; templates rendered through `use` do not take part in inheritance. This differs from storefront template logic. Each include carries a comment stating this.
- The rejected alternative (wrapping each `sw_include` in a block and swapping includes per document type) would have required overriding `base.html.twig` and let plugins conflict over the same include.
- The ADR's example block name `headline` is illustrative; the installed invoice template overrides `document_headline`.

## Code check (6.7.13.0)
- confirmed `{% use '@Framework/documents/includes/loop.html.twig' %}` — base composes includes via `use` — vendor/shopware/core/Framework/Resources/views/documents/base.html.twig:10
- confirmed `{% use '@Framework/documents/includes/logo.html.twig' %}` — used by the loop include — vendor/shopware/core/Framework/Resources/views/documents/includes/loop.html.twig:12
- confirmed `block('logo')` — include block rendered via `block()` — vendor/shopware/core/Framework/Resources/views/documents/includes/loop.html.twig:34
- confirmed `{% block logo %}` — include defines the block plus a do-not-extend notice — vendor/shopware/core/Framework/Resources/views/documents/includes/logo.html.twig:12
- confirmed `sw_extends` — invoice extends `@Framework/documents/base.html.twig` — vendor/shopware/core/Framework/Resources/views/documents/invoice.html.twig:10
- corrected `document_headline` — docs: block `headline` in example — vendor/shopware/core/Framework/Resources/views/documents/invoice.html.twig:16
- confirmed `sw_extends` — delivery note extends the base template — vendor/shopware/core/Framework/Resources/views/documents/delivery_note.html.twig:10
- unverified `header.html.twig` — example from the rejected include-based option; no such file in the installed documents folder
