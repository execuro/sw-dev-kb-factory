---
id: platform/dev/6.7/products/tools/mcp-server/examples.md
title: Examples
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/examples.html
sourceHash: 0f76b0acc26eb786e8a21ca88fa5a9c0d48e7654
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-entity-search", "shopware-entity-schema", "shopware-order-state", "shopware-entity-aggregate", "shopware-entity-upsert", "shopware-system-config-write", "shopware-media-upload", "shopware-theme-config", "shopware://state-machines", "mcp tool call examples", "dryRun", "ai agent workflow"]
summary: "Sample MCP tool-call payloads for Shopware core tools: entity search/aggregate/upsert, order state transitions, system config, media upload, theme config."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/shopware-extensions.md"]
---
## What it is

Sequences of tool calls an AI agent makes against Shopware's built-in MCP server for common tasks, with the JSON arguments for each core tool and the resources read along the way.

## When to use

When you need the argument shape for a core MCP tool or a recipe for chaining tools and resources.

## Key steps / config

**Data model**: read `shopware://entities` (no tool call), then `shopware-entity-schema` with `{"entity": "product"}` to learn valid fields and associations before building criteria.

**Search** (`shopware-entity-search`): `entity`, `term`, `limit`, `page`, and `criteria` — a JSON *string* in Admin API criteria format (`filter`, `sort`, `associations`, `includes`):

```json
{"entity": "product", "term": "shirt", "limit": 5}
{"entity": "product", "limit": 10, "page": 3}
{"entity": "order", "criteria": "{\"sort\": [...], \"associations\": {\"lineItems\": {}}}"}
```

Paginate by incrementing `page` until `page * limit >= _meta.total`.

**Order state** (`shopware-order-state`): `orderNumber`, any of `orderAction` / `transactionAction` / `deliveryAction`, `dryRun`. Preview with `true`, then repeat with `false`, e.g. `{"orderNumber": "10001", "orderAction": "cancel", "transactionAction": "refund", "deliveryAction": "cancel", "dryRun": false}`. Read `shopware://state-machines` first for valid actions.

**System config**: `shopware-system-config-read` with `{"key": "core.listing"}` (prefix returns all keys); `shopware-system-config-write` with `{"key": "core.listing.defaultSorting", "value": "\"price-asc\"", "dryRun": true}` — `value` is JSON-encoded.

**Upsert** (`shopware-entity-upsert`): `entity`, `payload` (JSON string), `dryRun`. A product payload carries `name`, `productNumber`, `stock`, `taxId`, `price` (`[{currencyId, gross, net, linked}]`); get `currencyId` from `shopware://currencies` and `taxId` via search on `tax`. Updates pass `id` plus changed fields.

**Analytics** (`shopware-entity-aggregate`): `entity`, `aggregations` (JSON string; `count`, `avg`, `date-histogram` with `interval: "month"`), optional `filters`.

**Media and theme**: `shopware-media-upload` with `url` and optional `productId`/`fileName` returns a `mediaId`; pass it to `shopware-theme-config` with `salesChannelId`, `action: "update"`, `config: "{\"sw-logo-desktop\": {\"value\": \"<mediaId>\"}}"`, `dryRun`.

**Resources**: `shopware://sales-channels`, `shopware://business-events`, `shopware://flow-actions`.

## Essential identifiers

- `shopware-entity-schema`, `shopware-entity-search`, `shopware-entity-aggregate`, `shopware-entity-upsert`, `shopware-order-state`, `shopware-system-config-read`, `shopware-system-config-write`, `shopware-media-upload`, `shopware-theme-config`
- `shopware://entities`, `shopware://currencies`, `shopware://sales-channels`, `shopware://state-machines`

## Gotchas

- `criteria`, `payload`, `aggregations`, `filters` and `config` are JSON-encoded strings.
- Write tools default to `dryRun=true` in the installed code; pass `false` to persist.
- `shopware-theme-config` ships with the Storefront package and errors on an empty `salesChannelId`.
- `merchant-*` workflow tools come from the SwagMcpMerchantTools plugin, not core.

## Code check (6.7.13.0)
- confirmed `shopware-entity-search` — core tool with entity, criteria, limit, page, term — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:33
- confirmed `shopware-entity-aggregate` — aggregations and filters are JSON strings — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:35
- confirmed `shopware-entity-upsert` — payload JSON string, dryRun default true — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:36
- confirmed `shopware-system-config-write` — key, value, dryRun default true — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:39
- confirmed `shopware-order-state` — orderNumber/orderId plus order/transaction/delivery actions — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:40
- confirmed `shopware-media-upload` — url required, fileName/productId optional — vendor/shopware/core/Framework/Mcp/Tool/MediaUploadTool.php:18
- confirmed `ThemeConfigTool::__invoke()` — salesChannelId, action, config, dryRun = true — vendor/shopware/storefront/Mcp/Tool/ThemeConfigTool.php:39
- confirmed `shopware-entity-schema` — field and association schema tool — vendor/shopware/core/Framework/Mcp/Tool/EntitySchemaTool.php:25
- confirmed `shopware://entities` — entity list resource — vendor/shopware/core/Framework/Mcp/Resource/EntityListResource.php:13
- confirmed `shopware://state-machines` — states and transitions resource — vendor/shopware/core/Framework/Mcp/Resource/StateMachineResource.php:16
