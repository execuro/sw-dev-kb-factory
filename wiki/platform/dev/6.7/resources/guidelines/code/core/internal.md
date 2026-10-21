---
id: platform/dev/6.7/resources/guidelines/code/core/internal.md
title: Internal
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/internal.html
sourceHash: 01386c55ef1db792be642f988b0dcbd7ccc871c3
codeCheckedAgainst: "6.7.15.1"
keywords: ["@internal", "@final", "final class", "getDecorated", "public api", "backward compatibility", "decoration pattern", "Struct", "CompilerPassInterface", "internal interfaces", "FieldSerializerInterface", "service decoration"]
summary: "Core guideline on Shopware Public API: when to use @internal, @final, native final classes, abstract decorators with getDecorated, and internal compiler passes."
lastBuilt: 2026-10-21
---
## What it is

A core coding guideline (mirrored from the Shopware repository's `coding-guidelines/core/internal.md`) defining which classes and elements count as Public API for third-party developers, and which markers (`@internal`, `@final`, native `final`, abstract decorator classes) Shopware uses to exclude or restrict elements.

## When to use

When adding or changing core classes, deciding whether a class may be used, extended or decorated by extensions, or judging whether a core class you depend on is covered by the backward-compatibility promise of minor releases.

## Key steps / config

**Default rule.** All protected or public classes and elements (methods, properties, constants) are initially Public API and must stay compatible with each release. In a minor release the following must not break for third-party developers: using a service for certain functions, decorating a service to extend it, and using DTOs to get or pass data. Because treating everything as Public API would be too limiting, non-public-API elements are marked explicitly.

**Decoration pattern.** Classes intended for service decoration get an abstract class carrying a `getDecorated` function, which forwards unimplemented functions to the core class (see the ADR `2020-11-25-decoration-pattern`). Shape in the installed code:

```php
abstract class AbstractCartDeleteRoute
{
    abstract public function getDecorated(): AbstractCartDeleteRoute;
    abstract public function delete(SalesChannelContext $context): NoContentResponse;
}
```

**Final classes.** `final` is about inheritance, not Public API status; a supported class can still forbid extension.
- Native `final class` for concrete classes that need no extension, decoration, proxying or mocking — especially simple value objects, structs, DTO-style classes and event subscribers.
- To append data to extensible structs, use the base `Struct` extension mechanism, not inheritance.
- `@final` for supported services or other public concrete classes that third parties may use but must not extend.
- A service meant to be exchanged via DI decoration exposes a supported abstract decorator contract instead of relying on `extends` from the concrete core service.
- Do not add `@final` to classes already marked `@internal`.

**`@internal` annotation.** Used for classes where a complete refactoring is reserved, or which only exist to avoid "a big master class" in a domain. It concerns supported use, not just inheritance: such classes may change completely with each release and are not meant to be used, extended, decorated or referenced by third parties. Do not repeat `@internal` on constructors or methods inside an `@internal` class — the class-level marker suffices.

**Compiler passes.** Every new class implementing `Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface` gets its own class-level `@internal` PHPDoc annotation — including abstract compiler passes and subclasses that inherit the interface through a parent.

**Internal interfaces.** Interfaces are declared `@internal` when the core wants multiple implementations of a feature or adapter but does not want third parties to implement or depend on the contract — for example the Data Abstraction Layer's Field and FieldSerializer classes, where optimizations and breaks within minor versions are reserved.

## Essential identifiers

- `@internal`, `@final`, native `final class`
- `getDecorated`
- `Struct` (extension mechanism via `addExtension`)
- `Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface`
- `FieldSerializerInterface`

## Gotchas

- `@internal` is the stronger signal; combining it with `@final` is redundant and disallowed.
- Inheriting `CompilerPassInterface` through a parent class does not exempt a subclass from its own class-level `@internal`.

## Code check (6.7.15.1)
- confirmed `getDecorated` — abstract decorator contract on route classes — vendor/shopware/core/Checkout/Cart/SalesChannel/AbstractCartDeleteRoute.php:15
- confirmed `Struct` — abstract base implementing ExtendableInterface — vendor/shopware/core/Framework/Struct/Struct.php:8
- confirmed `ExtendableTrait::addExtension()` — struct extension mechanism — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- confirmed `FieldSerializerInterface` — DAL serializer interface marked @internal — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/FieldSerializerInterface.php:16
- confirmed `CompilerPassInterface` — implemented by core compiler passes — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:48
- unverified `Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface` — interface definition lives in vendor/symfony, out of scope
