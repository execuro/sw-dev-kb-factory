---
id: platform/dev/6.6/products/extensions/b2b-suite/concept/basic-conventions.md
title: Basic conventions
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/concept/basic-conventions.html"
sourceHash: "35337c8e979096e3b621f8a3074f13b706d2cab8"
keywords: ["b2b suite", "naming conventions", "b2b_*", "swag_b2b_", "container ids", "entity naming", "debtor", "contact", "twig blocks", "b2b--*", "coding standards", "snippet key"]
summary: "Naming and coding conventions for DI container ids, tables, attributes, Twig blocks and TypeScript in the Shopware B2B Suite."
lastBuilt: "2026-09-15"
---
## What it is

Reference of naming conventions the B2B Suite codebase follows, plus a glossary mapping B2B UI display names to their internal entity names.

## Key steps / config

Codebase conventions:

- DI container ids: all look like `b2b_*.*` (first `*` component name, second `*` class abbreviation).
- Database: table names start with `b2b_`, are singular, and use snake_case for fields and tables.
- Attributes: all attribute names start with `swag_b2b_`.
- Subscribers: methods are named after their function, not the event.
- Tests: methods are snake_case and start with `test_`.
- Templates: new layout modules are wrapped in `b2b--*` class containers, reusing Shopware's template style.
- CSS selectors: at most three levels of selector depth.
- Twig blocks: `{% block b2b_* %}{% endblock %}`, with empty blocks written on one line.
- JavaScript/TypeScript: the B2B Suite is written in TypeScript; storefront plugin files end in `*.plugin.ts`; interface files start with `I`, e.g. `IAjaxPanelEvent.ts`.
- Snippets: the root snippet key is `b2b`.

## Essential identifiers

- `b2b_*.*` (DI container id pattern)
- `b2b_` (table name prefix)
- `swag_b2b_` (attribute prefix)
- `b2b--*` (template class container prefix)
- `{% block b2b_* %}{% endblock %}`
- `*.plugin.ts`, `I*.ts`
- `b2b` (root snippet key)

## Gotchas

The B2B UI display names differ from the codebase entity names: Company administrator maps to `Debtor`, Employee maps to `Contact`, Cart details maps to `Positions`, Quick order maps to `Fastorder`, Quote maps to `Offers`, Purchase restriction maps to `Contingent`, Order restriction maps to `Contingent rule`, and Product restriction maps to `Contingent restrictions`.
