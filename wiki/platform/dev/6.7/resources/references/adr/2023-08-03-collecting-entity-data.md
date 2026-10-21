---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2023-08-03-collecting-entity-data.md
sourceHash: 8f9efbc95a931d76c3fa83a4efd17ea59983f9e7
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-08-03-collecting-entity-data.html
title: Collecting and dispatching entity data
version: "6.7"
versions: ["6.7"]
keywords: ["usage data", "data sharing consent", "allow-list", "usage-data-allow-list.json", "usage_data.entity_data.collect", "CollectEntityDataTask", "shopware.usage_data.gateway.batch_size", "usage_data_entity_deletion", "ManyToManyIdField", "associationName", "kill-switch", "PUID", "data-services"]
summary: "ADR: consent-based collection of allow-listed entity fields, sent to the shopware AG gateway in daily low-priority queue batches of 50 with delta sync."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2023-08-03, area data-services) on how a shop extracts entity data and transfers it to *shopware AG* as the basis for data-driven features. It covers consent, exclusion of sensitive data, pseudonymisation, the entity/field allow-list, and the asynchronous, delta-based dispatch process.

## When to use

Read this when you need to know what entity data a shop shares after the merchant consents, how the allow-list format works (including many-to-many and translated fields), or how the scheduled collection, deletion tracking and gateway kill-switch behave.

## Key steps / config

Principles:

- **No sharing without consent.** Administration users are prompted on the dashboard; consent can be changed later in the system settings and revoked any time. Consent changes are sent to and stored on the gateway. Without consent nothing is collected or transferred.
- **No sensitive information** (personal or business-critical data) is collected.
- **PII** is modified so no person can be identified; a *personal unique identifier (PUID)* links the same person across sources (entity data, on-site tracking) without revealing who they are.
- Current approach is *data pushing* (prepared on the merchant's servers from the database); a move to *data pulling* via the Admin API is planned.
- Features built on the data ship as apps, independent of the Shopware release cycle.

Allow-list: entities are excluded by default; only listed entities and fields are collected. The default list ships as `usage-data-allow-list.json` in the core UsageData package. Shape (entity name to list of field names):

```json
{
    "category": ["id", "parentId", "type"],
    "product": ["id", "parentId", "name"]
}
```

- Many-to-many mapping entities are not listed themselves. List the association on the owning entity instead, using its `associationName` rather than the `propertyName` — e.g. `"product": ["categories", "tags"]`, where `ProductDefinition` declares `new ManyToManyIdField('category_ids', 'categoryIds', associationName: 'categories')`.
- Associations with a matching `ManyToManyIdField` have their ids read from the database directly; others are resolved by loading the associated mappings beforehand and matching them to the processed entity.
- Translated fields are not resolved automatically — add the translation entities to the allow-list explicitly.

Process:

- Scheduled task `usage_data.entity_data.collect` runs daily while consent is given, and also right after consent is given.
- Per entity definition, messages go to the low-priority queue and are processed asynchronously.
- Entities are sent in batches; default `shopware.usage_data.gateway.batch_size: 50`.
- After the first run only deltas (created/updated since the last send) are sent.
- An entity-delete subscriber stores deletions in `usage_data_entity_deletion`; they are sent and removed on the next run. Nothing is stored without consent.
- A gateway kill-switch can stop new dispatches; messages already queued are still handled.

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

- `usage_data.entity_data.collect` (scheduled task `CollectEntityDataTask`)
- `usage-data-allow-list.json`, `UsageDataAllowListService`
- `shopware.usage_data.collection_enabled`, `shopware.usage_data.gateway.dispatch_enabled`, `shopware.usage_data.gateway.batch_size`
- `usage_data_entity_deletion` table, `EntityDeleteSubscriber`
- `ManyToManyIdField`, `associationName`

## Gotchas

- Allow-list entries for many-to-many use the association name, not the id-field property name (`categories`, not `categoryIds`).
- Translated fields are silently missing unless translation entities are allow-listed.
- The ADR's section "Associations problem: product -> category" is empty in the source.

## Code check (6.7.15.1)
- confirmed `CollectEntityDataTask::getTaskName()` — returns `usage_data.entity_data.collect` — vendor/shopware/core/System/UsageData/ScheduledTask/CollectEntityDataTask.php:16
- confirmed `CollectEntityDataTask::getDefaultInterval()` — `self::DAILY` — vendor/shopware/core/System/UsageData/ScheduledTask/CollectEntityDataTask.php:21
- confirmed `batch_size` — default 50 under `shopware.usage_data.gateway` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:694
- confirmed `UsageDataAllowListService::getDefaultUsageDataAllowList()` — loads `usage-data-allow-list.json` — vendor/shopware/core/System/UsageData/Services/UsageDataAllowListService.php:31
- confirmed `IterateEntityMessage` — implements `LowPriorityMessageInterface` — vendor/shopware/core/System/UsageData/EntitySync/IterateEntityMessage.php:12
- confirmed `EntityDeleteSubscriber::DELETIONS_TABLE_NAME` — `usage_data_entity_deletion` — vendor/shopware/core/System/UsageData/Subscriber/EntityDeleteSubscriber.php:31
- confirmed `EntityDeleteSubscriber::handleEntityDeleteEvent()` — returns early without consent — vendor/shopware/core/System/UsageData/Subscriber/EntityDeleteSubscriber.php:49
- confirmed `killswitch` — gateway kill-switch queried by the client — vendor/shopware/core/System/UsageData/Client/GatewayClient.php:26
- confirmed `ManyToManyIdField::$associationName` — constructor argument — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyIdField.php:14
- confirmed `ManyToManyAssociationService::getMappingIdsForAssociationFields()` — resolves many-to-many mapping ids — vendor/shopware/core/System/UsageData/Services/ManyToManyAssociationService.php:33
