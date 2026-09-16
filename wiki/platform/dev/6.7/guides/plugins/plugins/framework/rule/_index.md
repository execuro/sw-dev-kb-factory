---
id: platform/dev/6.7/guides/plugins/plugins/framework/rule/_index.md
title: Rule
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/rule/
sourceHash: a61e4b808a67569004ddf138784d605ceb7f5a9a
codeCheckedAgainst: "6.7.13.0"
keywords: ["rule builder", "rules", "conditions", "custom rule", "Rule", "RuleScope", "RuleConfig", "shopware.rule.definition", "dynamic conditions", "discounts", "personalized content", "pricing conditions"]
summary: Overview of the Rule Builder for plugins - custom rules define conditions on customer, cart or order data that drive discounts, content or pricing.
lastBuilt: 2026-09-15
---
## What it is

The section overview for extending Shopware's Rule Builder from a plugin. The Rule Builder lets users add custom rules that create dynamic conditions and actions. A rule defines criteria based on attributes such as customer data, cart contents, order details or other relevant factors; the rules can then trigger actions such as applying discounts, displaying personalized content or adjusting pricing when the conditions are met.

## When to use

Start here when a plugin needs a new rule condition that the shop owner can combine in the Rule Builder — for example to make prices, promotions or shipping methods depend on something the built-in conditions do not cover. The concrete how-to (PHP rule class plus Administration condition) is the child guide of this section.

## Essential identifiers

Confirmed in the installed core (not named in this overview page itself):

- `Shopware\Core\Framework\Rule\Rule` — abstract base class of every rule condition; subclasses declare `match(RuleScope $scope): bool` and `getConstraints(): array`.
- `Shopware\Core\Framework\Rule\RuleScope` — the evaluation scope passed to `match()`.
- `Shopware\Core\Framework\Rule\RuleConfig` — optional field/operator config returned by `Rule::getConfig()` for rendering in the Administration.
- `shopware.rule.definition` — service tag for rule classes; services extending `Rule` are autoconfigured with it.

## Code check (6.7.13.0)
- confirmed `Rule` — abstract base class — vendor/shopware/core/Framework/Rule/Rule.php:10
- confirmed `Rule::match()` — abstract, takes `RuleScope` — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — abstract — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `Rule::getConfig()` — optional, returns `?RuleConfig` — vendor/shopware/core/Framework/Rule/Rule.php:79
- confirmed `shopware.rule.definition` — autoconfigured tag for `Rule` subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:142
