---
id: platform/dev/6.7/guides/development/extensions/architecture/final-and-internal.md
title: Final and Internal Annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/architecture/final-and-internal.html
sourceHash: f8e52ad80624211fc9bb5c1c4fedaa9c4e8824f1
codeCheckedAgainst: "6.7.13.0"
keywords: ["@final", "@internal", "final annotation", "internal annotation", "public api", "private api", "backward compatibility", "breaking changes", "docblock annotation", "service decoration", "extend core class", "coding guidelines"]
summary: Shopware core @final (use, do not extend) and @internal (private API, removable without deprecation) docblock annotations and allowed BC changes.
lastBuilt: 2026-09-15
---
## What it is

A core coding guideline (mirrored from the Shopware repository's `coding-guidelines/core/final-and-internal.md`) defining what the docblock annotations `@final` and `@internal` on Shopware classes mean for third-party developers: which classes are public or private API, and which breaking changes can be expected.

## When to use

Before using, extending, or replacing a Shopware core class or service in a plugin, app backend, or bundle: check its docblock to know what backward-compatibility guarantees apply.

## Key steps / config

### `@final` — use, but do not extend

Developers may use the class but should not extend it. The annotation is a docblock, not the PHP `final` keyword, e.g. in core:

```php
/**
 * @final
 */
#[Package('framework')]
class FkReference
```

Allowed changes to a `@final` class (no BC break):

- adding new public methods/properties/constants
- adding new optional parameters to public methods
- any change to protected and private methods/properties/constants
- widening the type of public method parameters

Not allowed:

- removing public methods/properties/constants
- removing public method parameters
- narrowing the type of public methods/properties/constants

### `@internal` — private API

The class should not be used or extended by other developers. Shopware may change it without restriction and remove it without deprecation. The annotation also appears on individual members (commonly service constructors) and on interfaces such as `FieldSerializerInterface`.

## Essential identifiers

- `@final` — docblock annotation: public API for consumers, not for inheritance
- `@internal` — docblock annotation: private API, no BC promise

## Gotchas

- Both annotations are only docblocks, so PHP does not stop you from extending a `@final` class or using/replacing an `@internal` service in the DI container. Both are possible but not recommended, and come without any guarantees.
- Protected members of a `@final` class can change in any release. A subclass that relies on them can break without notice.
- `@internal` on a constructor only (as on `FkReference::__construct()`) means that constructor signature is private API. The rest of the class keeps its own annotation.

## Code check (6.7.13.0)
- confirmed `@final` — class-level docblock on a core class that is not declared PHP-final — vendor/shopware/core/Framework/Api/Sync/FkReference.php:8
- confirmed `@internal` — member-level docblock on a constructor of a `@final` class — vendor/shopware/core/Framework/Api/Sync/FkReference.php:16
- confirmed `@internal` — docblock on the core interface `FieldSerializerInterface` — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/FieldSerializerInterface.php:13
- confirmed `FkReference` — declared as plain `class` (no PHP `final` keyword) under the `@final` docblock — vendor/shopware/core/Framework/Api/Sync/FkReference.php:11
