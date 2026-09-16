---
id: "platform/dev/6.6/resources/guidelines/code/core/internal.md"
title: "Internal"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/internal.html"
sourceHash: "ab8ff306d732f0a2969790d5eee4457dfdbf4c0e"
keywords: ["public API", "@internal", "final", "getDecorated", "DTO", "Struct", "event subscriber", "decoration pattern", "field serializer", "third party developers"]
summary: "How Shopware marks classes as public vs. internal API: decoration pattern, final classes, @internal classes, and internal interfaces."
lastBuilt: "2026-09-15"
---
## What it is

Explains how Shopware distinguishes public API from private/internal implementation, since all protected/public elements are initially considered public API for third-party developers.

## When to use

Use when deciding whether a new class, DTO, event subscriber, or interface should be exposed as public API or marked internal.

## Key steps / config

The Shopware public API must stay compatible across a minor release for third-party developers using services, decorating services, or using DTOs to get/pass data.

Tools used to mark non-public elements:
- Decoration pattern — classes meant for service decoration get an abstract class with a `getDecorated` function that forwards unimplemented calls to the core class.
- `final` classes — nearly all classes should be `final`: DI container services (to prevent `extends`, since exchangeable services already expose an `abstract class`), DTO classes (append data via the base `Struct` class instead of subclassing), and Event Subscribers. `final` classes are still public API since third parties consume their public methods.
- `@internal` annotation — for classes reserved for full refactoring, or classes that only exist to avoid one "big master class" per domain; they may change completely each release and are not intended for third-party use.
- `@internal` interfaces — used when multiple internal implementations of a feature/adapter exist but third parties should not implement the interface themselves, e.g. the Data Abstraction Layer's `Field` and `FieldSerializer` classes, to reserve optimizations and breaking changes within minor versions.

## Essential identifiers

- `getDecorated`
- `@internal`
- `Struct`
- `Field`, `FieldSerializer`

## Gotchas

- A class marked `final` is still public API for consumers of its public methods — `final` restricts extension, not usage.
