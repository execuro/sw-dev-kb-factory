---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/test-suite-types.md
title: Test Suite Types
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test-suite-types.html
sourceHash: f575e7c4e71b6f8920eb4b01c1971eff8e31632e
codeCheckedAgainst: "6.7.15.1"
keywords: ["ShopwareTypes.ts", "components['schemas']", "ProductReview", "Country", "Omit<T, K>", "CustomShippingMethod", "TestDataService", "typescript types", "openapi schema types", "entity types", "acceptance test suite", "intellisense"]
summary: ATS ShopwareTypes.ts - entity types built from Admin API OpenAPI schemas, extended with & or trimmed with Omit, plus custom types for TestDataService.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/testing/e2e-playwright/test-data-service.md"]
---
## What it is

The Acceptance Test Suite (ATS) uses TypeScript types to keep test data, API interactions and test logic consistent. The central file `ShopwareTypes.ts` (ATS repository, `src/types/ShopwareTypes.ts`) defines the shape and default data of each supported Shopware entity (Product, Customer, Media, ...) and is used throughout the [TestDataService](platform/dev/6.7/guides/development/testing/e2e-playwright/test-data-service.md) for IntelliSense and validation.

## When to use

- Adding or adjusting an entity type used by `TestDataService` methods.
- Defining a type for a project-specific payload.

## Key steps / config

1. Extend the auto-generated Admin API OpenAPI schema type with `& { ... }` to add or override fields:
   ```typescript
   export type ProductReview = components['schemas']['ProductReview'] & {
     id: string, productId: string, salesChannelId: string,
     title: string, content: string, points: number,
   }
   ```
2. Remove fields with `Omit<T, K>` and redefine them:
   ```typescript
   export type Country = Omit<components['schemas']['Country'], 'states'> & {
     id: string,
     states: [{ name: string, shortCode: string }],
   }
   ```
3. For custom use cases, define a plain type, e.g. `CustomShippingMethod = { name: string; active: boolean; deliveryTimeId: string; }`.

## Essential identifiers

- `ShopwareTypes.ts`, `components['schemas'][...]`
- `ProductReview`, `Country`, `CustomShippingMethod`
- `Omit<T, K>`, `TestDataService`

## Code check (6.7.15.1)
- unverified `ShopwareTypes.ts` — ATS file in an external npm package, outside vendor/shopware
- confirmed `product_review` — entity behind the `ProductReview` schema — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:32
- confirmed `productId` — required FK field on product_review — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:68
- confirmed `salesChannelId` — required FK field on product_review — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:71
- confirmed `points` — float rating field on product_review — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:77
- confirmed `states` — one-to-many association on country — vendor/shopware/core/System/Country/CountryDefinition.php:119
- confirmed `shortCode` — required field on country_state — vendor/shopware/core/System/Country/Aggregate/CountryState/CountryStateDefinition.php:65
- confirmed `deliveryTimeId` — required FK on shipping_method — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:86
- confirmed `active` — bool field on shipping_method — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:81
