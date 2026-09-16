---
id: platform/dev/6.7/products/tools/mcp-server/_index.md
title: About MCP
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/
sourceHash: d9b83b6ce004ae855be84e6a38190cbd0f2800ef
codeCheckedAgainst: "6.7.13.0"
keywords: ["mcp", "model context protocol", "MCP_SERVER", "/api/_mcp", "/store-api/_mcp", "mcp tools", "mcp resources", "mcp prompts", "mcp allowlist", "dry-run", "ai agent", "agentic commerce", "SwagMcpDevTools", "SwagMcpMerchantTools"]
summary: "Overview of the experimental Shopware MCP server: tools, resources, prompts, ACL and allowlists, /api/_mcp and /store-api/_mcp endpoints, MCP_SERVER flag."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/intro.md"]
---
## What it is

Overview of Shopware's Model Context Protocol (MCP) server: a standardized interface through which MCP-compatible AI clients (Claude, Cursor, Codex, ChatGPT, Shopware Copilot, others) interact with a Shopware instance. Flow: AI client → MCP client → Shopware MCP Server → Shopware Core. The feature is experimental.

## When to use

- Building buyer agents (product discovery/comparison, cart, checkout assistance).
- Building merchant assistants (product descriptions, catalog updates, order review, reports).
- Developer automation: migrations, data imports, custom MCP tools. Continue with the [technical setup](platform/dev/6.7/products/tools/mcp-server/intro.md).

## Key steps / config

Capability types exposed by the server:

| Capability | Purpose | Examples |
|---|---|---|
| Tools | Perform actions | product search, entity retrieval/upsert, order state changes, media upload, system config updates |
| Resources | Structured reference data | entity definitions, sales channels, currencies, languages, state machines, business events, extensions |
| Prompts | Domain guidance for agents | Shopware context, query patterns, data model guidance |

Endpoints: `/api/_mcp` (Admin API) and `/store-api/_mcp` (Store API). On the installed 6.7.13.0 both return 404 unless the `MCP_SERVER` feature flag is active (default `false`).

Security model:
- ACL checks on every call; agents only see capabilities they may use.
- Administrator-defined allowlists per persona (buyer agent, merchant assistant, reporting bot, developer assistant) restrict tools, resources and prompts.
- Write tools support dry-run execution by default.

Extension paths: plugins, Symfony bundles, apps using webhooks, apps using scripts.

## Essential identifiers

- `/api/_mcp`, `/store-api/_mcp`
- `MCP_SERVER` (feature flag)
- `SwagMcpDevTools` — dev/debug tools (log search, log stream, notifications)
- `SwagMcpMerchantTools` — merchant workflows
- `shopware/shopware` — core MCP server implementation

## Gotchas

- Capabilities available to an agent depend on the configured integration, allowlist and permissions.
- Experimental: APIs, capabilities and extension points may change.

## Version notes

- Introduced in Shopware 6.7.11.0.
- The source states progressive tool discovery arrives and the `MCP_SERVER` flag is removed in 6.7.14.0; the installed 6.7.13.0 still requires the flag.

## Code check (6.7.13.0)
- confirmed `/api/_mcp` — Admin API MCP route — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:76
- confirmed `/store-api/_mcp` — Store API MCP route — vendor/shopware/core/Framework/Mcp/Controller/StoreApiMcpServerController.php:63
- confirmed `MCP_SERVER` — feature flag, default false, still present in 6.7.13.0 — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:89
- confirmed `Feature::isActive('MCP_SERVER')` — endpoint returns 404 when the flag is inactive — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:83
- confirmed `McpAllowlist::TOOLS` — allowlist has tools/resources/prompts keys — vendor/shopware/core/Framework/Mcp/AllowList/McpAllowlist.php:19
- unverified `SwagMcpDevTools` — separate plugin repository, not in vendor/shopware
- unverified `SwagMcpMerchantTools` — separate plugin repository, not in vendor/shopware
