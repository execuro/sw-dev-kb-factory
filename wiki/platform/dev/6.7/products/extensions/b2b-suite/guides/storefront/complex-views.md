---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/complex-views.md
title: Complex views
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/complex-views.html
sourceHash: 159a1271e14c6e9547b629bf3886ce2184e9e083
codeCheckedAgainst: "6.7.13.0"
keywords: ["B2bContact", "B2bContactRole", "root controller", "sub-controller", "indexAction", "createAction", "assignAction", "modal.html.twig", "modal-content.html.twig", "b2b suite controller naming", "crud actions", "assignment controller"]
summary: B2B Suite storefront controller conventions - root controller CRUD actions, sub-controller assignment actions, B2bContact naming, and their twig views.
lastBuilt: 2026-09-15
---
## What it is

Describes how the B2B Suite structures its administration-like storefront UI: controller naming, the split into root controllers and sub-controllers, the canonical action names, and which twig views each has. Every controller belongs to one component.

## When to use

When adding or extending a B2B Suite storefront controller and its templates so that it follows the suite's canonical structure.

## Key steps / config

Naming (example: the contact component):

```
B2bContact - contact listing
├── B2bContactRole - role <-> contact assignment
├── B2bContactAddress - address <-> contact assignment
├── B2bContactContingent - contingent <-> contact assignment
├── B2bContactRoute - route <-> contact assignment
```

**Root controller** — needs no parameters; provides the page layout and CRUD on one entity:

- `indexAction` — page layout plus listing
- `newAction` — empty form, or errors and invalid entries
- `createAction` — POST only; stores a new entity, forwards to `newAction` on invalid input, to `detailAction` on success
- `detailAction` — detail layout, usually a modal with navigation initially selecting `editAction`
- `editAction` — form with all stored data
- `updateAction` — POST only; stores updates, forwards to `editAction`
- `removeAction` — POST only; removes a record, forwards to `indexAction`

POST-only actions only process data and have no view, so root views are:

- `index.html.twig` — listing grid
- `detail.html.twig` — modal layout with navigation, extends `modal.html.twig`
- `edit.html.twig` / `new.html.twig` — extend `modal.html.twig`
- `_edit.html.twig` / `_new.html.twig` — extend `modal-content.html.twig`
- `_form.html.twig` — internal form shared by edit and new

**Sub-controller** — depends on request context (usually a selected id) and provides auxiliary actions such as assignments:

- `indexAction` — layout and listing
- `assignAction` — POST only; assigns two ids to each other

Its only view is `index.html.twig` (entity listing).

## Essential identifiers

- Controller names: `B2bContact`, `B2bContactRole`, `B2bContactAddress`, `B2bContactContingent`, `B2bContactRoute`
- Root actions: `indexAction`, `newAction`, `createAction`, `detailAction`, `editAction`, `updateAction`, `removeAction`
- Sub-controller actions: `indexAction`, `assignAction`
- Templates: `index.html.twig`, `detail.html.twig`, `edit.html.twig`, `_edit.html.twig`, `new.html.twig`, `_new.html.twig`, `_form.html.twig`, `modal.html.twig`, `modal-content.html.twig`

## Gotchas

- There are fewer views than actions: `createAction`, `updateAction`, `removeAction` and `assignAction` never render a template.
- The modal templates are covered by the B2B Suite modal component page.

## Code check (6.7.13.0)
- unverified `B2bContact` — B2B Suite controller; the B2B Suite plugin is not part of the installed core/storefront/administration packages
- unverified `B2bContactRole` — B2B Suite controller, not installed
- unverified `indexAction` — B2B Suite controller convention, not installed
- unverified `createAction` — B2B Suite controller convention, not installed
- unverified `assignAction` — B2B Suite controller convention, not installed
- unverified `modal-content.html.twig` — B2B Suite template, not installed
