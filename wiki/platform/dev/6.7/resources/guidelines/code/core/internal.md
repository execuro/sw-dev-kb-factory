---
id: platform/dev/6.7/resources/guidelines/code/core/internal.md
title: Internal
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/internal.html
sourceHash: 468c9a1cb9aa9ac961843b67063b27a6da95b527
codeCheckedAgainst: "6.7.13.0"
keywords: ["@internal", "@final", "final class", "public api", "private api", "decoration pattern", "getDecorated", "Struct", "addExtension", "FieldSerializerInterface", "internal interface", "backward compatibility"]
summary: "What counts as Shopware public API and how core limits it: abstract decorators with getDecorated, native final vs @final, @internal classes and interfaces."
lastBuilt: 2026-09-15
---
## What it is

Core guideline defining Shopware's Public API: every protected or public class element is initially Public API for third-party developers and must stay compatible in minor releases. It lists the tools core uses to mark what is not Public API or not meant for extension.

## When to use

When writing core code and deciding how to mark a class (native `final`, `@final`, `@internal`, abstract decorator), or when a plugin developer needs to know whether relying on a core class is supported.

## Key steps / config

Must not change for third parties in a minor release: using a service, decorating a service, and using DTOs to get or pass data.

1. **Decoration pattern** — classes intended for service decoration get an abstract class with a `getDecorated` function that passes unimplemented functions to the core class. In 6.7.13.0, e.g. `Shopware\Core\Content\Category\SalesChannel\AbstractCategoryRoute` declares `abstract public function getDecorated(): AbstractCategoryRoute;`.
2. **Native `final class`** — for concrete classes that need no extension, decoration, proxying or mocking: value objects, structs, DTO-style classes, event subscribers. `final` is about inheritance, not about Public API status. To append data to extensible structs, use the `Struct` extension mechanism (`addExtension(string $name, Struct $extension)`) instead of inheritance.
3. **`@final`** — for supported services or public concrete classes that third parties may use but must not extend. If a service should be exchangeable via DI decoration, expose a supported abstract decorator contract instead of relying on `extends` of the concrete core service.
4. **`@internal`** on classes — for classes reserved for complete refactoring or split out to avoid "a big master class". They may change completely with each release and are not intended to be used, extended, decorated or referenced by third parties.
5. **`@internal` interfaces** — when core wants several implementations of a feature or adapter but third parties should not implement or depend on the contract; example area: the Data Abstraction Layer `Field` and `FieldSerializer` classes (`FieldSerializerInterface` is `@internal`).

## Essential identifiers

- `@internal`, `@final`, native `final class`
- `getDecorated()` on abstract decorator classes, e.g. `AbstractCategoryRoute`
- `Shopware\Core\Framework\Struct\Struct`, `addExtension`
- `FieldSerializerInterface`

## Gotchas

- Do not add `@final` to classes already marked `@internal`; `@internal` is the stronger signal.
- Do not repeat `@internal` on constructors or methods inside an `@internal` class; the class-level marker is enough.
- `@internal` is about supported use, not only inheritance — even referencing such a class is unsupported.

## Code check (6.7.13.0)
- confirmed `AbstractCategoryRoute::getDecorated()` — abstract decorator contract — vendor/shopware/core/Content/Category/SalesChannel/AbstractCategoryRoute.php:16
- confirmed `Struct` — abstract base implementing ExtendableInterface — vendor/shopware/core/Framework/Struct/Struct.php:8
- confirmed `ExtendableInterface::addExtension()` — struct extension mechanism — vendor/shopware/core/Framework/Struct/ExtendableInterface.php:14
- confirmed `FieldSerializerInterface` — marked @internal — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/FieldSerializerInterface.php:16
- confirmed `Field` — abstract DAL field base class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:17
- confirmed `@final` — docblock annotation on a supported service — vendor/shopware/core/Checkout/Cart/LineItemFactoryRegistry.php:21
