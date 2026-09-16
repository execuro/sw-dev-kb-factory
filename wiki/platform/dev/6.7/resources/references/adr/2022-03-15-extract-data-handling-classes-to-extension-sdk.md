---
id: platform/dev/6.7/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md
title: Extract data handling classes to extension sdk
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.html
sourceHash: 736010d38ee9e7c9f561ff211eee66c5806c6e18
codeCheckedAgainst: "6.7.13.0"
keywords: ["Entity", "EntityCollection", "Criteria", "@shopware-ag/meteor-admin-sdk", "@shopware-ag/meteor-extension-sdk", "extension sdk", "admin sdk", "administration data handling", "entity.data.ts", "criteria.data.ts", "entity-collection.data.ts", "adr"]
summary: "ADR: Entity, EntityCollection and Criteria moved to the Meteor admin SDK; admin core/data files only re-export the SDK default exports."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-03-15, area administration): the implementations of the Administration's data handling classes `Entity`, `EntityCollection` and `Criteria` were moved out of the Administration into the extension SDK package, and the Administration's own files just forward the SDK's default export.

## When to use

When importing `Entity`, `EntityCollection` or `Criteria` in Administration code or in an app/extension built on the SDK, or when wondering why these classes are not implemented inside the Administration source.

## Key steps / config

- Context: the Administration is not a standalone package the SDK could import, so the SDK could not reliably identify instances of these classes and would otherwise have had to copy their implementation.
- Decision: move the implementation into the SDK; Administration files re-export it. In the installed Administration the files under `src/core/data/` import from `@shopware-ag/meteor-admin-sdk`:

```ts
// src/core/data/criteria.data.ts
import Criteria from '@shopware-ag/meteor-admin-sdk/es/data/Criteria';
export default Criteria;

// src/core/data/entity-collection.data.ts
import EntityCollection from '@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection';

// src/core/data/entity.data.ts
import Entity, { assignSetterMethod } from '@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity';
```

- `entity.data.ts` additionally calls `assignSetterMethod` so drafts are made reactive via `Shopware.Application.view.setReactive` before re-exporting `Entity`.
- Consequence: behaviour of existing implementations stays the same, and the base classes are available in an external package anyone can use.

## Essential identifiers

- `Entity`, `EntityCollection`, `Criteria`
- `@shopware-ag/meteor-admin-sdk`
- `src/core/data/entity.data.ts`, `src/core/data/entity-collection.data.ts`, `src/core/data/criteria.data.ts`
- `assignSetterMethod`

## Gotchas

- The ADR names the package `@shopware-ag/meteor-extension-sdk`; the installed Administration imports from `@shopware-ag/meteor-admin-sdk`. `Entity` and `EntityCollection` come from its `es/_internals/data/` path, `Criteria` from `es/data/`.

## Code check (6.7.13.0)
- corrected `@shopware-ag/meteor-admin-sdk` — docs: package @shopware-ag/meteor-extension-sdk — vendor/shopware/administration/Resources/app/administration/src/core/data/criteria.data.ts:5
- confirmed `Criteria` — re-exported SDK default export — vendor/shopware/administration/Resources/app/administration/src/core/data/criteria.data.ts:8
- confirmed `EntityCollection` — re-exported from SDK _internals path — vendor/shopware/administration/Resources/app/administration/src/core/data/entity-collection.data.ts:5
- confirmed `Entity` — re-exported from SDK _internals path — vendor/shopware/administration/Resources/app/administration/src/core/data/entity.data.ts:5
- confirmed `assignSetterMethod` — sets reactive setter before re-export — vendor/shopware/administration/Resources/app/administration/src/core/data/entity.data.ts:7
