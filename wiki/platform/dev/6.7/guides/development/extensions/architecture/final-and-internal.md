---
id: platform/dev/6.7/guides/development/extensions/architecture/final-and-internal.md
title: Final and Internal Annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/architecture/final-and-internal.html
sourceHash: f8e52ad80624211fc9bb5c1c4fedaa9c4e8824f1
codeCheckedAgainst: "6.7.15.1"
keywords: ["@final", "@internal", "final annotation", "internal annotation", "public api", "private api", "breaking changes", "backward compatibility", "service decoration", "di container", "docblock", "coding guidelines"]
summary: "Meaning of Shopware's @final and @internal docblock annotations: which class changes each allows and why extending or replacing them is unsupported."
lastBuilt: 2026-10-21
---
## What it is

Core coding guideline (mirrored from the Shopware repository's `coding-guidelines/core/final-and-internal.md`) explaining the `@final` and `@internal` docblock annotations. Shopware uses them to mark services and classes as public or private API and to define which breaking changes an extension developer can expect.

## When to use

When you are about to extend, decorate, replace or call a core class or service and need to know whether that usage is covered by Shopware's backward compatibility promise, or what kind of changes to it can arrive in a minor release.

## Key steps / config

### `@final`

The class may be used, but should not be extended.

Allowed changes by Shopware:

- adding new public methods, properties or constants;
- adding new optional parameters to public methods;
- changing protected and private methods, properties or constants without any restriction;
- widening the type of public method parameters.

Not allowed:

- removing public methods, properties or constants;
- removing public method parameters;
- narrowing the type of public methods, properties or constants.

### `@internal`

The class is private API and should be neither used nor extended by other developers. Shopware may change it without restriction and may remove it without a deprecation.

## Essential identifiers

- `@final` — docblock annotation: use, do not extend.
- `@internal` — docblock annotation: private API, no guarantees.

## Gotchas

- Both markers are only docblock annotations, not the PHP `final` keyword. Technically you can still extend an `@final` class and replace the service in the DI container, or use or replace an `@internal` class — this is possible but not recommended, should be avoided, and comes without any guarantees.
- Protected members of an `@final` class can change at any time, so a subclass relying on them can break without notice.

## Code check (6.7.15.1)
- confirmed `@final` — present as a docblock tag on CartHook — vendor/shopware/core/Checkout/Cart/Hook/CartHook.php:20
- confirmed `CartHook` — declared as a plain `class`, no PHP final keyword, so the annotation is doc-only — vendor/shopware/core/Checkout/Cart/Hook/CartHook.php:23
- confirmed `@internal` — docblock tag on CartCalculator — vendor/shopware/core/Checkout/Cart/CartCalculator.php:10
- confirmed `@internal` — docblock tag on CartLocker — vendor/shopware/core/Checkout/Cart/CartLocker.php:10
