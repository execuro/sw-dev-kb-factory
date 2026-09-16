---
id: platform/dev/6.6/resources/references/adr/2020-08-12-document-template-refactoring.md
title: Document template refactoring
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-12-document-template-refactoring.html
sourceHash: a67684bd24e3eb9f013463e60dce908f4d814300
keywords: ["document template", "twig use block", "sw_extends", "sw_include", "invoice.html.twig", "base.html.twig", "nested line items", "document rendering", "adr"]
summary: "ADR refactoring Shopware document templates for nested line items, adopting Twig's use/block pattern over include overrides."
lastBuilt: 2026-09-15
---
## What it is

This ADR documents refactoring Shopware's document templates (invoices, delivery notes, etc.) to support nested line items, moving from a single `base.html.twig` with a loop over line items to smaller templates rendered recursively.

## When to use

Consult when customizing or extending a Shopware document template (e.g. invoice, delivery note) and needing to understand how block overrides work after the refactoring.

## Key steps / config

Two approaches were considered for keeping templates overridable after splitting them into smaller files:
1. Wrap each include in a block and overwrite the include in the corresponding template:
   ```twig
   {% block include_header %}
       {% sw_include '@Framework/documents/header.html.twig' %}
   {% endblock %}
   ```
   Disadvantage: exchanging a block requires first overwriting `base.html.twig`, then the corresponding include; several plugins overwriting the same include can conflict with each other.
2. Use Twig's `use` syntax to overwrite blocks of included files directly:
   ```twig
   {% use '@Framework/documents/includes/logo.html.twig' %}
   {{ block('logo') }}
   ```

Decision: Shopware adopted the `use`/`block` pattern from Twig to keep template extensibility simple. A developer can overwrite `base.html.twig` directly and extend/restructure all blocks, or make document-type-specific customizations in a file like `invoice.html.twig` (via `sw_extends`) without overwriting every include.

## Essential identifiers

`sw_extends`, `sw_include`, `{% use %}`, `{{ block() }}`, `base.html.twig`, `invoice.html.twig`

## Gotchas

Templates rendered via `use` cannot be inherited — this differs from the previous storefront template logic and had to be documented explicitly. Templates under `/shopware/src/Core/Framework/Resources/views/documents/includes` can no longer be extended by developers via `sw_extends`.
