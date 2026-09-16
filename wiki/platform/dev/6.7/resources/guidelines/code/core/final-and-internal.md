---
id: platform/dev/6.7/resources/guidelines/code/core/final-and-internal.md
title: Final and internal annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/final-and-internal.html
sourceHash: 3a6b4e9126a2af79519ea6e63fee5c8ad814f2b7
codeCheckedAgainst: "6.7.13.0"
keywords: ["@final", "@internal", "final annotation", "internal annotation", "public api", "private api", "backward compatibility", "breaking changes", "docblock annotation", "service decoration", "extend class"]
summary: "@final vs @internal doc annotations: allowed/forbidden changes for @final classes; @internal classes may change or be removed without deprecation."
lastBuilt: 2026-09-15
---
## What it is

Core guideline explaining how Shopware uses the `@final` and `@internal` docblock annotations to mark classes as public or private API and to define which breaking changes third-party developers can expect.

## When to use

When deciding whether a core class may be extended, replaced or relied upon from a plugin, or when judging whether a change to a core class is backward compatible.

## Key steps / config

**`@final`** — developers may use the class but should not extend it.

Allowed changes to a `@final` class:
- Adding new public methods/properties/constants.
- Adding new optional parameters to public methods.
- Changing protected and private methods/properties/constants without restriction.
- Widening the type of public method parameters.

Not allowed:
- Removing public methods/properties/constants.
- Removing public method parameters.
- Narrowing the type of public methods/properties/constants.

Example in 6.7.13.0: `Shopware\Core\Checkout\Cart\LineItemFactoryRegistry` carries `@final` in its class docblock.

**`@internal`** — the class is private API and should not be used or extended by other developers. It can be changed without restriction and removed without deprecation. Example: `Shopware\Storefront\Controller\ProductController` is marked `@internal`.

## Essential identifiers

- `@final`
- `@internal`

## Gotchas

- Both are only docblock annotations, not the native PHP `final` keyword. Developers can still extend a `@final` class and replace the service in the DI container, or use/replace an `@internal` class — this is not recommended and comes without any guarantees.

## Code check (6.7.13.0)
- confirmed `@final` — class docblock annotation on LineItemFactoryRegistry — vendor/shopware/core/Checkout/Cart/LineItemFactoryRegistry.php:21
- confirmed `@internal` — class docblock annotation on ProductController — vendor/shopware/storefront/Controller/ProductController.php:34
