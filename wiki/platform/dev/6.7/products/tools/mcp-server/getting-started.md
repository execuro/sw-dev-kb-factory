---
id: platform/dev/6.7/products/tools/mcp-server/getting-started.md
title: Getting Started
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/getting-started.html
sourceHash: 366588fcb119e744782843e4636220da8cd7eb4f
codeCheckedAgainst: "6.7.15.1"
keywords: ["integration:create", "sw-access-key", "sw-secret-access-key", "/api/_mcp", "streamable-http", "debug:mcp", "shopware-tool-search", "shopware-toolsets-list", "shopware-toolset-enable", "toolsets", "Mcp-Session-Id", "mcp allowlist", "claude desktop cursor codex"]
summary: Connect an AI client (Claude Desktop, Cursor, Claude Code, Codex) to Shopware's /api/_mcp endpoint with integration credentials and discover toolsets.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/configuration.md", "platform/dev/6.7/products/tools/mcp-server/store-api.md", "platform/dev/6.7/products/tools/mcp-server/tools-reference.md", "platform/dev/6.7/products/tools/mcp-server/examples.md"]
---
## What it is

Setup guide for connecting an MCP client to the Shopware Admin API MCP endpoint `/api/_mcp`: create integration credentials, configure the client, verify, and use on-demand tool discovery.

## When to use

First-time connection of Claude Desktop, Cursor, Claude Code or Codex to a shop, or when expected tools are not visible in a client.

## Key steps / config

Prerequisites: Shopware 6.7.14.0+, `symfony/mcp-bundle` installed (`composer show symfony/mcp-bundle`). Connect-time toolset selection needs 6.7.15.0+.

1. **Create an integration:** `bin/console integration:create "My MCP Client" --admin` prints `SHOPWARE_ACCESS_KEY_ID=SWIA...` and `SHOPWARE_SECRET_ACCESS_KEY=...`. For production omit `--admin` and assign a dedicated ACL role.
2. **Configure the client.** Claude Desktop (`claude_desktop_config.json`) and Cursor (`.cursor/mcp.json` or `~/.cursor/mcp.json`) use `"type": "streamable-http"`; Claude Code (`.mcp.json`) only accepts `"type": "http"`:

```json
{"mcpServers": {"shopware": {
    "type": "streamable-http",
    "url": "https://your-shop.example.com/api/_mcp",
    "headers": {"sw-access-key": "SWIA...", "sw-secret-access-key": "..."}
}}}
```

   Claude Code CLI: `claude mcp add --transport http shopware <shop-url>/api/_mcp --header "sw-access-key: SWIA..." --header "sw-secret-access-key: ..."`. Codex: in `~/.codex/config.toml` add `[mcp_servers.shopware]` with `url`, `env_http_headers = { "sw-access-key" = "SHOPWARE_MCP_ACCESS_KEY", "sw-secret-access-key" = "SHOPWARE_MCP_SECRET_KEY" }` (env var names; export the values) and `enabled = true`. `codex mcp add --url` cannot set custom headers.
3. **Verify:** `bin/console debug:mcp` lists tools of both MCP servers; `bin/console debug:mcp --native` lists prompts and resources. The first connection may take a few seconds.

**Discovery.** A fresh session advertises only `shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`. Search, find the toolset, enable it, then refresh `tools/list` (automatic for clients honouring `notifications/tools/list_changed`). Enabled toolsets are per session, tracked by the `Mcp-Session-Id` header; `/store-api/_mcp` works the same.

**Connect-time selection (6.7.15.0+)** for clients that read `tools/list` once (e.g. claude.ai): append `?toolsets=order,media` or `?toolsets=all`. Unknown names are ignored, nothing is stored, and the allowlist and ACL still decide what may be called. `tools/list` pages at 50 entries; a client ignoring `nextCursor` sees only page one.

**Authentication:** headers `sw-access-key`/`sw-secret-access-key` (no expiry, recommended) or Admin API OAuth tokens from `/api/oauth/token` (default lifetime 10 minutes; per-user allowlist applies).

**Allowlists:** per integration via Settings → Integrations → Edit MCP Allowlist; per user via Settings → Users & Permissions → MCP tool allowlist (admin users bypass it). Enabling a tool auto-includes its dependencies (e.g. `shopware-entity-delete` adds `shopware-entity-search` and `shopware-entity-schema`).

## Essential identifiers

- `/api/_mcp`, `/store-api/_mcp`, query parameter `toolsets`
- `bin/console integration:create --admin`, `bin/console debug:mcp [--native]`
- Headers `sw-access-key`, `sw-secret-access-key`, `Mcp-Session-Id`
- `shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`

## Gotchas

- Never commit `.mcp.json`, `.cursor/mcp.json` or other credential files.
- Missing/invalid/expired tokens return HTTP 401 with JSON-RPC code `-32001` and a reason such as `Access token is expired`.

## Version notes

6.7.11.0–6.7.13.x: set `MCP_SERVER=1` in `.env`; no discovery tools. `?toolsets` arrived in 6.7.15.0. Before 6.7.15.0, `/api/_mcp` answered auth failures with HTTP 500 and `-32000`.

## Code check (6.7.15.1)
- confirmed `integration:create` — `--admin` option, prints `SHOPWARE_ACCESS_KEY_ID`/`SHOPWARE_SECRET_ACCESS_KEY` — vendor/shopware/core/Framework/Api/Command/CreateIntegrationCommand.php:19
- confirmed `/api/_mcp` — Admin API MCP route — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:79
- confirmed `/store-api/_mcp` — Store API MCP route — vendor/shopware/core/Framework/Mcp/Controller/StoreApiMcpServerController.php:57
- confirmed `debug:mcp` — lists MCP capabilities; also has a `native` option — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:33
- confirmed `shopware-tool-search` — discovery tool name constant — vendor/shopware/core/Framework/Mcp/Tool/AbstractToolSearchTool.php:21
- confirmed `shopware-toolsets-list` — `LIST_TOOLSETS_TOOL` constant — vendor/shopware/core/Framework/Mcp/McpToolsetRegistry.php:14
- confirmed `toolsets` — `QUERY_PARAMETER`, comma-separated, non-string values ignored — vendor/shopware/core/Framework/Mcp/McpRequestedToolsetResolver.php:19
- confirmed `ALL_TOOLSETS` — value `all` — vendor/shopware/core/Framework/Mcp/McpToolsetRegistry.php:29
- confirmed `shopware.mcp.pagination_limit` — set to 50 — vendor/shopware/core/Framework/DependencyInjection/mcp.php:103
- confirmed `CODE_UNAUTHORIZED` — JSON-RPC code -32001 — vendor/shopware/core/Framework/Mcp/Authentication/McpExceptionListener.php:29
