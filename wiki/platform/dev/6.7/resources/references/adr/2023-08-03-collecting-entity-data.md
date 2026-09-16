---
id: platform/dev/6.7/resources/references/adr/2023-08-03-collecting-entity-data.md
title: Collecting and dispatching entity data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-08-03-collecting-entity-data.html
sourceHash: 8f9efbc95a931d76c3fa83a4efd17ea59983f9e7
codeCheckedAgainst: "6.7.13.0"
keywords: ["usage data", "entity data collection", "data sharing consent", "allow-list", "usage-data-allow-list.json", "ManyToManyIdField", "ManyToManyAssociationField", "associationName", "usage_data.entity_data.collect", "shopware.usage_data", "gateway batch_size", "puid", "kill-switch"]
summary: "ADR: consent-based usage data collection of allow-listed entity fields, sent in batches to the shopware AG gateway via scheduled task and queue."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (area `data-services`, 2023-08-03) describing how Shopware extracts entity data from shops, with merchant consent, and transfers it to the *shopware AG* gateway as the basis for data-driven features delivered as apps.

## When to use

Read this when working with the usage data (data sharing) feature in core (`Shopware\Core\System\UsageData`), when adding or checking which entity fields are shared, or when debugging the collection scheduled task, queue messages or deletion tracking.

## Key steps / config

Decisions:

- **Consent first**: no data is collected or transferred without explicit merchant consent. Admin users are prompted on the Administration dashboard; the state can be changed later in system settings. Consent changes are sent to and stored on the gateway. Revocation stops the process.
- **No sensitive data**: personal or business-critical information is excluded. PII is modified so a person cannot be identified; a *personal unique identifier (PUID)* links the same person across sources (entity data, on-site tracking).
- **Allow-list only**: entities are excluded by default; only entities and fields listed in the allow-list are collected. In 6.7.13.0 the list ships as `usage-data-allow-list.json` next to `UsageDataAllowListService`.

Allow-list shape:

```json
{
    "category": ["id", "parentId", "type"],
    "product": ["id", "parentId", "name", "categories", "tags"]
}
```

- **Many-to-many associations**: mapping entities (e.g. `product_category`) are not listed. List the association on the owning entity using the `associationName`, not the `propertyName` (e.g. `categories`, not `categoryIds`). Associations with a matching `ManyToManyIdField` (e.g. `new ManyToManyIdField('category_ids', 'categoryIds', 'categories')`) are read as ids directly from the database; other many-to-many associations are resolved by fetching the associated entities first and matching them.
- **Translated fields** are not resolved automatically — add translation entities (e.g. `product_translation`) to the allow-list explicitly.

Runtime behaviour (consequences):

- Triggered daily by the scheduled task `usage_data.entity_data.collect` while consent is given, and immediately when consent is granted.
- For each entity definition, messages go to a low-priority queue and are processed asynchronously; batches of up to 50 entities are sent to the gateway (config `shopware.usage_data.gateway.batch_size`, default `50`).
- After the first run only deltas (created/updated since the last send) are dispatched.
- Deletions are stored by an event subscriber and sent (then removed) on the next run; nothing is stored without consent.
- A remote kill-switch on the gateway stops new messages from being scheduled; already queued messages are still handled.

Relevant config block (`shopware.yaml` defaults):

```yaml
shopware:
    usage_data:
        collection_enabled: true
        gateway:
            dispatch_enabled: true
            base_uri: 'https://data.shopware.io'
            batch_size: 50
```

## Essential identifiers

- `Shopware\Core\System\UsageData\Services\UsageDataAllowListService`
- `usage-data-allow-list.json`
- `Shopware\Core\System\UsageData\ScheduledTask\CollectEntityDataTask` (`usage_data.entity_data.collect`)
- `Shopware\Core\System\UsageData\Subscriber\EntityDeleteSubscriber`
- `ManyToManyIdField`, `ManyToManyAssociationField`
- `shopware.usage_data.gateway.batch_size`

## Gotchas

- Using the `propertyName` of a many-to-many field in the allow-list instead of its `associationName` does not include the association.
- The source's `ProductDefinition` snippet passes `associationName:` as a named argument and adds `SearchRanking` flags; the installed definition passes `'categories'` positionally and has no `SearchRanking` on those associations — the allow-list semantics are the same.

## Version notes

The ADR announces a planned move from data pushing (reading the database on the merchant's server) to data pulling via the Admin API; it is stated as a plan, not as implemented.

## Code check (6.7.13.0)
- confirmed `ManyToManyIdField::$associationName` — third constructor argument used to map the association — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyIdField.php:14
- corrected `ManyToManyIdField('category_ids'` — docs: named `associationName:` argument; code passes `'categories'` positionally — vendor/shopware/core/Content/Product/ProductDefinition.php:207
- confirmed `ManyToManyAssociationField('tags'` — product tags association used in the allow-list example — vendor/shopware/core/Content/Product/ProductDefinition.php:283
- confirmed `usage_data.entity_data.collect` — scheduled task name, interval `self::DAILY` — vendor/shopware/core/System/UsageData/ScheduledTask/CollectEntityDataTask.php:16
- confirmed `batch_size` — `shopware.usage_data.gateway.batch_size` defaults to 50 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:652
- confirmed `usage-data-allow-list.json` — allow-list loaded from JSON file — vendor/shopware/core/System/UsageData/Services/UsageDataAllowListService.php:31
- confirmed `product_translation` — translation entity listed explicitly in the allow-list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:889
- confirmed `EntityDeleteSubscriber` — subscribes to `EntityDeleteEvent` to track deletions — vendor/shopware/core/System/UsageData/Subscriber/EntityDeleteSubscriber.php:29
