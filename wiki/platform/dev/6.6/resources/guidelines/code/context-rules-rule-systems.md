---
id: "platform/dev/6.6/resources/guidelines/code/context-rules-rule-systems.md"
title: "Context Rules & Rule Systems"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/context-rules-rule-systems.html"
sourceHash: "0ed910452ef431b36bb95f11b00b812651d27559"
keywords: ["rule system", "context rules", "CartRuleScope", "LineItemScope", "rule builder", "database queries", "rule scopes", "cart rules", "condition rules"]
summary: "Coding rules for Shopware's rule system: no database queries inside a rule, and rules may only access their scope's provided data."
lastBuilt: "2026-09-15"
---
## What it is

Coding rules for implementing rules in Shopware's rule system (used e.g. by the rule builder).

## When to use

Apply these rules when writing a new rule class that evaluates cart or line item conditions.

## Key steps / config

- A rule must never query the database, because all configured rules are validated within a single request.
- Rules that check the cart must support the `\Shopware\Core\Checkout\Cart\Rule\CartRuleScope` class and the `\Shopware\Core\Checkout\Cart\Rule\LineItemScope` class.
- Rules may only access data that is provided in the appropriate scope — not arbitrary external state.

## Essential identifiers

- `\Shopware\Core\Checkout\Cart\Rule\CartRuleScope`
- `\Shopware\Core\Checkout\Cart\Rule\LineItemScope`
