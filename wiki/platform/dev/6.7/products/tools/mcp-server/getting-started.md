---
id: platform/dev/6.7/products/tools/mcp-server/getting-started.md
title: Getting Started
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/getting-started.html
sourceHash: c1e33a0ac4158eac74c47b739d0ea1be64347719
codeCheckedAgainst: "6.7.13.0"
keywords: ["/api/_mcp", "integration:create", "debug:mcp", "sw-access-key", "sw-secret-access-key", "MCP_SERVER", "streamable-http", ".mcp.json", "mcp allowlist", "claude desktop cursor codex", "connect ai client", "symfony/mcp-bundle"]
summary: "Connect Claude Desktop, Cursor, Claude Code or Codex to Shopware's /api/_mcp endpoint with integration credentials; allowlists and debug:mcp verification."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/configuration.md", "platform/dev/6.7/products/tools/mcp-server/tools-reference.md", "platform/dev/6.7/products/tools/mcp-server/troubleshooting.md", "platform/dev/6.7/products/tools/mcp-server/examples.md"]
---
## What it is

Setup walkthrough for connecting an AI client to a Shopware shop through the built-in MCP server: create integration credentials, configure the client, verify, and restrict capabilities.

## When to use

When wiring Claude Desktop, Cursor, Claude Code or Codex to a shop's Admin API MCP endpoint for the first time.

## Key steps / config

**Prerequisites (installed 6.7.13.0)**: set `MCP_SERVER=1` in `.env` — without it the endpoint returns 404. `symfony/mcp-bundle` must be installed (`composer show symfony/mcp-bundle`, else `composer install`). See [Configuration](platform/dev/6.7/products/tools/mcp-server/configuration.md).

1. **Create an integration**: `bin/console integration:create "My MCP Client" --admin` prints `SHOPWARE_ACCESS_KEY_ID=SWIA...` and `SHOPWARE_SECRET_ACCESS_KEY=...`. `--admin` grants full Admin API access; in production omit it and assign a dedicated ACL role.
2. **Configure the client** — Claude Desktop (`claude_desktop_config.json`) and Cursor (`.cursor/mcp.json`, `~/.cursor/mcp.json`) use `"type": "streamable-http"`; Claude Code (`.mcp.json`) only accepts `"type": "http"`:

```json
{"mcpServers": {"shopware": {
    "type": "streamable-http",
    "url": "<shop-url>/api/_mcp",
    "headers": {"sw-access-key": "SWIA...", "sw-secret-access-key": "..."}
}}}
```

   Claude Code CLI: `claude mcp add --transport http shopware <shop-url>/api/_mcp --header "sw-access-key: SWIA..." --header "sw-secret-access-key: ..."`.
   Codex: `~/.codex/config.toml` or `.codex/config.toml`, table `[mcp_servers.shopware]` with `url`, `env_http_headers = { "sw-access-key" = "SHOPWARE_MCP_ACCESS_KEY", "sw-secret-access-key" = "SHOPWARE_MCP_SECRET_KEY" }` (env var names) and `enabled = true`; no `type`.
3. **Verify**: restart the client (first call may be slow while caches warm), then run `bin/console debug:mcp` to list registered tools, prompts and resources.

**Authentication**: integration headers (no expiry, recommended) or Admin API OAuth tokens from `/api/oauth/token` (default expiry 10 minutes; the user's allowlist applies).

**Restricting capabilities**: admin integrations may call everything by default. Per integration: **Settings → Integrations → Edit MCP Allowlist**. Per user: **Settings → Users & Permissions → user → MCP tool allowlist** (admin users bypass it). Enabling a tool auto-includes its dependencies, e.g. `shopware-entity-delete` pulls in `shopware-entity-search` and `shopware-entity-schema`. Global switch: `allowed_tools`.

## Essential identifiers

- `/api/_mcp`, `/store-api/_mcp`, `MCP_SERVER`
- `bin/console integration:create`, `bin/console debug:mcp`
- Headers `sw-access-key`, `sw-secret-access-key`

## Gotchas

- Never commit `.mcp.json`, `.cursor/mcp.json` or other credential files.
- `codex mcp add --url` cannot set custom headers — edit `config.toml` instead.

## Version notes

- Source targets 6.7.14.0+: flag removed; a session starts with only discovery tools `shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`; enabled toolsets are tracked per `Mcp-Session-Id` and clients refresh `tools/list` (automatic with `notifications/tools/list_changed`). None of these exist in installed 6.7.13.0 — allowed tools are advertised directly.
- 6.7.11.0–6.7.13.x: set `MCP_SERVER=1` and skip discovery.

## Code check (6.7.13.0)
- confirmed `MCP_SERVER` — endpoint returns 404 unless flag active — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:83
- confirmed `/api/_mcp` — route `api.mcp.endpoint` — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:76
- confirmed `integration:create` — command with `--admin` option — vendor/shopware/core/Framework/Api/Command/CreateIntegrationCommand.php:18
- confirmed `debug:mcp` — lists registered MCP capabilities — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:28
- confirmed `sw-secret-access-key` — header validated by MCP auth listener — vendor/shopware/core/Framework/Mcp/Authentication/McpAuthenticationListener.php:35
- confirmed `symfony/mcp-bundle` — core requires ~0.10.0 — vendor/shopware/core/composer.json:135
- confirmed `shopware-entity-delete` — depends on shopware-entity-search via McpToolDependsOn — vendor/shopware/core/Framework/Mcp/Tool/EntityDeleteTool.php:17
- confirmed `allowed_tools` — shopware.mcp config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1621
- absent `shopware-tool-search` — discovery tool not in installed code; 6.7.14.0+ per docs
- absent `shopware-toolset-enable` — toolsets not in installed code; `shopware-toolsets-list` likewise absent
