---
id: platform/dev/6.7/products/tools/mcp-server/examples.md
title: Examples
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/examples.html
sourceHash: 0f76b0acc26eb786e8a21ca88fa5a9c0d48e7654
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-entity-search", "shopware-entity-schema", "shopware-entity-upsert", "shopware-entity-aggregate", "shopware-order-state", "shopware-system-config-write", "shopware-media-upload", "shopware-theme-config", "shopware://state-machines", "dryRun", "mcp tool call examples", "criteria json"]
summary: Example argument payloads for Shopware's built-in MCP tools and resources - entity search, order state, system config, upsert, aggregations, media, theme.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/shopware-extensions.md"]
---
## What it is

Sequences of built-in MCP tool calls and resource reads an AI agent makes for common tasks, with the exact argument shapes. Criteria, payloads, aggregations and filters are passed as **JSON-encoded strings**, not nested objects.

## When to use

You need the argument format of a core MCP tool, or the order of calls for a workflow (explore schema → search → preview write → commit).

## Key steps / config

**Data model:** read `shopware://entities` for entity names; call `shopware-entity-schema` with `{"entity": "product"}` to learn valid fields and association names before building criteria.

**Search** (`shopware-entity-search`, params `entity`, `criteria`, `limit`, `page`, `term`):

```json
{"entity": "product", "term": "shirt", "limit": 5}
{"entity": "product", "limit": 10, "page": 3}
{"entity": "order", "criteria": "{\"sort\": [{\"field\": \"createdAt\", \"order\": \"DESC\"}], \"limit\": 5, \"associations\": {\"lineItems\": {}, \"transactions\": {}}}"}
```

Criteria JSON supports `filter` (e.g. `multi`/`equals`/`range`), `sort`, `includes`, `associations`. Paginate by incrementing `page` until `page * limit >= _meta.total`.

**Order state** (`shopware-order-state`): identify by `orderNumber` (or `orderId`), give any of `orderAction`, `transactionAction`, `deliveryAction`, preview with `dryRun: true`, execute with `dryRun: false`:

```json
{"orderNumber": "10001", "orderAction": "cancel", "transactionAction": "refund", "deliveryAction": "cancel", "dryRun": false}
```

Read `shopware://state-machines` first for valid actions.

**System config:** `shopware-system-config-read` with `{"key": "core.listing"}`; `shopware-system-config-write` with `{"key": "core.listing.defaultSorting", "value": "\"price-asc\"", "dryRun": true}` — `value` is itself JSON.

**Create/update** (`shopware-entity-upsert`): `{"entity": "product", "payload": "{...}", "dryRun": true}`; include `id` in the payload to update. Use `shopware://currencies` for `currencyId` and search `tax` for `taxId`.

**Analytics** (`shopware-entity-aggregate`, params `entity`, `aggregations`, `filters`): e.g. `count`, `avg` on `amountTotal`, `date-histogram` on `orderDateTime` with `interval: month`.

**Media / theme:** `shopware-media-upload` with `url` plus optional `productId` or `fileName`; then `shopware-theme-config` with `salesChannelId`, `action: "update"`, `config` (e.g. `sw-logo-desktop` set to the returned `mediaId`), `dryRun`. Find IDs via `shopware://sales-channels`.

**Other resources:** `shopware://business-events`, `shopware://flow-actions`.

Higher-level `merchant-*` workflow tools come from the SwagMcpMerchantTools plugin, see [Shopware extensions](platform/dev/6.7/products/tools/mcp-server/shopware-extensions.md).

## Essential identifiers

- Tools: `shopware-entity-schema`, `shopware-entity-search`, `shopware-entity-upsert`, `shopware-entity-aggregate`, `shopware-order-state`, `shopware-system-config-read`, `shopware-system-config-write`, `shopware-media-upload`, `shopware-theme-config`
- Resources: `shopware://entities`, `shopware://state-machines`, `shopware://currencies`, `shopware://sales-channels`, `shopware://business-events`, `shopware://flow-actions`

## Gotchas

- Write tools default to `dryRun = true` in code; pass `dryRun: false` explicitly to commit. `shopware-media-upload` has no `dryRun` parameter.

## Code check (6.7.15.1)
- confirmed `shopware-entity-search` — params entity, criteria, limit (25), page (1), term — vendor/shopware/core/Framework/Mcp/Tool/EntitySearchTool.php:22
- confirmed `shopware-entity-aggregate` — params entity, aggregations, filters — vendor/shopware/core/Framework/Mcp/Tool/EntityAggregateTool.php:25
- confirmed `shopware-order-state` — order/transaction/delivery actions, dryRun defaults true — vendor/shopware/core/Framework/Mcp/Tool/OrderStateTool.php:29
- confirmed `shopware-system-config-write` — key, value, salesChannelId, dryRun defaults true — vendor/shopware/core/Framework/Mcp/Tool/SystemConfigWriteTool.php:18
- confirmed `shopware-entity-upsert` — entity, payload, dryRun defaults true — vendor/shopware/core/Framework/Mcp/Tool/EntityUpsertTool.php:19
- confirmed `shopware-media-upload` — url, fileName, mediaFolderId, productId; no dryRun — vendor/shopware/core/Framework/Mcp/Tool/MediaUploadTool.php:21
- confirmed `shopware-theme-config` — Storefront tool: salesChannelId, action, config, dryRun — vendor/shopware/storefront/Mcp/Tool/ThemeConfigTool.php:26
- confirmed `shopware-entity-schema` — takes entity — vendor/shopware/core/Framework/Mcp/Tool/EntitySchemaTool.php:28
- confirmed `shopware://state-machines` — resource URI — vendor/shopware/core/Framework/Mcp/Resource/StateMachineResource.php:18
- confirmed `shopware://entities` — resource URI — vendor/shopware/core/Framework/Mcp/Resource/EntityListResource.php:15
