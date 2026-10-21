---
id: platform/dev/6.7/guides/plugins/plugins/framework/rule/_index.md
title: Rule
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/rule/
sourceHash: a61e4b808a67569004ddf138784d605ceb7f5a9a
codeCheckedAgainst: "6.7.15.1"
keywords: ["rule builder", "custom rules", "rule conditions", "dynamic conditions", "Rule", "rule system", "discounts", "personalized content", "pricing rules", "plugin guides"]
summary: Section index for plugin guides on the Rule Builder - adding custom rule conditions evaluated against customer, cart or order data.
lastBuilt: 2026-10-21
---
## What it is

Landing page for the plugin guides about the Rule Builder. The Rule Builder lets users combine conditions based on attributes such as customer data, cart contents or order details; rules built from these conditions are then used to drive actions such as applying discounts, showing personalized content or adjusting prices.

## When to use

Start here when a plugin needs to contribute its own rule condition to the Rule Builder; the concrete how-to (PHP rule class plus Administration integration) is the "Add Custom Rules" guide in this section.

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule` — abstract base class every rule condition extends (from the installed code, not named on this index page).

## Code check (6.7.15.1)
- confirmed `Rule` — abstract base class for rule conditions — vendor/shopware/core/Framework/Rule/Rule.php:10
- confirmed `shopware.rule.definition` — service tag used to register rule conditions — vendor/shopware/core/Checkout/DependencyInjection/rule.php:103
