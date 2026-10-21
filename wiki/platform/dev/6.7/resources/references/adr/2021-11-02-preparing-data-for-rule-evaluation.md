---
id: platform/dev/6.7/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.md
title: Preparing data for rule evaluation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.html
sourceHash: b55fd74615c650788187f22cbe0b2a9c0bac81d8
codeCheckedAgainst: "6.7.15.1"
keywords: ["rule evaluation", "Rule", "RuleScope", "SalesChannelContext", "SalesChannelContextFactory", "FkField", "ManyToManyIdField", "ManyToManyIdFieldUpdater", "JsonField", "indexer", "updater service", "rule builder", "adr"]
summary: "ADR (2021-11-02): rules evaluate only from RuleScope data; prefer FkField/ManyToManyIdField or indexer-maintained fields over extra Criteria associations."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record on how a `Rule` gets the data it evaluates. Because rules can be evaluated on any request, the data they need must always be available, so performance (extra database queries vs. pre-stored data) has to be considered when designing a new rule.

## When to use

Read this when writing a new `Rule` subclass whose `match()` needs data that is not obviously available from the current context, or when deciding whether to add an association, a `ManyToManyIdField`, or an indexer for rule evaluation.

## Key steps / config

1. Evaluate only from the `RuleScope` passed to `match(RuleScope $scope): bool`. The scope provides `getContext()`, `getSalesChannelContext()` and `getCurrentTime()` (a `\DateTimeImmutable`); everything the rule checks should be derived from these.
2. A concrete `Rule` must also implement `getConstraints(): array` and define a non-null `RULE_NAME` constant (otherwise `getName()` throws).
3. Check whether the scope already has the data:
   - ManyToOne / OneToOne association: match the association id via the target definition's `FkField`.
   - ManyToMany association: match ids via the corresponding `ManyToManyIdField`. If none exists and matching by id suffices, add a `ManyToManyIdField` to the definition first; the target entity then needs an indexer that calls `ManyToManyIdFieldUpdater` (`update(string $entity, array $ids, Context $context, ?string $propertyName = null)`).
4. Adding associations to the `Criteria` of DAL searches (e.g. in `SalesChannelContextFactory`) is the least favourable option — only when the association is needed anyway in a wider scope.
5. Preferred option for other data: indexers and updater services that store only the data needed for evaluation on the target entity's definition. The data is persisted asynchronously via the message queue, so storefront requests need no extra queries.

When writing such an updater service:

- Store multiple values per entity in a `JsonField`.
- Use plain SQL only, and handle large numbers of rows at once efficiently.
- Re-run on deletion of the data the index is based on.
- If the indexed data depends on the target entity's state, re-run on changes to the target entity.
- If the data can be inherited from a parent, include the parent ids in the SQL.

```php
class MyRule extends Rule
{
    final public const RULE_NAME = 'myRule';

    public function match(RuleScope $scope): bool { /* ... */ }

    public function getConstraints(): array { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Framework\Rule\Rule` (`match()`, `getConstraints()`, `RULE_NAME`)
- `Shopware\Core\Framework\Rule\RuleScope`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\FkField`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToManyIdField`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\ManyToManyIdFieldUpdater`
- `Shopware\Core\Framework\DataAbstractionLayer\Field\JsonField`
- `Shopware\Core\System\SalesChannel\Context\SalesChannelContextFactory`

## Gotchas

- A `ManyToManyIdField` is only kept in sync if the target entity's indexer calls `ManyToManyIdFieldUpdater`; adding the field alone is not enough.
- Indexed data is updated asynchronously through the message queue, so it can lag behind writes.

## Code check (6.7.15.1)
- confirmed `RuleScope::getContext()` — abstract getter on the scope — vendor/shopware/core/Framework/Rule/RuleScope.php:13
- confirmed `RuleScope::getSalesChannelContext()` — abstract getter on the scope — vendor/shopware/core/Framework/Rule/RuleScope.php:15
- confirmed `RuleScope::getCurrentTime()` — returns \DateTimeImmutable — vendor/shopware/core/Framework/Rule/RuleScope.php:17
- confirmed `Rule::match()` — abstract, takes RuleScope — vendor/shopware/core/Framework/Rule/Rule.php:62
- confirmed `Rule::getConstraints()` — also abstract; not mentioned in the ADR — vendor/shopware/core/Framework/Rule/Rule.php:74
- confirmed `Rule::RULE_NAME` — getName() throws when null — vendor/shopware/core/Framework/Rule/Rule.php:12
- confirmed `ManyToManyIdField` — DAL field extending ListField — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyIdField.php:9
- confirmed `ManyToManyIdFieldUpdater::update()` — indexer helper for id fields — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/ManyToManyIdFieldUpdater.php:36
- confirmed `FkField` — DAL foreign key field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/FkField.php:11
- confirmed `SalesChannelContextFactory` — context factory class — vendor/shopware/core/System/SalesChannel/Context/SalesChannelContextFactory.php:34
