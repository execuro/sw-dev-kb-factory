---
id: platform/dev/6.7/products/tools/mcp-server/store-api.md
title: Store API MCP
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/store-api.html
sourceHash: 1e14cce1426dbde1370a94fc47aed99c2f21e230
codeCheckedAgainst: "6.7.15.1"
keywords: ["/store-api/_mcp", "store api mcp", "shopper agent", "shopware-store-api-context", "shopware.store_api_mcp.tool", "StoreApiMcpContextProvider", "McpToolGroup", "mcp_store_api", "mcp_toolset_session", "sw-access-key", "sw-context-token", "Mcp-Session-Id", "debug:mcp", "progressive discovery"]
summary: "Sales-channel MCP server at /store-api/_mcp (6.7.11+): sw-access-key auth, no ACL or allowlist, store-api toolset, own rate limit and service tags."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/products/tools/mcp-server/getting-started.md
  - platform/dev/6.7/products/tools/mcp-server/configuration.md
  - platform/dev/6.7/products/tools/mcp-server/tools-reference.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/templates/agentic-files.md
---
## What it is

A second, sales-channel-facing MCP server at `/store-api/_mcp`, next to the Admin API server at `/api/_mcp`. It runs in a Store API sales-channel context instead of an Admin API session, so shopper-side agents see the same data a storefront would.

## When to use

When an AI client should browse a shop as a shopper (anonymous or logged in), or when a plugin registers its own Store API MCP tools, prompts, or resources.

## Key steps / config

**Endpoint**: path `/store-api/_mcp`, methods `GET`, `POST`, `DELETE`, `OPTIONS`, Streamable HTTP transport, route scope `store-api`. `POST` carries JSON-RPC messages, `GET` opens a stream for server-initiated messages such as `notifications/tools/list_changed`, `DELETE` ends the session. Without `symfony/mcp-bundle` the endpoint answers HTTP 404.

**Headers**:

| Header | Required | Purpose |
|---|---|---|
| `sw-access-key` | yes | Sales channel access key |
| `sw-context-token` | no | Continue a context; otherwise an anonymous one is created |
| `Mcp-Session-Id` | no | From `initialize`; needed for toolsets |

No customer login is required. There is **no Admin API ACL** and **no MCP allowlist**: every tool registered for the Store API scope is reachable by any client that authenticates against the sales channel, so each tool must validate its own input and scope its own data access.

**Discovery**: a fresh session advertises only `shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`. Everything else, including `shopware-store-api-context`, sits behind the `store-api` toolset. Select toolsets at connect time with `/store-api/_mcp?toolsets=store-api`.

**Core tool `shopware-store-api-context`** (no parameters) returns:

```json
{"success": true, "data": {"salesChannelId": "...", "token": "...", "languageId": "...",
  "currencyId": "...", "customerAuthenticated": false, "customerId": null}}
```

Without a resolvable context it returns `No Store API sales-channel context is available for this MCP request.` Core registers no prompts or resources for this scope.

**Sessions and rate limiting**: own session store (an `Mcp-Session-Id` from `/api/_mcp` is not valid here); enabled toolsets live in the shared `mcp_toolset_session` table with its daily cleanup task. Rate-limit bucket `mcp_store_api`: 120 requests/60 s and 600/10 min, keyed on sales channel plus context token, plus a per-client-IP limit.

**Advertising**: API (headless) sales channels with the `agentic` file family enabled and a resolvable domain base URL get an entry in `/.well-known/ai-catalog.json` (`identifier`, `displayName`, `type: application/mcp-server-card+json`, `url`, `tags`, `capabilities`). The endpoint itself has no toggle.

**Extending**: tag services with `shopware.store_api_mcp.tool`, `shopware.store_api_mcp.prompt`, or `shopware.store_api_mcp.resource`. Get the context from `StoreApiMcpContextProvider` (no `requirePrivilege()` equivalent). Assign a group with `#[McpToolGroup]`. Inspect with `bin/console debug:mcp --scope=store-api`; `bin/console debug:mcp --native` shows prompts and resources. See [Agentic files](platform/dev/6.7/guides/plugins/plugins/storefront/templates/agentic-files.md) and [Extending via plugin](platform/dev/6.7/guides/plugins/plugins/mcp-server.md).

## Essential identifiers

- `/store-api/_mcp`, `?toolsets=store-api`
- `shopware-store-api-context`, toolset `store-api`
- `shopware.store_api_mcp.tool`, `shopware.store_api_mcp.prompt`, `shopware.store_api_mcp.resource`
- `StoreApiMcpContextProvider`, `#[McpToolGroup]`, `#[McpTool]`
- `mcp_store_api`, `mcp_toolset_session`
- `bin/console debug:mcp --scope=store-api`, `bin/console debug:mcp --native`

## Gotchas

- Since 6.7.14.0 a bare `tools/list` no longer returns the full catalogue; clients must follow discovery or enable `store-api`.
- Toolset names are not namespaced per endpoint.
- The same tool name on both scopes needs two classes, because the MCP SDK binds a tool to the class carrying `#[McpTool]`.

## Version notes

Introduced in 6.7.11.0, experimental until 6.8. Discovery-only default since 6.7.14.0; `?toolsets=` connection parameter and separate session store since 6.7.15.0.

## Code check (6.7.15.1)
- confirmed `/store-api/_mcp` — route with GET/POST/DELETE/OPTIONS — vendor/shopware/core/Framework/Mcp/Controller/StoreApiMcpServerController.php:57
- confirmed `StoreApiMcpServerController::handle()` — returns 404 when server/transport absent — vendor/shopware/core/Framework/Mcp/Controller/StoreApiMcpServerController.php:65
- confirmed `shopware-store-api-context` — tool name, group `store-api` — vendor/shopware/core/System/SalesChannel/Mcp/Tool/StoreApiContextTool.php:18
- confirmed `StoreApiMcpContextProvider` — context source for Store API tools — vendor/shopware/core/Framework/Mcp/Context/StoreApiMcpContextProvider.php:17
- confirmed `shopware.store_api_mcp.tool` — tag mapped to `mcp.tool` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:59
- confirmed `shopware.store_api_mcp.resource` — tag mapped to `mcp.resource` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:61
- confirmed `mcp_store_api` — 120/60 s and 600/10 min limits — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:396
- confirmed `mcp_toolset_session.cleanup` — daily scheduled task — vendor/shopware/core/Framework/Mcp/ScheduledTask/McpToolsetSessionCleanupTask.php:16
- confirmed `McpRequestedToolsetResolver::QUERY_PARAMETER` — value `toolsets` — vendor/shopware/core/Framework/Mcp/McpRequestedToolsetResolver.php:19
- confirmed `debug:mcp` — command with `scope` and `native` options — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:66
