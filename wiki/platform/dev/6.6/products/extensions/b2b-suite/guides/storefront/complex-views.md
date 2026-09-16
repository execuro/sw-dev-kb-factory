---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/complex-views.md
title: Complex views
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/storefront/complex-views.html"
sourceHash: 159a1271e14c6e9547b629bf3886ce2184e9e083
keywords: ["complex views", "b2b suite", "root controller", "sub-controller", "indexAction", "newAction", "createAction", "detailAction", "editAction", "updateAction", "removeAction", "assignAction", "ContactController"]
summary: "B2B Suite storefront controllers follow a root-controller / sub-controller naming scheme with a fixed set of CRUD actions and matching twig views."
lastBuilt: "2026-09-15"
---
## What it is
Describes the canonical controller naming and structure the B2B Suite's Administration-like frontend UI uses, illustrated by `ContactController` and its assignment controllers.

## Key steps / config
Controllers split into a *root controller* (no required parameters; page layout plus CRUD on one entity) and *sub-controllers* (depend on a context id; provide assignment/auxiliary actions), e.g.:

```
B2bContact - contact listing
├── B2bContactRole - role <-> contact assignment
├── B2bContactAddress - address <-> contact assignment
├── B2bContactContingent - contingent <-> contact assignment
├── B2bContactRoute - route <-> contact assignment
```

Root controller actions: `indexAction` (listing), `newAction` (empty form), `createAction` (POST-only, store new, forward to `detailAction` or back to `newAction`), `detailAction` (modal layout), `editAction` (edit form), `updateAction` (POST-only, forwards to `editAction`), `removeAction` (POST-only, forwards to `indexAction`). Matching views: `index.html.twig`, `detail.html.twig`, `edit.html.twig`, `_edit.html.twig`, `new.html.twig`, `_new.html.twig`, `_form.html.twig` — `detail`/`edit`/`new` extend `modal.html.twig`, the underscored ones extend `modal-content.html.twig`.

Sub-controller actions: `indexAction` (listing for the context) and `assignAction` (POST-only, assigns two ids). Only view: `index.html.twig`.

## Essential identifiers
- `indexAction`, `newAction`, `createAction`, `detailAction`, `editAction`, `updateAction`, `removeAction`, `assignAction`
- `modal.html.twig`, `modal-content.html.twig`

## Gotchas
POST-only actions never have a view of their own; they always forward to another action.
