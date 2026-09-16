---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/test-suite-types.md
title: Test Suite Types
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test-suite-types.html
sourceHash: f575e7c4e71b6f8920eb4b01c1971eff8e31632e
codeCheckedAgainst: "6.7.13.0"
keywords: ["ShopwareTypes.ts", "TestDataService", "components['schemas']", "Omit<T, K>", "ProductReview", "Country", "typescript types", "openapi schema types", "acceptance test suite", "playwright", "entity types"]
summary: How the Shopware Playwright acceptance test suite types entities in ShopwareTypes.ts - extending Admin API OpenAPI schema types, Omit, custom types.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/testing/e2e-playwright/test-data-service.md"]
---
## What it is

The Shopware Acceptance Test Suite defines the shape and default data of supported Shopware entities (Product, Customer, Media, ...) in one TypeScript file, `src/types/ShopwareTypes.ts` (https://github.com/shopware/acceptance-test-suite/blob/trunk/src/types/ShopwareTypes.ts). These types are used throughout the [TestDataService](platform/dev/6.7/guides/development/testing/e2e-playwright/test-data-service.md) for IntelliSense, validation and consistent data structures.

## When to use

When adding or changing a type for an entity used by `TestDataService` or your own test helpers — extending an auto-generated Admin API type, removing fields from it, or defining a fully custom type.

## Key steps / config

Extend the auto-generated Admin API OpenAPI schema type with `& { ... }`:

```typescript
export type ProductReview = components['schemas']['ProductReview'] & {
    id: string,
    productId: string,
    salesChannelId: string,
    title: string,
    content: string,
    points: number,
}
```

Remove fields with `Omit<T, K>`, then re-add them in a different shape:

```typescript
export type Country = Omit<components['schemas']['Country'], 'states'> & {
    id: string,
    states: [{ name: string, shortCode: string }],
}
```

For custom cases define a plain type:

```typescript
export type CustomShippingMethod = { name: string; active: boolean; deliveryTimeId: string; }
```

## Essential identifiers

- `ShopwareTypes.ts`
- `components['schemas']['<Entity>']` (Admin API OpenAPI schema)
- `Omit<T, K>`
- `TestDataService`

## Code check (6.7.13.0)
- unverified `ShopwareTypes.ts` — file of the external acceptance-test-suite package, out of scope
- confirmed `product_review` — entity backing the ProductReview schema — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:29
- confirmed `productId` — required FK on product review — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:65
- confirmed `salesChannelId` — required FK on product review — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:68
- confirmed `title` — required string field on product review — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:72
- confirmed `content` — required long text field on product review — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:73
- confirmed `points` — FloatField on product review (TS type `number`) — vendor/shopware/core/Content/Product/Aggregate/ProductReview/ProductReviewDefinition.php:74
- confirmed `states` — one-to-many association on country, the field omitted in the Country example — vendor/shopware/core/System/Country/CountryDefinition.php:116
- confirmed `deliveryTimeId` — required FK on shipping method — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:83
