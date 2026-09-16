---
id: platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md
title: API & Pricing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.html
sourceHash: bc3f8c7b841e538408f6db7cc10db758c84f9739
codeCheckedAgainst: "6.7.13.0"
keywords: ["/store-api/shopping-list", "/store-api/shopping-lists", "ShoppingListSubscriber", "ShoppingListPriceCalculator", "AbstractShoppingListPriceCalculator", "store api", "admin api", "shopping list price", "summary price", "price calculation", "b2b shopping list", "duplicate shopping list"]
summary: B2B shopping list Store API routes (create, duplicate, get, list, delete, summary) and how list prices are calculated on load, not stored.
lastBuilt: 2026-09-15
---
## What it is

Guide to the Store API endpoints of the B2B Components *Shopping lists* feature and to how shopping list prices are computed at load time by the commercial plugin.

## When to use

When building a headless/storefront client that manages shopping lists, or when debugging why a shopping list shows no or unexpected prices.

## Key steps / config

Store API routes (base URL elided as `{url}`):

```
POST   {url}/store-api/shopping-list                 { name }
POST   {url}/store-api/shopping-list/{id}/duplicate  { name }
GET    {url}/store-api/shopping-list/{id}
GET    {url}/store-api/shopping-lists
DELETE {url}/store-api/shopping-lists                { ids: [] }
GET    {url}/store-api/shopping-list/{id}/summary
```

- The price is already included in the "get shopping list" response; `/summary` returns only the list's summary price.
- Admin API: no special endpoints — use the generic entity CRUD of the Admin API.

Price calculation flow:

1. `Shopware\Commercial\B2B\ShoppingList\Subscriber\ShoppingListSubscriber` subscribes to shopping list loaded events: admin load (`adminLoadedForSpecificCustomer`), sales channel list load (`salesChannelLoaded`) and sales channel line item load (`salesChannelLineItemLoaded`).
2. `Shopware\Commercial\B2B\ShoppingList\Domain\Price\ShoppingListPriceCalculator::calculate(iterable $shoppingLists, SalesChannelContext $context): void` (extends `AbstractShoppingListPriceCalculator`) loads all referenced products via a `Criteria` with the product ids, calculates each line item price, adds line item prices to a `PriceCollection` and assigns the aggregated `price` to the list entity.
3. Lists without a line item collection get a price calculated from an empty collection.

## Essential identifiers

- `Shopware\Commercial\B2B\ShoppingList\Subscriber\ShoppingListSubscriber`
- `Shopware\Commercial\B2B\ShoppingList\Domain\Price\ShoppingListPriceCalculator::calculate`
- `AbstractShoppingListPriceCalculator`
- `ShoppingListLineItemCollection`
- `SalesChannelContext`, `Criteria`, `PriceCollection`

## Gotchas

- Prices of products and of the list total are not persisted; they depend on time, customer and sales channel and are recalculated on every load.
- Admin loading: all loaded shopping lists must belong to the same customer, otherwise no price is calculated.
- Deactivated products stay in a list but are excluded from price calculation.

## Code check (6.7.13.0)
- unverified `ShoppingListSubscriber` — Shopware\Commercial namespace, commercial plugin not installed under vendor/shopware
- unverified `ShoppingListPriceCalculator::calculate()` — commercial plugin, out of scope
- unverified `AbstractShoppingListPriceCalculator` — commercial plugin, out of scope
- unverified `/store-api/shopping-list` — route defined in commercial plugin, not found in installed core
- confirmed `SalesChannelContext` — core class used as calculate() context argument — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:28
- confirmed `Criteria` — core DAL search criteria class — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- confirmed `PriceCollection` — core price collection (cart price struct variant) — vendor/shopware/core/Checkout/Cart/Price/Struct/PriceCollection.php:16
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
