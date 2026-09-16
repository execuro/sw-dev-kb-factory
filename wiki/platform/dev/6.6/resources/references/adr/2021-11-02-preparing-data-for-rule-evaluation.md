---
id: platform/dev/6.6/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.md
title: Preparing data for rule evaluation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.html
sourceHash: b55fd74615c650788187f22cbe0b2a9c0bac81d8
keywords: ["rule evaluation", "RuleScope", "Rule definition", "SalesChannelContextFactory", "FkField", "ManyToManyIdField", "ManyToManyIdFieldUpdater", "JsonField", "indexer", "updater service", "Criteria associations", "DAL performance"]
summary: ADR on sourcing rule-evaluation data from RuleScope first, preferring indexers/updaters over extra Criteria associations for performance.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record on how new `Rule` definitions should retrieve the data they need to evaluate, balancing correctness against added database queries on every request.

## When to use
Relevant when writing a new rule condition and deciding where its evaluation data should come from.

## Key steps / config
- A `Rule` instance should evaluate based on data available from `RuleScope`, which provides `Context`, `SalesChannelContext`, and a `\DateTimeImmutable` current time.
- If the data isn't already reachable via `Context`/`SalesChannelContext` methods, the **least** favorable option is adding an association to the `Criteria` of a DAL search (e.g. in `SalesChannelContextFactory`).
- The preferred option is to use indexers and updater services so only the data strictly necessary for evaluation is stored on the target entity's definition, kept current by background/message-queue processing.
- For a ManyToOne/OneToOne match, use the target definition's `FkField`. For a ManyToMany match, use a `ManyToManyIdField`; if missing, add one and ensure the target entity's indexer calls `ManyToManyIdFieldUpdater`.
- When indexing other data: use a `JsonField` for multi-value fields, keep the updater service plain-SQL only, make it efficient for bulk row updates, call it on deletion of the source data, on changes to the target entity's relevant state, and account for parent-inherited data in the plain SQL.

## Essential identifiers
- `RuleScope`
- `FkField`
- `ManyToManyIdField` / `ManyToManyIdFieldUpdater`
- `JsonField`

## Gotchas
- Adding a `Criteria` association should be a last resort — prefer indexer/updater services to avoid extra database queries during storefront requests.
