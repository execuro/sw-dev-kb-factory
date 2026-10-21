---
id: platform/dev/6.7/guides/hosting/configurations/shopware/price-rule-limit.md
title: Price rule calculation limit
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/price-rule-limit.html
sourceHash: 4db3e66f88d4443ad19136deda9c3e84fdc75b82
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.dal.max_rule_prices", "max_rule_prices", "dal", "CheapestPriceAccessorBuilder", "cheapest price", "rule prices", "advanced prices", "listing sorting", "listing filters", "price filter", "rule limit", "shopware.yaml"]
summary: "shopware.dal.max_rule_prices (default 100) caps matching rules used for cheapest-price listing filters/sorting; extra rules are ignored and logged."
lastBuilt: 2026-10-21
---
## What it is

Shopware considers at most a fixed number of matching rules (default `100`) when it calculates the cheapest price used for product listing filters and sorting. If the customer context matches more rules, only the first N rule IDs are used, the rest are ignored for this calculation, and a warning is logged. The limit is the bundle config key `shopware.dal.max_rule_prices`.

## When to use

- Listing sort order or price filters look wrong while the product detail page shows the correct price.
- The log contains "More than 100 rules are active, only the first 100 rules are considered for the cheapest price calculation".
- A shop has many overlapping rules (advanced prices bound to rules) that match the same customer at once.

## Key steps / config

1. First reduce unnecessary overlap between rules so fewer of them match the same context at the same time.
2. If the limit must be raised, set it in `config/packages/prod/shopware.yaml`:

```yaml
shopware:
    dal:
        max_rule_prices: 200
```

3. Monitor listing performance and logs after changing it.

The value is an integer node with a minimum of `1`; the shipped bundle default is `max_rule_prices: 100`. It is injected as the container parameter `shopware.dal.max_rule_prices` into `CheapestPriceAccessorBuilder`, which builds the SQL accessor for the cheapest-price field. For each considered rule it adds one `COALESCE` candidate (two when the context currency is not the default currency), plus a fallback `default` price key.

## Essential identifiers

- `shopware.dal.max_rule_prices` — config key / container parameter, default `100`
- `Shopware\Core\Content\Product\DataAbstractionLayer\CheapestPrice\CheapestPriceAccessorBuilder` — applies the limit
- `config/packages/prod/shopware.yaml` — where the docs place the override

## Gotchas

- Raising the limit increases the cost of listing queries: every additional rule adds expressions to the generated `COALESCE(...)` accessor used in filters and sorting.
- Rules beyond the limit are cut by the order of the context's rule IDs (`array_slice`), not by price; which rules are dropped depends on that order.
- Besides the warning, an info-level log message explains that `dal.max_rule_prices` can be increased at a performance cost.

## Code check (6.7.15.1)
- confirmed `max_rule_prices` — integer node, min 1, default 100 under `shopware.dal` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:902
- confirmed `shopware.dal.max_rule_prices` — parameter injected into CheapestPriceAccessorBuilder — vendor/shopware/core/Content/DependencyInjection/product.php:839
- confirmed `CheapestPriceAccessorBuilder::buildAccessor()` — builds the cheapest-price accessor and applies the rule limit — vendor/shopware/core/Content/Product/DataAbstractionLayer/CheapestPrice/CheapestPriceAccessorBuilder.php:25
- confirmed `CheapestPriceAccessorBuilder::$maxRulePrices` — warning logged, rule IDs sliced to the first N, `default` key appended — vendor/shopware/core/Content/Product/DataAbstractionLayer/CheapestPrice/CheapestPriceAccessorBuilder.php:38
- confirmed `dal.max_rule_prices` — info log recommends restructuring rules before raising it — vendor/shopware/core/Content/Product/DataAbstractionLayer/CheapestPrice/CheapestPriceAccessorBuilder.php:36
