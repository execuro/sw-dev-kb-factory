---
id: platform/dev/6.7/products/extensions/b2b-suite/concept/basic-conventions.md
title: Basic conventions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/concept/basic-conventions.html
sourceHash: c90d736cc5874243b974a5ef39aabd48f8e6969a
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "naming conventions", "b2b_*.*", "b2b_", "swag_b2b_", "b2b--*", "test_", "*.plugin.ts", "Debtor", "Contact", "Contingent", "Fastorder", "Offers", "Positions", "entity names"]
summary: "B2B Suite naming conventions (service ids, tables, Twig, TypeScript, snippets) and UI-term to entity-name mapping such as Debtor/Contact."
lastBuilt: 2026-10-21
---
## What it is

The naming conventions the B2B Suite codebase follows, plus a table mapping the English display names in the B2B storefront UI to the entity names used in the code.

## When to use

Use it when writing code that extends or reads the B2B Suite (service ids, tables, templates, tests, TypeScript plugins), or when you see a UI term such as "Employee" or "Quote" and need the entity name to search the codebase for.

## Key steps / config

Codebase conventions:

| Group | Practice |
|---|---|
| DI container | All container ids look like `b2b_*.*` — first asterisk = component name, second = class name abbreviation |
| Database | Table names start with `b2b_`, are singular; field and table names are snake case |
| Attributes | Attribute names start with `swag_b2b_` |
| Subscriber | Subscriber methods are named after their function, not after the event |
| Tests | Test methods are snake case and start with `test_` |
| Templates | New layout modules are wrapped in `b2b--*` class containers; modules reuse the Shopware template style |
| CSS selectors | Maximum three levels of selector depth |
| Twig blocks | Empty blocks are written on one line: `{% block b2b_* %}{% endblock %}` |
| JavaScript | Written in TypeScript |
| Storefront plugins | File names end with `*.plugin.ts` |
| Interfaces | File names start with `I`, e.g. `IAjaxPanelEvent.ts` |
| Snippets | Root snippet key is `b2b` |

Entity naming (display name → B2B Suite entity name):

| English term (display) | Entity name |
|---|---|
| Company administrator | Debtor |
| Employee | Contact |
| Cart details | Positions |
| Quick order | Fastorder |
| Quote | Offers |
| Purchase restriction | Contingent |
| Order restriction | Contingent rule |
| Product restriction | Contingent restrictions |

## Essential identifiers

- Prefixes: `b2b_*.*` (service ids), `b2b_` (tables), `swag_b2b_` (attributes), `b2b--*` (CSS containers), `test_` (test methods), `b2b` (snippet root)
- File patterns: `*.plugin.ts`, `IAjaxPanelEvent.ts`
- Entities: `Debtor`, `Contact`, `Positions`, `Fastorder`, `Offers`, `Contingent`

## Gotchas

- UI labels and code names differ: search the code for `Debtor`, not "company administrator", and `Offers`, not "quote".
- The `b2b_` tables listed in the core's usage-data allow list (e.g. `b2b_employee`) belong to the newer B2B Components, not to the B2B Suite — the prefix alone does not identify which product a table comes from.

## Code check (6.7.15.1)
- unverified `b2b_*.*` — B2B Suite service-id convention; the B2B Suite is a separate extension, not in vendor/shopware packages
- unverified `swag_b2b_` — no occurrence in the installed core/storefront/administration packages
- unverified `IAjaxPanelEvent.ts` — B2B Suite storefront file, out of scope
- confirmed `b2b_employee` — core usage-data allow list contains B2B Components tables with the `b2b_` prefix — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2084
