---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/currency.md
title: Currency
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/currency.html
sourceHash: cb869fb3846407853fbe92a1eef7feba415b7228
keywords: ["Currency component", "CurrencyContext", "CurrencyService", "CurrencyAware", "CurrencyCalculator", "recalculateAmount", "recalculateAmounts", "getSqlCalculationPart", "B2B Suite", "currency factor", "money calculation", "SQL calculation", "b2b-suite"]
summary: The B2B Suite Currency component recalculates money values via CurrencyContext/CurrencyService/CurrencyCalculator, in PHP or, for GROUP BY sums, in SQL.
lastBuilt: 2026-09-15
---
## What it is

Documents the Currency component, which provides currency calculation for the B2B Suite core — computing and applying a currency factor so monetary amounts on entities are correct for the currently selected currency.

## When to use

Use this when an entity in the B2B Suite carries money amounts that must be recalculated for the active currency, either in application code (the preferred path) or, when a SQL aggregate such as `GROUP BY` needs a summed amount, directly in a database query.

## Key steps / config

The Currency component exposes an additional context object, `Shopware\B2B\Currency\Framework\CurrencyContext`, containing a currency factor. The default context — holding the currently selected currency factor — is retrieved through `Shopware\B2B\Currency\Framework\CurrencyService`:

```php
$this->currencyService->createCurrencyContext();
```

Any entity that needs its money values recalculated must implement `Shopware\B2B\Currency\Framework\CurrencyAware`, which requires `getCurrencyFactor()`, `setCurrencyFactor()` and `getAmountPropertyNames(): array` (the property names holding amounts, e.g. `amount1`, `amount2`).

A repository loading such entities uses `Shopware\B2B\Currency\Framework\CurrencyCalculator` to guarantee every entity it returns has valid, recalculated money values. Two PHP-side methods are provided and preferred:

- `recalculateAmount($entity, $currencyContext)` — for a single entity.
- `recalculateAmounts($entities, $currencyContext)` — for an array of entities.

When calculation must happen in SQL instead — for example alongside a `GROUP BY` sum — `CurrencyCalculator::getSqlCalculationPart('amount', 'currency_factor', $currencyContext)` returns a SQL snippet that can be substituted into the aggregate expression in place of the raw column, e.g. inside `SELECT SUM(...) AS sum_amount FROM ...`.

## Essential identifiers

- `Shopware\B2B\Currency\Framework\CurrencyContext`
- `Shopware\B2B\Currency\Framework\CurrencyService`
- `Shopware\B2B\Currency\Framework\CurrencyAware`
- `Shopware\B2B\Currency\Framework\CurrencyCalculator`
- `CurrencyCalculator::recalculateAmount()`, `CurrencyCalculator::recalculateAmounts()`, `CurrencyCalculator::getSqlCalculationPart()`

## Gotchas

Calculating in PHP via `recalculateAmount`/`recalculateAmounts` is the preferred approach; SQL-side calculation with `getSqlCalculationPart` is only meant for cases like a `GROUP BY` sum where the amount must already be aggregated inside the query rather than recalculated afterward in PHP.
