---
id: platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md
title: API & Pricing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.html
sourceHash: bc3f8c7b841e538408f6db7cc10db758c84f9739
codeCheckedAgainst: "6.7.15.1"
keywords: ["/store-api/shopping-list", "/store-api/shopping-lists", "ShoppingListSubscriber", "ShoppingListPriceCalculator", "AbstractShoppingListPriceCalculator", "SalesChannelContext", "PriceCollection", "shopping list price", "store api", "admin api", "b2b components", "summary price"]
summary: B2B shopping list Store API routes (create, duplicate, get, list, delete, summary) and how list prices are calculated on load, not stored.
lastBuilt: 2026-10-21
---
## What it is

The Store API endpoints of the B2B Components Shopping Lists feature, the Admin API situation, and how shopping list prices are computed at load time by the Commercial extension.

## When to use

When building a storefront/headless client that manages shopping lists, or when debugging why a shopping list shows no or unexpected prices.

## Key steps / config

### Store API

| Action | Request |
|---|---|
| Create | `POST {url}/store-api/shopping-list` body `{ name }` |
| Duplicate | `POST {url}/store-api/shopping-list/{id}/duplicate` body `{ name }` |
| Get one | `GET {url}/store-api/shopping-list/{id}` |
| Get list | `GET {url}/store-api/shopping-lists` |
| Remove | `DELETE {url}/store-api/shopping-lists` body `{ ids: [...] }` |
| Summary price | `GET {url}/store-api/shopping-list/{id}/summary` |

The get endpoint already includes the list price; `/summary` returns only the summary price. Full request details are in the Store API reference ("B2B Shopping Lists").

### Admin API

No dedicated endpoints — use the generic Admin API CRUD operations on the shopping list entities.

### Price calculation

Product prices vary by time, customer and sales channel, so neither line-item prices nor the list total are persisted; they are calculated whenever a shopping list is loaded.

- `Shopware\Commercial\B2B\ShoppingList\Subscriber\ShoppingListSubscriber` subscribes to the loaded events:

```php
return [
    self::SHOPPING_LIST_LOADED => 'adminLoadedForSpecificCustomer',
    self::SALES_CHANNEL_SHOPPING_LIST_LOADED => 'salesChannelLoaded',
    self::SALES_CHANNEL_SHOPPING_LIST_LINE_ITEM_LOADED => 'salesChannelLineItemLoaded',
];
```

- `Shopware\Commercial\B2B\ShoppingList\Domain\Price\ShoppingListPriceCalculator::calculate(iterable $shoppingLists, SalesChannelContext $context): void` (extends `AbstractShoppingListPriceCalculator`) loads the referenced products via `Criteria`, calculates each line item, sums line-item prices into a `PriceCollection`, and assigns the result to the list's `price`.

## Essential identifiers

- `Shopware\Commercial\B2B\ShoppingList\Subscriber\ShoppingListSubscriber`
- `Shopware\Commercial\B2B\ShoppingList\Domain\Price\ShoppingListPriceCalculator::calculate`
- `AbstractShoppingListPriceCalculator`
- `SHOPPING_LIST_LOADED`, `SALES_CHANNEL_SHOPPING_LIST_LOADED`, `SALES_CHANNEL_SHOPPING_LIST_LINE_ITEM_LOADED`
- `/store-api/shopping-list`, `/store-api/shopping-lists`, `/store-api/shopping-list/{id}/summary`

## Gotchas

- Admin loading: prices for the list and its products are calculated only if all loaded shopping lists belong to the same customer; otherwise no price is calculated.
- Deactivated products stay stored in shopping lists but are excluded from price calculation on load.
- The subscriber, calculator and routes live in the Shopware Commercial extension, not in the core package.

## Code check (6.7.15.1)
- confirmed `SalesChannelContext` — core class used as calculate() context argument — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:28
- confirmed `PriceCollection` — core collection of CalculatedPrice used for summed list prices — vendor/shopware/core/Checkout/Cart/Price/Struct/PriceCollection.php:16
- confirmed `Criteria` — core DAL search criteria used to load products by id — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- confirmed `b2b_components_shopping_list` — entity name known to core usage-data allow-list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2092
- unverified `ShoppingListSubscriber` — Shopware Commercial extension, out of scope of the checked roots
- unverified `ShoppingListPriceCalculator::calculate()` — Shopware Commercial extension, out of scope
- unverified `AbstractShoppingListPriceCalculator` — Shopware Commercial extension, out of scope
- unverified `/store-api/shopping-list` — route defined in the Commercial extension, out of scope
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
