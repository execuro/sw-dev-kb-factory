---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.md
sourceHash: b55fd74615c650788187f22cbe0b2a9c0bac81d8
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.html
title: Preparing data for rule evaluation
version: "6.7"
versions:
  - "6.7"
keywords: ["rule evaluation", "rule builder", "Rule", "RuleScope", "SalesChannelContext", "SalesChannelContextFactory", "FkField", "ManyToManyIdField", "ManyToManyIdFieldUpdater", "JsonField", "indexer", "updater service", "conditions", "adr"]
summary: "ADR: rules evaluate only data from RuleScope; prefer FkField/ManyToManyIdField and indexer-maintained fields over extra Criteria associations."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2021-11-02, area services-settings) on how to provide the data a new `Rule` needs for evaluation. Because rules may be evaluated on any request, the data must always be available without costly extra database queries.

## When to use

- You write a custom rule condition and need to decide where its evaluation data comes from.
- You consider adding associations to context loading or writing an indexer/updater for rule data.

## Key steps / config

1. Evaluate a `Rule` only from its `RuleScope` (in code: `Rule::match(RuleScope $scope): bool`). `RuleScope` provides `getContext()` (`Context`), `getSalesChannelContext()` (`SalesChannelContext`) and `getCurrentTime()` (`\DateTimeImmutable`); derive everything from these.
2. First check whether the scope already provides the data:
   - ManyToOne / OneToOne association: match the id via the target definition's `FkField`.
   - ManyToMany association: match via the `ManyToManyIdField` (e.g. product `tagIds`). If none exists yet and id matching suffices, add a `ManyToManyIdField` to the definition first, and make sure the target entity has an indexer that calls `ManyToManyIdFieldUpdater`.
3. Least favourable option: adding associations to the `Criteria` of DAL searches, e.g. in `SalesChannelContextFactory` — only if the association is needed anyway in a much wider scope.
4. Preferred option for anything beyond ids: indexers and updater services that store only the data needed for evaluation on the target entity's definition. The data is persisted asynchronously via the message queue, avoiding extra queries during storefront requests.
5. When writing the updater service:
   - store multiple values per entity in a `JsonField`;
   - use plain SQL only;
   - handle large numbers of rows at once efficiently;
   - also run on deletion of the data the index is based on;
   - also run on changes to the target entity if the index depends on its state;
   - include parent ids in the SQL when the data can be inherited from a parent.

## Essential identifiers

- `Rule`, `Rule::match()`
- `RuleScope::getContext()`, `RuleScope::getSalesChannelContext()`, `RuleScope::getCurrentTime()`
- `FkField`, `ManyToManyIdField`, `JsonField`
- `ManyToManyIdFieldUpdater::update()`
- `SalesChannelContextFactory`

## Gotchas

- Extra `Criteria` associations in context creation cost performance on every request; the ADR ranks them last.

## Code check (6.7.13.0)
- confirmed `Rule::match()` — abstract, receives a RuleScope — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `RuleScope::getContext()` — abstract getter — vendor/shopware/core/Framework/Rule/RuleScope.php:13
- confirmed `RuleScope::getSalesChannelContext()` — abstract getter — vendor/shopware/core/Framework/Rule/RuleScope.php:15
- confirmed `RuleScope::getCurrentTime()` — returns \DateTimeImmutable from the clock — vendor/shopware/core/Framework/Rule/RuleScope.php:17
- confirmed `ManyToManyIdField` — DAL field class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyIdField.php:9
- confirmed `ManyToManyIdFieldUpdater::update()` — updates id fields for entity ids — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/ManyToManyIdFieldUpdater.php:36
- confirmed `tagIds` — product ManyToManyIdField example — vendor/shopware/core/Content/Product/ProductDefinition.php:206
- confirmed `FkField` — DAL field class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/FkField.php:11
- confirmed `JsonField` — DAL field class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/JsonField.php:10
- confirmed `SalesChannelContextFactory` — context factory class — vendor/shopware/core/System/SalesChannel/Context/SalesChannelContextFactory.php:34
