---
id: platform/dev/6.7/products/tools/mcp-server/_index.md
title: About MCP
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/mcp-server/
sourceHash: 8a7f1a4f0831fa63117ef2a97e8917c1672ccca4
codeCheckedAgainst: "6.7.15.1"
keywords: ["mcp", "model context protocol", "/api/_mcp", "/store-api/_mcp", "mcp server", "ai agent", "tools", "resources", "prompts", "mcp allowlist", "dry-run", "SwagMcpDevTools", "SwagMcpMerchantTools", "agentic commerce"]
summary: Experimental Shopware MCP server overview - tools, resources, prompts, ACL/allowlists, /api/_mcp and /store-api/_mcp, since 6.7.11.0.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/mcp-server/intro.md"]
---
## What it is

Overview of Shopware's Model Context Protocol (MCP) support. MCP is a standardized interface that lets AI agents interact with Shopware: instead of a custom integration per AI platform, Shopware exposes its capabilities through an MCP server that any MCP-compatible client (Claude, Cursor, Codex, ChatGPT, Shopware Copilot and others) can consume. The flow is AI client → MCP client → Shopware MCP Server → Shopware Core.

The server exposes three capability types:

| Capability | Purpose | Examples |
|---|---|---|
| Tools | Perform actions and operations | product search, entity retrieval, entity create/update, order state changes, media uploads, system configuration updates, checkout-related operations |
| Resources | Structured reference information about the environment and data model | entity definitions, sales channels, currencies, languages, state machines, business events, extensions |
| Prompts | Domain-specific guidance for agents | Shopware context, query patterns, data model guidance, best practices |

## When to use

- You want AI agents to discover capabilities dynamically, read reference data, introspect the data model, resolve entities without manually supplying UUIDs, and run multi-step workflows through one standardized endpoint.
- Typical personas: shopper/buyer agents (product discovery, comparison, cart, checkout assistance), merchant assistants (product descriptions, customer behaviour analysis, catalog changes, reports, order review), and developer integrations (store migrations, data imports/transformations, development assistants, custom MCP tools, operational automation).
- Continue with the technical documentation in [Shopware MCP Server](platform/dev/6.7/products/tools/mcp-server/intro.md) for setup, configuration and extension.

## Key steps / config

- Endpoints: `/api/_mcp` (Admin API) and `/store-api/_mcp` (Store API).
- Security layers on every request:
  - ACL checks against Shopware permissions on every call; agents only see capabilities they may use, and permissions are separate from capability visibility.
  - Allowlists: administrators define exactly which tools, resources and prompts an agent may access, enabling persona-specific integrations (buyer agent, merchant assistant, reporting bot, developer assistant).
  - Write tools support dry-run execution by default so agents preview changes before committing.
- Available capabilities depend on the configured integration, allowlist and permissions.
- Extension paths for custom tools, resources and prompts: plugins, Symfony bundles, apps using webhooks, apps using scripts.

Ecosystem:

| Component | Purpose |
|---|---|
| [`shopware/shopware`](https://github.com/shopware/shopware) | Core MCP server implementation |
| [`SwagMcpDevTools`](https://github.com/shopware/SwagMcpDevTools) | Development and debugging tools (log search, log stream, notifications) |
| [`SwagMcpMerchantTools`](https://github.com/shopware/SwagMcpMerchantTools) | Merchant-focused workflows and tools |

## Essential identifiers

- `/api/_mcp`, `/store-api/_mcp`
- `symfony/mcp-bundle`
- `SwagMcpDevTools`, `SwagMcpMerchantTools`

## Gotchas

- The MCP server is experimental; APIs, capabilities and extension points may change based on community and partner feedback.

## Version notes

- Introduced in Shopware 6.7.11.0.
- 6.7.14.0: progressive tool discovery; the `MCP_SERVER` feature flag was removed.
- 6.7.15.0: connect-time toolset selection and `symfony/mcp-bundle` 0.13.

## Code check (6.7.15.1)
- confirmed `/api/_mcp` — Admin API MCP route on McpServerController — vendor/shopware/core/Framework/Mcp/Controller/McpServerController.php:79
- confirmed `/store-api/_mcp` — Store API MCP route on StoreApiMcpServerController — vendor/shopware/core/Framework/Mcp/Controller/StoreApiMcpServerController.php:57
- confirmed `MCP_SERVER` — no longer a feature flag; MCP is always enabled — vendor/shopware/core/Framework/Mcp/AGENTS.md:87
- confirmed `bool $dryRun = true` — write tools default to dry-run — vendor/shopware/core/Framework/Mcp/Tool/EntityUpsertTool.php:38
- confirmed `shopware://state-machines` — state machine reference resource — vendor/shopware/core/Framework/Mcp/Resource/StateMachineResource.php:18
- confirmed `shopware-context` — built-in context prompt — vendor/shopware/core/Framework/Mcp/Prompt/ShopwareContextPrompt.php:18
- unverified `SwagMcpDevTools` — separate plugin repository, not in vendor/shopware
- unverified `SwagMcpMerchantTools` — separate plugin repository, not in vendor/shopware
