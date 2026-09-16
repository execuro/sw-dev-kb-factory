---
id: "platform/dev/6.6/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.md"
title: "Extract data handling classes to extension sdk"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-15-extract-data-handling-classes-to-extension-sdk.html"
sourceHash: "736010d38ee9e7c9f561ff211eee66c5806c6e18"
keywords: ["meteor-extension-sdk", "Entity", "EntityCollection", "Criteria", "extension sdk", "administration data handling", "@shopware-ag/meteor-extension-sdk", "default export forwarding"]
summary: "ADR: Entity, EntityCollection and Criteria implementations move from the administration into @shopware-ag/meteor-extension-sdk; admin re-exports them."
lastBuilt: "2026-09-15"
---
## What it is

This ADR moves the implementation of the administration's core data-handling classes — `Entity`, `EntityCollection`, `Criteria` — out of the administration and into the `@shopware-ag/meteor-extension-sdk` package (referred to as "sdk"), so the sdk can reliably recognize instances of these classes.

## When to use

Relevant when working with `Entity`, `EntityCollection`, or `Criteria` instances in the administration or in an extension built against the sdk, or when an instance check against these classes behaves unexpectedly across packages.

## Key steps / config

- Previously the administration held the sole implementation of `Entity`, `EntityCollection`, and `Criteria`; because the administration is not a standalone importable package, the sdk could not import them and would otherwise have needed a separate, duplicated implementation to represent the same administration data handling.
- Decision: move the implementations of `Entity`, `EntityCollection`, and `Criteria` into the sdk (`@shopware-ag/meteor-extension-sdk`).
- The corresponding files that remain in the administration now simply forward the sdk's default export, rather than containing their own implementation.

## Essential identifiers

- `Entity`
- `EntityCollection`
- `Criteria`
- `@shopware-ag/meteor-extension-sdk`

## Gotchas

Because the administration files now only forward the sdk's default export, code that previously relied on the administration's own copy of these classes behaves the same, but instance checks against `Entity`/`EntityCollection`/`Criteria` now resolve consistently between the sdk and the administration, since there is a single shared implementation instead of two separate ones.
