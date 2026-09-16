---
id: platform/dev/6.6/concepts/framework/rules.md
title: Rules
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/rules.html
sourceHash: 286e7101a68ef969b96469232cea81d7eb1dd04a
keywords: ["rule system", "Rule", "RuleScope", "match", "rule builder", "conditions", "Specification pattern", "Container rules", "SalesChannel", "CustomerGroup", "LineItems", "cart", "Data Abstraction Layer"]
summary: "The rule system matches Rule objects against a RuleScope (SalesChannel, CustomerGroup, LineItems, Amount) to drive cart behavior."
lastBuilt: "2026-09-15"
---
## What it is

The rule system pervades Shopware 6. It solves the problem of calculating the cart differently based on context (`SalesChannel`, `CustomerGroup`, etc.) and the current state (`LineItems`, `Amount`, etc.), while staying user-controlled and decoupled from the cart itself. In principle, any part of Shopware 6 can contribute to the set of available rules.

## When to use

Use the rule system whenever cart or checkout behavior needs to be conditional on runtime data — for example, "if a customer orders product A, product B is free in the same order" — without hardcoding the condition into the cart logic.

## Key steps / config

The center of the rule system is the `Rule` class, a variant of the Specification pattern with a few differences:

- It is storable, retrievable and identifiable through the Data Abstraction Layer.
- It takes a `RuleScope` parameter instead of an arbitrary object.
- It uses `match` instead of `isSatisfiedBy`.

A `Rule` implements `match(RuleScope $scope)` to validate user-defined values against the current runtime state. A single rule can contain user-defined values or other user-defined rules (these are Container rules, e.g. an `OrRule` combining a line-item-count rule and a cart-price rule). Unlike a `SearchCriteria`, which is translated and executed by the storage engine, a `Rule` matches in-memory in PHP and never accesses storage directly. The `RuleScope` carries the current runtime state needed to match the data, and rule objects are stored in the database and used to trigger behavior in the cart through their associations.

## Essential identifiers

- `Rule` class
- `RuleScope`
- `Rule::match(RuleScope $scope)`
- Container rules (e.g. `OrRule`)
