---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/currency.md
title: Currency
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/currency.html
sourceHash: 3f8429a91823533e3e45618cef472ea302c2fe13
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "currency", "currency factor", "CurrencyContext", "CurrencyService", "CurrencyAware", "CurrencyCalculator", "createCurrencyContext", "recalculateAmount", "recalculateAmounts", "getSqlCalculationPart", "currency conversion", "exchange rate"]
summary: "B2B Suite Currency component: CurrencyContext via CurrencyService, CurrencyAware entities, CurrencyCalculator recalculation in PHP or SQL."
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite Currency component handles currency calculation for B2B entities. It provides a context object carrying the currently selected currency factor, an interface for recalculable entities, and a calculator used by repositories.

## When to use

When a B2B entity stores money amounts that must be stored with a currency factor or returned recalculated into the currently selected currency.

## Key steps / config

1. **Get the context** — inject `Shopware\B2B\Currency\Framework\CurrencyService` and call `createCurrencyContext()`; the returned `Shopware\B2B\Currency\Framework\CurrencyContext` always holds the currently selected currency factor. Use it to store the factor with a new amount or to fetch recalculated data.
2. **Entity** — every recalculable entity implements `Shopware\B2B\Currency\Framework\CurrencyAware`:

```php
class MyEntity implements CurrencyAware
{
    public float $amount1;
    private float $factor;
    public function getCurrencyFactor(): float { /* ... */ }
    public function setCurrencyFactor(float $factor) { /* ... */ }
    /** @return string[] */
    public function getAmountPropertyNames(): array { return ['amount1']; }
}
```

3. **Repository** — inject `Shopware\B2B\Currency\Framework\CurrencyCalculator`; the repository must guarantee every entity it returns has valid, recalculated money values.
4. **Recalculate in PHP (preferred)** — pass a `CurrencyContext` into fetch methods:
   - `$this->currencyCalculator->recalculateAmount($entity, $currencyContext)` for one entity;
   - `$this->currencyCalculator->recalculateAmounts($entities, $currencyContext)` for an array.
5. **Recalculate in SQL** — when aggregating (e.g. `SUM` with `GROUP BY`), get a SQL snippet and use it in place of the raw column:

```php
$transactionSnippet = $this->currencyCalculator
    ->getSqlCalculationPart('amount', 'currency_factor', $currencyContext);
// 'SELECT SUM(' . $transactionSnippet . ') AS sum_amount FROM b2b_budget_transaction WHERE budget_id=:budgetId'
```

## Essential identifiers

- `Shopware\B2B\Currency\Framework\CurrencyContext`
- `Shopware\B2B\Currency\Framework\CurrencyService::createCurrencyContext()`
- `Shopware\B2B\Currency\Framework\CurrencyAware` (`getCurrencyFactor()`, `setCurrencyFactor()`, `getAmountPropertyNames()`)
- `Shopware\B2B\Currency\Framework\CurrencyCalculator` (`recalculateAmount()`, `recalculateAmounts()`, `getSqlCalculationPart()`)

## Gotchas

- The source's snippets contain typos (`$this->>currencyCalculator`, `$this-connection`); use `$this->` in real code.
- These are B2B Suite classes, distinct from Shopware core's currency handling (core `CurrencyEntity` has its own `$factor`, and `Context::getCurrencyFactor()`); they are not present in the installed packages.

## Code check (6.7.13.0)
- unverified `Shopware\B2B\Currency\Framework\CurrencyContext` — B2B Suite class, not in vendor/shopware core/storefront/administration
- unverified `Shopware\B2B\Currency\Framework\CurrencyService` — B2B Suite class, out of scope of installed packages
- unverified `Shopware\B2B\Currency\Framework\CurrencyAware` — B2B Suite interface, required members cannot be read
- unverified `Shopware\B2B\Currency\Framework\CurrencyCalculator` — B2B Suite class, out of scope
- unverified `getSqlCalculationPart` — B2B Suite calculator method, out of scope
- confirmed `CurrencyEntity::$factor` — core currency entity factor property (not the B2B class) — vendor/shopware/core/System/Currency/CurrencyEntity.php:26
- confirmed `Context::getCurrencyFactor()` — core context currency factor accessor (not the B2B interface) — vendor/shopware/core/Framework/Context.php:151
