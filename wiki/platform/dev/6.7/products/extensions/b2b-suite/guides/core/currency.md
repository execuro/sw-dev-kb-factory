---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/currency.md
title: Currency
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/currency.html
sourceHash: 3f8429a91823533e3e45618cef472ea302c2fe13
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "currency", "currency factor", "CurrencyContext", "CurrencyService", "createCurrencyContext", "CurrencyAware", "CurrencyCalculator", "recalculateAmount", "recalculateAmounts", "getSqlCalculationPart", "exchange rate", "money recalculation"]
summary: B2B Suite Currency component - CurrencyContext/CurrencyService, CurrencyAware entities and CurrencyCalculator recalculation in PHP or SQL.
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite Currency component handles currency calculation for B2B entities. It provides a context object carrying the currency factor, an interface for recalculable entities, and a calculator that repositories use so every loaded entity has valid, recalculated money values.

## When to use

When a B2B Suite entity stores amounts (budgets, transactions, etc.) that must be shown in the currently selected currency, or when you sum amounts in SQL.

## Key steps / config

1. **Get the context** - `Shopware\B2B\Currency\Framework\CurrencyService::createCurrencyContext()` returns the default `Shopware\B2B\Currency\Framework\CurrencyContext`, always holding the currently selected currency factor. Use it to store the factor along with a new amount, or to request recalculated data from a repository.
2. **Entity** - every recalculable entity implements `Shopware\B2B\Currency\Framework\CurrencyAware`:

```php
class MyEntity implements CurrencyAware
{
    public float $amount1;
    private float $factor;

    public function getCurrencyFactor(): float { return $this->factor; }
    public function setCurrencyFactor(float $factor) { $this->factor = $factor; }
    /** @return string[] */
    public function getAmountPropertyNames(): array { return ['amount1']; }
}
```

3. **Repository** - inject `Shopware\B2B\Currency\Framework\CurrencyCalculator` and pass a `CurrencyContext` into fetch methods.
4. **Recalculate in PHP (preferred)**:
   - `$this->currencyCalculator->recalculateAmount($entity, $currencyContext)` for one entity
   - `$this->currencyCalculator->recalculateAmounts($entities, $currencyContext)` for an array
5. **Recalculate in SQL** - needed e.g. for `GROUP BY` sums. Get a calculation snippet and embed it instead of the raw column:

```php
$transactionSnippet = $this->currencyCalculator
    ->getSqlCalculationPart('amount', 'currency_factor', $currencyContext);
// 'SELECT SUM(' . $transactionSnippet . ') AS sum_amount FROM b2b_budget_transaction WHERE budget_id=:budgetId'
```

## Essential identifiers

- `Shopware\B2B\Currency\Framework\CurrencyContext`
- `Shopware\B2B\Currency\Framework\CurrencyService` / `createCurrencyContext()`
- `Shopware\B2B\Currency\Framework\CurrencyAware` (`getCurrencyFactor`, `setCurrencyFactor`, `getAmountPropertyNames`)
- `Shopware\B2B\Currency\Framework\CurrencyCalculator` (`recalculateAmount`, `recalculateAmounts`, `getSqlCalculationPart`)
- column `currency_factor`

## Gotchas

- The repository is responsible for the guarantee that retrieved entities carry recalculated values; the calculator only helps.
- The source's SQL example calls `fetchColumn()` on the DBAL connection; Shopware 6.7 core has no call site of this method (core code uses e.g. `fetchAllAssociative()`), so check the DBAL version your code runs against.

## Code check (6.7.15.1)
- unverified `Shopware\B2B\Currency\Framework\CurrencyContext` — B2B Suite plugin code, not in the installed core/storefront/administration packages
- unverified `Shopware\B2B\Currency\Framework\CurrencyService` — B2B Suite plugin code, out of scope
- unverified `Shopware\B2B\Currency\Framework\CurrencyAware` — B2B Suite plugin code, out of scope
- unverified `Shopware\B2B\Currency\Framework\CurrencyCalculator` — B2B Suite plugin code, out of scope
- confirmed `CurrencyEntity::$factor` — core currency entity stores its exchange factor as float — vendor/shopware/core/System/Currency/CurrencyEntity.php:29
- confirmed `CurrencyEntity::getFactor()` — returns float — vendor/shopware/core/System/Currency/CurrencyEntity.php:73
- confirmed `Connection::fetchAllAssociative()` — DBAL fetch method used by core — vendor/shopware/core/Checkout/Customer/Validation/CustomerEmailUniqueChecker.php:194
- unverified `Connection::fetchColumn()` — vendor/doctrine, out of scope; zero call sites in installed core
