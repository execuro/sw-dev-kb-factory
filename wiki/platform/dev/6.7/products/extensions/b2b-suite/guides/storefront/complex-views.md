---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/complex-views.md
title: Complex views
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/complex-views.html
sourceHash: 159a1271e14c6e9547b629bf3886ce2184e9e083
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "complex views", "controller structure", "root controller", "sub-controller", "B2bContact", "B2bContactRole", "indexAction", "createAction", "assignAction", "modal.html.twig", "crud actions", "assignment controller"]
summary: B2B Suite storefront controller naming - root controllers with CRUD actions and views, sub-controllers for assignments with indexAction/assignAction.
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite ships a storefront UI with Administration-like features. Its controllers follow a canonical naming scheme: every controller belongs to one component, and controllers are split into *root controllers* and *sub-controllers*. This page describes that structure, the action set of each type and the Twig views that go with them.

## When to use

Use it when you add or extend a B2B Suite storefront controller and want to follow the suite's naming, action and template conventions — e.g. adding a new assignment to an existing entity listing.

## Key steps / config

Controller naming, using the contact component as example:

```
B2bContact - contact listing
├── B2bContactRole - role <-> contact assignment
├── B2bContactAddress - address <-> contact assignment
├── B2bContactContingent - contingent <-> contact assignment
├── B2bContactRoute - route <-> contact assignment
```

**Root controller** — needs no parameters; provides the page layout and CRUD on a single entity:

- `indexAction` — page layout plus entity listing
- `newAction` — empty form, or errors and invalid entries
- `createAction` — POST only; stores a new entity, forwards to `newAction` on invalid input, to `detailAction` on success
- `detailAction` — detail layout, usually a modal with navigation that initially selects `editAction`
- `editAction` — form with all stored data
- `updateAction` — POST only; stores updates, forwards to `editAction`
- `removeAction` — POST only; removes a record, forwards to `indexAction`

POST-only actions only process data and have no view, so a root controller has fewer views than actions:

```
├── index.html.twig   - the listing grid
├── detail.html.twig  - modal layout with navigation, extends modal.html.twig
├── edit.html.twig    - extends modal.html.twig
├── _edit.html.twig   - extends modal-content.html.twig
├── new.html.twig     - extends modal.html.twig
├── _new.html.twig    - extends modal-content.html.twig
├── _form.html.twig   - internal form shared by edit and new
```

**Sub-controller** — depends on a context from the request (usually a selected id) and provides auxiliary actions such as assignments:

- `indexAction` — controller layout plus listing
- `assignAction` — POST only; assigns two ids to each other

It therefore has a single view: `index.html.twig` (entity listing).

## Essential identifiers

- Controller names: `B2bContact`, `B2bContactRole`, `B2bContactAddress`, `B2bContactContingent`, `B2bContactRoute`
- Root controller actions: `indexAction`, `newAction`, `createAction`, `detailAction`, `editAction`, `updateAction`, `removeAction`
- Sub-controller actions: `indexAction`, `assignAction`
- Templates: `index.html.twig`, `detail.html.twig`, `edit.html.twig`, `_edit.html.twig`, `new.html.twig`, `_new.html.twig`, `_form.html.twig`, `modal.html.twig`, `modal-content.html.twig`

## Gotchas

- POST-only actions (`createAction`, `updateAction`, `removeAction`, `assignAction`) never render a view; they forward to another action. This keeps methods small for extension developers.
- Detail, edit and new views build on the B2B modal templates; see the B2B Suite modal component page for their blocks and settings.

## Code check (6.7.15.1)
- unverified `B2bContact` — B2B Suite plugin controller, not part of the core/storefront/administration checkout
- unverified `RootController` — illustrative class from the docs, no base class or interface to check
- unverified `SubController` — illustrative class from the docs, no base class or interface to check
- unverified `modal.html.twig` — B2B Suite plugin template, out of scope
- confirmed `SwagB2bPlatform` — the B2B Suite is a separate plugin listed among translatable plugins — vendor/shopware/core/System/Resources/translation.yaml:9
