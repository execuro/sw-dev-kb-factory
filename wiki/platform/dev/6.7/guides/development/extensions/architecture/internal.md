---
id: platform/dev/6.7/guides/development/extensions/architecture/internal.md
title: Public API and Internal Annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/architecture/internal.html
sourceHash: 16d41259a41e4b67bf835304e19b02486e19a720
codeCheckedAgainst: "6.7.15.1"
keywords: ["public api", "@internal", "final", "getDecorated", "decoration pattern", "abstract class", "Struct", "dto", "event subscriber", "backward compatibility", "minor release", "FieldSerializerInterface"]
summary: "Defines Shopware's Public API: protected/public members are stable in minors; final classes, abstract decoration classes, and @internal classes/interfaces."
lastBuilt: 2026-10-20
---
## What it is

A core coding guideline (mirrored from the Shopware repository) defining what counts as Shopware's Public API and how core marks elements that are not public API.

## When to use

When deciding whether a core class, service or DTO is safe to use, decorate or extend in an extension across minor releases.

## Key steps / config

Public API baseline: all classes and elements (methods, properties, constants) defined as protected or public are initially Public API and must stay compatible within a minor release for these use cases:

- using a service to call its functions
- decorating a service to extend its functionality
- using a DTO to get or pass data

Tools core uses to mark non-public API:

1. **Decoration pattern** — services meant for decoration have an abstract class with a `getDecorated()` method that forwards unimplemented calls to the core implementation (e.g. `AbstractCategoryRoute::getDecorated()`). Decorate the abstract class; do not `extends` a core service.
2. **Final classes** — nearly all classes should be `final`:
   - DI container services are `final`; exchangeable services have an `abstract class`.
   - DTO classes are `final`; to append data, use the `Struct` base class (`Shopware\Core\Framework\Struct\Struct`), which supports **Extensions**.
   - Event subscribers are `final`.
   - Final classes remain Public API: third-party developers consume their public methods.
3. **`@internal` classes** — classes reserved for complete refactoring, or split out to avoid one big master class, may change completely with each release; not for third-party use.
4. **`@internal` interfaces** — used where core wants multiple implementations without third-party interference, e.g. the Data Abstraction Layer's field serializers (`FieldSerializerInterface`), so optimizations and breaks remain possible within minor versions.

## Essential identifiers

- `getDecorated()`
- `Shopware\Core\Framework\Struct\Struct`
- `@internal`
- `final`

## Gotchas

The source names "the Field and FieldSerializer classes" as the internal-interface example; in 6.7 `FieldSerializerInterface` carries `@internal`, while the abstract `Field` class itself has no class-level `@internal` docblock.

## Code check (6.7.15.1)
- confirmed `AbstractCategoryRoute::getDecorated()` — abstract decoration method — vendor/shopware/core/Content/Category/SalesChannel/AbstractCategoryRoute.php:16
- confirmed `CategoryRoute::getDecorated()` — concrete implementation of the decoration contract — vendor/shopware/core/Content/Category/SalesChannel/CategoryRoute.php:50
- confirmed `Struct` — abstract base implementing ExtendableInterface — vendor/shopware/core/Framework/Struct/Struct.php:8
- confirmed `FieldSerializerInterface` — marked `@internal` — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/FieldSerializerInterface.php:13
- corrected `Field` — docs: Field classes are an internal area; the abstract class has no class-level @internal — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:18
