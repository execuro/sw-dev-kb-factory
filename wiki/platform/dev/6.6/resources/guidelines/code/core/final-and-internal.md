---
id: platform/dev/6.6/resources/guidelines/code/core/final-and-internal.md
title: Final and internal annotation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/final-and-internal.html
sourceHash: 3a6b4e9126a2af79519ea6e63fee5c8ad814f2b7
keywords: ["final", "@final", "internal", "@internal", "annotation", "public api", "private api", "breaking changes", "di container", "extend class", "core guidelines", "doc annotation"]
summary: "Shopware core guideline on @final and @internal doc annotations: which changes are allowed and why internal classes can change freely."
lastBuilt: 2026-09-15
---
## What it is

This core coding guideline (mirrored from Shopware's core coding-guidelines repository) explains the `@final` and `@internal` annotations used to mark classes as final or internal, distinguishing public API from private API and defining which breaking changes are acceptable for each.

## When to use

Apply when deciding whether a new core class should be marked `@final` or `@internal`, and when consuming an existing core class to judge whether it is safe to extend, replace, or rely on for future compatibility.

## Key steps / config

- `@final` marks classes that developers can use but should not extend.
  - Allowed changes to a `@final` class: adding new public methods/properties/constants; adding new optional parameters to public methods; changing protected/private methods/properties/constants without restriction; widening the type of public method params.
  - Not allowed: removing public methods/properties/constants; removing public method parameters; narrowing the type of public methods/properties/constants.
- `@internal` marks classes that are private API and should not be used or extended by other developers. Internal classes can be changed without any restrictions and can be removed without any deprecation.

## Essential identifiers

`@final`, `@internal`

## Gotchas

Because `@final` and `@internal` are enforced only via doc annotation (not by the PHP language itself), it remains technically possible for developers to extend a `@final` base class and replace the service in the DI container, or to use/extend an `@internal` class and replace its service. This is possible but not recommended, and is done without any guarantees of stability.
