---
id: platform/dev/6.7/products/tools/mcp-server/intro.md
title: MCP Server
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/intro.html
sourceHash: 5ba316d14d8d7afd9adf5596c6e340bc2fa7b97b
codeCheckedAgainst: "6.7.13.0"
keywords: ["mcp server", "model context protocol", "/api/_mcp", "/store-api/_mcp", "MCP_SERVER", "symfony/mcp-bundle", "mcp/sdk", "Resources/mcp.xml", "shopware-entity-search", "ai agent integration", "SwagMcpMerchantTools", "plugin or app"]
summary: "Overview of Shopware's MCP server (/api/_mcp, /store-api/_mcp): architecture, plugin vs app, spec coverage, known gaps; experimental until 6.8."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/getting-started.md", "platform/dev/6.7/products/tools/mcp-server/configuration.md", "platform/dev/6.7/products/tools/mcp-server/extending.md", "platform/dev/6.7/products/tools/mcp-server/mcp-concepts.md"]
---
## What it is

Shopware core ships a native Model Context Protocol (MCP) server that lets MCP clients (Claude Desktop, Cursor, Claude Code) call tools such as `shopware-entity-search` and receive structured results. Endpoints: `/api/_mcp` (Admin API, integration or OAuth credentials) and `/store-api/_mcp` (sales-channel facing, see [Store API MCP](platform/dev/6.7/products/tools/mcp-server/store-api.md)). The feature is experimental until Shopware 6.8; APIs and tool names may change.

## When to use

Orientation before connecting an AI client or deciding whether to extend the server with a plugin, bundle or app.

## Key steps / config

**Capabilities**

| Capability | Details |
|---|---|
| HTTP endpoints | `/api/_mcp`, `/store-api/_mcp` via Streamable HTTP |
| Authentication | Integration/OAuth credentials (Admin API); Store API headers |
| Authorization | Admin API ACL, or the Store API sales-channel context |
| Tool allowlist | Per integration and per user in the Admin UI; intersected when an app forwards `sw-app-user-id` |
| Rate limiting | Per principal |
| Extensibility | Custom tools, prompts, resources |

**Enabling (installed 6.7.13.0)**: the server sits behind feature flag `MCP_SERVER` (default `false`); set `MCP_SERVER=1`. See [Configuration](platform/dev/6.7/products/tools/mcp-server/configuration.md).

**Architecture**
- **Core**: HTTP endpoint, authentication bridge, ACL enforcement, rate limiting, capability listing, and low-level primitives `shopware-entity-*`, `shopware-system-config-*`.
- **Plugins / Symfony bundles**: in-process, full DAL and container access, register capabilities via Symfony service tags. Examples: SwagMcpMerchantTools and SwagMcpDevTools ([Shopware Extensions](platform/dev/6.7/products/tools/mcp-server/shopware-extensions.md)).
- **Apps**: declare capabilities in `Resources/mcp.xml`; Shopware calls the app endpoint with an HMAC-signed request.

Choose a plugin/bundle for direct DAL access, Marketplace distribution or lifecycle coupling; an app for remote logic (ERP, PIM, CRM), Cloud compatibility or independent deployment. Guides: [plugin](platform/dev/6.7/guides/plugins/plugins/mcp-server.md), [app](platform/dev/6.7/guides/plugins/apps/mcp-server.md), [comparison](platform/dev/6.7/products/tools/mcp-server/extending.md).

## Essential identifiers

- `/api/_mcp`, `/store-api/_mcp`
- `MCP_SERVER`
- `symfony/mcp-bundle`, `mcp/sdk`
- `Resources/mcp.xml`

## Gotchas

Known gaps: no resource subscriptions (templates supported); no completion utility for prompt/URI arguments; `structuredContent`/`isError` unused — Shopware returns its own `{"success": bool, ...}` envelope; no ACL checks on resources (public within the authenticated session). The protocol revision is negotiated by the SDK from the client's `initialize` request (reference: MCP spec 2025-11-25). Check the `symfony/mcp-bundle` repository before building workarounds for missing features.

## Version notes

- 6.7.11.0: introduced behind `MCP_SERVER`.
- 6.7.14.0 (per docs): flag removed, progressive tool discovery added — not in installed 6.7.13.0.
- Docs state `symfony/mcp-bundle` `~0.11.0` with `mcp/sdk ^0.7.0`; installed 6.7.13.0 core requires `~0.10.0` and `^0.6.0`.

## Code check (6.7.13.0)
- confirmed `/api/_mcp` — Admin API MCP route — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:76
- confirmed `/store-api/_mcp` — Store API MCP route — vendor/shopware/core/Framework/Mcp/Controller/StoreApiMcpServerController.php:63
- confirmed `MCP_SERVER` — feature flag, default false, experimental — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:89
- corrected `symfony/mcp-bundle` — docs: ~0.11.0; core requires ~0.10.0 — vendor/shopware/core/composer.json:135
- corrected `mcp/sdk` — docs: ^0.7.0; core requires ^0.6.0 — vendor/shopware/core/composer.json:92
- confirmed `mcp_admin_api` — per-scope MCP rate limiter key — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:38
- confirmed `mcp_store_api` — Store API MCP rate limiter key — vendor/shopware/core/Framework/RateLimiter/RateLimiter.php:40
- confirmed `mcp_allowlist` — per-integration allowlist field — vendor/shopware/core/System/Integration/IntegrationDefinition.php:69
- confirmed `shopware-entity-search` — core primitive tool — vendor/shopware/core/Framework/Mcp/Tool/EntitySearchTool.php:18
- unverified `listChanged` — notification emission not found in shopware core; may live in vendor/mcp SDK, out of scope
