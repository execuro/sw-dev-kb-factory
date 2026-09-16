---
id: platform/dev/6.6/resources/guidelines/code/public-apis.md
title: Public APIs
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/public-apis.html"
sourceHash: "0a9dcb0bbdd02aa3c2a5a94e91404ad9dca23374"
keywords: ["public api", "@internal", "backward compatibility", "DTO", "data transfer object", "__construct", "CalculatedPrice", "QuantityPriceDefinition", "DI container", "service decoration"]
summary: "Services not meant for decoration or direct use must be @internal; DI-instantiated __construct is not public API, but DTO __construct methods are."
lastBuilt: "2026-09-15"
---
## What it is
Coding guideline defining what counts as public API in Shopware core code and how to mark internal-only services.

## Key steps / config
- Services not intended for decoration or direct use must be marked `@internal` with a docblock comment explaining why they should not be used or decorated directly.
- Classes marked `@internal` need not stay backward compatible for third-party developers; their public API can change at any time.
- `__construct` methods of services instantiated via the DI container are not public API and can be changed at any time.
- `__construct` methods of Data Transfer Objects (DTO) that a developer could instantiate themselves (e.g. `CalculatedPrice`, `QuantityPriceDefinition`) are public API and must be kept backward compatible.

## Essential identifiers
- `@internal`
- `CalculatedPrice`
- `QuantityPriceDefinition`
