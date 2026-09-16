---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/tools/mcp-server/store-api.md
sourceHash: 72c5de92561a913b4ec4b445ba52cb0ff3ec967e
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/store-api.html
title: Store API MCP
version: "6.7"
versions:
  - "6.7"
keywords: ["/store-api/_mcp", "shopware-store-api-context", "shopware.store_api_mcp.tool", "shopware.store_api_mcp.prompt", "shopware.store_api_mcp.resource", "StoreApiMcpContextProvider", "mcp_store_api", "sw-access-key", "sw-context-token", "ai-catalog.json", "store api mcp", "shopper agent", "sales channel mcp"]
summary: "Sales-channel MCP server at /store-api/_mcp: no ACL/allowlist, shopware-store-api-context tool, mcp_store_api rate limit, store_api_mcp service tags."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/tools-reference.md", "platform/dev/6.7/products/tools/mcp-server/configuration.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/agentic-files.md", "platform/dev/6.7/guides/plugins/plugins/mcp-server.md"]
---
## What it is

A sales-channel-facing MCP server at `/store-api/_mcp`, next to the Admin API server at `/api/_mcp`, running in a Store API sales-channel context for shopper-side agents. Experimental until 6.8.

## When to use

Connecting a shopper-side AI client, or registering Store API MCP tools/prompts/resources from a plugin.

## Key steps / config

**Endpoint**: `/store-api/_mcp` (route `store-api.mcp.endpoint`), `GET`/`POST`/`DELETE`/`OPTIONS`, Streamable HTTP, route scope `store-api`. Returns 404 if the `MCP_SERVER` feature flag is inactive or `symfony/mcp-bundle` is missing.

**Headers**: `sw-access-key` (required), `sw-context-token` (optional; otherwise an anonymous context), `Mcp-Session-Id` (optional, from `initialize`). No customer login needed.

**Authorization**: no Admin API ACL, no MCP allowlist — any client authenticated against the sales channel reaches every Store API tool. Tools must validate input and scope data access themselves.

**Core tool** `shopware-store-api-context` — no parameters:

```json
{"success": true, "data": {"salesChannelId": "...", "token": "...", "languageId": "...",
  "currencyId": "...", "customerAuthenticated": false, "customerId": null}}
```

**Rate limit**: `mcp_store_api` — 120 requests / 60 seconds and 600 / 10 minutes, keyed on sales channel + context token.

**Advertising**: `/.well-known/ai-catalog.json` gets an entry (`"identifier": "urn:air:<host>:server:store-api-mcp"`, `"type": "application/mcp-server-card+json"`, `"url"`, `"capabilities": ["shopware-store-api-context"]`) only when the agentic file family is enabled, a domain base URL resolves, and the channel is of type API. The endpoint itself has no toggle. See [Agentic files](platform/dev/6.7/guides/plugins/plugins/storefront/templates/agentic-files.md).

**Extending**: tag services `shopware.store_api_mcp.tool`, `shopware.store_api_mcp.prompt`, `shopware.store_api_mcp.resource`; get the context from `StoreApiMcpContextProvider::getSalesChannelContext()` (no `requirePrivilege()` equivalent). Same tool name in both scopes needs two classes carrying `#[McpTool]`. See [MCP server guide](platform/dev/6.7/guides/plugins/plugins/mcp-server.md).

## Essential identifiers

- `/store-api/_mcp`, `store-api.mcp.endpoint`
- `shopware-store-api-context`
- `shopware.store_api_mcp.tool` / `.prompt` / `.resource`
- `StoreApiMcpContextProvider`, `mcp_store_api`

## Gotchas

- `bin/console debug:mcp` covers the Admin API server only (per docs).
- Docs describe progressive discovery (`shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`, a `store-api` toolset, `#[McpToolGroup]`, `mcp_toolset_session` table). None exists in installed 6.7.13.0.

## Version notes

- Introduced in 6.7.11.0. Docs say that since 6.7.14.0 a bare `tools/list` hides tools behind toolsets — newer than the installed 6.7.13.0.

## Code check (6.7.13.0)
- confirmed `/store-api/_mcp` — route `store-api.mcp.endpoint`, GET/POST/DELETE/OPTIONS — vendor/shopware/core/Framework/Mcp/Controller/StoreApiMcpServerController.php:63
- confirmed `MCP_SERVER` — endpoint returns 404 unless the flag is active — vendor/shopware/core/Framework/Mcp/Controller/StoreApiMcpServerController.php:70
- confirmed `shopware-store-api-context` — core Store API tool returning context fields — vendor/shopware/core/System/SalesChannel/Mcp/Tool/StoreApiContextTool.php:15
- confirmed `shopware.store_api_mcp.tool` — tag collected by builder compiler pass (also .prompt/.resource) — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/StoreApiMcpServerBuilderCompilerPass.php:44
- confirmed `StoreApiMcpContextProvider::getSalesChannelContext()` — returns nullable SalesChannelContext — vendor/shopware/core/Framework/Mcp/Context/StoreApiMcpContextProvider.php:24
- confirmed `mcp_store_api` — 120/60 seconds and 600/10 minutes, time_backoff — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:366
- confirmed `store-api-mcp` — ai-catalog entry identifier; added only for API-type channels — vendor/shopware/core/Framework/Resources/views/files/agentic/.well-known/ai-catalog.json.twig:15
- absent `shopware-tool-search` — discovery tools (also shopware-toolsets-list, shopware-toolset-enable) not in installed code
- absent `McpToolGroup` — no tool group attribute in installed code
- absent `mcp_toolset_session` — no toolset session table in installed code
