---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-position.md
title: usePosition()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-position.html
sourceHash: 49d43066eb7e4ce847afa32a0ea8f2ab813f88b9
codeCheckedAgainst: "6.7.15.1"
keywords: ["usePosition", "getNewPosition", "raisePositionValue", "lowerPositionValue", "changePosition", "getSiblingIndex", "getSibling", "renumberPositions", "position mixin", "shopware:composables", "sort order", "entity collection", "composable"]
summary: "usePosition() admin composable: compute, swap and renumber position values of an entity collection; replaces the position mixin"
lastBuilt: 2026-10-21
---
## What it is

`usePosition()` is an Administration composable with helpers for the `position` integers that order an entity collection. It replaces the `position` mixin.

## When to use

In a Composition API admin component that lets users reorder items (move up/down) or needs the next free position before creating an entity.

## Key steps / config

```ts
import { usePosition } from 'shopware:composables';

const { getNewPosition, raisePositionValue } = usePosition();

const position = await getNewPosition(repository, new Criteria(1, 1), Shopware.Context.api);
```

Behaviour in the installed code:

- `getNewPosition(repository, criteria, context, field?)` adds `Criteria.max('maxPosition', field)` and a `DESC` sorting on `field` to the `criteria` you pass, searches, and resolves to max + 1 — or `1` when no max is found.
- `lowerPositionValue()` calls `changePosition(..., 'ASC')`; `raisePositionValue()` calls `changePosition(..., 'DESC')`. Each swaps the selected item's value with its neighbour.
- `changePosition(collection, selectedItem, field?, direction?)` (direction defaults to `'ASC'`) returns the collection unchanged when it has fewer than 2 items or the item is already at the edge.
- `getSiblingIndex()` returns `-1` in those cases; `getSibling()` returns `null`.
- `renumberPositions(collection, startIndex?, field?)` assigns consecutive values starting at `startIndex` (default `0`).
- Every function's optional `field` defaults to `'position'`. The collection is sorted in place by `field` and returned.

## Essential identifiers

- `usePosition()`
- `getNewPosition`, `lowerPositionValue`, `raisePositionValue`, `changePosition`, `getSiblingIndex`, `getSibling`, `renumberPositions`
- `position` mixin (Options API counterpart)

## Gotchas

- `getNewPosition()` mutates the `criteria` argument (aggregation + sorting) — pass a fresh `Criteria`.
- The sort functions mutate the passed collection.
- In 6.7.15.1 the composable is annotated `@private` and `@experimental stableVersion:v6.9.0 feature:ADMIN_MIXIN_COMPOSABLES`; the `shopware:composables` alias was not found in the installed Administration source.

## Version notes

The `position` mixin is still registered in 6.7.15.1; the composable duplicates its bodies.

## Code check (6.7.15.1)
- confirmed `usePosition()` — default export returning the seven helpers — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-position.ts:18
- confirmed `getNewPosition()` — max + 1, starting with 1; `field` defaults to `'position'` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-position.ts:62
- confirmed `maxPosition` — max aggregation plus `DESC` sort added to the passed criteria — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-position.ts:68
- confirmed `lowerPositionValue()` — delegates to `changePosition` with `'ASC'` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-position.ts:85
- confirmed `raisePositionValue()` — delegates to `changePosition` with `'DESC'` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-position.ts:96
- confirmed `changePosition()` — `direction = 'ASC'` default, no-op below 2 items — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-position.ts:107
- confirmed `getSiblingIndex()` — returns `-1` for fewer than 2 items or at the edge — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-position.ts:151
- confirmed `renumberPositions()` — `startIndex = 0` default — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-position.ts:199
- confirmed `position` — mixin still registered under this name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/position.mixin.ts:16
- unverified `shopware:composables` — import alias not found in the installed Administration src; may come from build tooling outside the checked roots
