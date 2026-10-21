---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/tools/mcp-server/tools-reference.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/mcp-server.md
  - platform/dev/6.7/products/tools/mcp-server/getting-started.md
  - platform/dev/6.7/products/tools/mcp-server/store-api.md
sourceHash: fd7085cdf65743639c08dbebf18147ba5eb3d02c
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/tools-reference.html
title: Tools Reference
version: "6.7"
versions:
  - "6.7"
keywords: ["mcp server", "McpToolResponse", "shopware-tool-search", "shopware-toolsets-list", "shopware-toolset-enable", "shopware-entity-search", "shopware-entity-upsert", "shopware-order-state", "shopware-theme-config", "shopware-context", "toolsets", "dryRun", "shopware://state-machines", "mcp resources", "ai agent tools"]
summary: "Built-in Shopware MCP server tools, toolsets, resources and the shopware-context prompt: parameters, ACL, dry-run, and response envelope"
lastBuilt: 2026-10-21
---
## What it is

Reference for what Shopware's Admin API MCP server ships: discovery tools, core toolsets and tools (parameters, ACL), the JSON response envelope, large-result handling, dry-run, resources, and the `shopware-context` prompt.

## When to use

When an AI client calls the Shopware MCP endpoint and needs exact tool names, parameters, privileges, or pagination/dry-run behavior.

## Key steps / config

**Envelope.** Core tools extend `McpToolResponse`:

```json
{"success": true, "data": [], "_meta": {"total": 42, "page": 1, "limit": 25}}
{"success": false, "error": "Human-readable message"}
```

`_meta` is optional. Responses over 100 KB are returned as a `shopware://tool-result/{id}` URI in `_meta.resourceUri`, removed when the session ends.

**Discovery** (only tools on a fresh session):

- `shopware-tool-search` — `query`, `maxResults` (default 3, capped at 20). Results: `tool`, `score`, `matchedIn`.
- `shopware-toolsets-list` — no parameters; entries `name`, `title`, `description`, `tools`, `enabled` (`false` without `Mcp-Session-Id`).
- `shopware-toolset-enable` — `toolset`; one per call, no disable, needs a session; emits `notifications/tools/list_changed`; grants no permission. Static alternative: `/api/_mcp?toolsets=entity,order` ([getting started](platform/dev/6.7/products/tools/mcp-server/getting-started.md)).

**Toolsets:** `entity` (`shopware-entity-schema`, `-search`, `-read`, `-aggregate`, `-upsert`, `-delete`), `system-config` (`shopware-system-config-read`, `-write`), `media` (`shopware-media-upload`), `order` (`shopware-order-state`), `theme` (`shopware-theme-config`, Storefront), `store-api` ([Store API endpoint](platform/dev/6.7/products/tools/mcp-server/store-api.md) only). `#[McpToolGroup('swag-my-plugin')]` yields title "Swag my plugin tools".

**Tools (parameters; ACL):**

- `shopware-entity-schema` — `entity`; none.
- `shopware-entity-search` — `entity`, `criteria` (JSON string), `limit` (25), `page` (1), `term`; `{entity}:read`. Paginate until `page * limit >= total`; no aggregations.
- `shopware-entity-aggregate` — `entity`, `aggregations` (JSON array), `filters`; `{entity}:read`. Types `avg`, `sum`, `min`, `max`, `count`, `terms`, `date-histogram`, `range`, `filter`, `entity`.
- `shopware-entity-read` — `entity`, `id`, `criteria`; `{entity}:read`.
- `shopware-system-config-read` — `key` (or prefix like `core.listing`), `salesChannelId`; `system_config:read`.
- `shopware-entity-upsert` — `entity`, `payload` (no `id` creates), `dryRun`; `{entity}:create`/`{entity}:update`.
- `shopware-entity-delete` — `entity`, `ids`, `dryRun`; `{entity}:delete`.
- `shopware-system-config-write` — `key`, `value`, `salesChannelId`, `dryRun`; `system_config:update`.
- `shopware-order-state` — `orderNumber` or `orderId`, `orderAction`/`transactionAction`/`deliveryAction`, `dryRun`; `order:read` plus per-action update privileges.
- `shopware-media-upload` — `url`, `fileName`, `mediaFolderId`, `productId`; `media:create` (+ `product:update`).
- `shopware-theme-config` — `salesChannelId`, `action` (`get`/`update`), `config`, `dryRun`; `theme:read`/`theme:update`.

**Dry-run.** Write tools default to `dryRun=true`: run in a rolled-back transaction with `SKIP_TRIGGER_FLOW`. Pass `dryRun=false` to commit.

**Resources:** `shopware://entities`, `shopware://sales-channels`, `shopware://currencies`, `shopware://languages`, `shopware://state-machines`, `shopware://business-events`, `shopware://flow-actions`, `shopware://extensions`. **Prompt:** `shopware-context` (data model, criteria format, recipes, best practices).

## Essential identifiers

- `McpToolResponse`, `McpToolGroup`, `SKIP_TRIGGER_FLOW`, `Mcp-Session-Id`
- `shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`
- `shopware-context`, `shopware://tool-result/{id}`

## Gotchas

- The `discovery` group is always advertised and never listed by `shopware-toolsets-list`.
- `shopware-media-upload` has no dry-run.
- `shopware-system-config-write` can expose SMTP and payment credentials; restrict it.
- Allowlisting a tool auto-includes its dependencies (entity tools need `shopware-entity-schema`; delete needs `shopware-entity-search`; config write needs config read).
- Plugins can add discovery tools: [plugin guide](platform/dev/6.7/guides/plugins/plugins/mcp-server.md).

## Code check (6.7.15.1)
- confirmed `McpToolResponse` — abstract base class providing the success/error envelope — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:32
- confirmed `McpToolResponse::MAX_RESPONSE_SIZE` — 100_000 bytes inline limit — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:34
- confirmed `shopware://tool-result/` — oversized result stored and referenced via resourceUri — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:88
- confirmed `McpToolResponse::executeWithDryRun()` — adds SKIP_TRIGGER_FLOW, always rolls back — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:178
- confirmed `AbstractToolSearchTool::NAME` — value shopware-tool-search — vendor/shopware/core/Framework/Mcp/Tool/AbstractToolSearchTool.php:21
- confirmed `AbstractToolSearchTool::__invoke()` — maxResults default 3, capped at 20 — vendor/shopware/core/Framework/Mcp/Tool/AbstractToolSearchTool.php:30
- confirmed `McpToolsetRegistry::ENABLE_TOOLSET_TOOL` — value shopware-toolset-enable — vendor/shopware/core/Framework/Mcp/McpToolsetRegistry.php:16
- confirmed `shopware-entity-delete` — group entity, depends on shopware-entity-search — vendor/shopware/core/Framework/Mcp/Tool/EntityDeleteTool.php:19
- confirmed `shopware-theme-config` — registered by the Storefront bundle — vendor/shopware/storefront/Mcp/Tool/ThemeConfigTool.php:26
- confirmed `shopware-context` — MCP prompt name — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:18
