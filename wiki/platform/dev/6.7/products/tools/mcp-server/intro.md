---
id: platform/dev/6.7/products/tools/mcp-server/intro.md
title: MCP Server
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/intro.html
sourceHash: 3ebd9a1085666dca2fd2b2771b8db327d21435ed
codeCheckedAgainst: "6.7.15.1"
keywords: ["model context protocol", "mcp server", "/api/_mcp", "/store-api/_mcp", "symfony/mcp-bundle", "mcp/sdk", "shopware.mcp.tool", "shopware.store_api_mcp.tool", "Resources/mcp.xml", "shopware-entity-search", "toolsets", "ai agent integration", "Mcp-Session-Id"]
summary: Overview of Shopware's native MCP server - /api/_mcp and /store-api/_mcp endpoints, architecture, plugin vs app extension, spec coverage and gaps.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/store-api.md", "platform/dev/6.7/products/tools/mcp-server/configuration.md", "platform/dev/6.7/products/tools/mcp-server/shopware-extensions.md", "platform/dev/6.7/products/tools/mcp-server/mcp-concepts.md"]
---
## What it is

Shopware core ships a native Model Context Protocol (MCP) server so AI clients (Claude Desktop, Cursor, Claude Code) can call tools like `shopware-entity-search` and get structured results. It exposes `POST /api/_mcp` (Admin API, integration or OAuth credentials, ACL-enforced) and `POST /store-api/_mcp` (sales-channel context, see [Store API MCP](platform/dev/6.7/products/tools/mcp-server/store-api.md)) over Streamable HTTP. Experimental until Shopware 6.8; APIs and tool names may change.

## When to use

Orientation before connecting a client ([Getting Started](platform/dev/6.7/products/tools/mcp-server/getting-started.md)) or extending the server ([Extending](platform/dev/6.7/products/tools/mcp-server/extending.md)); deciding plugin vs app.

## Key steps / config

**Capabilities:** HTTP endpoints, authentication, authorization (Admin API ACL or Store API context), per-integration and per-user tool allowlists (intersected when an app forwards `sw-app-user-id`), per-principal rate limiting, discovery (small default surface, tool search, session-scoped toolsets, connect-time `?toolsets`), and extension-contributed tools, prompts and resources.

**Architecture:**

- **Core** owns endpoint, auth bridge, ACL, rate limiting, discovery and low-level primitives (`shopware-entity-*`, `shopware-system-config-*`).
- **Plugins / Symfony bundles** run in-process with DAL and container access and register capabilities via service tags. SwagMcpMerchantTools and SwagMcpDevTools are examples ([Shopware extensions](platform/dev/6.7/products/tools/mcp-server/shopware-extensions.md)).
- **Apps** declare capabilities in `Resources/mcp.xml`; Shopware calls the app endpoint via HMAC-signed HTTP requests.

**Two servers, one bundle:** `admin` behind `/api/_mcp`, `store_api` behind `/store-api/_mcp`, both declared under the `servers` key of the `symfony/mcp-bundle` configuration (since 6.7.15.0). Each has its own registry, session store and handlers, so a session from one endpoint is invalid on the other. The bundle's own HTTP transport is off; Shopware controllers run auth, rate limiting and allowlist first. Core capabilities are assigned to a server by namespace; extension capabilities by tag: `shopware.mcp.*` → Admin API server, `shopware.store_api_mcp.*` → Store API server. App capabilities load at runtime and only on the Admin API server.

**Plugin or app?** Plugin/bundle for direct DAL/container access, Marketplace distribution, or lifecycle coupling. App for remote logic (ERP, PIM, CRM), Shopware Cloud compatibility, or independent deployment. Guides: [plugin](platform/dev/6.7/guides/plugins/plugins/mcp-server.md), [app](platform/dev/6.7/guides/plugins/apps/mcp-server.md).

## Essential identifiers

- `/api/_mcp`, `/store-api/_mcp`; servers `admin`, `store_api`
- Tags `shopware.mcp.tool` / `.prompt` / `.resource`, `shopware.store_api_mcp.tool` / `.prompt` / `.resource`
- `Resources/mcp.xml`; packages `symfony/mcp-bundle`, `mcp/sdk`

## Gotchas

- Spec reference is MCP 2025-11-25, session-based handshake era only; the stateless 2026-07-28 revision (supported by `mcp/sdk` 0.8) is disabled because toolsets and `listChanged` rely on `Mcp-Session-Id`.
- Supported: cursor pagination, `listChanged` notifications, resource templates. Not implemented: resource subscriptions, completion utility, ACL checks on resources (public within the authenticated session). `structuredContent`/`isError` are unused; Shopware returns its own `{"success": bool, ...}` envelope.

## Version notes

- 6.7.11.0: introduced behind the `MCP_SERVER` feature flag; both servers exist.
- 6.7.14.0: flag removed, progressive tool discovery; `symfony/mcp-bundle ~0.11.0` with `mcp/sdk ^0.7.0`; Store API server built by hand.
- 6.7.15.0: `symfony/mcp-bundle ~0.13.0` with `mcp/sdk ^0.8.1`, both servers under `servers`, connect-time toolset selection. Details: [Configuration](platform/dev/6.7/products/tools/mcp-server/configuration.md).

## Code check (6.7.15.1)
- confirmed `/api/_mcp` — Admin API MCP controller route — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:79
- confirmed `/store-api/_mcp` — Store API MCP controller route — vendor/shopware/core/Framework/Mcp/Controller/StoreApiMcpServerController.php:57
- confirmed `servers` — bundle config declares `admin` and `store_api` servers — vendor/shopware/core/Framework/Resources/config/packages/mcp.php:36
- confirmed `shopware.mcp.tool` — mapped to `mcp.tool` (Admin API server) — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:56
- confirmed `shopware.store_api_mcp.tool` — mapped to the Store API server — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/McpToolDiscoveryCompilerPass.php:59
- confirmed `shopware-entity-search` — core tool name — vendor/shopware/core/Framework/Mcp/Tool/EntitySearchTool.php:22
- confirmed `mcp-tools` — app `mcp.xml` schema element — vendor/shopware/core/Framework/App/Mcp/Schema/mcp-1.0.xsd:6
- confirmed `Mcp-Session-Id` — header read by the Admin API controller — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:141
- unverified `symfony/mcp-bundle` — package version constraints live in composer metadata, out of scope
