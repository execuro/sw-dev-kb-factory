---
id: platform/dev/6.7/products/extensions/b2b-suite/concept/basic-conventions.md
title: Basic conventions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/concept/basic-conventions.html
sourceHash: c90d736cc5874243b974a5ef39aabd48f8e6969a
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b_*.*", "b2b_", "swag_b2b_", "b2b--*", "test_", "*.plugin.ts", "IAjaxPanelEvent.ts", "naming conventions", "debtor", "contact", "contingent", "fastorder", "offers", "positions", "b2b suite"]
summary: "B2B Suite naming conventions (service ids b2b_*.*, tables b2b_, attributes swag_b2b_, Twig, TypeScript) and UI-to-entity names like Debtor, Contact."
lastBuilt: 2026-09-15
---
## What it is

The naming conventions the B2B Suite codebase follows, plus a mapping between the display names shown in the B2B storefront UI and the entity names used in the code.

## When to use

When writing code for or around the B2B Suite (services, tables, templates, TypeScript plugins, snippets), or when you need to find the code entity behind a term shown in the B2B storefront (e.g. "Employee" is `Contact`).

## Key steps / config

Codebase conventions:

| Group | Practice |
|---|---|
| DI container | All container ids look like `b2b_*.*` — first `*` = component name, second `*` = class name abbreviation |
| Database | Table names start with `b2b_`, are singular; field and table names are snake case |
| Attributes | Attribute names start with `swag_b2b_` |
| Subscribers | Methods are named after their function, not after the event |
| Tests | Test methods are snake case and start with `test_` |
| Templates | New layout modules are wrapped in `b2b--*` class containers; modules reuse Shopware's template style |
| CSS selectors | At most three levels of selector depth |
| Twig blocks | `{% block b2b_* %}{% endblock %}` — empty blocks on one line |
| JavaScript | Written in TypeScript; storefront plugin files end with `*.plugin.ts` |
| Interfaces | File names start with `I`, e.g. `IAjaxPanelEvent.ts` |
| Snippets | Root snippet key is `b2b` |

Entity naming (English display name → B2B Suite entity name):

| Display name | Entity name |
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

- `b2b_*.*` (service id pattern), `b2b_` (table prefix), `swag_b2b_` (attribute prefix)
- `b2b--*` (CSS container class), `b2b_*` (Twig block prefix), `b2b` (snippet root key)
- `test_` (test method prefix), `*.plugin.ts`, `IAjaxPanelEvent.ts`

## Gotchas

- UI terms and code entity names differ: search the code for `Debtor`, `Contact`, `Contingent`, `Offers`, not "Company administrator", "Employee", "Purchase restriction", "Quote".

## Code check (6.7.13.0)
- unverified `swag_b2b_` — B2B Suite extension not installed; no match under vendor/shopware roots
- unverified `IAjaxPanelEvent.ts` — B2B Suite extension not installed; no match under vendor/shopware roots
- unverified `b2b_*.*` — B2B Suite service ids not present in vendor/shopware/core, storefront or administration
