---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/tools/mcp-server/tools-reference.md
sourceHash: 28b9fc2aa2aa90d0e68a835472ca472ddccd14eb
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/tools-reference.html
title: Tools Reference
version: "6.7"
versions:
  - "6.7"
keywords: ["McpToolResponse", "shopware-entity-search", "shopware-entity-upsert", "shopware-entity-aggregate", "shopware-system-config-write", "shopware-order-state", "shopware-media-upload", "shopware-theme-config", "shopware-context", "shopware://tool-result", "dryRun", "SKIP_TRIGGER_FLOW", "mcp tools", "mcp resources", "tool parameters"]
summary: "Built-in Shopware MCP tools, parameters, ACL, dryRun behaviour, 100 KB result offloading, shopware:// resources and the shopware-context prompt."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/store-api.md", "platform/dev/6.7/guides/plugins/plugins/mcp-server.md"]
---
## What it is

Reference for the built-in tools, resources and `shopware-context` prompt of the MCP server at `/api/_mcp`: parameters, defaults, ACL privileges, response envelope, dry-run semantics.

## When to use

Calling core MCP tools, configuring an integration's ACL role or allowlist, or handling a `shopware://tool-result/...` URI in a response.

## Key steps / config

**Envelope** (all core tools extend `McpToolResponse`); `_meta` is optional:

```json
{"success": true, "data": [], "_meta": {"total": 42, "page": 1, "limit": 25}}
{"success": false, "error": "Human-readable message"}
```

**Large results**: over 100 KB, the result is stored and `_meta.resourceUri` holds `shopware://tool-result/{id}`; cache is removed when the MCP session ends.

**Dry run**: write tools default `dryRun` to `true` — transaction opened, operation run, rolled back, flows suppressed via `SKIP_TRIGGER_FLOW`. Pass `dryRun=false` to commit. `shopware-media-upload` has no dry run.

**Read tools**

| Tool | Parameters (default) | ACL |
|---|---|---|
| `shopware-entity-schema` | `entity` | none |
| `shopware-entity-search` | `entity`, `criteria` (`{}`), `limit` (25), `page` (1), `term` | `{entity}:read` |
| `shopware-entity-aggregate` | `entity`, `aggregations`, `filters` (`[]`) | `{entity}:read` |
| `shopware-entity-read` | `entity`, `id`, `criteria` | `{entity}:read` |
| `shopware-system-config-read` | `key`, `salesChannelId` | `system_config:read` |

- Search criteria keys: `filter`, `sort`, `limit`, `page`, `associations`, `includes`, `fields`, `ids`, `term`, `query`, `post-filter`, `grouping`, `total-count-mode`. Without `includes`, output is trimmed to scalars plus requested associations. Paginate until `page * limit >= total`.
- Aggregate returns zero rows; types `avg`, `sum`, `min`, `max`, `count`, `terms`, `date-histogram`, `range`, `filter`, `entity`.

**Write tools**

| Tool | Parameters | ACL |
|---|---|---|
| `shopware-entity-upsert` | `entity`, `payload`, `dryRun` | `{entity}:create` (no `id`) / `{entity}:update` (with `id`) |
| `shopware-entity-delete` | `entity`, `ids`, `dryRun` | `{entity}:delete` |
| `shopware-system-config-write` | `key`, `value`, `salesChannelId`, `dryRun` | `system_config:update` |
| `shopware-order-state` | `orderNumber`/`orderId`, `orderAction`, `transactionAction`, `deliveryAction`, `dryRun` | `order:read` + per-action update privileges |
| `shopware-media-upload` | `url`, `fileName`, `mediaFolderId`, `productId` | `media:create` (+ `product:update`) |

Storefront bundle: `shopware-theme-config` — `salesChannelId`, `action` (`get`), `config` (`{}`), `dryRun`; ACL `theme:read`/`theme:update`.

**Dependencies** (auto-added to allowlists): entity read/search/aggregate/upsert → `shopware-entity-schema`; `shopware-entity-delete` → `shopware-entity-search`; `shopware-system-config-write` → `shopware-system-config-read`.

**Resources**: `shopware://entities`, `shopware://sales-channels`, `shopware://currencies`, `shopware://languages`, `shopware://state-machines`, `shopware://business-events`, `shopware://flow-actions`, `shopware://extensions`.

## Essential identifiers

- `McpToolResponse`, `SKIP_TRIGGER_FLOW`
- `shopware-entity-search`, `shopware-entity-aggregate`, `shopware-entity-upsert`, `shopware-order-state`, `shopware-theme-config`
- `shopware://tool-result/{id}`, `shopware-context`

## Gotchas

- `system_config` can hold SMTP credentials and payment keys; restrict `shopware-system-config-write`.
- Docs describe progressive discovery (`shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`, toolsets, `#[McpToolGroup]`, `_meta.listChanged`). None exists in installed 6.7.13.0; all allowed tools are listed directly.

## Version notes

- Discovery tools and toolsets belong to a release newer than 6.7.13.0 (the Store API page dates the change to 6.7.14.0).

## Code check (6.7.13.0)
- confirmed `McpToolResponse` — 100 KB inline limit (`MAX_RESPONSE_SIZE = 100_000`) — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:34
- confirmed `shopware://tool-result/` — oversized results offloaded to resource URI — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:88
- confirmed `SKIP_TRIGGER_FLOW` — added to context during dry run — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:169
- confirmed `EntitySearchTool::__invoke()` — criteria `{}`, limit 25, page 1, term — vendor/shopware/core/Framework/Mcp/Tool/EntitySearchTool.php:37
- confirmed `OrderStateTool::__invoke()` — orderNumber/orderId/actions, dryRun true — vendor/shopware/core/Framework/Mcp/Tool/OrderStateTool.php:45
- confirmed `MediaUploadTool::__invoke()` — url, fileName, mediaFolderId, productId, no dryRun — vendor/shopware/core/Framework/Mcp/Tool/MediaUploadTool.php:34
- confirmed `shopware-theme-config` — Storefront tool, dryRun true — vendor/shopware/storefront/Mcp/Tool/ThemeConfigTool.php:23
- confirmed `McpToolDependsOn` — entity-delete depends on shopware-entity-search — vendor/shopware/core/Framework/Mcp/Tool/EntityDeleteTool.php:17
- absent `shopware-tool-search` — discovery tools and toolsets (also shopware-toolsets-list, shopware-toolset-enable) not in installed code
- absent `McpToolGroup` — no tool group attribute in installed code
