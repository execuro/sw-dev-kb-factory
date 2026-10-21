---
id: platform/dev/6.7/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md
title: Extract data handling classes to extension sdk
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.html
sourceHash: 736010d38ee9e7c9f561ff211eee66c5806c6e18
codeCheckedAgainst: "6.7.15.1"
keywords: ["Entity", "EntityCollection", "Criteria", "@shopware-ag/meteor-extension-sdk", "@shopware-ag/meteor-admin-sdk", "entity.data.ts", "criteria.data.ts", "entity-collection.data.ts", "admin sdk", "administration data handling", "adr", "extension api"]
summary: "ADR: the Administration's Entity, EntityCollection and Criteria classes live in the Meteor admin SDK; admin files only re-export the SDK defaults."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-15, area: administration) that moves the implementation of the Administration data handling classes `Entity`, `EntityCollection` and `Criteria` out of the Administration and into the extension SDK package. The ADR calls the package `@shopware-ag/meteor-extension-sdk` ("sdk"); in the installed 6.7 code the package is imported as `@shopware-ag/meteor-admin-sdk`.

## When to use

- You need to know where the real implementation of the admin `Criteria`, `Entity` or `EntityCollection` lives (for debugging, reading the source, or checking behaviour).
- You build an extension with the SDK and want to construct or recognise these objects the same way the Administration does.

## Key steps / config

Problem stated by the ADR: the Administration held its own implementations, so the SDK could not reliably identify instances of these classes (the Administration is not a standalone package the SDK could import), and the SDK would otherwise have had to copy the implementation.

Decision: the implementation moves to the SDK; the Administration files only forward the SDK's default export. In 6.7.15.1 these are the three files under `src/core/data/` of the Administration:

```ts
// criteria.data.ts
import Criteria from '@shopware-ag/meteor-admin-sdk/es/data/Criteria';
export default Criteria;

// entity-collection.data.ts
import EntityCollection from '@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection';
export default EntityCollection;
```

`entity.data.ts` imports `Entity` and `assignSetterMethod` from `@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity`, registers a setter that calls `Shopware.Application.view.setReactive(...)` so drafts stay reactive in the Vue app, then re-exports `Entity`.

## Essential identifiers

- `Entity`, `EntityCollection`, `Criteria`
- `@shopware-ag/meteor-admin-sdk/es/data/Criteria`
- `@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity` (`assignSetterMethod`)
- `@shopware-ag/meteor-admin-sdk/es/_internals/data/EntityCollection`

## Gotchas

- Behaviour for existing implementations stays the same (stated consequence); the benefit is that the base classes are available in an external package anyone can use.
- `Entity` and `EntityCollection` are imported from the SDK's `_internals` path, while `Criteria` comes from the public `es/data/Criteria` path.

## Version notes

- The ADR names the package `@shopware-ag/meteor-extension-sdk`; the 6.7.15.1 Administration imports from `@shopware-ag/meteor-admin-sdk`.

## Code check (6.7.15.1)
- confirmed `Criteria` — admin file re-exports the SDK default export — vendor/shopware/administration/Resources/app/administration/src/core/data/criteria.data.ts:5
- confirmed `EntityCollection` — admin file re-exports the SDK default export — vendor/shopware/administration/Resources/app/administration/src/core/data/entity-collection.data.ts:5
- confirmed `Entity` — imported from SDK with `assignSetterMethod`, then re-exported — vendor/shopware/administration/Resources/app/administration/src/core/data/entity.data.ts:5
- corrected `@shopware-ag/meteor-admin-sdk` — docs: package `@shopware-ag/meteor-extension-sdk` — vendor/shopware/administration/Resources/app/administration/src/core/data/criteria.data.ts:5
