---
id: platform/dev/6.6/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md
title: API & Pricing
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.html
sourceHash: 675fccb85281ea0cd3b7cebe3061f4f8fafd58c7
keywords: ["shopping list", "Store API", "Admin API", "ShoppingListSubscriber", "ShoppingListPriceCalculator", "AbstractShoppingListPriceCalculator", "store-api/shopping-list", "store-api/shopping-lists", "price calculation", "CRUD", "B2B", "b2b-components", "SALES_CHANNEL_SHOPPING_LIST_LOADED"]
summary: Store API routes for managing B2B shopping lists and how their prices are calculated on load instead of being stored.
lastBuilt: 2026-09-15
---
## What it is

Documents the Store API endpoints available for the *Shopping lists* B2B component and explains that shopping-list and line-item prices are calculated when a list is loaded rather than persisted in the database.

## When to use

Use this when integrating with shopping lists over the Store API, or when investigating why a shopping list's displayed price changes without any write to the database.

## Key steps / config

Store API routes for shopping lists:

```
POST   {url}/store-api/shopping-list
POST   {url}/store-api/shopping-list/{id}/duplicate
GET    {url}/store-api/shopping-list/{id}
GET    {url}/store-api/shopping-lists
DELETE {url}/store-api/shopping-lists
GET    {url}/store-api/shopping-list/{id}/summary
```

`POST {url}/store-api/shopping-list` and its `duplicate` variant take a `name` body field; `DELETE {url}/store-api/shopping-lists` takes an `ids` array. The `summary` route returns just the shopping list's summary price, which is otherwise already included when fetching the list itself.

There is no dedicated Admin API for shopping lists — the source states the Admin API's generic CRUD operations, available for every Shopware entity, are used instead.

Pricing is recalculated on load because product prices vary by time, customer and sales channel, so nothing is stored. `Shopware\Commercial\B2B\ShoppingList\Subscriber\ShoppingListSubscriber` implements `EventSubscriberInterface` and listens for shopping-list loading:

```php
class ShoppingListSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            self::SHOPPING_LIST_LOADED => 'adminLoadedForSpecificCustomer',
            self::SALES_CHANNEL_SHOPPING_LIST_LOADED => 'salesChannelLoaded',
            self::SALES_CHANNEL_SHOPPING_LIST_LINE_ITEM_LOADED => 'salesChannelLineItemLoaded',
        ];
    }
}
```

The actual computation happens in `Shopware\Commercial\B2B\ShoppingList\Domain\Price\ShoppingListPriceCalculator::calculate`, which extends `AbstractShoppingListPriceCalculator` and iterates the loaded shopping lists, computing each entity's price from its line items via the product repository.

## Essential identifiers

- Routes: `/store-api/shopping-list`, `/store-api/shopping-list/{id}`, `/store-api/shopping-lists`, `/store-api/shopping-list/{id}/duplicate`, `/store-api/shopping-list/{id}/summary`
- `Shopware\Commercial\B2B\ShoppingList\Subscriber\ShoppingListSubscriber`
- `Shopware\Commercial\B2B\ShoppingList\Domain\Price\ShoppingListPriceCalculator::calculate`
- `AbstractShoppingListPriceCalculator`

## Gotchas

For the admin loading path to include price of the list and its products, all shopping lists loaded together must belong to the same customer; otherwise the price is not calculated. Products can be activated or deactivated at any time — deactivated products remain stored in the list but are excluded from the price calculation when the list is loaded.
