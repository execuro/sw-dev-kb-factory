---
id: platform/dev/6.7/products/tools/mcp-server/troubleshooting.md
title: Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/troubleshooting.html
sourceHash: a0c9c1b56df7c1015614790ba73a6656b2b4ffd1
codeCheckedAgainst: "6.7.15.1"
keywords: ["mcp troubleshooting", "/api/_mcp", "mcp allowlist", "-32001", "Mcp-Session-Id", "shopware.mcp.allowed_tools", "shopware.mcp.tool", "debug:mcp", "McpTool", "sw-access-key", "sw-secret-access-key", "toolsets", "/register", "ECONNREFUSED"]
summary: "Fixes for Shopware MCP errors: auth/401 -32001, allowlist and ACL denials, missing tools or toolsets, session issues, debug:mcp checks, client config."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/products/tools/mcp-server/store-api.md
---
## What it is

A symptom-to-fix guide for Shopware's MCP server: connection and authentication failures, allowlist/ACL denials, progressive-discovery surprises, sessions, client config, tool registration, and the three security layers.

## When to use

When a client cannot connect to `/api/_mcp`, a tool is missing or blocked, toolsets do not appear, or a tool returns a `shopware://tool-result/...` URI instead of data.

## Key steps / config

| Symptom | Fix |
|---|---|
| `Authentication failed. Configure your MCP client...` | Check `sw-access-key` / `sw-secret-access-key` |
| `Tool "X" is not enabled in your MCP allowlist.` (or `Resource`/`Prompt`) | Settings → Integrations → Edit MCP Allowlist |
| `Missing privilege: {entity}:read` | Grant the ACL privilege, or use `--admin` |
| Only three tools in a fresh session | Expected; use `shopware-tool-search` / `shopware-toolset-enable` |
| Enabled toolset not visible | Refresh `tools/list`, or connect with `?toolsets=<name>` (needed for claude.ai, 6.7.15.0+) |
| No tools at all | Add the three discovery tools to `shopware.mcp.allowed_tools` |
| `Cannot enable an MCP toolset without an active MCP session.` | Complete `initialize`, send `Mcp-Session-Id` every request |
| `Invalid value for pagination parameter "cursor"` | Restart listing without `cursor` |
| Toolsets forgotten between requests | Redis session store on multi-server setups |
| Session rejected after updating to 6.7.15.0 | Send `initialize` again |
| Tool missing entirely | `bin/console debug:mcp`; prompts/resources: `--native` |
| Result is `shopware://tool-result/...` | Over 100 KB: read it as a resource or narrow `limit`/fields |
| `ECONNREFUSED` / "fetch failed" | Start Shopware, verify host/port |

**"Needs authentication" / `/register`**: clients like Cursor POST to `{server-origin}/register` after a failed connect and get a structured error. Check that `sw-access-key` starts with `SWIA`, the secret matches, and the URL ends with `/api/_mcp` (not `/api/_action/mcp/tools`).

**Claude Code `.mcp.json`** needs `"type": "http"`, not `"streamable-http"`:

```json
{"mcpServers": {"shopware": {"type": "http", "url": "https://localhost:8000/api/_mcp",
  "headers": {"sw-access-key": "SWIA...", "sw-secret-access-key": "..."}}}}
```

**Tool missing from `debug:mcp`** (also missing live): plugin active (`bin/console plugin:list`), service tagged `shopware.mcp.tool` in `services.php`, `#[McpTool]` on the class (not `__invoke()`), then `bin/console cache:clear`. Core/bundle tools: correct DI tag (`shopware.mcp.tool`, or `shopware.store_api_mcp.tool`); read the `debug:mcp` footer warning about capabilities no server exposes.

**Security layers** (all must pass):

1. Authentication — `sw-access-key` + `sw-secret-access-key`.
2. MCP allowlist — per integration and per user (Settings → Users & Permissions → [user] → MCP tool allowlist). `null` = all, `[]` = none. The integration `admin` flag does not bypass it; admin users (`admin = true`) do. With `sw-app-user-id` (e.g. Copilot) the intersection of integration and user lists applies.
3. ACL — entity-level privileges of the integration role.

The Store API endpoint has no allowlist — see [Store API MCP](platform/dev/6.7/products/tools/mcp-server/store-api.md).

## Gotchas

- Do not test allowlists with an admin user's Administration token (`client_id = administration`); it bypasses the allowlist.

## Version notes

- 6.7.15.0+: missing/invalid/expired bearer tokens on `/api/_mcp` return HTTP 401 with `-32001` (e.g. `Access token is expired`); earlier HTTP 500 with `-32000`.
- 6.7.15.0+: capabilities register from their tag; `scan_dirs` in `config/packages/mcp.php` (needed up to 6.7.14.x) is gone; `debug:mcp` lists tools only.

## Code check (6.7.15.1)
- confirmed `McpExceptionListener::CODE_UNAUTHORIZED` — value -32001 — vendor/shopware/core/Framework/Mcp/Authentication/McpExceptionListener.php:29
- confirmed `/register` — POST fallback path handled by the exception listener — vendor/shopware/core/Framework/Mcp/Authentication/McpExceptionListener.php:45
- confirmed `/api/_mcp` — Admin API MCP route — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:79
- confirmed `is not enabled in your MCP allowlist` — tool denial message — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:186
- confirmed `Missing privilege` — canonical ACL error prefix — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:166
- confirmed `Cannot enable an MCP toolset without an active MCP session.` — toolset-enable error — vendor/shopware/core/Framework/Mcp/Tool/ToolsetEnableTool.php:41
- confirmed `shopware.mcp.tool` — plugin tag re-tagged to `mcp.tool` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:56
- confirmed `shopware.store_api_mcp.tool` — Store API tag — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:59
- confirmed `shopware.mcp.allowed_tools` — global compile-time tool allowlist — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:314
- confirmed `debug:mcp` — console command lists MCP capabilities — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:33
