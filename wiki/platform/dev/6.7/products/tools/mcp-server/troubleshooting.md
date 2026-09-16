---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/tools/mcp-server/troubleshooting.md
sourceHash: 855207b588015c5935732314048b8b25e0dc213f
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/troubleshooting.html
title: Troubleshooting
version: "6.7"
versions:
  - "6.7"
keywords: ["/api/_mcp", "sw-access-key", "sw-secret-access-key", "shopware.mcp.tool", "mcp.tool", "scan_dirs", "shopware.mcp.allowed_tools", "debug:mcp", "Missing privilege", "mcp allowlist", "mcp troubleshooting", "authentication failed", ".mcp.json"]
summary: "Shopware MCP server troubleshooting: auth failures, allowlist and ACL errors, /register fallback, Claude Code .mcp.json type, tool registration checks."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/store-api.md"]
---
## What it is

Symptom-to-fix reference for the Admin API MCP endpoint `/api/_mcp`: connection and authentication errors, allowlist/ACL denials, client configuration, missing tools, and the three security layers.

## When to use

An MCP client cannot connect, gets an authentication/allowlist/privilege error, or a registered tool does not show up.

## Key steps / config

**Quick fixes**
- `Authentication failed. Configure your MCP client...` — check `sw-access-key` / `sw-secret-access-key`.
- `Tool "X" is not enabled in your MCP allowlist.` (same for `Resource`/`Prompt`) — Settings → Integrations → Edit MCP Allowlist → enable it.
- `Missing privilege: {entity}:read` — assign an ACL role with the privilege, or use `--admin`.
- No tools at all — the global `shopware.mcp.allowed_tools` list removes unlisted tools.
- Tool missing — extension inactive or registration missing; check `bin/console debug:mcp`.
- `ECONNREFUSED` / "fetch failed" — start Shopware, verify host/port in the client config.
- Result is `shopware://tool-result/...` — response exceeded 100 KB; read it as a resource or narrow `limit`/fields.

**"Needs authentication" / `/register` fallback** — clients such as Cursor POST to `{server-origin}/register` after a failed connect; Shopware returns a structured error. Confirm `sw-access-key` starts with `SWIA`, the secret matches, and the URL ends with `/api/_mcp` (not `/api/_action/mcp/tools`).

**Claude Code** — `.mcp.json` needs `"type": "http"` (not `"streamable-http"`):

```json
{"mcpServers": {"shopware": {"type": "http", "url": "https://<shop-host>/api/_mcp",
  "headers": {"sw-access-key": "SWIA...", "sw-secret-access-key": "..."}}}}
```

**Tool missing from `debug:mcp`** (so also from the endpoint)
- Plugin tools: plugin active (`bin/console plugin:list`); service tagged `shopware.mcp.tool`; `#[McpTool]` on the class, not `__invoke()`; `bin/console cache:clear`.
- Core/in-tree bundle tools: tagged `mcp.tool` and directory listed in the MCP config `scan_dirs`.

**Security layers**: 1. authentication; 2. MCP allowlist per integration or user (`null` = all, `[]` = none; the integration `admin` flag does not bypass it, admin users do; integration plus `sw-app-user-id` uses the intersection; Administration-login tokens are unrestricted); 3. ACL. The Store API endpoint has no allowlist — see [Store API MCP](platform/dev/6.7/products/tools/mcp-server/store-api.md).

## Essential identifiers

- `/api/_mcp`, `sw-access-key`, `sw-secret-access-key`
- `shopware.mcp.tool`, `mcp.tool`, `scan_dirs`, `shopware.mcp.allowed_tools`
- `bin/console debug:mcp`

## Gotchas

- Test allowlists with integration credentials or a user access key, never an Administration token.
- Docs list discovery symptoms (three tools per fresh session, toolsets, `shopware-tool-search`, `shopware-toolsets-list`, `shopware-toolset-enable`). Installed 6.7.13.0 has no discovery tools or toolsets.
- The endpoint returns 404 unless the `MCP_SERVER` feature flag is active.

## Code check (6.7.13.0)
- corrected `Tool "%s" is not enabled in your MCP allowlist.` — docs: `Tool "X" is not in the allowlist...` — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:176
- confirmed `Authentication failed.` — error description for failed MCP auth — vendor/shopware/core/Framework/Mcp/Authentication/McpExceptionListener.php:66
- confirmed `/register` — POST OAuth fallback path handled — vendor/shopware/core/Framework/Mcp/Authentication/McpExceptionListener.php:44
- confirmed `Missing privilege: %s` — ACL denial message — vendor/shopware/core/Framework/Mcp/Tool/McpToolResponse.php:151
- confirmed `shopware.mcp.tool` — plugin tag registered via builder compiler pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpServerBuilderCompilerPass.php:43
- confirmed `scan_dirs` — MCP bundle package config — vendor/shopware/core/Framework/Resources/config/packages/mcp.php:36
- confirmed `shopware.mcp.allowed_tools` — removes tool services not listed — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:57
- confirmed `debug:mcp` — lists registered MCP capabilities — vendor/shopware/core/Framework/Mcp/Command/DebugMcpCommand.php:28
- absent `shopware-toolset-enable` — discovery tools and toolsets (also shopware-tool-search, shopware-toolsets-list) not in installed code
- unverified `Invalid value for pagination parameter "cursor"` — not in vendor/shopware; likely MCP SDK, out of scope
