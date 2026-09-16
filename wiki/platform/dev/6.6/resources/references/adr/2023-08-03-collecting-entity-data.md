---
id: platform/dev/6.6/resources/references/adr/2023-08-03-collecting-entity-data.md
title: Collecting and dispatching entity data
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-08-03-collecting-entity-data.html"
sourceHash: "8f9efbc95a931d76c3fa83a4efd17ea59983f9e7"
keywords: ["entity data collection", "consent", "PII", "PUID", "allow-list", "ManyToManyIdField", "ManyToManyAssociationField", "data pulling", "data pushing", "gateway", "kill-switch", "usage data"]
summary: "ADR: consent-gated allow-list based collection of entity data, pushed asynchronously in batches to shopware AG's gateway for data-driven features."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record describing how Shopware extracts and transfers entity data from shops to shopware AG to power data-driven features, under merchant consent.

## When to use
Relevant when understanding what entity/field data is collected from a shop, how consent gates it, or how to add an entity/field to the collection allow-list.

## Key steps / config
- No data is collected or transferred without explicit merchant consent, revocable at any time; consent changes are tracked and sent to the gateway.
- Sensitive/PII data is excluded; a personal unique identifier (PUID) is generated instead, allowing cross-source correlation without identifying the person.
- Only entities/fields listed in an allow-list are collected, in this shape:
```json
{
    "entity_one": ["fieldOne", "fieldTwo"],
    "entity_two": ["fieldOne"]
}
```
- Many-to-many associations are referenced by `associationName` (not `propertyName`) in the allow-list, e.g. a product's `categories`/`tags` fields defined via `ManyToManyIdField`/`ManyToManyAssociationField`.
- Translated fields are not auto-resolved; translation entities must be added to the allow-list explicitly.
- Collection runs once a day via a scheduled task (and immediately when consent is granted), producing low-priority queue messages batched up to 50 entities (configurable).
- After the first run, only deltas (created/updated since the last send) are sent; deletions are tracked by an event subscriber.
- A remote kill-switch on the gateway can stop shops from sending data; already-queued messages still process but no new ones are scheduled while active.

## Essential identifiers
- allow-list JSON format (`{"entity": ["field", ...]}`)
- `ManyToManyIdField`, `ManyToManyAssociationField`
- personal unique identifier (PUID)

## Gotchas
Many-to-many entities themselves are excluded from the allow-list; they're resolved by fetching directly or via the associated entity table instead. Data-driven features built on this data are rolled out via the app system, independent of the Shopware release cycle. The current push-based approach is planned to transition to a pull-based approach using the Admin API.
